import path from 'path';
import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV !== 'production';

const nextConfig: NextConfig = {
  ...(!isDev ? { output: 'export' } : {}),
  distDir: 'dist/public',
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'date-fns',
      '@radix-ui/react-accordion',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
    ],
  },
  trailingSlash: true,
  outputFileTracingRoot: path.resolve(__dirname, '../../'),
  typescript: {
    // We run typecheck separately across workspace packages
    ignoreBuildErrors: true,
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

