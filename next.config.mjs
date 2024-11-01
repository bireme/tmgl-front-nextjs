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
    BASE_SEARCH_URL: process.env.BASE_SEARCH_URL,
    WP_BASE_URL: process.env.WP_BASE_URL,
    MAILCHIMP_API_KEY:process.env.MAILCHIMP_API_KEY,
    MAILCHIMP_LIST_ID:process.env.MAILCHIMP_LIST_ID,
    MAILCHIMP_DATA_CENTER:process.env.MAILCHIMP_DATA_CENTER,
  },
};

export default nextConfig;
