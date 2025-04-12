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
      // Add pattern for images on wp.hvyt.pl if needed (adjust the path if necessary)
      {
        protocol: 'https',
        hostname: 'wp.hvyt.pl',
        pathname: '/wp-content/uploads/**',
      },
      // Instagram & Facebook CDN domains
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
      // Preserve Next.js internals
      { source: '/_next/:path*', destination: '/_next/:path*' },
      { source: '/api/:path*', destination: '/api/:path*' },
      { source: '/static/:path*', destination: '/static/:path*' },

      // Serve Next.js homepage
      { source: '/', destination: '/' },

      // Explicit Next.js routes (folders & files)
      { source: '/auth/:path*', destination: '/auth/:path*' },
      { source: '/moje-konto/:path*', destination: '/moje-konto/:path*' },
      { source: '/orders/:path*', destination: '/orders/:path*' },
      { source: '/posts/:path*', destination: '/posts/:path*' },
      { source: '/blog/:path*', destination: '/blog/:path*' },
      { source: '/kategoria/:path*', destination: '/kategoria/:path*' },
      { source: '/kolekcje/:path*', destination: '/kolekcje/:path*' },
      { source: '/category/:path*', destination: '/category/:path*' },
      { source: '/contact/:path*', destination: '/contact/:path*' },
      { source: '/create-order/:path*', destination: '/create-order/:path*' },
      { source: '/payment-webhooks/:path*', destination: '/payment-webhooks/:path*' },
      { source: '/payment/:path*', destination: '/payment/:path*' },
      { source: '/reviews/:path*', destination: '/reviews/:path*' },
      { source: '/shipping/:path*', destination: '/shipping/:path*' },
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
      { source: '/produkt/:path*', destination: '/produkt/:path*' },
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

      // Catch-all: Any route not matched above is proxied to WordPress.
      {
        source: '/:path((?!_next|api|static|wp-json|wp-admin|auth|moje-konto|orders|posts|blog|kategoria|kolekcje|category|contact|create-order|payment-webhooks|payment|reviews|shipping|waiting-list|woocommerce|checkout|dostawa|dziekujemy|hvyt-objects|kase|koszyk|logowanie|o-nas|polityka-prywatnosci|potwierdzenie-email|regulamin|ulubione|wspolpraca|wygodne-zwroty|zapomniane-haslo|zwroty-i-reklamacje|produkt).+)',
        destination: 'https://wp.hvyt.pl/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
