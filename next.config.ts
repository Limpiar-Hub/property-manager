import path from 'path';
import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  output: 'standalone',
  webpack(config, { isServer }) {
    if (!isServer) {
      config.resolve.fallback = { fs: false };
    }
  
    // Base alias '@' pointing to root of project
    config.resolve.alias['@'] = path.resolve(__dirname);
  
    // Alias whole folders to empty mocks
    config.resolve.alias['@/actions'] = path.resolve(__dirname, 'mocks/empty.js');
    config.resolve.alias['@/cleaningBusiness/component'] = path.resolve(__dirname, 'mocks/empty.js');
  
    return config;
  },
  

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['limpiar-backend.onrender.com'],
  },
};

export default nextConfig;
