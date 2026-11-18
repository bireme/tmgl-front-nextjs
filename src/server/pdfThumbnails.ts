import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import sharp from "sharp";
import { ApiError } from "./api";
import { downloadPdf, parsePdfUrl } from "./remotePdf";

const execFileAsync = promisify(execFile);
const CACHE_DIR = path.resolve(process.env.PDF_THUMBNAIL_DIR || path.join(process.cwd(), ".cache", "pdf-thumbnails"));
const MAX_AGE = 7 * 24 * 60 * 60 * 1000;
const MAX_CACHE_BYTES = 256 * 1024 * 1024;
const pending = new Map<string, Promise<string>>();
let active = 0;
let maintenance: Promise<void> | undefined;

export function thumbnailKey(url: unknown) {
  return createHash("sha256").update(parsePdfUrl(url).href).digest("hex");
}

export function thumbnailUrl(key: string) { return `/api/pdf-image?key=${key}`; }

function cachePath(key: string) {
  if (!/^[a-f0-9]{64}$/.test(key)) throw new ApiError(400, "INVALID_KEY", "We couldn't load this preview. Please refresh the page and try again.");
  return path.join(CACHE_DIR, `${key}.png`);
}

export async function hasThumbnail(key: string) {
  try {
    const stat = await fs.stat(cachePath(key));
    return stat.isFile() && Date.now() - stat.mtimeMs < MAX_AGE;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return false;
    throw error;
  }
}

export async function readThumbnail(key: string) {
  if (!await hasThumbnail(key)) throw new ApiError(404, "NOT_FOUND", "This preview is no longer available. Please refresh the page.");
  try { return await fs.readFile(cachePath(key)); }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") throw new ApiError(404, "NOT_FOUND", "This preview is no longer available. Please refresh the page.");
    throw error;
  }
}

async function pruneCache() {
  await fs.mkdir(CACHE_DIR, { recursive: true });
  const files = await fs.readdir(CACHE_DIR);
  const entries = (await Promise.all(files.filter((name) => /^[a-f0-9]{64}\.png$/.test(name)).map(async (name) => {
    const file = path.join(CACHE_DIR, name);
    try { return { file, ...await fs.stat(file) }; }
    catch (error) { if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error; return undefined; }
  }))).filter((entry) => entry !== undefined).sort((a, b) => b.mtimeMs - a.mtimeMs);
  let size = 0;
  let count = 0;
  for (const entry of entries) {
    size += entry.size;
    count++;
    if (Date.now() - entry.mtimeMs >= MAX_AGE || size > MAX_CACHE_BYTES || count > 1000) {
      await fs.rm(entry.file, { force: true });
    }
  }
}

export async function generateThumbnail(url: unknown) {
  const key = thumbnailKey(url);
  const existing = pending.get(key);
  if (existing) return existing;
  if (await hasThumbnail(key)) return thumbnailUrl(key);
  // Recheck after asynchronous disk access so simultaneous requests share one job.
  const raced = pending.get(key);
  if (raced) return raced;
  if (active >= 2) throw new ApiError(503, "THUMBNAIL_BUSY", "We couldn't prepare this preview right now. Please try again in a moment.");
  active++;
  const job = (async () => {
    let workDir: string | undefined;
    try {
      const pdf = await downloadPdf(url);
      workDir = await fs.mkdtemp(path.join(os.tmpdir(), "tmgl-pdf-"));
      const input = path.join(workDir, "input.pdf");
      const output = path.join(workDir, "page");
      await fs.writeFile(input, pdf);
      // Render only page one at bounded dimensions; timeout kills the converter.
      try {
        await execFileAsync("pdftoppm", ["-f", "1", "-singlefile", "-scale-to", "800", "-png", input, output], {
          timeout: 15000, killSignal: "SIGKILL", maxBuffer: 1024 * 1024,
        });
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") throw new ApiError(500, "CONVERTER_UNAVAILABLE", "We couldn't prepare this preview right now. Please try again later.");
        if ((error as { killed?: boolean }).killed) throw new ApiError(504, "CONVERSION_TIMEOUT", "This preview is taking longer than expected to load. Please try again shortly.");
        throw new ApiError(422, "INVALID_PDF", "We couldn't display a preview of this document.");
      }
      const image = await sharp(`${output}.png`, { limitInputPixels: 1000000 })
        .resize(400, 300, { fit: "cover", position: "north" }).png().toBuffer();
      maintenance ??= pruneCache().finally(() => { maintenance = undefined; });
      await maintenance;
      const temporary = path.join(CACHE_DIR, `${key}.${path.basename(workDir)}.tmp`);
      try {
        await fs.writeFile(temporary, image);
        await fs.rename(temporary, cachePath(key));
      } finally { await fs.rm(temporary, { force: true }); }
      return thumbnailUrl(key);
    } finally {
      active--;
      pending.delete(key);
      if (workDir) await fs.rm(workDir, { recursive: true, force: true });
    }
  })();
  pending.set(key, job);
  return job;
}
