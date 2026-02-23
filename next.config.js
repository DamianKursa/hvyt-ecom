/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'swewoocommerce.dfweb.no',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'hvyt.pl',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'wp.hvyt.pl',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '**.cdninstagram.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.fbcdn.net',
        pathname: '/**',
      },
    ],
  },
  i18n: {
    locales: ['pl', 'en'],
    defaultLocale: 'pl',
    localeDetection: false,
  },

  // Environment variables exposed to the browser
  env: {
    NEXT_PUBLIC_DEFAULT_LOCALE: process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'pl',
    NEXT_PUBLIC_SITE_URL_PL: process.env.NEXT_PUBLIC_SITE_URL_PL || 'https://hvyt.pl',
    NEXT_PUBLIC_SITE_URL_EN: process.env.NEXT_PUBLIC_SITE_URL_EN || 'https://hvyt.eu',
  },
  
  async redirects() {
    return [
      {
        source: '/kategoria/uchwyty-meblowe/page/:page(\\d+)',
        destination: 'https://hvyt.pl/kategoria/uchwyty-meblowe',
        permanent: true,
      },
    ];
  },
  
  async rewrites() {
    return [
      { source: '/category/:path*', destination: '/kategoria/:path*' },
      { source: '/product/:path*', destination: '/produkt/:path*' },
      { source: '/moje-konto/:path*', destination: '/moje-konto/:path*' },
      { source: '/my-account/my-orders/:path*', destination: '/moje-konto/moje-zamowienia/:path*' },
      { source: '/my-account/bought-products/:path*', destination: '/moje-konto/kupione-produkty/:path*' },
      { source: '/my-account/account-details/:path*', destination: '/moje-konto/moje-dane/:path*' },
      { source: '/my-account/my-addresses/:path*', destination: '/moje-konto/moje-adresy/:path*' },
      { source: '/my-account/billing-data/:path*', destination: '/moje-konto/dane-do-faktury/:path*' },
      { source: '/contact/:path*', destination: '/kontakt/:path*' },
      { source: '/orders/:path*', destination: '/orders/:path*' },
      { source: '/posts/:path*', destination: '/posts/:path*' },   
      { source: '/create-order/:path*', destination: '/create-order/:path*' },
      { source: '/payment-webhooks/:path*', destination: '/payment-webhooks/:path*' },
      { source: '/payment/:path*', destination: '/payment/:path*' },
      { source: '/reviews/:path*', destination: '/reviews/:path*' },
      { source: '/shipping/:path*', destination: '/shipping/:path*' },
      { source: '/about-us/:path*', destination: '/o-nas/:path*' },
      { source: '/wishlist/:path*', destination: '/ulubione/:path*' },
      { source: '/cart/:path*', destination: '/koszyk/:path*' },
      { source: '/thank-you/:path*', destination: '/dziekujemy/:path*' },
      { source: '/login/:path*', destination: '/logowanie/:path*' },
      { source: '/forgot-password/:path*', destination: '/zapomniane-haslo/:path*' },
      { source: '/confirm-email/:path*', destination: '/potwierdzenie-email/:path*' },      
      { source: '/terms/:path*', destination: '/regulamin/:path*' },      
      { source: '/order-received/:path*', destination: '/zamowienie-otrzymane/:path*' },      
      { source: '/cooperation/:path*', destination: '/wspolpraca/:path*' },      
      { source: '/delivery/:path*', destination: '/dostawa/:path*' },      
      { source: '/returns/:path*', destination: '/zwroty-i-reklamacje/:path*' },      
      { source: '/privacy-policy/:path*', destination: '/polityka-prywatnosci/:path*' },      
      // { source: '/en/about-us/:path*', destination: '/o-nas/:path*' },
               
      { source: '/_next/:path*', destination: '/_next/:path*' },
      { source: '/api/:path*', destination: '/api/:path*' },
      { source: '/static/:path*', destination: '/static/:path*' },
      { source: '/', destination: '/' },
      { source: '/auth/:path*', destination: '/auth/:path*' },

      { source: '/blog/:path*', destination: '/blog/:path*' },
      { source: '/kategoria/:path*', destination: '/kategoria/:path*' },
      { source: '/collections/:path*', destination: '/kolekcje/:path*' },


      { source: '/waiting-list/:path*', destination: '/waiting-list/:path*' },
      { source: '/woocommerce/:path*', destination: '/woocommerce/:path*' },
      { source: '/checkout/:path*', destination: '/checkout/:path*' },
      { source: '/dostawa/:path*', destination: '/dostawa/:path*' },
      { source: '/dziekujemy/:path*', destination: '/dziekujemy/:path*' },
      { source: '/hvyt-objects/:path*', destination: '/hvyt-objects/:path*' },
      { source: '/kase/:path*', destination: '/kase/:path*' },
      { source: '/koszyk/:path*', destination: '/koszyk/:path*' },
      { source: '/logowanie/:path*', destination: '/logowanie/:path*' },
      { source: '/o-nas/:path*', destination: '/o-nas/:path*' },

      { source: '/polityka-prywatnosci/:path*', destination: '/polityka-prywatnosci/:path*' },
      { source: '/potwierdzenie-email/:path*', destination: '/potwierdzenie-email/:path*' },
      { source: '/regulamin/:path*', destination: '/regulamin/:path*' },
      { source: '/ulubione/:path*', destination: '/ulubione/:path*' },
      { source: '/wspolpraca/:path*', destination: '/wspolpraca/:path*' },
      { source: '/wygodne-zwroty/:path*', destination: '/wygodne-zwroty/:path*' },
      { source: '/zapomniane-haslo/:path*', destination: '/zapomniane-haslo/:path*' },
      { source: '/zwroty-i-reklamacje/:path*', destination: '/zwroty-i-reklamacje/:path*' },
      { source: '/wp-json/:path*', destination: 'https://wp.hvyt.pl/wp-json/:path*' },
      {
        source: '/',
        has: [
          {
            type: 'query',
            key: 'wc-api',
            value: '(.*)',
          },
        ],
        destination: 'https://wp.hvyt.pl/',
      },

      {
        source: '/:path((?!_next|api|static|wp-json|wp-admin|auth|moje-konto|orders|posts|blog|kategoria|kolekcje|category|contact|create-order|payment-webhooks|payment|reviews|shipping|waiting-list|woocommerce|checkout|dostawa|dziekujemy|hvyt-objects|kase|koszyk|logowanie|o-nas|polityka-prywatnosci|potwierdzenie-email|regulamin|ulubione|wspolpraca|wygodne-zwroty|zapomniane-haslo|zwroty-i-reklamacje|produkt).+)',
        destination: 'https://wp.hvyt.pl/:path*',
      },
      // English category routes
      // {
      //   source: '/en/category/:slug*',
      //   destination: '/kategoria/:slug*',
      //   locale: false,
      // },
      // // English product routes
      // {
      //   source: '/en/product/:slug*',
      //   destination: '/produkt/:slug*',
      //   locale: false,
      // },
      // // English static page routes
      // {
      //   source: '/en/cart',
      //   destination: '/koszyk',
      //   locale: false,
      // },
      // {
      //   source: '/en/checkout',
      //   destination: '/checkout',
      //   locale: false,
      // },
      // {
      //   source: '/en/thank-you',
      //   destination: '/dziekujemy',
      //   locale: false,
      // },
      // {
      //   source: '/en/login',
      //   destination: '/logowanie',
      //   locale: false,
      // },
      // {
      //   source: '/en/about-us',
      //   destination: '/o-nas',
      //   locale: false,
      // },
      // {
      //   source: '/en/contact',
      //   destination: '/kontakt',
      //   locale: false,
      // },
      // {
      //   source: '/en/delivery',
      //   destination: '/dostawa',
      //   locale: false,
      // },
      // {
      //   source: '/en/returns-and-complaints',
      //   destination: '/zwroty-i-reklamacje',
      //   locale: false,
      // },
      // {
      //   source: '/en/terms',
      //   destination: '/regulamin',
      //   locale: false,
      // },
      // {
      //   source: '/en/privacy-policy',
      //   destination: '/polityka-prywatnosci',
      //   locale: false,
      // },
      // {
      //   source: '/en/collections',
      //   destination: '/kolekcje',
      //   locale: false,
      // },
      // {
      //   source: '/en/collections/:slug*',
      //   destination: '/kolekcje/:slug*',
      //   locale: false,
      // },
      // {
      //   source: '/en/my-account',
      //   destination: '/moje-konto',
      //   locale: false,
      // },
      // {
      //   source: '/en/my-account/:section*',
      //   destination: '/moje-konto/:section*',
      //   locale: false,
      // },
      // {
      //   source: '/en/wishlist',
      //   destination: '/ulubione',
      //   locale: false,
      // },
      // {
      //   source: '/en/cooperation',
      //   destination: '/wspolpraca',
      //   locale: false,
      // },
      // {
      //   source: '/en/forgot-password',
      //   destination: '/zapomniane-haslo',
      //   locale: false,
      // },
      // {
      //   source: '/en/easy-returns',
      //   destination: '/wygodne-zwroty',
      //   locale: false,
      // },      
    ];
  },

  // Headers for security and caching
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },  
};

module.exports = nextConfig;
