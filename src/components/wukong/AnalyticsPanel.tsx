"use client";

import { useEffect, useState, useCallback } from "react";
import { useDashboard } from "@/components/wukong/DashboardContext";
import type { AnalyticsData } from "@/types/wukong";
import { FASTAPI } from "@/lib/wukong/config";
import Modal from "@/components/wukong/Modal";

const SUBJECT_BAR_COLORS: Record<string, string> = {
  "國文": "bg-red-500",
  "英文": "bg-blue-500",
  "數學": "bg-purple-500",
  "社會": "bg-green-500",
  "自然": "bg-orange-500",
};

export default function AnalyticsPanel() {
  const { refreshKey, backendOnline } = useDashboard();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    if (!backendOnline) return;
    try {
      const res = await fetch(`${FASTAPI}/api/analytics/summary`);
      if (res.ok) {
        setData(await res.json());
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [backendOnline]);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshKey]);

  const exportMarkdown = async () => {
    try {
      const res = await fetch(`${FASTAPI}/api/analytics/export/markdown`);
      if (!res.ok) return;
      const text = await res.text();
      const blob = new Blob([text], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `wukong_report_${new Date().toISOString().slice(0, 10)}.md`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // ignore
    }
  };

  const exportJSON = async () => {
    try {
      const res = await fetch(`${FASTAPI}/api/analytics/export/json`);
      if (!res.ok) return;
      const json = await res.json();
      const blob = new Blob([JSON.stringify(json, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `wukong_data_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // ignore
    }
  };

  if (loading) {
    return (
      <div className="bg-surface border border-accent-amber/20 rounded-xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-white/5 rounded w-1/3" />
          <div className="h-32 bg-white/5 rounded" />
        </div>
      </div>
    );
  }

  const overallAccuracy =
    data && data.total_questions > 0
      ? Math.round((data.total_correct / data.total_questions) * 100)
      : 0;

  return (
    <div className="bg-surface border border-accent-amber/20 rounded-xl overflow-hidden transition-all duration-300 hover:border-accent-amber/30 hover:shadow-[0_0_20px_rgba(245,158,11,0.08)]">
      <div className="px-4 py-3 border-b border-border-subtle flex items-center justify-between">
        <h2 className="text-sm font-bold text-accent-amber">
          📊 學習分析 — NotebookLM 數據中心
        </h2>
        <div className="flex gap-2">
          <button
            onClick={exportMarkdown}
            className="text-[10px] px-2 py-1 bg-surface-elevated text-gray-400 border border-border-subtle rounded hover:bg-white/[0.08] transition-colors"
          >
            匯出 Markdown
          </button>
          <button
            onClick={exportJSON}
            className="text-[10px] px-2 py-1 bg-surface-elevated text-gray-400 border border-border-subtle rounded hover:bg-white/[0.08] transition-colors"
          >
            匯出 JSON
          </button>
          {data && data.total_questions > 0 && (
            <button
              onClick={() => setModalOpen(true)}
              className="text-[10px] px-2 py-1 bg-accent-amber/15 text-accent-amber border border-accent-amber/30 rounded hover:bg-accent-amber/25 transition-colors"
            >
              展開
            </button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-4 gap-3">
          <StatBox label="總題數" value={data?.total_questions ?? 0} />
          <StatBox label="答對數" value={data?.total_correct ?? 0} />
          <StatBox
            label="正確率"
            value={`${overallAccuracy}%`}
            color={
              overallAccuracy >= 80
                ? "text-emerald-400"
                : overallAccuracy >= 60
                  ? "text-amber-400"
                  : "text-red-400"
            }
          />
          <StatBox
            label="連續天數"
            value={data?.study_streak_days ?? 0}
            suffix="天"
          />
        </div>

        {data &&
          Object.keys(data.subject_accuracy).length > 0 && (
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">
                各科正確率
              </p>
              <div className="space-y-2">
                {Object.entries(data.subject_accuracy).map(
                  ([subject, accuracy]) => (
                    <div key={subject} className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 w-10 text-right">
                        {subject}
                      </span>
                      <div className="flex-1 h-5 bg-white/[0.04] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${SUBJECT_BAR_COLORS[subject] || "bg-gray-500"}`}
                          style={{ width: `${Math.min(accuracy, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono text-gray-400 w-12 text-right">
                        {accuracy}%
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

        {data && data.recent_trend.length > 0 && (
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">
              近期趨勢
            </p>
            <div className="flex items-end gap-1 h-16">
              {data.recent_trend.slice(-14).map((t, i) => {
                const rate =
                  t.total > 0 ? Math.round((t.correct / t.total) * 100) : 0;
                const h = Math.max(rate * 0.6, 4);
                return (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center gap-0.5"
                    title={`${t.date}: ${rate}% (${t.correct}/${t.total})`}
                  >
                    <div
                      className={`w-full rounded-t transition-all ${rate >= 80 ? "bg-emerald-500" : rate >= 60 ? "bg-amber-500" : "bg-red-500"}`}
                      style={{ height: `${h}px` }}
                    />
                    <span className="text-[8px] text-gray-600">
                      {t.date.slice(5)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {data && data.weak_areas.length > 0 && (
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">
              弱項分析
            </p>
            <div className="space-y-1">
              {data.weak_areas.slice(0, 3).map((w, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs px-2 py-1.5 bg-surface-elevated rounded"
                >
                  <span className="text-gray-300">
                    {w.subject}（{w.difficulty}）
                  </span>
                  <span
                    className={`font-mono ${w.accuracy < 50 ? "text-red-400" : "text-amber-400"}`}
                  >
                    {w.accuracy}%
                    <span className="text-gray-600 ml-1">
                      ({w.correct}/{w.total})
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {(!data || data.total_questions === 0) && (
          <div className="text-center py-6 text-gray-600">
            <p className="text-sm">尚無答題紀錄</p>
            <p className="text-xs mt-1">
              使用鏡頭擷取題目並記錄答題結果，分析數據將會在這裡顯示
            </p>
          </div>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="📊 學習分析 — 完整報告"
        accent="amber"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-surface-elevated rounded-lg px-4 py-3 text-center">
              <div className="text-2xl font-bold font-mono text-gray-200">{data?.total_questions ?? 0}</div>
              <div className="text-xs text-gray-500 mt-1">總題數</div>
            </div>
            <div className="bg-surface-elevated rounded-lg px-4 py-3 text-center">
              <div className="text-2xl font-bold font-mono text-gray-200">{data?.total_correct ?? 0}</div>
              <div className="text-xs text-gray-500 mt-1">答對數</div>
            </div>
            <div className="bg-surface-elevated rounded-lg px-4 py-3 text-center">
              <div className={`text-2xl font-bold font-mono ${
                overallAccuracy >= 80 ? "text-emerald-400" : overallAccuracy >= 60 ? "text-amber-400" : "text-red-400"
              }`}>{overallAccuracy}%</div>
              <div className="text-xs text-gray-500 mt-1">正確率</div>
            </div>
            <div className="bg-surface-elevated rounded-lg px-4 py-3 text-center">
              <div className="text-2xl font-bold font-mono text-accent-amber">{data?.study_streak_days ?? 0}</div>
              <div className="text-xs text-gray-500 mt-1">連續天數</div>
            </div>
          </div>

          {data && Object.keys(data.subject_accuracy).length > 0 && (
            <div>
              <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-3">各科正確率</p>
              <div className="space-y-3">
                {Object.entries(data.subject_accuracy).map(([subject, accuracy]) => (
                  <div key={subject} className="flex items-center gap-3">
                    <span className="text-sm text-gray-300 w-12 text-right font-medium">{subject}</span>
                    <div className="flex-1 h-6 bg-white/[0.04] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${SUBJECT_BAR_COLORS[subject] || "bg-gray-500"}`}
                        style={{ width: `${Math.min(accuracy, 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-mono text-gray-300 w-14 text-right font-bold">{accuracy}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data && data.recent_trend.length > 0 && (
            <div>
              <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-3">完整趨勢</p>
              <div className="flex items-end gap-1 h-24">
                {data.recent_trend.map((t, i) => {
                  const rate = t.total > 0 ? Math.round((t.correct / t.total) * 100) : 0;
                  const h = Math.max(rate * 0.9, 4);
                  return (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center gap-0.5"
                      title={`${t.date}: ${rate}% (${t.correct}/${t.total})`}
                    >
                      <span className="text-[9px] text-gray-500 font-mono">{rate}%</span>
                      <div
                        className={`w-full rounded-t transition-all ${rate >= 80 ? "bg-emerald-500" : rate >= 60 ? "bg-amber-500" : "bg-red-500"}`}
                        style={{ height: `${h}px` }}
                      />
                      <span className="text-[8px] text-gray-600">{t.date.slice(5)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {data && data.weak_areas.length > 0 && (
            <div>
              <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-3">弱項分析</p>
              <div className="space-y-2">
                {data.weak_areas.map((w, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-sm px-3 py-2.5 bg-surface-elevated rounded-lg"
                  >
                    <span className="text-gray-200 font-medium">
                      {w.subject}（{w.difficulty}）
                    </span>
                    <span className={`font-mono font-bold ${w.accuracy < 50 ? "text-red-400" : "text-amber-400"}`}>
                      {w.accuracy}%
                      <span className="text-gray-500 font-normal ml-2">
                        ({w.correct}/{w.total})
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}

function StatBox({
  label,
  value,
  color = "text-gray-200",
  suffix = "",
}: {
  label: string;
  value: number | string;
  color?: string;
  suffix?: string;
}) {
  return (
    <div className="bg-surface-elevated rounded-lg px-3 py-2 text-center">
      <p className="text-[10px] text-gray-500">{label}</p>
      <p className={`text-lg font-bold font-mono ${color}`}>
        {value}
        {suffix && <span className="text-xs text-gray-500">{suffix}</span>}
      </p>
    </div>
  );
}
