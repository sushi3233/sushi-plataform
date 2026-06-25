import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: process.env.BUILD_STANDALONE === 'true' ? 'standalone' : undefined,
  serverExternalPackages: ['sharp'],

  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },

  images: {
    remotePatterns: [

      {
        protocol: 'https',
        hostname: '*.cloudflarestream.com',
      },

      {
        protocol: 'https',
        hostname: '*.r2.dev',
      },

      {
        protocol: 'https',
        hostname: '*.r2.cloudflarestorage.com',
      },

      {
        protocol: 'https',
        hostname: 'thumbs.xvideosprime.com',
      },

      {
        protocol: 'https',
        hostname: 'vazounudes.net',
      },

      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

};

export default nextConfig;
