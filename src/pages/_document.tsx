import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="pl-PL">
      <Head>
        {/* Meta Tags */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Odkryj nowoczesne gałki, uchwyty meblowe, klamki i wieszaki. Stylowe akcesoria wnętrzarskie od HVYT dla wymagających klientów."
        />
        <meta
          name="keywords"
          content="uchwyty meblowe, gałki meblowe, klamki, wieszaki, akcesoria wnętrzarskie, HVYT, stylowe wnętrza"
        />
        <meta name="author" content="HVYT" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://hvyt.pl" />
        {/* Open Graph Meta Tags for Social Media */}
        <meta
          property="og:title"
          content="HVYT – Nowoczesne Gałki i Uchwyty Meblowe"
        />
        <meta
          property="og:description"
          content="Stylowe akcesoria wnętrzarskie: gałki, uchwyty, klamki i wieszaki. Odkryj nasze kolekcje!"
        />
        <meta property="og:url" content="https://hvyt.pl" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://hvyt.pl/og-image.jpg" />
        {/* Favicon */}
        <link rel="icon" href="/favicon.png" />
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        {/* Additional Resources */}
        <link rel="stylesheet" href="https://hvyt.pl/styles.css" />
        {/* Facebook Domain Verification */}
        <meta
          name="facebook-domain-verification"
          content="t3ojuyqbn81ecfp2vg7hi9e76z6dku"
        />
        <meta
          name="p:domain_verify"
          content="a6786718d22d0c370bdbd44d3a3f44ee"
        />

        {/* Global site tag (gtag.js) - Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=UA-191037585-1"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'UA-191037585-1');
            `,
          }}
        />
        {/* Cookiebot Script */}
        <script
          id="Cookiebot"
          src="https://consent.cookiebot.com/uc.js"
          data-cbid="feef7cd9-8bc1-4184-80c9-90153c1244ea"
          type="text/javascript"
          async
        ></script>
      </Head>
      <body className="bg-beige-light">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PJNDR4N"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
        <Main />
        <NextScript />
        {/* Allekurier Banner Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function (i) {
                var j = document.createElement("script");
                j.src = "https://cdn.allekurier.pl/mail-box/banner.js?hid=" + i;
                j.async = true;
                j.referrerPolicy = "no-referrer-when-downgrade";
                document.body.appendChild(j);
              })("59c63e5c-3a7e-4b8e-8165-999687ba3bc4");
            `,
          }}
        />
      </body>
    </Html>
  );
}
