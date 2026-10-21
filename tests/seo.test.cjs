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
const seo = { ...load('src/helpers/seo.ts'), IS_PRODUCTION: true };

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

test('middleware redirects trailing slashes and aliases once, preserving query parameters', async () => {
  const { NextRequest } = require('next/server');
  const { middleware } = load('src/middleware.ts', { './helpers/seo': seo });
  for (const [source, destination] of [
    ['/content/privacy-policy-terms-and-conditions-of-use/', '/content/privacy-policy-terms-and-conditions-of-use'],
    ['/content/privacy-policy-terms-and-conditions-of-use/?lang=pt', '/content/privacy-policy-terms-and-conditions-of-use?lang=pt'],
    ['/afro/content/home/', '/afro'],
    ['/en/', '/'],
  ]) {
    const response = await middleware(new NextRequest(`https://tmgl.org${source}`));
    assert.equal(response.status, 308);
    assert.equal(response.headers.get('location'), `https://tmgl.org${destination}`);
    const final = await middleware(new NextRequest(response.headers.get('location')));
    assert.equal(final.status, 200);
    assert.equal(final.headers.get('location'), null);
  }
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

 test('nonproduction sitemap skips all upstream work and robots omits sitemap', async () => {
  const stagingSeo = { ...seo, IS_PRODUCTION: false };
  const fail = () => { throw new Error('staging must not fetch sitemap sources'); };
  const sitemap = load('src/pages/sitemap.xml.tsx', {
    axios: { create: fail }, '@/helpers/crypto': {}, '@/helpers/seo': stagingSeo,
    '@/server/wordpress': { publishedRegions: fail },
  });
  const res = response();
  await sitemap.getServerSideProps({ res });
  assert.equal(res.statusCode, 404);
  assert.equal(res.headers['Cache-Control'], 'no-store');
  assert.equal(res.headers['X-Robots-Tag'], 'noindex, nofollow');
  assert.ok(!res.body.includes('<urlset'));
  const robots = load('src/pages/robots.txt.tsx', { '@/helpers/seo': stagingSeo });
  const robotsRes = response();
  await robots.getServerSideProps({ res: robotsRes });
  assert.equal(robotsRes.body, 'User-agent: *\nAllow: /\n');
  assert.equal(robotsRes.headers['Cache-Control'], 'no-store');
});

test('only explicit production enables indexing and removes global noindex headers', async () => {
  const previous = process.env.PRODUCTION;
  try {
    for (const value of [undefined, 'false', 'true']) {
      if (value === undefined) delete process.env.PRODUCTION;
      else process.env.PRODUCTION = value;
      assert.equal(load('src/helpers/seo.ts').IS_PRODUCTION, value === 'true');
      const { default: config } = await import('../next.config.mjs');
      const headers = await config.headers();
      assert.deepEqual(headers, value === 'true' ? [] : [{
        source: '/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      }]);
    }
  } finally {
    if (previous === undefined) delete process.env.PRODUCTION;
    else process.env.PRODUCTION = previous;
  }
});

test('resource details render upstream data in serializable server props; confirmed missing records are 404s', async () => {
  const previous = [process.env.BVSALUD_URL, process.env.BVSALUD_API_KEY];
  process.env.BVSALUD_URL = 'https://bvs.example/';
  process.env.BVSALUD_API_KEY = 'encrypted-test-key';
  const utils = load('src/services/apiRepositories/utils.ts');
  const resources = (get) => load('src/server/resources.ts', {
    axios: { create: () => ({ get }), isAxiosError: (e) => e.isAxiosError === true },
    '@/helpers/crypto': { decryptFromEnv: () => 'test-key' },
    '@/services/apiRepositories/utils': utils,
  });
  try {
    const resource = resources(async () => ({ data: {
      id: 123, title: 'Evidence map title', abstract: 'Visible abstract', link: ['https://example.org'],
      descriptors: [], thematic_areas: [], publication_country: [],
    } }));
    const result = await resource.resourcePageProps('resource')({ params: { id: '123' } });
    assert.equal(result.props.initialItem.title, 'Evidence map title');
    assert.equal(result.props.initialItem.excerpt, 'Visible abstract');
    assert.deepEqual(JSON.parse(JSON.stringify(result.props)), result.props);
    assert.deepEqual(await resource.resourcePageProps('resource')({ params: { id: 'invalid' } }), { notFound: true });
    const journal = resources(async (url) => ({ data: url === 'search/' ? {
      diaServerResponse: [{ response: { docs: [{ abstract: 'Journal abstract', description: ['en|Description'], link: ['https://journal.example'] }] } }],
    } : { id_number: '456', title: 'Journal title', issn: '1234-5678' } }));
    const journalResult = await journal.resourcePageProps('title')({ params: { id: '456' } });
    assert.equal(journalResult.props.initialItem.title, 'Journal title');
    assert.equal(journalResult.props.initialItem.description[0].content, 'Description');
    const missing = resources(async () => { throw { isAxiosError: true, response: { status: 404 } }; });
    assert.deepEqual(await missing.resourcePageProps('resource')({ params: { id: '123' } }), { notFound: true });
    const outage = resources(async () => { throw new Error('upstream outage'); });
    await assert.rejects(outage.resourcePageProps('resource')({ params: { id: '123' } }), /upstream outage/);
  } finally {
    for (const [i, key] of ['BVSALUD_URL', 'BVSALUD_API_KEY'].entries()) {
      if (previous[i] === undefined) delete process.env[key];
      else process.env[key] = previous[i];
    }
  }
});

test('country landing pages render published content and reject unknown countries or regions', async () => {
  const wp = loader(async (url, { params } = {}) => ({
    data: url.includes('options') ? { acf: { regionais: [{ rest_api_prefix: 'americas' }] } }
      : params.slug === 'brazil' ? [{ id: 1, title: { rendered: 'Brazil' }, acf: { content: 'Country content' } }] : [],
    headers: {},
  }));
  const result = await wp.countryPageProps({ params: { region: 'americas', country: 'brazil' } });
  assert.equal(result.props.initialPost.title.rendered, 'Brazil');
  assert.deepEqual(await wp.countryPageProps({ params: { region: 'americas', country: 'missing' } }), { notFound: true });
  assert.deepEqual(await wp.countryPageProps({ params: { region: 'unknown', country: 'brazil' } }), { notFound: true });
});
