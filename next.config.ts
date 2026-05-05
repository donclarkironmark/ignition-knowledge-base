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

  // Preserve old URLs from prior IA refactors
  async redirects() {
    return [
      // Competitive Positioning lives under Resources (was under Capabilities, was top-level)
      { source: "/competitive", destination: "/resources/competitive", permanent: true },
      { source: "/capabilities/competitive", destination: "/resources/competitive", permanent: true },
      // Capabilities overview retired — send to ROI Reporting (the entry-point capability)
      { source: "/capabilities", destination: "/capabilities/roi-reporting", permanent: true },
      // Platform + Industries sections retired — send any saved links home
      { source: "/platform", destination: "/", permanent: true },
      { source: "/platform/:path*", destination: "/", permanent: true },
      { source: "/verticals", destination: "/", permanent: true },
      { source: "/verticals/:path*", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
