const path = require('path');

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

    // Base alias for '@'
    config.resolve.alias['@'] = path.resolve(__dirname);

    // Aliases for missing modules to empty mock file
    config.resolve.alias['@/actions/password-reset'] = path.resolve(__dirname, 'mocks/empty.js');
    config.resolve.alias['@/cleaningBusiness/component/refund-modal'] = path.resolve(__dirname, 'mocks/empty.js');
    config.resolve.alias['@/cleaningBusiness/component/withdraw-modal'] = path.resolve(__dirname, 'mocks/empty.js');

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
