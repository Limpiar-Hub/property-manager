

module.exports = {
      images: {
    domains: ['cdn.builder.io'],
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