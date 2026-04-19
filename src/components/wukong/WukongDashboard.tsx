"use client";

import DashboardHeader from "@/components/wukong/DashboardHeader";
import LiveStatusCards from "@/components/wukong/LiveStatusCards";
import CameraFeedPanel from "@/components/wukong/CameraFeedPanel";
import FocusMetricsPanel from "@/components/wukong/FocusMetricsPanel";
import RecentNotesPanel from "@/components/wukong/RecentNotesPanel";
import AnalyticsPanel from "@/components/wukong/AnalyticsPanel";
import { DashboardProvider } from "@/components/wukong/DashboardContext";

export default function WukongDashboard() {
  return (
    <DashboardProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <DashboardHeader />

        <main className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
          {/* 三大組件狀態卡片（即時） */}
          <section
            className="opacity-0 animate-[slideUp_0.4s_ease-out_forwards]"
            style={{ animationDelay: "0ms" }}
          >
            <LiveStatusCards />
          </section>

          {/* 鏡頭串流 + 專注力面板 */}
          <section
            className="grid grid-cols-1 lg:grid-cols-3 gap-4 opacity-0 animate-[slideUp_0.4s_ease-out_forwards]"
            style={{ animationDelay: "100ms" }}
          >
            <div className="lg:col-span-2">
              <CameraFeedPanel />
            </div>
            <div>
              <FocusMetricsPanel />
            </div>
          </section>

          {/* 學習分析 */}
          <section
            className="opacity-0 animate-[slideUp_0.4s_ease-out_forwards]"
            style={{ animationDelay: "200ms" }}
          >
            <AnalyticsPanel />
          </section>

          {/* 工程筆記（即時） */}
          <section
            className="opacity-0 animate-[slideUp_0.4s_ease-out_forwards]"
            style={{ animationDelay: "300ms" }}
          >
            <RecentNotesPanel />
          </section>
        </main>

        <footer className="relative text-center text-[11px] text-gray-600 py-4 font-mono">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
          孫悟空 AI 智慧學習生態系統 &copy; 2026 Hank Ni
        </footer>
      </div>
    </DashboardProvider>
  );
}
