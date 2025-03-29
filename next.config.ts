

module.exports = {
  images: {
    domains: ["cdn.builder.io"], 
    remotePatterns: [
      {
        protocol: "https",
        hostname: "limpiar-backend.onrender.com",
        pathname: "/api/properties/gridfs/files/**",
      },
    ],
  },
  async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'https://limpiar-backend.onrender.com*',
        },
      ]
    },
};