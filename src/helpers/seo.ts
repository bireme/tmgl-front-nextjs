/** Shared by HTML metadata, internal links, robots and the sitemap. */
export const SITE_ORIGIN = new URL(
  process.env.NEXT_PUBLIC_SITE_URL || "https://tmgl.org"
).origin;

export function canonicalPath(value: string): string {
  const path = value.split(/[?#]/, 1)[0].replace(/\/+$/, "") || "/";
  if (path === "/en" || path === "/content/home-global") return "/";
  return path.replace(/^\/([^/]+)\/content\/home$/, "/$1");
}

export function isIndexablePath(path: string): boolean {
  return !/\/content\/(home(?:-.*)?|thanks-for-your-subscription)$/.test(path)
    && path !== "/subscription";
}

export function canonicalUrl(path: string): string {
  return `${SITE_ORIGIN}${canonicalPath(path)}`;
}

export function normalizeInternalLink(value: string): string {
  if (!value || value.startsWith("#")) return value;
  try {
    const url = new URL(value, SITE_ORIGIN);
    const cmsOrigin = process.env.WP_BASE_URL
      ? new URL(process.env.WP_BASE_URL).origin
      : undefined;
    if (url.origin !== SITE_ORIGIN && url.origin !== cmsOrigin) return value;
    // Preserve the existing CMS menu mapping for its Spanish prefix.
    return `${canonicalPath(url.pathname.replace(/^\/es\//, "/"))}${url.search}${url.hash}`;
  } catch {
    return value;
  }
}
