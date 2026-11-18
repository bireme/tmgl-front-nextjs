import { lookup } from "node:dns/promises";
import type { LookupAddress } from "node:dns";
import { BlockList, isIP } from "node:net";
import http from "node:http";
import https from "node:https";
import { ApiError } from "./api";

const blocked = new BlockList();
for (const [network, prefix] of [
  ["0.0.0.0", 8], ["10.0.0.0", 8], ["100.64.0.0", 10], ["127.0.0.0", 8],
  ["169.254.0.0", 16], ["168.63.129.16", 32], ["172.16.0.0", 12], ["192.0.0.0", 24], ["192.0.2.0", 24],
  ["192.88.99.0", 24], ["192.168.0.0", 16], ["198.18.0.0", 15], ["198.51.100.0", 24],
  ["203.0.113.0", 24], ["224.0.0.0", 4], ["240.0.0.0", 4],
] as const) blocked.addSubnet(network, prefix, "ipv4");
const globalV6 = new BlockList();
globalV6.addSubnet("2000::", 3, "ipv6");
blocked.addSubnet("2001::", 23, "ipv6");
blocked.addSubnet("2001:db8::", 32, "ipv6");
blocked.addSubnet("2002::", 16, "ipv6");
blocked.addSubnet("3fff::", 20, "ipv6");

export function isPublicAddress(address: string) {
  const family = isIP(address);
  if (family === 4) return !blocked.check(address, "ipv4");
  if (family === 6) return globalV6.check(address, "ipv6") && !blocked.check(address, "ipv6");
  return false;
}

export function parsePdfUrl(input: unknown): URL {
  if (typeof input !== "string" || input.length > 4096) throw new ApiError(400, "INVALID_URL", "We couldn't open this document. Please check the link.");
  let url: URL;
  try { url = new URL(input); } catch { throw new ApiError(400, "INVALID_URL", "We couldn't open this document. Please check the link."); }
  if (!["https:", "http:"].includes(url.protocol) || url.username || url.password
    || (url.port && url.port !== (url.protocol === "https:" ? "443" : "80"))) {
    throw new ApiError(400, "INVALID_URL", "We couldn't open this document. Please check the link.");
  }
  const hostname = url.hostname.replace(/^\[|\]$/g, "");
  if (hostname === "localhost" || hostname.endsWith(".localhost") || (isIP(hostname) && !isPublicAddress(hostname))) {
    throw new ApiError(400, "BLOCKED_DESTINATION", "This document can't be opened here. Please try another document.");
  }
  url.hash = "";
  return url;
}

export const MAX_PDF_BYTES = 20 * 1024 * 1024;

function downloadFailure(signal: AbortSignal) {
  return new ApiError(signal.aborted ? 504 : 502, signal.aborted ? "UPSTREAM_TIMEOUT" : "PDF_UNAVAILABLE",
    signal.aborted ? "This document is taking longer than expected to open. Please try again shortly." : "We couldn't open this document right now. Please try again later.");
}

function resolveDestination(hostname: string, signal: AbortSignal): Promise<LookupAddress[]> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) { reject(downloadFailure(signal)); return; }
    const onAbort = () => reject(downloadFailure(signal));
    signal.addEventListener("abort", onAbort, { once: true });
    lookup(hostname, { all: true, verbatim: true }).then(resolve, () => reject(downloadFailure(signal)))
      .finally(() => signal.removeEventListener("abort", onAbort));
  });
}

/** Resolve every redirect and pin the connection to the validated IP (DNS rebinding protection). */
export async function downloadPdf(input: unknown): Promise<Buffer> {
  const signal = AbortSignal.timeout(15000);
  let url = parsePdfUrl(input);
  for (let redirects = 0; redirects <= 3; redirects++) {
    const hostname = url.hostname.replace(/^\[|\]$/g, "");
    const addresses = await resolveDestination(hostname, signal);
    if (!addresses.length || addresses.some(({ address }) => !isPublicAddress(address))) {
      throw new ApiError(400, "BLOCKED_DESTINATION", "This document can't be opened here. Please try another document.");
    }
    if (signal.aborted) throw new ApiError(504, "UPSTREAM_TIMEOUT", "This document is taking longer than expected to open. Please try again shortly.");
    const address = addresses[0];
    const result = await new Promise<Buffer | URL>((resolve, reject) => {
      const transport = url.protocol === "https:" ? https : http;
      const request = transport.request(url, {
        method: "GET", signal, agent: false, family: address.family,
        headers: { Accept: "application/pdf", "Accept-Encoding": "identity", "User-Agent": "TMGL-PDF/1.0" },
        lookup: (_hostname, _options, callback) => callback(null, address.address, address.family),
      }, (response) => {
        response.on("error", () => reject(downloadFailure(signal)));
        if ([301, 302, 303, 307, 308].includes(response.statusCode || 0)) {
          response.destroy();
          try {
            if (!response.headers.location) throw new ApiError(502, "PDF_UNAVAILABLE", "We couldn't open this document right now. Please try again later.");
            resolve(parsePdfUrl(new URL(response.headers.location, url).href));
          } catch (error) { reject(error instanceof ApiError ? error : new ApiError(502, "PDF_UNAVAILABLE", "We couldn't open this document right now. Please try again later.")); }
          return;
        }
        if (response.statusCode !== 200) {
          response.destroy();
          reject(new ApiError(response.statusCode === 404 ? 404 : 502, "PDF_UNAVAILABLE", "We couldn't open this document right now. Please try again later."));
          return;
        }
        const type = response.headers["content-type"]?.split(";")[0].trim().toLowerCase();
        if (type && !["application/pdf", "application/octet-stream", "binary/octet-stream"].includes(type)) {
          response.destroy(); reject(new ApiError(415, "INVALID_PDF", "This document isn't available as a PDF.")); return;
        }
        if (Number(response.headers["content-length"]) > MAX_PDF_BYTES) {
          response.destroy(); reject(new ApiError(413, "PDF_TOO_LARGE", "This document is too large to preview here.")); return;
        }
        let size = 0;
        const chunks: Buffer[] = [];
        response.on("data", (chunk: Buffer) => {
          size += chunk.length;
          if (size > MAX_PDF_BYTES) {
            response.destroy(); reject(new ApiError(413, "PDF_TOO_LARGE", "This document is too large to preview here."));
          } else chunks.push(chunk);
        });
        response.on("end", () => {
          const buffer = Buffer.concat(chunks);
          if (!buffer.subarray(0, 1024).includes(Buffer.from("%PDF-"))) {
            reject(new ApiError(415, "INVALID_PDF", "This document isn't available as a PDF."));
          } else resolve(buffer);
        });
      });
      request.on("error", () => reject(downloadFailure(signal)));
      request.end();
    });
    if (Buffer.isBuffer(result)) return result;
    url = result;
  }
  throw new ApiError(502, "TOO_MANY_REDIRECTS", "We couldn't open this document right now. Please try again later.");
}
