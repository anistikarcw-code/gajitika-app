/**
 * @deprecated next.config.js is deprecated. Please use next.config.mjs instead.
 */
// @ts-check
const {withPWA} = require('next-pwa');
const path = require('path');

const isDev = process.env.NODE_ENV === 'development';

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: isDev,
    fallbacks: {
      document: '/_offline',
    },
  },
  webpack: (
    config,
    {buildId, dev, isServer, defaultLoaders, nextRuntime, webpack}
  ) => {
    // Important: return the modified config
    return config;
  },
};

module.exports = withPWA(nextConfig);
