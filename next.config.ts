import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    if (process.env.REMOTE_API_BASE) {
      return [
        {
          source: "/api/:path*",
          destination: `${process.env.REMOTE_API_BASE}/api/:path*`,
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
