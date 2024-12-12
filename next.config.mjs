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
    SECRET: process.env.SECRET,
    RSS_FEED_URL: process.env.RSS_FEED_URL,
    DIREV_API_KEY: process.env.DIREV_API_KEY,
    DIREV_API_URL: process.env.DIREV_API_URL,
    LIS_API_URL: process.env.LIS_API_URL,
    JOURNALS_API_URL: process.env.JOURNALS_API_URL,
    MULTIMEDIA_API_URL: process.env.MULTIMEDIA_API_URL,
    
  },
};



export default nextConfig;
