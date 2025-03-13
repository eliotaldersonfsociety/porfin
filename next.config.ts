import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true, // Si usas server actions en Next.js 15
  },
};

export default nextConfig;
