/* eslint-disable @next/next/next-script-for-ga */

import { Head, Html, Main, NextScript } from "next/document";

import { ColorSchemeScript } from "@mantine/core";

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        {/* Meta tags para SEO e compartilhamento em redes sociais */}
        <meta
          name="description"
          content="The WHO Traditional Medicine Global Library (TMGL) is a comprehensive digital resource for traditional medicine information, research, and evidence from around the world."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="The WHO Traditional Medicine Global Library"
        />
        <meta
          property="og:description"
          content="The WHO Traditional Medicine Global Library (TMGL) is a comprehensive digital resource for traditional medicine information, research, and evidence from around the world."
        />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:site_name" content="TMGL - WHO" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="The WHO Traditional Medicine Global Library"
        />
        <meta
          name="twitter:description"
          content="The WHO Traditional Medicine Global Library (TMGL) is a comprehensive digital resource for traditional medicine information, research, and evidence from around the world."
        />
        <meta name="twitter:image" content="/og-image.png" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Serif:ital,opsz,wght@0,8..144,100..900;1,8..144,100..900&display=swap"
          rel="stylesheet"
        ></link>
        <ColorSchemeScript defaultColorScheme="auto" />
        <script
          id={"hotjar-tmgl"}
          dangerouslySetInnerHTML={{
            __html: `(function(h,o,t,j,a,r){
                      h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                      h._hjSettings={hjid:5146983,hjsv:6};
                      a=o.getElementsByTagName('head')[0];
                      r=o.createElement('script');r.async=1;
                      r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                      a.appendChild(r);
                  })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
            `,
          }}
        />
        {/* Script Google Tag (gtag.js) */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.PRODUCTION ? 'G-KVDQKKTNBY' : 'G-EQQV5PQT16'}`}
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.PRODUCTION ? 'G-KVDQKKTNBY' : 'G-EQQV5PQT16'}');
            `,
          }}
        />
        <title>The WHO Traditional Medicine Global Library</title>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
