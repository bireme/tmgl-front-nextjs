import axios from "axios";
import type { GetServerSideProps } from "next";
import type { Post } from "@/services/types/posts.dto";
import { canonicalPath } from "@/helpers/seo";

export interface PostPageProps {
  initialPost: Post;
  initialChildren: Post[];
}

/** Region taxonomy also includes filters (e.g. 'global') that are not sites. */
export async function publishedRegions(): Promise<{ slug: string }[]> {
  const { data } = await wordpressApi().get("../../acf/v3/options/options");
  if (!Array.isArray(data?.acf?.regionais)) throw new Error("Regional site configuration is missing");
  const slugs = data.acf.regionais.map((region: { rest_api_prefix: string }) =>
    region.rest_api_prefix.toLowerCase().replace(/^\/+|\/+$/g, "")
  ).filter((slug: string) => /^[a-z0-9-]+$/.test(slug));
  return [...new Set<string>(slugs)].map((slug) => ({ slug }));
}

export function wordpressApi(region?: string) {
  if (!process.env.WP_BASE_URL) throw new Error("WP_BASE_URL is required");
  return axios.create({
    baseURL: `${process.env.WP_BASE_URL.replace(/\/$/, "")}/${region ? `${encodeURIComponent(region)}/` : ""}wp-json/wp/v2/`,
    timeout: 20000,
  });
}

export async function publishedPosts(
  postType: string,
  region?: string,
  filters: Record<string, string | number> = {}
): Promise<Post[]> {
  const api = wordpressApi(region);
  const params = { status: "publish", _embed: true, acf_format: "standard", per_page: 100, ...filters };
  const first = await api.get<Post[]>(postType, { params });
  const total = Number(first.headers["x-wp-totalpages"] || 1);
  const rest = await Promise.all(Array.from({ length: total - 1 }, (_, i) =>
    api.get<Post[]>(postType, { params: { ...params, page: i + 2 } })
  ));
  return [first, ...rest].flatMap(({ data }) => data);
}

/** Empty successful results are 404s; upstream outages must remain server errors. */
export function postPageProps(postType: string, children = false): GetServerSideProps<PostPageProps> {
  return async ({ params, resolvedUrl }) => {
    const slug = params?.slug;
    const region = params?.region;
    if (typeof slug !== "string" || (region !== undefined && typeof region !== "string")) {
      return { notFound: true };
    }
    const path = resolvedUrl.split("?")[0];
    if (canonicalPath(path) !== path) {
      return { redirect: { destination: canonicalPath(path), permanent: true } };
    }
    const posts = await publishedPosts(postType, region, { slug }).catch((error) => {
      if (region && postType === "dimensions" && axios.isAxiosError(error)
        && error.response?.status === 404 && error.response.data?.code === "rest_no_route") return [];
      throw error;
    });
    if (!posts[0] && region && postType === "dimensions") {
      const globalPosts = await publishedPosts(postType, undefined, { slug });
      if (globalPosts[0]) {
        return { redirect: { destination: `/dimensions/${encodeURIComponent(globalPosts[0].slug)}`, permanent: true } };
      }
    }
    if (!posts[0]) return { notFound: true };
    const initialChildren = children
      ? await publishedPosts(postType, region, { parent: posts[0].id })
      : [];
    return { props: { initialPost: posts[0], initialChildren } };
  };
}
