/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
      ignoreBuildErrors: true,
    },
    eslint: {
      ignoreDuringBuilds: true, // Ignore lint errors during build
    },
    webpack(config, { isServer }) {
      if (!isServer) {
        config.resolve.fallback = { fs: false };
      }
      return config;
    },
    images: {
      domains: [
        'limpiar-backend.onrender.com',
        'encrypted-tbn0.gstatic.com',
        't4.ftcdn.net',  
         "img.freepik.com",
        
      ],
    },
  };
  
  module.exports = nextConfig;
  