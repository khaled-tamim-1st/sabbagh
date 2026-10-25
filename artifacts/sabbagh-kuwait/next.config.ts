import path from 'path';
import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV !== 'production';

const nextConfig: NextConfig = {
  ...(!isDev ? { output: 'export' } : {}),
  distDir: 'dist/public',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  outputFileTracingRoot: path.resolve(__dirname, '../../'),
  typescript: {
    // We run typecheck separately across workspace packages
    ignoreBuildErrors: false,
  },
  ...(isDev ? {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'http://127.0.0.1:5000/api/:path*',
        },
      ];
    },
  } : {}),
};

export default nextConfig;
