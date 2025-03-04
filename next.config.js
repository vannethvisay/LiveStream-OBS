/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  swcMinify: false,
  transpilePackages: [],
  experimental: {
    forceSwcTransforms: false,
    swcTraceProfiling: false,
    esmExternals: 'loose',
  },
};

module.exports = nextConfig;
