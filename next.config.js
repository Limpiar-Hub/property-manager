/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack(config, { isServer }) {
    if (!isServer) {
      config.resolve.fallback = { fs: false };
    }
    return config;
  },
  images: {
    domains: ['limpiar-backend.onrender.com'],
  },
  async redirects() {
    return [
      {
        source: '/login',
        destination: '/partner/login',
        permanent: false, 
      },
    ];
  },
};

module.exports = nextConfig;
