import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["*.trycloudflare.com"],
  async rewrites() {
    return [
      // 悟空 Vision-AI 後端 (port 8000)
      { source: "/wukong-api/:path*", destination: "http://localhost:8000/api/:path*" },
      { source: "/wukong-health", destination: "http://localhost:8000/health" },
    ];
  },
};

export default nextConfig;
