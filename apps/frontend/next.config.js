/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  experimental: {
    allowedDevOrigins: ["webelong.world", "api.webelong.world"],
  },
};

module.exports = nextConfig;
