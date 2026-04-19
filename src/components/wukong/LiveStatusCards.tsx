"use client";

import { useEffect, useState } from "react";
import type { SubsystemStatus } from "@/types/wukong";
import StatusCard from "@/components/wukong/StatusCard";
import { useDashboard } from "@/components/wukong/DashboardContext";
import { FASTAPI } from "@/lib/wukong/config";

export default function LiveStatusCards() {
  const { refreshKey, backendOnline } = useDashboard();
  const [subsystems, setSubsystems] = useState<SubsystemStatus[]>([]);

  useEffect(() => {
    if (!backendOnline) return;

    fetch(`${FASTAPI}/api/dashboard/subsystems`)
      .then((r) => r.json())
      .then((data) => setSubsystems(data))
      .catch(() => {});
  }, [refreshKey, backendOnline]);

  if (subsystems.length === 0) {
    return (
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {["筋斗雲", "緊箍咒", "金箍棒"].map((name) => (
          <div
            key={name}
            className="bg-surface border border-border-subtle rounded-xl p-5 animate-pulse"
          >
            <div className="h-4 w-20 bg-white/5 rounded mb-3" />
            <div className="h-3 w-full bg-white/5 rounded mb-2" />
            <div className="h-3 w-2/3 bg-white/5 rounded" />
          </div>
        ))}
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {subsystems.map((s) => (
        <StatusCard key={s.id} data={s} />
      ))}
    </section>
  );
}
