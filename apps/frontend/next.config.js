/** @type {import('next').NextConfig} */
const allowedDevOrigins = process.env.ALLOWED_DEV_ORIGINS?.split(",") || [];

const nextConfig = {
  /* config options here */
  experimental: {
    allowedDevOrigins,
  },
};

module.exports = nextConfig;
