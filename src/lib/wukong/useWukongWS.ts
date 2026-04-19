"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { WS_URL } from "@/lib/wukong/config";

type MessageHandler = (channel: string, data: unknown) => void;

/**
 * 孫悟空 WebSocket Hook
 * 連接後端 /ws/dashboard，訂閱指定頻道並接收即時推送。
 *
 * @param channels - 要訂閱的頻道列表，如 ["posture", "scanner", "knowledge"]
 * @param onMessage - 收到訊息時的回呼
 */
export function useWukongWS(channels: string[], onMessage: MessageHandler) {
  const wsRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;
  const channelsKey = channels.join(",");

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    // 動態生成 WebSocket URL：支援公開部署（相對路徑）和本地開發
    const wsBase = WS_URL || (typeof window !== "undefined"
      ? `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}`
      : "ws://localhost:8000");
    const ws = new WebSocket(`${wsBase}/ws/dashboard`);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      // 訂閱頻道
      ws.send(JSON.stringify({ subscribe: channels }));
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.channel && msg.data) {
          onMessageRef.current(msg.channel, msg.data);
        }
      } catch {
        // 忽略非 JSON 訊息
      }
    };

    ws.onclose = () => {
      setConnected(false);
      // 自動重連（3 秒後）
      setTimeout(() => connect(), 3000);
    };

    ws.onerror = () => {
      ws.close();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelsKey]);

  useEffect(() => {
    connect();
    return () => {
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [connect]);

  return { connected };
}
