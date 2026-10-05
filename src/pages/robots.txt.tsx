import { IS_PRODUCTION, SITE_ORIGIN } from "@/helpers/seo";
import type { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", IS_PRODUCTION ? "public, s-maxage=3600" : "no-store");
  if (!IS_PRODUCTION) res.setHeader("X-Robots-Tag", "noindex, nofollow");
  res.write(
    IS_PRODUCTION
      ? `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${SITE_ORIGIN}/sitemap.xml\n`
      // Crawlers must access pages to see their noindex directives.
      : "User-agent: *\nAllow: /\n"
  );
  res.end();

  return { props: {} };
};

export default function RobotsTxt() {
  return null;
}
