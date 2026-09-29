const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');

function apiReturning(posts, calls) {
  const code = ts.transpileModule(fs.readFileSync('src/services/posts/PostsApi.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  class BaseUnauthenticatedApi {
    _lang = 'en';
    _api = { get: async (url) => { calls.push(url); return { data: posts }; } };
  }
  const loaded = { exports: {} };
  new Function('require', 'module', 'exports', code)(
    (name) => name === '../BaseUnauthenticatedApi' ? { BaseUnauthenticatedApi } : {},
    loaded, loaded.exports
  );
  return new loaded.exports.PostsApi();
}

test('category and thematic tag exclusions both apply when WordPress returns excluded posts', async () => {
  const calls = [];
  const posts = [
    { id: 1, categories: [7], tags: [] },
    { id: 2, categories: [], tags: [181] },
    { id: 3, categories: [], _embedded: { 'wp:term': [[{ id: 181, taxonomy: 'post_tag' }]] } },
    { id: 4, categories: [], tags: [42] },
  ];
  const result = await apiReturning(posts, calls).getCustomPost('posts', 4, undefined, undefined, undefined, {
    catId: 7, excludeCat: true, tagId: 181, excludeTag: true,
  });
  assert.deepEqual(result.map((post) => post.id), [4]);
  assert.match(calls[0], /tags_exclude=181/);
  assert.match(calls[0], /categories_exclude=7/);
  assert.equal(posts.length, 4);
});

test('thematic-page inclusion keeps its own news', async () => {
  const posts = [{ id: 2, categories: [], tags: [181] }];
  const calls = [];
  const result = await apiReturning(posts, calls).getCustomPost('posts', 4, undefined, undefined, undefined, {
    tagId: 181,
  });
  assert.deepEqual(result, posts);
  assert.match(calls[0], /&tags=181/);
});

test('standalone tag exclusions also apply to featured stories', async () => {
  const posts = [{ id: 1, tags: [181] }, { id: 2, tags: [] }];
  const result = await apiReturning(posts, []).getCustomPost('featured_stories', 3, undefined, undefined, undefined, {
    tagId: 181, excludeTag: true,
  });
  assert.deepEqual(result.map((post) => post.id), [2]);
});
