const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const sharp = require('sharp');
const { PDFDocument } = require('pdf-lib');
const { loader } = require('./helpers/load-ts.cjs');

test('PDF thumbnails render page one, deduplicate jobs, persist atomically and expire', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'tmgl-thumbnail-test-'));
  const previous = process.env.PDF_THUMBNAIL_DIR;
  process.env.PDF_THUMBNAIL_DIR = dir;
  try {
    const pdf = await PDFDocument.create();
    pdf.addPage([600, 800]).drawText('TMGL thumbnail regression test', { x: 30, y: 700 });
    pdf.addPage([800, 600]);
    const bytes = Buffer.from(await pdf.save());
    let downloads = 0;
    const remote = loader()('src/server/remotePdf.ts');
    const load = loader({ './remotePdf': { ...remote, downloadPdf: async () => { downloads++; return bytes; } } });
    const cache = load('src/server/pdfThumbnails.ts');
    const urls = await Promise.all(Array.from({ length: 5 }, () => cache.generateThumbnail('https://example.org/report.pdf')));
    assert.equal(downloads, 1);
    assert.equal(new Set(urls).size, 1);
    const key = new URL(urls[0], 'https://portal.example').searchParams.get('key');
    assert.equal(await cache.hasThumbnail(key), true);
    const meta = await sharp(await cache.readThumbnail(key)).metadata();
    assert.equal(meta.width, 400); assert.equal(meta.height, 300);
    assert.equal(meta.format, 'png');
    assert.equal((await fs.readdir(dir)).length, 1);
    await cache.generateThumbnail('https://example.org/report.pdf#page=2');
    assert.equal(downloads, 1, 'fragment changes reuse the cache');
    await assert.rejects(cache.readThumbnail('../escape'), { code: 'INVALID_KEY' });
    const expired = new Date(Date.now() - 8 * 86400000);
    await fs.utimes(path.join(dir, `${key}.png`), expired, expired);
    assert.equal(await cache.hasThumbnail(key), false);
    await assert.rejects(cache.readThumbnail(key), { statusCode: 404 });
    await cache.generateThumbnail('https://example.org/another.pdf');
    assert.equal((await fs.readdir(dir)).length, 1, 'expired cache entries are pruned');
  } finally {
    if (previous === undefined) delete process.env.PDF_THUMBNAIL_DIR;
    else process.env.PDF_THUMBNAIL_DIR = previous;
    await fs.rm(dir, { recursive: true, force: true });
  }
});

test('PDF thumbnail conversion rejects corrupt files and releases capacity', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'tmgl-thumbnail-failure-'));
  const previous = process.env.PDF_THUMBNAIL_DIR;
  process.env.PDF_THUMBNAIL_DIR = dir;
  try {
    const remote = loader()('src/server/remotePdf.ts');
    const load = loader({ './remotePdf': { ...remote, downloadPdf: async () => Buffer.from('%PDF-1.7\ninvalid') } });
    const { generateThumbnail } = load('src/server/pdfThumbnails.ts');
    for (let i = 0; i < 3; i++) {
      await assert.rejects(generateThumbnail(`https://example.org/bad-${i}.pdf`), { code: 'INVALID_PDF' });
    }
    assert.deepEqual(await fs.readdir(dir), []);
  } finally {
    if (previous === undefined) delete process.env.PDF_THUMBNAIL_DIR;
    else process.env.PDF_THUMBNAIL_DIR = previous;
    await fs.rm(dir, { recursive: true, force: true });
  }
});
