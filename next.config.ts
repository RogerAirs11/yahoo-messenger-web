import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // css: tailwind v4 pipeline
  allowedDevOrigins: ["*.space-z.ai", "localhost"],
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;

