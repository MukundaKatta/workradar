import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@workradar/shared", "@workradar/supabase", "@workradar/ui"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
