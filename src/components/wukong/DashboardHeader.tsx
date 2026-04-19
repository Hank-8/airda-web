"use client";

import { useDashboard } from "@/components/wukong/DashboardContext";

export default function DashboardHeader() {
  const { backendOnline, wsConnected } = useDashboard();

  return (
    <header className="relative bg-black/90 backdrop-blur-lg px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🐵</span>
        <h1 className="text-xl font-bold tracking-wide text-accent-cyan">
          孫悟空導師系統
        </h1>
        <span className="text-xs text-gray-500 font-mono ml-2">
          WUKONG AI v1.0
        </span>
      </div>
      <div className="flex items-center gap-5 text-sm">
        <span className="text-gray-400 font-mono">
          {new Date().toLocaleDateString("zh-Hant", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}
        </span>

        {/* 後端狀態 */}
        <div className="flex items-center gap-2">
          <span
            className={`inline-block h-2 w-2 rounded-full ${backendOnline ? "bg-emerald-500" : "bg-red-500"}`}
          />
          <span className={`text-xs ${backendOnline ? "text-emerald-400" : "text-red-400"}`}>
            FastAPI {backendOnline ? "在線" : "離線"}
          </span>
        </div>

        {/* WebSocket 狀態 */}
        <div className="flex items-center gap-2">
          <span
            className={`inline-block h-2 w-2 rounded-full ${wsConnected ? "bg-violet-500" : "bg-gray-600"}`}
          />
          <span className={`text-xs ${wsConnected ? "text-violet-400" : "text-gray-500"}`}>
            WS {wsConnected ? "即時" : "離線"}
          </span>
        </div>

        {/* 系統狀態 */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>
          <span className="text-emerald-400">系統運行中</span>
        </div>
      </div>

      {/* 底部漸層線 */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-cyan/40 to-transparent" />
    </header>
  );
}
