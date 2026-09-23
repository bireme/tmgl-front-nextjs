import { writeFile, readFile } from 'node:fs/promises';

// Read-only audit. Example: node scripts/audit-seo.mjs --origin http://localhost:3100
const args = process.argv.slice(2);
const option = (name, fallback) => args.includes(name) ? args[args.indexOf(name) + 1] : fallback;
const origin = new URL(option('--origin', 'https://tmgl.org')).origin;
const canonicalOrigin = new URL(option('--canonical-origin', 'https://tmgl.org')).origin;
const output = option('--output', '/tmp/tmgl-seo-audit.json');
const urlsFile = option('--urls', '');
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const attrs = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*["']([^"']*)["']/g)].map((m) => [m[1].toLowerCase(), decode(m[2])]));
const fetchPage = (url) => fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(60000) });
const sitemap = await fetchPage(`${origin}/sitemap.xml`);
if (sitemap.status !== 200) throw new Error(`Sitemap returned ${sitemap.status}`);
const xml = await sitemap.text();
const locations = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => decode(m[1]));
if (!locations.length) throw new Error('Sitemap has no URLs');
const sitemapIssues = [];
if (new Set(locations).size !== locations.length) sitemapIssues.push('Duplicate sitemap locations');
for (const loc of locations) {
  const url = new URL(loc);
  if (url.origin !== canonicalOrigin || url.search || url.hash || (url.pathname !== '/' && url.pathname.endsWith('/'))) sitemapIssues.push(`Noncanonical sitemap location: ${loc}`);
}
const robotsResponse = await fetchPage(`${origin}/robots.txt`);
const robots = await robotsResponse.text();
if (robotsResponse.status !== 200 || !robots.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`)) sitemapIssues.push('robots.txt and sitemap origin disagree');
const selected = urlsFile ? (await readFile(urlsFile, 'utf8')).split(/\r?\n/).filter(Boolean) : locations;
const queue = [...selected];
const results = [];
async function audit(input) {
  const expected = new URL(input, canonicalOrigin);
  const requestUrl = new URL(expected.pathname + expected.search, origin);
  const issues = [];
  try {
    const response = await fetchPage(requestUrl);
    const html = await response.text();
    const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] || '';
    const links = [...head.matchAll(/<link\b[^>]*>/gi)].map((m) => attrs(m[0]));
    const canonicals = links.filter((tag) => tag.rel === 'canonical').map((tag) => tag.href);
    const meta = [...head.matchAll(/<meta\b[^>]*>/gi)].map((m) => attrs(m[0]));
    if (response.status !== 200) issues.push(`HTTP ${response.status}`);
    if (canonicals.length !== 1 || canonicals[0] !== expected.href) issues.push('Missing, multiple, or non-self canonical');
    if (meta.some((tag) => /^(robots|googlebot)$/i.test(tag.name || '') && /noindex/i.test(tag.content || '')) || /noindex/i.test(response.headers.get('x-robots-tag') || '')) issues.push('noindex');
    if (!/<title\b[^>]*>[^<]+<\/title>/i.test(head)) issues.push('Missing title in server HTML');
    // Inspect visible HTML only; serialized Next.js props are not rendered content.
    const visible = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
    const headings = [...visible.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => m[1].replace(/<[^>]+>/g, '').trim());
    if (/\/(dimensions|content|news|events|featured-stories|recent-literature-reviews)\/[^/]+$/.test(expected.pathname) && !headings.length) issues.push('Missing rendered h1');
    return { url: expected.href, status: response.status, location: response.headers.get('location'), canonicals, headings, issues };
  } catch (error) { return { url: expected.href, issues: [error.message] }; }
}
await Promise.all(Array.from({ length: 4 }, async () => {
  while (queue.length) results.push(await audit(queue.shift()));
}));
results.sort((a, b) => a.url.localeCompare(b.url));
const report = { checkedAt: new Date().toISOString(), origin, canonicalOrigin, sitemapCount: locations.length, checked: results.length, failures: results.filter((r) => r.issues.length).length, sitemapIssues, results };
await writeFile(output, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ checked: report.checked, failures: report.failures, sitemapIssues, output }, null, 2));
process.exitCode = report.failures || sitemapIssues.length ? 1 : 0;
