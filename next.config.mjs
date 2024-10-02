/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    prependData: `@import "./_mantine.scss";`,
  },
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    BASE_URL: process.env.BASE_URL,
    POSTSPERPAGE: process.env.POSTSPERPAGE,
    BASE_SEARCH_URL: process.env.BASE_SEARCH_URL
  },
};

export default nextConfig;
