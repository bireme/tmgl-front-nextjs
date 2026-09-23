import { publishedRegions } from "@/server/wordpress";
import { SITE_ORIGIN, canonicalPath, isIndexablePath } from "@/helpers/seo";
import type { GetServerSideProps } from "next";
import axios, { AxiosInstance } from "axios";

import { decryptFromEnv } from "@/helpers/crypto";

type SitemapEntry = {
  path: string;
  lastModified?: string;
};

type WpItem = {
  slug: string;
  modified?: string;
};

type WpTerm = {
  slug: string;
};

const STATIC_ROUTES = [
  "/",
  "/databases-and-repositories",
  "/dimensions",
  "/events",
  "/evidence-maps",
  "/featured-stories",
  "/global-summit",
  "/journals",
  "/multimedia",
  "/news",
  "/recent-literature-reviews",
  "/regulations-and-policies",
  "/thematic-page",
];

const GLOBAL_WP_ROUTES = [
  { postType: "pages", route: "/content" },
  { postType: "posts", route: "/news" },
  { postType: "event", route: "/events" },
  { postType: "featured_stories", route: "/featured-stories" },
  {
    postType: "trending_topics",
    route: "/recent-literature-reviews",
  },
  { postType: "thematic-pages", route: "/thematic-page" },
  { postType: "dimensions", route: "/dimensions" },
];

const REGIONAL_WP_ROUTES = [
  { postType: "pages", route: "content" },
  { postType: "featured_stories", route: "featured-stories" },
  { postType: "dimensions", route: "dimensions" },
];

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const normalizeDate = (value?: string): string | undefined => {
  if (!value) return undefined;
  if (/^\d{8}$/.test(value)) {
    return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
};

async function fetchAllWpItems(
  api: AxiosInstance,
  postType: string,
  optionalPostType = false
): Promise<WpItem[]> {
  const params = {
    per_page: 100,
    page: 1,
    status: "publish",
    _fields: "slug,modified",
  };
  const firstPage = await api.get<WpItem[]>(postType, { params }).catch((error) => {
    // Regional WordPress sites do not all register the same custom post types.
    if (optionalPostType && axios.isAxiosError(error) && error.response?.status === 404 && error.response.data?.code === "rest_no_route") {
      return { data: [] as WpItem[], headers: {} as Record<string, string> };
    }
    throw error;
  });
  const totalPages = Number(firstPage.headers["x-wp-totalpages"] || 1);
  const remainingPages = await Promise.all(
    Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) =>
      api.get<WpItem[]>(postType, {
        params: { ...params, page: index + 2 },
      })
    )
  );

  return [firstPage, ...remainingPages].flatMap(({ data }) => data);
}

async function fetchWpEntries(
  api: AxiosInstance,
  postType: string,
  route: string,
  optionalPostType = false
): Promise<SitemapEntry[]> {
  const items = await fetchAllWpItems(api, postType, optionalPostType);
  return items
    .filter(({ slug }) => Boolean(slug))
    .map(({ slug, modified }) => ({
      path: `${route}/${encodeURIComponent(slug)}`,
      lastModified: normalizeDate(modified),
    }));
}

async function fetchRegionalEntries(
  wpBaseUrl: string,
  region: WpTerm
): Promise<SitemapEntry[]> {
  const api = axios.create({
    baseURL: `${wpBaseUrl}/${encodeURIComponent(region.slug)}/wp-json/wp/v2/`,
    timeout: 20000,
  });
  const entries: SitemapEntry[] = [{ path: `/${region.slug}` }];
  const results = await Promise.allSettled([
    fetchWpEntries(api, "countries", `/${region.slug}`),
    ...REGIONAL_WP_ROUTES.map(({ postType, route }) =>
      fetchWpEntries(api, postType, `/${region.slug}/${route}`, postType !== "pages")
    ),
  ]);

  results.forEach((result) => {
    if (result.status === "rejected") throw result.reason;
    entries.push(...result.value);
  });
  return entries;
}

async function fetchBvsEntries(
  endpoint: "resource" | "title",
  thematicArea: string,
  route: string
): Promise<SitemapEntry[]> {
  if (!process.env.BVSALUD_URL || !process.env.BVSALUD_API_KEY) return [];

  const apiKey = decryptFromEnv(process.env.BVSALUD_API_KEY);
  const { data } = await axios.get(
    `${process.env.BVSALUD_URL}${endpoint}/v1/search/`,
    {
      headers: { apiKey },
      params: {
        fq: `thematic_area:"${thematicArea}"`,
        q: "*:*",
        count: 10000,
        start: 0,
        lang: "en",
      },
      timeout: 30000,
    }
  );
  const docs = data?.diaServerResponse?.[0]?.response?.docs || [];

  return docs.flatMap((doc: Record<string, unknown>) => {
    const id = doc.django_id || doc.id;
    if (!id) return [];

    return [
      {
        path: `${route}/${encodeURIComponent(String(id))}`,
        lastModified: normalizeDate(
          typeof doc.updated_date === "string" ? doc.updated_date : undefined
        ),
      },
    ];
  });
}

function createSitemap(origin: string, entries: SitemapEntry[]): string {
  const uniqueEntries = new Map<string, SitemapEntry>();
  entries.forEach((entry) => {
    if (!isIndexablePath(entry.path) || canonicalPath(entry.path) !== entry.path) return;
    const existing = uniqueEntries.get(entry.path);
    if (!existing || (!existing.lastModified && entry.lastModified)) {
      uniqueEntries.set(entry.path, entry);
    }
  });

  const urls = Array.from(uniqueEntries.values())
    .sort((a, b) => a.path.localeCompare(b.path))
    .map(({ path, lastModified }) => {
      const location = escapeXml(`${origin}${path}`);
      const lastmod = lastModified
        ? `\n    <lastmod>${escapeXml(lastModified)}</lastmod>`
        : "";
      return `  <url>\n    <loc>${location}</loc>${lastmod}\n  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const wpBaseUrl = process.env.WP_BASE_URL?.replace(/\/$/, "");
  if (!wpBaseUrl) {
    res.statusCode = 503;
    res.setHeader("Cache-Control", "no-store");
    res.end("Sitemap configuration is incomplete");
    return { props: {} };
  }
  const origin = SITE_ORIGIN;
  const entries: SitemapEntry[] = STATIC_ROUTES.map((path) => ({ path }));
  const wpApi = axios.create({
    baseURL: `${wpBaseUrl}/wp-json/wp/v2/`,
    timeout: 20000,
  });

  const globalResults = await Promise.allSettled([
    ...GLOBAL_WP_ROUTES.map(({ postType, route }) =>
      fetchWpEntries(wpApi, postType, route)
    ),
    publishedRegions(),
    fetchBvsEntries("resource", "TMGL-EV", "/evidence-maps"),
    fetchBvsEntries("title", "TMGL", "/journals"),
  ]);

  if (globalResults.some((result) => result.status === "rejected")) {
    res.statusCode = 503;
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Retry-After", "300");
    res.end("Sitemap temporarily unavailable");
    return { props: {} };
  }

  globalResults.slice(0, GLOBAL_WP_ROUTES.length).forEach((result) => {
    if (result.status === "fulfilled") {
      entries.push(...(result.value as SitemapEntry[]));
    }
  });

  const regionsResult = globalResults[GLOBAL_WP_ROUTES.length];
  if (regionsResult?.status === "fulfilled") {
    const regionalResults = await Promise.allSettled(
      (regionsResult.value as WpTerm[]).map((region) =>
        fetchRegionalEntries(wpBaseUrl, region)
      )
    );
    if (regionalResults.some((result) => result.status === "rejected")) {
      res.statusCode = 503;
      res.setHeader("Cache-Control", "no-store");
      res.setHeader("Retry-After", "300");
      res.end("Sitemap temporarily unavailable");
      return { props: {} };
    }
    regionalResults.forEach((result) => {
      if (result.status === "fulfilled") entries.push(...result.value);
    });
  }

  globalResults.slice(GLOBAL_WP_ROUTES.length + 1).forEach((result) => {
    if (result.status === "fulfilled") {
      entries.push(...(result.value as SitemapEntry[]));
    }
  });

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate=86400"
  );
  res.write(createSitemap(origin, entries));
  res.end();

  return { props: {} };
};

export default function SitemapXml() {
  return null;
}
