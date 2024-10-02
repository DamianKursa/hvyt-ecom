/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'swewoocommerce.dfweb.no',
        pathname: '/**', // Allow all paths from this domain
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**', // Allow all paths from Cloudinary
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**', // Allow all paths from placeholder
      },
      {
        protocol: 'https',
        hostname: 'hvyt.pl',
        pathname: '/**', // Allow all paths from hvyt.pl
      },
    ],
  },
};

module.exports = nextConfig;
