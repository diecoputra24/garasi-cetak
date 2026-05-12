import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/ldashboard',
        destination: '/dashboard',
        permanent: true,
      },
      {
        source: '/dahboard',
        destination: '/dashboard',
        permanent: true,
      },
    ];
  },
  experimental: {},
  // As recommended by Next.js 15+ terminal output
  allowedDevOrigins: ['192.168.1.12'],
};

export default nextConfig;
