import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export not used — we need middleware for auth
  // Pages are statically generated at build time via generateStaticParams

  images: {
    // Allow images from GitHub raw content (some docs may reference images)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
    ],
  },

  // Suppress hydration warnings from browser extensions
  reactStrictMode: true,
};

export default nextConfig;
