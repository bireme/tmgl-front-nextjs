const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

// Compile the actual TS modules; inject only external services for deterministic tests.
function load(file, mocks = {}) {
  const code = ts.transpileModule(fs.readFileSync(path.resolve(file), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const loadedModule = { exports: {} };
  const localRequire = (name) => Object.hasOwn(mocks, name) ? mocks[name] : require(name);
  new Function('require', 'module', 'exports', code)(localRequire, loadedModule, loadedModule.exports);
  return loadedModule.exports;
}
const seo = load('src/helpers/seo.ts');

test('canonical and links consolidate home aliases, slash, tracking, and preserve external links', () => {
  assert.equal(seo.canonicalUrl('/dimensions/research-evidence/?utm_source=test#tab'), `${seo.SITE_ORIGIN}/dimensions/research-evidence`);
  for (const alias of ['/en/', '/en', '/content/home-global/']) assert.equal(seo.canonicalPath(alias), '/');
  assert.equal(seo.canonicalPath('/afro/content/home/'), '/afro');
  assert.equal(seo.normalizeInternalLink('/en/?utm_source=test#top'), '/?utm_source=test#top');
  assert.equal(seo.normalizeInternalLink('https://external.example/en/'), 'https://external.example/en/');
  assert.equal(seo.normalizeInternalLink('mailto:test@example.org'), 'mailto:test@example.org');
  assert.equal(seo.isIndexablePath('/afro/content/home-bkp'), false);
  assert.equal(seo.isIndexablePath('/content/about-us'), true);
});

function loader(get) {
  process.env.WP_BASE_URL = 'https://cms.example';
  const axios = { create: () => ({ get }), isAxiosError: (e) => e.isAxiosError === true };
  return load('src/server/wordpress.ts', { axios, '@/helpers/seo': seo });
}

test('editorial loader returns published body and all children, including pagination', async () => {
  const calls = [];
  const wp = loader(async (type, { params }) => {
    calls.push(params);
    assert.equal(params.status, 'publish');
    if (params.slug) return { data: [{ id: 1, slug: params.slug, content: { rendered: '<p>Main text</p>' } }], headers: {} };
    return { data: [{ id: params.page || 1 }], headers: { 'x-wp-totalpages': '2' } };
  });
  const result = await wp.postPageProps('dimensions', true)({ params: { slug: 'research-evidence' }, resolvedUrl: '/dimensions/research-evidence' });
  assert.equal(result.props.initialPost.content.rendered, '<p>Main text</p>');
  assert.equal(result.props.initialChildren.length, 2);
  assert.equal(calls.length, 3);
});

test('missing posts are 404, but upstream outages cannot become false 404s', async () => {
  const context = { params: { slug: 'missing' }, resolvedUrl: '/content/missing' };
  assert.deepEqual(await loader(async () => ({ data: [], headers: {} })).postPageProps('pages')(context), { notFound: true });
  await assert.rejects(loader(async () => { throw new Error('upstream unavailable'); }).postPageProps('pages')(context), /upstream unavailable/);
});

test('regional dimension aliases redirect only when the global post exists', async () => {
  let calls = 0;
  const wp = loader(async () => ({ data: ++calls === 1 ? [] : [{ slug: 'research-evidence' }], headers: {} }));
  assert.deepEqual(await wp.postPageProps('dimensions')({ params: { region: 'afro', slug: 'research-evidence' }, resolvedUrl: '/afro/dimensions/research-evidence' }), {
    redirect: { destination: '/dimensions/research-evidence', permanent: true },
  });
});

function response() {
  return { headers: {}, body: '', statusCode: 200, setHeader(k, v) { this.headers[k] = v; }, write(v) { this.body += v; }, end(v = '') { this.body += v; } };
}

test('sitemap and robots use configured origin even with spoofed proxy headers; omit aliases', async () => {
  const axios = { create: () => ({ get: async (type) => ({
    data: type === 'region' ? [] : type === 'pages' ? [{ slug: 'home-global' }, { slug: 'about-us' }, { slug: 'about-us' }] : [], headers: {},
  }) }), isAxiosError: () => false };
  const sitemap = load('src/pages/sitemap.xml.tsx', { axios, '@/helpers/crypto': {}, '@/helpers/seo': seo, '@/server/wordpress': { publishedRegions: async () => [] } });
  const req = { headers: { host: 'evil.example', 'x-forwarded-proto': 'http' } };
  const res = response();
  await sitemap.getServerSideProps({ req, res });
  assert.equal(res.statusCode, 200);
  assert.ok(res.body.includes(`${seo.SITE_ORIGIN}/content/about-us`));
  assert.equal((res.body.match(/\/content\/about-us/g) || []).length, 1);
  assert.ok(!res.body.includes('home-global'));
  assert.ok(!res.body.includes('evil.example'));
  const robots = load('src/pages/robots.txt.tsx', { '@/helpers/seo': seo });
  const robotsRes = response();
  await robots.getServerSideProps({ req, res: robotsRes });
  assert.ok(robotsRes.body.includes(`Sitemap: ${seo.SITE_ORIGIN}/sitemap.xml`));
});

test('failed sitemap sources return non-cacheable 503, never a partial sitemap', async () => {
  const sitemap = load('src/pages/sitemap.xml.tsx', {
    axios: { create: () => ({ get: async () => { throw new Error('outage'); } }), isAxiosError: () => false },
    '@/helpers/crypto': {}, '@/helpers/seo': seo, '@/server/wordpress': { publishedRegions: async () => [] },
  });
  const res = response();
  await sitemap.getServerSideProps({ req: { headers: {} }, res });
  assert.equal(res.statusCode, 503);
  assert.equal(res.headers['Cache-Control'], 'no-store');
  assert.ok(!res.body.includes('<urlset'));
});

test('an unregistered mandatory global source cannot silently shrink the sitemap', async () => {
  const sitemap = load('src/pages/sitemap.xml.tsx', {
    axios: {
      create: () => ({ get: async () => { throw { isAxiosError: true, response: { status: 404, data: { code: 'rest_no_route' } } }; } }),
      isAxiosError: (error) => error.isAxiosError === true,
    },
    '@/helpers/crypto': {}, '@/helpers/seo': seo,
    '@/server/wordpress': { publishedRegions: async () => [] },
  });
  const res = response();
  await sitemap.getServerSideProps({ res });
  assert.equal(res.statusCode, 503);
});

test('published regions come from site configuration rather than arbitrary filter terms', async () => {
  const wp = loader(async () => ({ data: { acf: { regionais: [
    { rest_api_prefix: 'Americas' }, { rest_api_prefix: '/afro/' }, { rest_api_prefix: 'afro' },
  ] } } }));
  assert.deepEqual(await wp.publishedRegions(), [{ slug: 'americas' }, { slug: 'afro' }]);
});
