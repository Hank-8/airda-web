import type { NextConfig } from "next";

const WUKONG_BACKEND = process.env.WUKONG_BACKEND_URL || "http://localhost:8000";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["*.trycloudflare.com"],
  async rewrites() {
    return [
      // 悟空 Vision-AI 後端 — 透過官網代理，middleware 擋未登入用戶
      { source: "/wukong-api/:path*", destination: `${WUKONG_BACKEND}/api/:path*` },
      { source: "/wukong-health", destination: `${WUKONG_BACKEND}/health` },
    ];
  },
};

export default nextConfig;
