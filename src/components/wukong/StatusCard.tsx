"use client";

import { useState } from "react";
import type { SubsystemStatus } from "@/types/wukong";
import Modal from "@/components/wukong/Modal";

const accentMap = {
  jindouyun: { color: "text-accent-cyan", border: "border-accent-cyan/20", glow: "hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]", icon: "☁️", accent: "cyan" as const },
  jingguzhou: { color: "text-accent-amber", border: "border-accent-amber/20", glow: "hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]", icon: "💍", accent: "amber" as const },
  jingubang: { color: "text-accent-emerald", border: "border-accent-emerald/20", glow: "hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]", icon: "🏏", accent: "emerald" as const },
} as const;

const statusDot: Record<SubsystemStatus["status"], string> = {
  online: "bg-emerald-500",
  offline: "bg-red-500",
  warning: "bg-amber-500",
};

const statusLabel: Record<SubsystemStatus["status"], { text: string; color: string }> = {
  online: { text: "在線", color: "text-emerald-400" },
  offline: { text: "離線", color: "text-red-400" },
  warning: { text: "警告", color: "text-amber-400" },
};

export default function StatusCard({ data }: { data: SubsystemStatus }) {
  const [modalOpen, setModalOpen] = useState(false);
  const accent = accentMap[data.id];

  return (
    <>
      <div
        onClick={() => setModalOpen(true)}
        className={`relative bg-surface border ${accent.border} rounded-xl p-5 transition-all duration-300 cursor-pointer ${accent.glow} hover:border-opacity-50 hover:-translate-y-0.5 active:scale-[0.98]`}
      >
        <div className="absolute top-4 right-4">
          <span className={`inline-block h-2.5 w-2.5 rounded-full ${statusDot[data.status]}`} />
        </div>

        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">{accent.icon}</span>
          <h3 className={`text-lg font-bold ${accent.color}`}>{data.name}</h3>
        </div>

        <p className="text-sm text-gray-400 mb-4">{data.description}</p>

        <div className="grid grid-cols-3 gap-2">
          {Object.entries(data.metrics).map(([key, val]) => (
            <div key={key} className="text-center">
              <div className={`text-lg font-bold font-mono ${accent.color}`}>{val}</div>
              <div className="text-[11px] text-gray-500">{key}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-border-subtle text-[11px] text-gray-600 font-mono">
          上次更新：{new Date(data.lastUpdated).toLocaleTimeString("zh-Hant")}
        </div>
      </div>

      {/* 詳情彈窗 */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`${accent.icon} ${data.name} — 子系統詳情`}
        accent={accent.accent}
      >
        <div className="space-y-6">
          {/* 狀態概覽 */}
          <div className="flex items-center gap-3">
            <span className={`inline-block h-3 w-3 rounded-full ${statusDot[data.status]}`} />
            <span className={`text-sm font-bold ${statusLabel[data.status].color}`}>
              {statusLabel[data.status].text}
            </span>
            <span className="text-xs text-gray-600 font-mono ml-auto">
              ID: {data.id}
            </span>
          </div>

          {/* 描述 */}
          <div>
            <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-1">描述</p>
            <p className="text-sm text-gray-300">{data.description}</p>
          </div>

          {/* 完整指標 */}
          <div>
            <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-3">系統指標</p>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(data.metrics).map(([key, val]) => (
                <div key={key} className="bg-surface-elevated rounded-lg px-4 py-3">
                  <div className={`text-2xl font-bold font-mono ${accent.color}`}>{val}</div>
                  <div className="text-xs text-gray-500 mt-1">{key}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 時間戳 */}
          <div className="pt-3 border-t border-border-subtle">
            <p className="text-xs text-gray-600 font-mono">
              最後更新：{new Date(data.lastUpdated).toLocaleString("zh-Hant")}
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}
