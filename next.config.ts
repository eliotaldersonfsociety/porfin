import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Optimizaciones para builds en Vercel
  experimental: {
    largePageDataBytes: 256 * 1000, // 256KB (límite para páginas SSR)
  },
  // Configuración Webpack para memoria
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: false,
      };
    }
    return config;
  },
  // Configuración de imágenes si usas dominios externos
  images: {
    domains: [
      "lh3.googleusercontent.com", // Ejemplo para Google auth
      "vercel.com", // Ejemplo para imágenes de Vercel
    ],
  },
};

export default nextConfig;
