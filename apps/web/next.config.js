/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable webpack file system cache in dev to prevent stale chunk mismatches
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
    }
    return config;
  },
  // Suppress outdated version warning
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;
