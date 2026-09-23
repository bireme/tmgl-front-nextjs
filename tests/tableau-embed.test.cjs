const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

const code = ts.transpileModule(fs.readFileSync('src/components/embed/TableauEmbed.tsx', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
}).outputText;
const compiled = { exports: {} };
new Function('require', 'module', 'exports', code)(require, compiled, compiled.exports);
const { TableauEmbed } = compiled.exports;

test('Tableau renders with the application React runtime and no browser globals', () => {
  const html = renderToStaticMarkup(React.createElement(TableauEmbed, {
    sourceUrl: 'https://public.tableau.com/views/workbook/dashboard',
    title: 'Evidence map',
  }));
  assert.match(html, /<iframe/);
  assert.match(html, /title="Evidence map"/);
  assert.match(html, /width="100%"/);
  assert.match(html, /height="1050"/);
  assert.match(html, /%3Aembed=true/);
  assert.match(html, /%3AshowVizHome=no/);
});

test('embedding preserves dashboard filters and replaces conflicting embed options', () => {
  const element = TableauEmbed({
    sourceUrl: 'https://public.tableau.com/views/workbook/dashboard?:embed=false&:showVizHome=yes&Region=South%20America&:language=pt-BR#1',
    title: 'Map',
  });
  const url = new URL(element.props.src);
  assert.equal(url.pathname, '/views/workbook/dashboard');
  assert.equal(url.searchParams.get(':embed'), 'true');
  assert.equal(url.searchParams.get(':showVizHome'), 'no');
  assert.equal(url.searchParams.getAll(':embed').length, 1);
  assert.equal(url.searchParams.get('Region'), 'South America');
  assert.equal(url.searchParams.get(':language'), 'pt-BR');
  assert.equal(url.hash, '#1');
});
