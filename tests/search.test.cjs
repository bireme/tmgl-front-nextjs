const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loader } = require('./helpers/load-ts.cjs');
const { searchUrl } = loader()('src/helpers/search.ts');

test('search preserves reserved characters, Unicode and endpoint configuration', () => {
  const url = new URL(searchUrl('https://search.example/tmgl/?lang=pt', '  plantas & saúde #1 + 漢字  '));
  assert.equal(url.pathname, '/tmgl/');
  assert.equal(url.searchParams.get('q'), 'plantas & saúde #1 + 漢字');
  assert.equal(url.searchParams.get('lang'), 'pt');
  assert.equal(url.hash, '');
  assert.equal(new URL(searchUrl('https://search.example/?q=old', '  ')).searchParams.has('q'), false);
  assert.throws(() => searchUrl(undefined, 'test'));
  assert.throws(() => searchUrl('javascript:alert(1)', 'test'));
});
