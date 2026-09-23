import type { GetServerSideProps } from "next";
import { publishedPosts, publishedRegions } from "@/server/wordpress";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const segments = params?.customRoute;
  const region = params?.region;
  if (!Array.isArray(segments) || typeof region !== "string") return { notFound: true };
  const slug = segments[segments.length - 1];
  const regions = await publishedRegions();
  const prefix = regions.some(({ slug }) => slug === region) ? region : undefined;
  const posts = await publishedPosts("pages", prefix, { slug });
  if (!posts[0]) return { notFound: true };
  return {
    redirect: {
      destination: `${prefix ? `/${prefix}` : ""}/content/${encodeURIComponent(posts[0].slug)}`,
      permanent: true,
    },
  };
};

export default function LegacyContentRoute() { return null; }
