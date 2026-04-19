"use client";

import { useEffect, useState, useCallback } from "react";
import { useDashboard } from "@/components/wukong/DashboardContext";
import { FASTAPI } from "@/lib/wukong/config";
import type { AnalyticsData, QuizResultRecord } from "@/types/wukong";
import Modal from "@/components/wukong/Modal";

/* ── 科目配色 ─────────────────────────────── */

const SUBJECTS = ["國文", "英文", "數學", "社會", "自然"] as const;

const SUBJECT_STYLE: Record<string, {
  bg: string; text: string; border: string; ring: string; icon: string;
}> = {
  "國文": { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/25", ring: "#ef4444", icon: "📖" },
  "英文": { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/25", ring: "#3b82f6", icon: "🌍" },
  "數學": { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/25", ring: "#a855f7", icon: "🔢" },
  "社會": { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/25", ring: "#22c55e", icon: "🏛️" },
  "自然": { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/25", ring: "#f97316", icon: "🔬" },
};

const DIFF_COLORS: Record<string, string> = {
  "簡單": "text-emerald-400",
  "中等": "text-amber-400",
  "困難": "text-red-400",
};

/* ── 筆記型別 ─────────────────────────────── */

interface KnowledgeEntry {
  id: string;
  title: string;
  content: string;
  content_type: string;
  source: string;
  tags: string[];
  created_at: string;
}

const typeColors: Record<string, string> = {
  "程式碼": "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  "數學題": "bg-violet-500/15 text-violet-400 border-violet-500/30",
  "電路圖": "bg-amber-500/15 text-amber-400 border-amber-500/30",
  "文字筆記": "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  "未分類": "bg-gray-500/15 text-gray-400 border-gray-500/30",
};

/* ── 小圓環 ───────────────────────────────── */

function MiniRing({ value, color }: { value: number; color: string }) {
  const r = 20;
  const c = 2 * Math.PI * r;
  const pct = Math.min(value / 100, 1);
  const offset = c - pct * c;

  return (
    <svg width="50" height="50" className="-rotate-90">
      <circle cx="25" cy="25" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
      <circle
        cx="25" cy="25" r={r} fill="none"
        stroke={color} strokeWidth="4" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={offset}
        className="transition-all duration-700"
      />
    </svg>
  );
}

/* ── 主元件 ───────────────────────────────── */

export default function RecentNotesPanel() {
  const { refreshKey, backendOnline } = useDashboard();

  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [quizHistory, setQuizHistory] = useState<QuizResultRecord[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [expandedQuiz, setExpandedQuiz] = useState<string | null>(null);
  const [notes, setNotes] = useState<KnowledgeEntry[]>([]);
  const [selectedNote, setSelectedNote] = useState<KnowledgeEntry | null>(null);

  useEffect(() => {
    if (!backendOnline) return;

    fetch(`${FASTAPI}/api/analytics/summary`)
      .then((r) => r.json())
      .then(setAnalytics)
      .catch(() => {});

    fetch(`${FASTAPI}/api/knowledge/recent?limit=3`)
      .then((r) => r.json())
      .then(setNotes)
      .catch(() => {});
  }, [refreshKey, backendOnline]);

  const openSubject = useCallback(async (subject: string) => {
    setSelectedSubject(subject);
    setQuizHistory([]);
    setExpandedQuiz(null);
    setLoadingHistory(true);

    try {
      const res = await fetch(`${FASTAPI}/api/analytics/quiz/history?subject=${encodeURIComponent(subject)}&limit=500`);
      if (res.ok) {
        const data = await res.json();
        setQuizHistory(data);
      }
    } catch {
      // ignore
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  const subjectEntries = SUBJECTS
    .filter((s) => analytics?.subject_accuracy[s] !== undefined)
    .map((subject) => {
      const accuracy = analytics?.subject_accuracy[subject] ?? 0;
      const weakItems = analytics?.weak_areas.filter((w) => w.subject === subject) ?? [];
      const totalQuestions = weakItems.reduce((sum, w) => sum + w.total, 0);
      const style = SUBJECT_STYLE[subject];
      return { subject, accuracy, weakItems, totalQuestions, style };
    });

  const selectedWeakItems = analytics?.weak_areas.filter(
    (w) => w.subject === selectedSubject
  ) ?? [];

  const selectedAccuracy = selectedSubject
    ? analytics?.subject_accuracy[selectedSubject] ?? 0
    : 0;

  const selectedStyle = selectedSubject ? SUBJECT_STYLE[selectedSubject] : null;

  return (
    <div className="bg-surface border border-accent-emerald/20 rounded-xl overflow-hidden transition-all duration-300 hover:border-accent-emerald/30 hover:shadow-[0_0_20px_rgba(16,185,129,0.08)]">
      <div className="px-4 py-3 border-b border-border-subtle flex items-center justify-between">
        <h2 className="text-sm font-bold text-accent-emerald">
          🏏 金箍棒 — 學科題庫
        </h2>
        <span className="text-xs text-gray-600 font-mono">
          {analytics?.total_questions ?? 0} 題
        </span>
      </div>

      {subjectEntries.length === 0 ? (
        <div className="px-4 py-10 text-center text-gray-600">
          <p className="text-sm">尚無答題紀錄</p>
          <p className="text-xs mt-1 text-gray-700">
            使用鏡頭擷取題目並記錄答題結果，各科統計將會在這裡顯示
          </p>
        </div>
      ) : (
        <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {subjectEntries.map(({ subject, accuracy, weakItems, style }) => (
            <button
              key={subject}
              onClick={() => openSubject(subject)}
              className={`relative text-left rounded-xl border ${style.border} ${style.bg} p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98] cursor-pointer`}
            >
              {weakItems.length > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              )}

              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{style.icon}</span>
                <span className={`text-sm font-bold ${style.text}`}>{subject}</span>
              </div>

              <div className="flex items-center gap-2">
                <MiniRing value={accuracy} color={style.ring} />
                <div className="-ml-1">
                  <div className={`text-lg font-bold font-mono ${style.text} -mt-0.5`}>
                    {Math.round(accuracy)}%
                  </div>
                  <div className="text-[10px] text-gray-500">正確率</div>
                </div>
              </div>

              {weakItems.length > 0 && (
                <div className="mt-2 text-[10px] text-red-400/80">
                  ⚠ {weakItems.length} 個弱項
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {notes.length > 0 && (
        <div className="border-t border-border-subtle">
          <div className="px-4 py-2 flex items-center justify-between">
            <span className="text-[11px] text-gray-500 uppercase tracking-wider">最近筆記</span>
            <span className="text-[10px] text-gray-600 font-mono">{notes.length} 則</span>
          </div>
          <div className="divide-y divide-border-subtle">
            {notes.map((note) => {
              const cat = typeColors[note.content_type] ?? typeColors["未分類"];
              return (
                <div
                  key={note.id}
                  onClick={() => setSelectedNote(note)}
                  className="px-4 py-2.5 hover:bg-white/[0.02] transition-colors cursor-pointer flex items-center gap-3"
                >
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border shrink-0 ${cat}`}>
                    {note.content_type}
                  </span>
                  <span className="text-xs text-gray-300 truncate flex-1">{note.title}</span>
                  <span className="text-[10px] text-gray-600 font-mono shrink-0">
                    {new Date(note.created_at).toLocaleString("zh-Hant", {
                      month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
                    })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 科目詳情彈窗 */}
      <Modal
        open={selectedSubject !== null}
        onClose={() => { setSelectedSubject(null); setQuizHistory([]); }}
        title={selectedStyle ? `${selectedStyle.icon} ${selectedSubject} — 題目歷史與弱點分析` : ""}
        accent="emerald"
      >
        {selectedSubject && selectedStyle && (() => {
          const wrongQuestions = quizHistory.filter((q) => !q.is_correct);
          const DIFF_ORDER = ["困難", "中等", "簡單"] as const;
          const wrongByDifficulty = DIFF_ORDER
            .map((diff) => ({
              difficulty: diff,
              items: wrongQuestions.filter((q) => q.difficulty === diff).slice(0, 10),
            }))
            .filter((g) => g.items.length > 0);

          return (
            <div className="space-y-6">
              <div className="flex items-start gap-5">
                <div className="text-center shrink-0">
                  <div className={`text-4xl font-bold font-mono ${selectedStyle.text}`}>
                    {Math.round(selectedAccuracy)}%
                  </div>
                  <div className="text-xs text-gray-500 mt-1">正確率</div>
                </div>

                <div className="flex-1 min-w-0">
                  {selectedWeakItems.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-[11px] text-gray-500 uppercase tracking-wider">難度分組概覽</p>
                      {selectedWeakItems.map((w, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between bg-surface-elevated rounded-lg px-3 py-2"
                        >
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${
                              w.accuracy < 50 ? "bg-red-500" : w.accuracy < 70 ? "bg-amber-500" : "bg-emerald-500"
                            }`} />
                            <span className="text-xs text-gray-300">{w.difficulty}難度</span>
                          </div>
                          <div className="text-right">
                            <span className={`text-sm font-bold font-mono ${
                              w.accuracy < 50 ? "text-red-400" : w.accuracy < 70 ? "text-amber-400" : "text-emerald-400"
                            }`}>{w.accuracy}%</span>
                            <span className="text-[10px] text-gray-600 ml-2">({w.correct}/{w.total})</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg px-3 py-3 text-center">
                      <span className="text-xs text-emerald-400/70">✓ 此科目無明顯弱項</span>
                    </div>
                  )}
                </div>
              </div>

              {loadingHistory ? (
                <div className="flex items-center gap-2 py-6 justify-center">
                  <div className="w-4 h-4 border-2 border-accent-emerald border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs text-gray-500">載入中...</span>
                </div>
              ) : wrongByDifficulty.length > 0 ? (
                <div>
                  <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-3">
                    ⚠ 弱點知識點
                    <span className="ml-2 text-red-400/80 normal-case">
                      {wrongQuestions.length} 題答錯
                    </span>
                  </p>
                  <div className="space-y-4">
                    {wrongByDifficulty.map(({ difficulty, items }) => {
                      const diffIcon = difficulty === "困難" ? "🔴" : difficulty === "中等" ? "🟡" : "🟢";
                      return (
                        <div key={difficulty}>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs">{diffIcon}</span>
                            <span className={`text-xs font-bold ${DIFF_COLORS[difficulty] || "text-gray-400"}`}>
                              {difficulty}
                            </span>
                            <span className="text-[10px] text-gray-600">({items.length} 題)</span>
                          </div>
                          <div className="space-y-1.5 ml-5 border-l-2 border-border-subtle pl-3">
                            {items.map((q) => {
                              const isExp = expandedQuiz === q.id;
                              return (
                                <div key={q.id} className="bg-surface-elevated rounded-lg overflow-hidden">
                                  <button
                                    onClick={() => setExpandedQuiz(isExp ? null : q.id)}
                                    className="w-full text-left px-3 py-2 flex items-start gap-2 hover:bg-white/[0.02] transition-colors"
                                  >
                                    <span className="shrink-0 mt-0.5 text-red-400 text-[10px]">✗</span>
                                    <p className="text-xs text-gray-200 leading-relaxed flex-1">
                                      {q.question_summary}
                                    </p>
                                    <svg
                                      className={`w-3 h-3 text-gray-600 shrink-0 mt-0.5 transition-transform ${isExp ? "rotate-180" : ""}`}
                                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                    >
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                  </button>
                                  {isExp && (
                                    <div className="px-3 pb-2.5 pt-1 border-t border-border-subtle space-y-2 ml-5">
                                      <div>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">正確答案</p>
                                        <p className="text-xs text-emerald-400 font-medium">{q.correct_answer}</p>
                                      </div>
                                      {q.ai_explanation && (
                                        <div>
                                          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">AI 解釋</p>
                                          <p className="text-xs text-gray-400 whitespace-pre-wrap leading-relaxed">
                                            {q.ai_explanation}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : quizHistory.length > 0 ? (
                <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg px-3 py-3 text-center">
                  <span className="text-xs text-emerald-400/70">🎉 太厲害了！此科目全部答對</span>
                </div>
              ) : null}

              {!loadingHistory && quizHistory.length > 0 && (
                <div>
                  <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-3">
                    完整題目歷史
                    <span className="ml-2 text-gray-600 normal-case">
                      共 {quizHistory.length} 題
                    </span>
                  </p>
                  <div className="space-y-1.5 max-h-[300px] overflow-y-auto">
                    {quizHistory.map((q) => (
                      <div
                        key={q.id}
                        className="flex items-center gap-2 px-3 py-2 bg-surface-elevated rounded-lg"
                      >
                        <span className={`shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                          q.is_correct
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-red-500/20 text-red-400"
                        }`}>
                          {q.is_correct ? "✓" : "✗"}
                        </span>
                        <p className="text-[11px] text-gray-300 flex-1 truncate">{q.question_summary}</p>
                        <span className={`text-[10px] font-mono shrink-0 ${DIFF_COLORS[q.difficulty] || "text-gray-500"}`}>
                          {q.difficulty}
                        </span>
                        <span className="text-[10px] text-gray-600 font-mono shrink-0">
                          {new Date(q.timestamp).toLocaleString("zh-Hant", {
                            month: "2-digit", day: "2-digit",
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })()}
      </Modal>

      {/* 筆記詳情彈窗 */}
      <Modal
        open={selectedNote !== null}
        onClose={() => setSelectedNote(null)}
        title={selectedNote ? `🏏 ${selectedNote.title}` : ""}
        accent="emerald"
      >
        {selectedNote && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs px-2.5 py-1 rounded-full border ${
                typeColors[selectedNote.content_type] ?? typeColors["未分類"]
              }`}>
                {selectedNote.content_type}
              </span>
              <span className="text-xs px-2 py-1 rounded bg-surface-elevated text-gray-400">
                {selectedNote.source === "camera_ocr" ? "鏡頭擷取" : "手動輸入"}
              </span>
              <span className="text-xs text-gray-600 font-mono ml-auto">
                {new Date(selectedNote.created_at).toLocaleString("zh-Hant")}
              </span>
            </div>
            <div>
              <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-2">筆記內容</p>
              <div className="bg-surface-elevated rounded-lg px-4 py-3">
                <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {selectedNote.content}
                </p>
              </div>
            </div>
            {selectedNote.tags.filter(Boolean).length > 0 && (
              <div>
                <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-2">標籤</p>
                <div className="flex gap-2 flex-wrap">
                  {selectedNote.tags.filter(Boolean).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-accent-emerald/10 text-accent-emerald border border-accent-emerald/20 rounded-full px-3 py-1"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
