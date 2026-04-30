/** 悟空系統 — 統一後端 URL 和 Proxy Token */
export const FASTAPI = process.env.NEXT_PUBLIC_WUKONG_API_URL || "/wukong-api";
export const WS_URL = process.env.NEXT_PUBLIC_WUKONG_WS_URL || "";
export const PROXY_TOKEN = process.env.NEXT_PUBLIC_WUKONG_PROXY_TOKEN || "";

/** 帶 Proxy Token 的 fetch — 悟空後端會驗證此 header */
export function wukongFetch(url: string, init?: RequestInit): Promise<Response> {
  const headers = new Headers(init?.headers);
  if (PROXY_TOKEN) {
    headers.set("x-proxy-token", PROXY_TOKEN);
  }
  return fetch(url, { ...init, headers });
}
