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

  // Preserve old URLs from the pre-IA-simplification site
  async redirects() {
    return [
      // Competitive Positioning moved under Capabilities
      { source: "/competitive", destination: "/capabilities/competitive", permanent: true },
      // Platform + Industries sections retired — send any saved links home
      { source: "/platform", destination: "/", permanent: true },
      { source: "/platform/:path*", destination: "/", permanent: true },
      { source: "/verticals", destination: "/", permanent: true },
      { source: "/verticals/:path*", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
