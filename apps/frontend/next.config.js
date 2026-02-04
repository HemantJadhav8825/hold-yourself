/** @type {import('next').NextConfig} */
if (!process.env.ALLOWED_DEV_ORIGINS) {
  throw new Error("ALLOWED_DEV_ORIGINS environment variable is required");
}
const allowedDevOrigins = process.env.ALLOWED_DEV_ORIGINS.split(",");

const nextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      allowedOrigins: allowedDevOrigins,
    },
  },
};

module.exports = nextConfig;
