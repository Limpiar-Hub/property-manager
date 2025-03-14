// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   images: {
//     domains: ['cdn.builder.io'],
//   },
//   /* config options here */
// };

// export default nextConfig;


// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   images: {
//     domains: ['cdn.builder.io'],
//   },
//   async rewrites() {
//     return [
//       {
//         source: "/api/:path*",
//         destination: "https://limpiar-backend.onrender.com", // Your backend URL
//       },
//     ];
//   },
//   /* other config options here */
// };

// export default nextConfig;


/** @type {import('next').NextConfig} */
// const nextConfig = {
//     images: {
//     domains: ['cdn.builder.io'],
//   },
//   async headers() {
//     return [
//       {
//         // This affects all routes
//         source: '/:path*',
//         headers: [
//           {
//             key: 'Access-Control-Allow-Credentials',
//             value: 'true',
//           },
//           {
//             key: 'Access-Control-Allow-Origin',
//             value: 'https://limpiar-backend.onrender.com', // Your backend URL
//           },
//           {
//             key: 'Access-Control-Allow-Methods',
//             value: 'GET,DELETE,PATCH,POST,PUT,OPTIONS',
//           },
//           {
//             key: 'Access-Control-Allow-Headers',
//             value: 'Content-Type, Authorization',
//           },
//         ],
//       },
//     ];
//   },
// };

// module.exports = nextConfig;

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