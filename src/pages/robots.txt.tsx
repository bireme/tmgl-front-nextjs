import type { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const forwardedProtocol = req.headers["x-forwarded-proto"];
  const forwardedHost = req.headers["x-forwarded-host"];
  const protocol = Array.isArray(forwardedProtocol)
    ? forwardedProtocol[0]
    : forwardedProtocol?.split(",")[0] || "http";
  const host = Array.isArray(forwardedHost)
    ? forwardedHost[0]
    : forwardedHost?.split(",")[0] || req.headers.host;

  if (!host) {
    res.statusCode = 500;
    res.end("Robots configuration is incomplete");
    return { props: {} };
  }

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600");
  res.write(
    `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${protocol}://${host}/sitemap.xml\n`
  );
  res.end();

  return { props: {} };
};

export default function RobotsTxt() {
  return null;
}
