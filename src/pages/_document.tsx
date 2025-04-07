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

        {/* Open Graph Meta Tags */}
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
        {/* Fonts & Additional Resources */}
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

        {/* --- Google Tag Manager (GTM) Script --- */}
        <script
          data-cookieconsent="ignore"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){
                w[l]=w[l]||[];
                w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
                var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s), dl=l!='dataLayer'?'&l='+l:'';
                j.async=true;
                j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
                f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-PJNDR4N');
            `,
          }}
        />

        {/* 
          Removed Cookiebot script from here.
          Load Cookiebot in _app.tsx with Next/Script using strategy="afterInteractive"
        */}
      </Head>
      <body className="bg-beige-light">
        {/* --- Google Tag Manager (noscript) fallback --- */}
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
        {/* --- Allekurier Banner Script --- */}
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
