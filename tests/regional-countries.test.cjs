const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');

function load(file, mocks = {}) {
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const module = { exports: {} };
  new Function('require', 'module', 'exports', code)((name) => mocks[name] || require(name), module, module.exports);
  return module.exports;
}
const seo = load('src/helpers/seo.ts');
const { regionalCountries } = load('src/helpers/regionalCountries.ts', { './seo': seo });
const item = (ID, title, url, children = []) => ({ ID, title, url, children });

test('countries preserve menu labels and order while isolating the current region', () => {
  const menu = [item(1, 'Regions', '#', [
    item(2, 'Americas', '/americas', [
      item(3, 'Brazil', 'https://tmgl.org/americas/brazil/'),
      item(4, 'Chile', '/americas/chile'),
      item(5, 'News', '/americas/news'),
      item(6, 'About', '/americas/content/about'),
      item(7, 'Duplicate Brazil', '/americas/brazil'),
      item(8, 'External', 'https://external.example/americas/peru'),
    ]),
    item(9, 'AFRO', '/afro', [item(10, 'Kenya', '/afro/kenya')]),
  ])];
  assert.deepEqual(regionalCountries(menu, 'americas'), [
    { id: 3, title: 'Brazil', href: '/americas/brazil' },
    { id: 4, title: 'Chile', href: '/americas/chile' },
  ]);
  assert.deepEqual(regionalCountries(menu, 'emro'), []);
  assert.deepEqual(regionalCountries([], 'americas'), []);
});
