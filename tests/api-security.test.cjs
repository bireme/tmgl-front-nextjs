const { test } = require('node:test');
const assert = require('node:assert/strict');
const { PassThrough } = require('node:stream');
const { EventEmitter } = require('node:events');
const axios = require('axios');
const { loader } = require('./helpers/load-ts.cjs');

function response() {
  return {
    headers: {}, statusCode: 200,
    setHeader(name, value) { this.headers[name] = value; },
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
    send(body) { this.body = body; return this; },
  };
}
function request(method, body, query = {}) { return { method, body, query, socket: { remoteAddress: 'test-client' } }; }

const real = loader();
const { isPublicAddress, parsePdfUrl } = real('src/server/remotePdf.ts');
test('PDF destinations reject private, mapped, reserved and disguised IP addresses', () => {
  for (const ip of ['127.0.0.1', '10.1.1.1', '169.254.169.254', '172.16.1.1', '192.168.0.1', '100.64.1.1', '0.0.0.0', '224.0.0.1', '::1', '::ffff:8.8.8.8', 'fc00::1', 'fe80::1', '2001:db8::1', '2002:7f00:1::']) {
    assert.equal(isPublicAddress(ip), false, ip);
  }
  for (const ip of ['8.8.8.8', '1.1.1.1', '2606:4700:4700::1111']) assert.equal(isPublicAddress(ip), true, ip);
  for (const url of ['file:///etc/passwd', 'http://localhost/x', 'http://127.1/x', 'http://2130706433/x', 'http://0x7f000001/x', 'http://[::1]/x', 'https://user:password@example.org/x', 'https://example.org:8080/x']) {
    assert.throws(() => parsePdfUrl(url), undefined, url);
  }
  assert.equal(parsePdfUrl('https://example.org/doc.pdf#page=2').href, 'https://example.org/doc.pdf');
});

function pdfLoader(replies, resolve = async () => [{ address: '8.8.8.8', family: 4 }]) {
  const requests = [];
  const transport = {
    request(url, options, callback) {
      requests.push({ url, options });
      const outgoing = new EventEmitter();
      outgoing.end = () => setImmediate(() => {
        const reply = replies.shift();
        const incoming = new PassThrough();
        incoming.statusCode = reply.status || 200;
        incoming.headers = reply.headers || { 'content-type': 'application/pdf' };
        callback(incoming);
        incoming.end(reply.body || '%PDF-1.7\n');
      });
      return outgoing;
    },
  };
  const load = loader({ 'node:http': transport, 'node:https': transport, 'node:dns/promises': { lookup: resolve } });
  return { ...load('src/server/remotePdf.ts'), requests };
}

test('PDF downloads pin DNS, reject internal DNS answers and validate redirect destinations', async () => {
  const safe = pdfLoader([{}]);
  assert.match((await safe.downloadPdf('https://example.org/a.pdf')).toString(), /^%PDF/);
  const options = safe.requests[0].options;
  options.lookup('example.org', {}, (error, address) => { assert.equal(error, null); assert.equal(address, '8.8.8.8'); });
  assert.equal(options.agent, false);
  const privateDns = pdfLoader([], async () => [{ address: '127.0.0.1', family: 4 }]);
  await assert.rejects(privateDns.downloadPdf('https://internal.example/a'), { code: 'BLOCKED_DESTINATION' });
  assert.equal(privateDns.requests.length, 0);
  const redirect = pdfLoader([{ status: 302, headers: { location: 'http://169.254.169.254/latest/' } }]);
  await assert.rejects(redirect.downloadPdf('https://example.org/a'), { code: 'BLOCKED_DESTINATION' });
  assert.equal(redirect.requests.length, 1);
  const redirectLoop = pdfLoader(Array.from({ length: 4 }, () => ({ status: 302, headers: { location: '/again' } })));
  await assert.rejects(redirectLoop.downloadPdf('https://example.org/a'), { code: 'TOO_MANY_REDIRECTS' });
});

test('PDF downloads enforce MIME, file signature and advertised/streamed size limits', async () => {
  const html = pdfLoader([{ headers: { 'content-type': 'text/html' }, body: '<html>unsafe</html>' }]);
  await assert.rejects(html.downloadPdf('https://example.org/a'), { statusCode: 415 });
  const forged = pdfLoader([{ body: '<script>not a PDF</script>' }]);
  await assert.rejects(forged.downloadPdf('https://example.org/a'), { statusCode: 415 });
  const large = pdfLoader([{ headers: { 'content-length': String(21 * 1024 * 1024) } }]);
  await assert.rejects(large.downloadPdf('https://example.org/a'), { statusCode: 413 });
  const streamed = pdfLoader([{ body: Buffer.alloc(20 * 1024 * 1024 + 1) }]);
  await assert.rejects(streamed.downloadPdf('https://example.org/a'), { statusCode: 413 });
});

test('repository API validates requests, preserves query values and always terminates failures safely', async () => {
  process.env.BVSALUD_URL = 'https://upstream.example/api/';
  process.env.BVSALUD_API_KEY = 'encrypted';
  const calls = [];
  let failure;
  const load = loader({
    axios: { ...axios, get: async (...args) => { calls.push(args); if (failure) throw failure; return { data: { results: [] } }; } },
    '@/helpers/crypto': { decryptFromEnv: () => 'secret-test-key' },
  });
  const handler = load('src/pages/api/direve.ts').default;
  let res = response();
  await handler(request('POST', { query: 'title:"A&B"', q: 'herbs #1 + 2', count: 12 }), res);
  assert.equal(res.statusCode, 200);
  const url = new URL(calls[0][0]);
  assert.equal(url.pathname, '/api/event/v1/search/');
  assert.equal(url.searchParams.get('fq'), 'title:"A&B"');
  assert.equal(url.searchParams.get('q'), 'herbs #1 + 2');
  assert.equal(url.searchParams.get('lang'), 'en');
  assert.equal(calls[0][1].maxRedirects, 0);
  assert.equal(calls[0][1].timeout, 20000);
  for (const invalid of [null, { count: -1 }, { count: 10001 }, { start: 'garbage' }, { lang: ['en'] }, { id: '../../admin' }]) {
    res = response(); await handler(request('POST', invalid), res);
    assert.equal(res.statusCode, 400);
    assert.equal(res.body.status, false);
  }
  res = response(); await handler(request('GET'), res);
  assert.equal(res.statusCode, 405); assert.equal(res.headers.Allow, 'POST');
  for (const [code, upstream, expected] of [['ECONNABORTED', undefined, 504], ['ERR_BAD_RESPONSE', 500, 502], ['ERR_BAD_REQUEST', 404, 404]]) {
    failure = new axios.AxiosError('Sensitive upstream details', code, { headers: { apiKey: 'secret-test-key' } }, null, upstream ? { status: upstream } : undefined);
    res = response(); await handler(request('POST', {}), res);
    assert.equal(res.statusCode, expected);
    assert.equal(res.body.status, false);
    assert.doesNotMatch(JSON.stringify(res.body), /secret-test-key|Sensitive upstream details|apiKey/);
  }
});

test('API rate limiting responds with 429 and a retry interval', async () => {
  const { apiHandler, rateLimit } = loader()('src/server/api.ts');
  const handler = apiHandler(['GET'], async (req, res) => { rateLimit(req, res, 'test', 1); return res.json({ status: true }); });
  await handler(request('GET'), response());
  const res = response(); await handler(request('GET'), res);
  assert.equal(res.statusCode, 429); assert.ok(res.headers['Retry-After'] > 0);
});

test('repository route mapping and validation apply consistently across all resource APIs', async () => {
  process.env.BVSALUD_URL = 'https://upstream.example/api/';
  process.env.BVSALUD_API_KEY = 'encrypted';
  process.env.LIS_API_URL = 'https://upstream.example/lis/v1/';
  process.env.DIREV_API_KEY = 'encrypted';
  process.env.FIADMIN_URL = 'https://upstream.example/fi-admin/';
  const calls = [];
  const load = loader({ axios: { ...axios, get: async (url) => { calls.push(url); return { data: { results: [] } }; } }, '@/helpers/crypto': { decryptFromEnv: () => 'test-key' } });
  for (const [route, endpoint] of [
    ['bibliographic', '/api/bibliographic/v1/'], ['evidencemaps', '/api/resource/v1/'],
    ['journals', '/api/title/v1/'], ['legislations', '/api/leisref/v1/'],
    ['lis', '/lis/v1/'], ['multimedia', '/fi-admin/multimedia/'],
  ]) {
    const handler = load(`src/pages/api/${route}.ts`).default;
    const res = response(); await handler(request('POST', { q: 'a&b', count: 5 }), res);
    assert.equal(res.statusCode, 200, route);
    assert.equal(new URL(calls.at(-1)).pathname, `${endpoint}search/`);
    assert.equal(new URL(calls.at(-1)).searchParams.get('q'), 'a&b');
    const invalid = response(); await handler(request('POST', null), invalid);
    assert.equal(invalid.statusCode, 400, route);
  }
});

test('RSS API preserves configured endpoint, encodes queries and returns errors for invalid feeds', async () => {
  process.env.RSS_FEED_URL = 'https://rss.example/feed?collection=tmgl';
  let xml = '<rss><channel><title>TMGL</title><item><title>A &amp; B</title></item></channel></rss>';
  let called;
  const load = loader({ axios: { ...axios, get: async (url) => { called = new URL(url); return { data: xml }; } } });
  const handler = load('src/pages/api/rssfeed.ts').default;
  const res = response();
  await handler(request('GET', null, { lang: 'en', queryString: 'a&b #1', filter: '&lang=pt&count=5' }), res);
  assert.equal(res.statusCode, 200);
  assert.equal(called.origin, 'https://rss.example');
  assert.equal(called.searchParams.get('q'), 'a&b #1');
  assert.equal(called.searchParams.get('lang'), 'pt');
  assert.equal(res.body.rss.channel.item.title, 'A & B');
  for (const invalid of ['<html>upstream error</html>', '<!DOCTYPE rss><rss/>', '<rss>']) {
    xml = invalid;
    const error = response(); await handler(request('GET'), error);
    assert.equal(error.statusCode, 502);
    assert.equal(error.body.error.code, 'INVALID_FEED');
  }
  const oversized = response(); await handler(request('GET', null, { filter: '&count=10001' }), oversized);
  assert.equal(oversized.statusCode, 400);
});

test('newsletter API validates email and reports duplicate subscriptions without leaking member details', async () => {
  process.env.MAILCHIMP_API_KEY = 'encrypted';
  process.env.MAILCHIMP_LIST_ID = 'test-list';
  process.env.MAILCHIMP_DATA_CENTER = 'us1';
  let failure;
  let calls = 0;
  const load = loader({
    axios: { ...axios, post: async () => { calls++; if (failure) throw failure; return { data: { email: 'private@example.org', id: 'private-id' } }; } },
    '@/helpers/crypto': { decryptFromEnv: () => 'private-api-key' },
  });
  const handler = load('src/pages/api/subscribe.ts').default;
  const invalid = response(); await handler(request('POST', { email: 'not-an-email' }), invalid);
  assert.equal(invalid.statusCode, 400); assert.equal(calls, 0);
  const success = response(); await handler(request('POST', { email: 'user@example.org' }), success);
  assert.equal(success.statusCode, 200); assert.equal(success.body.status, true);
  assert.doesNotMatch(JSON.stringify(success.body), /private/);
  failure = new axios.AxiosError('private upstream details', 'ERR_BAD_REQUEST', undefined, undefined, { status: 400, data: { title: 'Member Exists', detail: 'private@example.org' } });
  const duplicate = response(); await handler(request('POST', { email: 'user@example.org' }), duplicate);
  assert.equal(duplicate.statusCode, 409); assert.equal(duplicate.body.error.code, 'ALREADY_SUBSCRIBED');
  assert.doesNotMatch(JSON.stringify(duplicate.body), /private/);
});
