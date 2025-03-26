/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Socket.io requires special config to work with serverless functions
  experimental: {
    serverComponents: true,
  },
  // This setting is needed for Vercel serverless functions
  serverRuntimeConfig: {
    PROJECT_ROOT: process.cwd(),
  },
};

export default nextConfig; 