/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
      ignoreBuildErrors: true,
    },
    webpack(config, { isServer }) {
      
      if (!isServer) {
        config.resolve.fallback = { fs: false };
      }
      return config;
    },
    
    cssModules: true,
    css: {
      loaderOptions: {
        
      },
    },
    images: {
      domains: ['limpiar-backend.onrender.com'], 
    },
  };
  
  module.exports = nextConfig;
  