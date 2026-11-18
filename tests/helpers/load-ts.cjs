const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

// Execute the real TypeScript modules with only external services replaced.
exports.loader = function loader(mocks = {}) {
  const cache = new Map();
  function load(file) {
    const absolute = path.resolve(file);
    if (cache.has(absolute)) return cache.get(absolute).exports;
    const loaded = { exports: {} };
    cache.set(absolute, loaded);
    const code = ts.transpileModule(fs.readFileSync(absolute, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true, jsx: ts.JsxEmit.ReactJSX },
    }).outputText;
    const requireLocal = (name) => {
      if (Object.hasOwn(mocks, name)) return mocks[name];
      if (name.startsWith('@/')) return load(path.join('src', name.slice(2)) + '.ts');
      if (name.startsWith('.')) return load(path.resolve(path.dirname(absolute), name) + '.ts');
      return require(name);
    };
    new Function('require', 'module', 'exports', code)(requireLocal, loaded, loaded.exports);
    return loaded.exports;
  }
  return load;
};
