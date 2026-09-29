const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');

// Render the page's JSX tree with controlled configuration-loading states.
// Child components are placeholders so no WordPress requests are needed.
function renderHome(globalConfig, region = 'afro') {
  const code = ts.transpileModule(
    fs.readFileSync('src/pages/[region]/index.tsx', 'utf8'),
    { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }
  ).outputText;
  const loaded = { exports: {} };
  const mocks = {
    react: {
      useState: (initial) => [initial, () => {}],
      useContext: () => ({ globalConfig, setRegionName() {} }),
      useEffect() {},
    },
    'next/router': { useRouter: () => ({ query: { region } }) },
    '@/helpers/stringhelper': { capitalizeFirstLetter: (text) => text },
  };
  const localRequire = (name) => {
    if (name === 'react/jsx-runtime') return require(name);
    if (Object.hasOwn(mocks, name)) return mocks[name];
    return new Proxy({ __esModule: true }, { get: (target, key) => target[key] ?? `${name}:${String(key)}` });
  };
  new Function('require', 'module', 'exports', code)(localRequire, loaded, loaded.exports);
  return loaded.exports.default({ initialAcf: { search: {}, resources: [] } });
}

function find(tree, type) {
  if (Array.isArray(tree)) return tree.flatMap((node) => find(node, type));
  if (!tree || typeof tree !== 'object') return [];
  return [
    ...(tree.type === type ? [tree.props] : []),
    ...find(tree.props?.children, type),
  ];
}
const stories = '@/components/sections/stories:StoriesSection';
const news = '@/components/sections/news:NewsSection';

test('regional feeds do not mount before exclusion configuration loads', () => {
  const tree = renderHome(undefined);
  assert.equal(find(tree, stories).length, 0);
  assert.equal(find(tree, news).length, 0);
});

test('regional feeds receive the configured tag and their own region on first mount', () => {
  for (const region of ['afro', 'emro', 'americas']) {
    const tree = renderHome({ acf: { thematic_page_tag: 181 } }, region);
    const [storyProps] = find(tree, stories);
    const [newsProps] = find(tree, news);
    assert.equal(storyProps.region, region);
    assert.deepEqual(storyProps.fetchOptions, { tagId: 181, excludeTag: true });
    assert.equal(newsProps.region, region);
    assert.deepEqual(newsProps.excludedTagIds, [181]);
  }
});

test('regional feeds do not mount without the route region', () => {
  const tree = renderHome({ acf: { thematic_page_tag: 181 } }, '');
  assert.equal(find(tree, stories).length, 0);
  assert.equal(find(tree, news).length, 0);
});
