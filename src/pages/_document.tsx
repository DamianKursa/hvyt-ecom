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
      </Head>
      <body className="bg-beige-light">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
