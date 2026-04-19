"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { FASTAPI } from "@/lib/wukong/config";
import { useWukongWS } from "@/lib/wukong/useWukongWS";

const POLL_INTERVAL = 5000;

interface DashboardState {
  refreshKey: number;
  triggerRefresh: () => void;
  backendOnline: boolean;
  wsConnected: boolean;
}

const Ctx = createContext<DashboardState>({
  refreshKey: 0,
  triggerRefresh: () => {},
  backendOnline: false,
  wsConnected: false,
});

export function useDashboard() {
  return useContext(Ctx);
}

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [backendOnline, setBackendOnline] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null);

  const triggerRefresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  // WebSocket 即時更新：收到任何頻道訊息就觸發 refresh
  const { connected: wsConnected } = useWukongWS(
    ["posture", "scanner", "knowledge", "analytics"],
    useCallback(() => {
      setRefreshKey((k) => k + 1);
    }, [])
  );

  // 定時輪詢 + 檢查後端狀態（WebSocket 斷線時的 fallback）
  useEffect(() => {
    const check = () => {
      fetch("/wukong-health")
        .then((r) => {
          setBackendOnline(r.ok);
          if (r.ok) setRefreshKey((k) => k + 1);
        })
        .catch(() => setBackendOnline(false));
    };

    check();
    intervalRef.current = setInterval(check, POLL_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <Ctx.Provider value={{ refreshKey, triggerRefresh, backendOnline, wsConnected }}>
      {children}
    </Ctx.Provider>
  );
}
