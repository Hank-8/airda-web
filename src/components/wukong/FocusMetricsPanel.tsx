"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useDashboard } from "@/components/wukong/DashboardContext";
import { FASTAPI } from "@/lib/wukong/config";
import Modal from "@/components/wukong/Modal";

const POSTURE_INTERVAL = 3000;

interface PostureResult {
  person_detected: boolean;
  posture_score: number;
  shoulder_tilt: number;
  head_forward_ratio: number;
  head_drop_ratio: number;
  alerts: { type: string; message: string; severity: string; timestamp: string }[];
}

interface PostureStats {
  total_frames: number;
  good_posture_frames: number;
  good_posture_rate: number;
  recent_alerts: { type: string; message: string; severity: string; timestamp: string }[];
}

interface KnowledgeStats {
  total_entries: number;
  type_counts: Record<string, number>;
}

function StatRing({
  value,
  max,
  label,
  color,
  size = 90,
  onClick,
}: {
  value: number;
  max: number;
  label: string;
  color: string;
  size?: number;
  onClick?: () => void;
}) {
  const r = size * 0.4;
  const c = 2 * Math.PI * r;
  const pct = max > 0 ? Math.min(value / max, 1) : 0;
  const offset = c - pct * c;
  const center = size / 2;

  return (
    <div
      className={`flex flex-col items-center ${onClick ? "cursor-pointer hover:scale-105 transition-transform" : ""}`}
      onClick={onClick}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={center} cy={center} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
        <circle
          cx={center}
          cy={center}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      <span className="text-2xl font-bold font-mono -mt-14" style={{ color }}>
        {value}
      </span>
      <span className="text-[11px] text-gray-500 mt-8">{label}</span>
    </div>
  );
}

export default function FocusMetricsPanel() {
  const { refreshKey, backendOnline } = useDashboard();
  const [posture, setPosture] = useState<PostureResult | null>(null);
  const [stats, setStats] = useState<PostureStats | null>(null);
  const [knowledgeStats, setKnowledgeStats] = useState<KnowledgeStats | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const captureAndAnalyze = useCallback(async () => {
    if (!backendOnline) return;

    const video = document.querySelector("video") as HTMLVideoElement | null;
    if (!video || video.readyState < 2) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(video, 0, 0);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/jpeg", 0.7)
    );
    if (!blob) return;

    const formData = new FormData();
    formData.append("file", blob, "posture.jpg");

    try {
      const res = await fetch(`${FASTAPI}/api/posture/analyze`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data: PostureResult = await res.json();
        setPosture(data);
      }
    } catch {
      // 靜默失敗
    }
  }, [backendOnline]);

  useEffect(() => {
    if (!backendOnline) return;

    captureAndAnalyze();
    intervalRef.current = setInterval(captureAndAnalyze, POSTURE_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [backendOnline, captureAndAnalyze]);

  useEffect(() => {
    if (!backendOnline) return;

    fetch(`${FASTAPI}/api/posture/stats`)
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});

    fetch(`${FASTAPI}/api/knowledge/stats`)
      .then((r) => r.json())
      .then(setKnowledgeStats)
      .catch(() => {});
  }, [refreshKey, backendOnline, posture]);

  const postureScore = posture?.posture_score ?? 0;
  const goodRate = stats?.good_posture_rate ?? 0;
  const totalEntries = knowledgeStats?.total_entries ?? 0;
  const alerts = posture?.alerts ?? [];
  const recentAlerts = stats?.recent_alerts ?? [];

  const scoreColor =
    postureScore >= 80 ? "#10b981" : postureScore >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <div className="bg-surface border border-accent-amber/20 rounded-xl overflow-hidden flex flex-col">
      <div className="px-4 py-3 border-b border-border-subtle flex items-center justify-between">
        <h2 className="text-sm font-bold text-accent-amber">
          💍 緊箍咒 — 專注守護
        </h2>
        <span
          className={`text-xs font-mono ${
            posture?.person_detected
              ? "text-emerald-400"
              : "text-gray-500"
          }`}
        >
          {posture?.person_detected ? "● 偵測中" : "○ 等待中"}
        </span>
      </div>

      <div className="p-4 flex-1 flex flex-col gap-3">
        <div className="flex justify-around">
          <StatRing
            value={postureScore}
            max={100}
            label="姿態分數"
            color={scoreColor}
            onClick={() => setModalOpen(true)}
          />
          <StatRing
            value={totalEntries}
            max={Math.max(totalEntries, 10)}
            label="知識總量"
            color="#06b6d4"
          />
        </div>

        <div className="text-center text-xs text-gray-500">
          良好姿態比率：
          <span className="text-accent-amber font-mono font-bold">
            {goodRate}%
          </span>
          <span className="text-gray-700 ml-2">
            ({stats?.good_posture_frames ?? 0}/{stats?.total_frames ?? 0} 幀)
          </span>
        </div>

        {posture?.person_detected && (
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <div className="text-gray-400 mb-0.5">肩膀傾斜</div>
              <div className={`font-mono font-bold ${posture.shoulder_tilt > 12 ? "text-red-400" : "text-emerald-400"}`}>
                {posture.shoulder_tilt}°
              </div>
            </div>
            <div>
              <div className="text-gray-400 mb-0.5">頭部前傾</div>
              <div className={`font-mono font-bold ${posture.head_forward_ratio > 0.6 ? "text-red-400" : "text-emerald-400"}`}>
                {posture.head_forward_ratio}
              </div>
            </div>
            <div>
              <div className="text-gray-400 mb-0.5">低頭程度</div>
              <div className={`font-mono font-bold ${posture.head_drop_ratio > 0.15 ? "text-red-400" : "text-emerald-400"}`}>
                {posture.head_drop_ratio}
              </div>
            </div>
          </div>
        )}

        {alerts.length > 0 && (
          <div className="space-y-1.5">
            <div className="text-[11px] text-gray-600">即時警示</div>
            {alerts.map((a, i) => (
              <div
                key={i}
                className="text-xs bg-amber-500/10 border border-amber-500/20 rounded px-3 py-1.5 text-amber-300 animate-pulse"
              >
                ⚠ {a.message}
              </div>
            ))}
          </div>
        )}

        {posture?.person_detected && alerts.length === 0 && (
          <div className="text-xs text-center text-emerald-400/70 bg-emerald-500/5 border border-emerald-500/10 rounded px-3 py-2">
            ✓ 姿態良好，繼續保持！
          </div>
        )}

        {recentAlerts.length > 0 && (
          <div className="space-y-1 mt-auto">
            <div className="text-[11px] text-gray-600">近期紀錄</div>
            {recentAlerts.slice(-3).map((a, i) => (
              <div key={i} className="text-[10px] text-gray-600 flex justify-between">
                <span>{a.message}</span>
                <span className="font-mono text-gray-700">
                  {new Date(a.timestamp).toLocaleTimeString("zh-Hant", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="💍 緊箍咒 — 姿態分析詳情"
        accent="amber"
      >
        <div className="space-y-6">
          <div className="flex justify-center">
            <StatRing
              value={postureScore}
              max={100}
              label="即時姿態分數"
              color={scoreColor}
              size={140}
            />
          </div>

          <div className="bg-surface-elevated rounded-lg px-4 py-3 text-center">
            <div className="text-2xl font-bold font-mono text-accent-amber">{goodRate}%</div>
            <div className="text-xs text-gray-500 mt-1">
              良好姿態比率（{stats?.good_posture_frames ?? 0}/{stats?.total_frames ?? 0} 幀）
            </div>
          </div>

          {posture?.person_detected && (
            <div>
              <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-3">即時偵測數據</p>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-surface-elevated rounded-lg px-3 py-3 text-center">
                  <div className={`text-xl font-bold font-mono ${posture.shoulder_tilt > 12 ? "text-red-400" : "text-emerald-400"}`}>
                    {posture.shoulder_tilt}°
                  </div>
                  <div className="text-xs text-gray-500 mt-1">肩膀傾斜</div>
                </div>
                <div className="bg-surface-elevated rounded-lg px-3 py-3 text-center">
                  <div className={`text-xl font-bold font-mono ${posture.head_forward_ratio > 0.6 ? "text-red-400" : "text-emerald-400"}`}>
                    {posture.head_forward_ratio}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">頭部前傾</div>
                </div>
                <div className="bg-surface-elevated rounded-lg px-3 py-3 text-center">
                  <div className={`text-xl font-bold font-mono ${posture.head_drop_ratio > 0.15 ? "text-red-400" : "text-emerald-400"}`}>
                    {posture.head_drop_ratio}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">低頭程度</div>
                </div>
              </div>
            </div>
          )}

          {recentAlerts.length > 0 && (
            <div>
              <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-2">完整警示紀錄</p>
              <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
                {recentAlerts.map((a, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-xs bg-surface-elevated rounded px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        a.severity === "high" ? "bg-red-500" : "bg-amber-500"
                      }`} />
                      <span className="text-gray-300">{a.message}</span>
                    </div>
                    <span className="font-mono text-gray-600 shrink-0 ml-3">
                      {new Date(a.timestamp).toLocaleTimeString("zh-Hant", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {recentAlerts.length === 0 && (
            <div className="text-center py-4 text-gray-600 text-sm">
              目前無警示紀錄
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
