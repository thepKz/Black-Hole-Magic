import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
  // Add empty turbopack config to silence warning
  turbopack: {},
  // Disable strict mode for jQuery compatibility
  reactStrictMode: false,
};

export default nextConfig;
