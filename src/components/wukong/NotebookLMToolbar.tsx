"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type {
  AIAnalysisResult,
  MindMapData,
  ChartData,
  PresentationData,
  QuizData,
} from "@/types/wukong";
import { FASTAPI } from "@/lib/wukong/config";

type ContentType = "mindmap" | "chart" | "presentation" | "quiz";
type GeneratedContent =
  | { type: "mindmap"; data: MindMapData }
  | { type: "chart"; data: ChartData }
  | { type: "presentation"; data: PresentationData }
  | { type: "quiz"; data: QuizData };

const TOOLS: { key: ContentType; icon: string; label: string }[] = [
  { key: "mindmap", icon: "🧠", label: "心智圖" },
  { key: "chart", icon: "📊", label: "圖表" },
  { key: "presentation", icon: "📽️", label: "簡報" },
  { key: "quiz", icon: "✏️", label: "測驗" },
];

interface Props {
  analysisResult: AIAnalysisResult;
}

const LOADING_MESSAGES = [
  "AI 正在分析題目...",
  "生成學習內容中...",
  "快好了，整理資料中...",
  "AI 仍在努力中，請稍候...",
];

export default function NotebookLMToolbar({ analysisResult }: Props) {
  const [loading, setLoading] = useState<ContentType | null>(null);
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizRevealed, setQuizRevealed] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>(null);

  // 計時器：loading 時每秒更新
  useEffect(() => {
    if (loading) {
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed((t) => t + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setElapsed(0);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [loading]);

  const loadingMsg = LOADING_MESSAGES[Math.min(Math.floor(elapsed / 5), LOADING_MESSAGES.length - 1)];

  const generate = useCallback(
    async (type: ContentType) => {
      setLoading(type);
      setContent(null);
      setError(null);
      setQuizAnswers({});
      setQuizRevealed(false);
      setCurrentSlide(0);

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 120000); // 2 分鐘超時

      try {
        const res = await fetch(`${FASTAPI}/api/content/${type}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject: analysisResult.subject,
            question_summary: analysisResult.question_summary,
            solution: analysisResult.solution,
            explanation: analysisResult.explanation,
            key_concepts: analysisResult.key_concepts,
          }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => null);
          throw new Error(errData?.detail || `HTTP ${res.status}`);
        }
        const data = await res.json();
        setContent({ type, data } as GeneratedContent);
      } catch (e) {
        const msg = e instanceof DOMException && e.name === "AbortError"
          ? "請求超時，請稍後再試（Gemini API 可能忙碌中）"
          : e instanceof Error ? e.message : "生成失敗";
        setError(msg);
      } finally {
        clearTimeout(timeout);
        setLoading(null);
      }
    },
    [analysisResult]
  );

  return (
    <div className="border-t border-violet-500/20 bg-surface">
      {/* 工具列按鈕 */}
      <div className="px-4 py-2.5 flex items-center gap-2">
        <span className="text-[10px] text-violet-400 font-mono mr-1 shrink-0">
          NotebookLM
        </span>
        {TOOLS.map(({ key, icon, label }) => (
          <button
            key={key}
            onClick={() => generate(key)}
            disabled={loading !== null}
            className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all
              ${
                content?.type === key
                  ? "bg-violet-500/25 text-violet-300 border-violet-500/40 shadow-[0_0_10px_rgba(139,92,246,0.2)]"
                  : "bg-surface-elevated text-gray-400 border-border-subtle hover:bg-violet-500/15 hover:text-violet-300 hover:border-violet-500/30"
              }
              disabled:opacity-30 disabled:cursor-not-allowed`}
          >
            {loading === key ? (
              <span className="w-3 h-3 border border-violet-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>{icon}</span>
            )}
            {label}
          </button>
        ))}
      </div>

      {/* Loading 狀態 */}
      {loading && (
        <div className="px-4 pb-3 flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-violet-400 border-t-transparent rounded-full animate-spin shrink-0" />
          <div>
            <p className="text-xs text-violet-300">{loadingMsg}</p>
            <p className="text-[10px] text-gray-600 font-mono">{elapsed}s</p>
          </div>
        </div>
      )}

      {/* 錯誤提示 */}
      {error && !loading && (
        <div className="px-4 pb-3">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 flex items-start gap-2">
            <span className="text-red-400 shrink-0">⚠</span>
            <p className="text-[11px] text-red-300">{error}</p>
          </div>
        </div>
      )}

      {/* 生成結果顯示 */}
      {content && !loading && (
        <div className="px-4 pb-3 max-h-[420px] overflow-y-auto">
          {content.type === "mindmap" && (
            <MindMapView data={content.data} />
          )}
          {content.type === "chart" && (
            <ChartView data={content.data} />
          )}
          {content.type === "presentation" && (
            <PresentationView
              data={content.data}
              currentSlide={currentSlide}
              onSlideChange={setCurrentSlide}
            />
          )}
          {content.type === "quiz" && (
            <QuizView
              data={content.data}
              answers={quizAnswers}
              revealed={quizRevealed}
              onAnswer={(id, ans) =>
                setQuizAnswers((prev) => ({ ...prev, [id]: ans }))
              }
              onReveal={() => setQuizRevealed(true)}
            />
          )}
        </div>
      )}
    </div>
  );
}

/* ── 心智圖視圖（NotebookLM 風格：互動式節點連線圖）── */

function MindMapView({ data }: { data: MindMapData }) {
  const [expandedBranch, setExpandedBranch] = useState<number | null>(null);
  const branches = data.branches || [];
  const total = branches.length;

  return (
    <div className="relative py-4">
      {/* NotebookLM 風格頂部標示 */}
      <div className="flex items-center gap-2 mb-4 px-1">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
        <span className="text-[10px] text-blue-400/80 font-medium tracking-wider uppercase">
          Mind Map
        </span>
        <span className="text-[10px] text-gray-600 ml-auto font-mono">
          {total} branches
        </span>
      </div>

      {/* 中心節點 */}
      <div className="flex justify-center mb-6">
        <div className="relative group">
          <div className="absolute -inset-1 bg-blue-500/20 rounded-2xl blur-md group-hover:bg-blue-500/30 transition-all" />
          <div className="relative px-5 py-3 bg-surface-elevated border border-blue-500/40 rounded-2xl shadow-lg shadow-blue-500/10">
            <p className="text-sm font-semibold text-blue-100 text-center">
              {data.central_topic}
            </p>
          </div>
        </div>
      </div>

      {/* 分支節點（放射狀佈局） */}
      <div className="grid grid-cols-2 gap-3">
        {branches.map((branch, i) => {
          const isExpanded = expandedBranch === i;
          const hue = branch.color || `hsl(${(i / total) * 360}, 70%, 65%)`;

          return (
            <button
              key={i}
              onClick={() => setExpandedBranch(isExpanded ? null : i)}
              className={`text-left rounded-xl border transition-all duration-200 ${
                isExpanded
                  ? "bg-surface-elevated border-blue-500/30 shadow-lg shadow-blue-500/5 col-span-2"
                  : "bg-surface border-border-subtle hover:border-gray-600/60 hover:bg-surface-elevated"
              }`}
            >
              {/* 分支標題 */}
              <div className="flex items-center gap-2.5 px-3.5 py-2.5">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: hue, boxShadow: `0 0 0 2px #141825, 0 0 0 4px ${hue}` }}
                />
                <span className="text-xs font-semibold text-gray-200 flex-1">
                  {branch.label}
                </span>
                <span className="text-[10px] text-gray-600">
                  {branch.children?.length || 0}
                </span>
                <svg
                  className={`w-3 h-3 text-gray-600 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* 展開的子節點 */}
              {isExpanded && branch.children && (
                <div className="px-3.5 pb-3 space-y-1.5 border-t border-border-subtle pt-2">
                  {branch.children.map((child, j) => (
                    <div
                      key={j}
                      className="flex items-start gap-2 px-2.5 py-2 rounded-lg bg-surface border border-border-subtle"
                    >
                      <span
                        className="w-1 h-1 rounded-full mt-1.5 shrink-0"
                        style={{ backgroundColor: hue }}
                      />
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium text-gray-200">
                          {child.label}
                        </p>
                        {child.detail && (
                          <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">
                            {child.detail}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* 底部統計 */}
      <div className="mt-4 flex items-center justify-center gap-4 text-[10px] text-gray-600">
        <span>{total} 個分支</span>
        <span>·</span>
        <span>{branches.reduce((sum, b) => sum + (b.children?.length || 0), 0)} 個概念</span>
      </div>
    </div>
  );
}

/* ── 圖表視圖 ───────────────────────────────── */

function ChartView({ data }: { data: ChartData }) {
  const maxImportance = Math.max(
    ...((data.concepts || []).map((c) => c.importance)),
    1
  );

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-400">{data.summary}</p>

      {/* 概念重要度長條圖 */}
      <div className="space-y-1.5">
        <p className="text-[10px] text-gray-500 uppercase tracking-wider">
          概念重要度
        </p>
        {data.concepts?.map((c, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-[11px] text-gray-300 w-24 truncate shrink-0">
              {c.name}
            </span>
            <div className="flex-1 bg-white/[0.04] rounded-full h-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full flex items-center justify-end pr-1.5 transition-all duration-700"
                style={{ width: `${(c.importance / maxImportance) * 100}%` }}
              >
                <span className="text-[9px] text-white font-mono">
                  {c.importance}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 概念關係 */}
      {data.relationships && data.relationships.length > 0 && (
        <div className="space-y-1">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">
            概念關係
          </p>
          {data.relationships.map((r, i) => (
            <div
              key={i}
              className="text-[11px] text-gray-400 flex items-center gap-1"
            >
              <span className="text-cyan-400">{r.from}</span>
              <span className="text-gray-600">→</span>
              <span className="text-violet-400">{r.to}</span>
              <span className="text-gray-600 ml-1">({r.relation})</span>
            </div>
          ))}
        </div>
      )}

      {/* 學習優先順序 */}
      {data.study_priorities && data.study_priorities.length > 0 && (
        <div className="space-y-1">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">
            學習優先
          </p>
          {data.study_priorities.map((p, i) => (
            <div
              key={i}
              className="text-[11px] bg-amber-500/10 border border-amber-500/20 rounded px-2 py-1.5"
            >
              <span
                className={`font-bold ${p.priority === "high" ? "text-red-400" : "text-amber-400"}`}
              >
                {p.concept}
              </span>
              <span className="text-gray-400 ml-1.5">{p.reason}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── 簡報視圖（NotebookLM 風格：Google Slides 卡片式）── */

function PresentationView({
  data,
  currentSlide,
  onSlideChange,
}: {
  data: PresentationData;
  currentSlide: number;
  onSlideChange: (n: number) => void;
}) {
  const slides = data.slides || [];
  const slide = slides[currentSlide];
  const [showNotes, setShowNotes] = useState(false);
  if (!slide) return null;

  const TYPE_BG: Record<string, string> = {
    intro: "from-blue-600/30 to-indigo-700/20",
    concept: "from-violet-600/30 to-purple-700/20",
    example: "from-amber-600/20 to-orange-700/15",
    practice: "from-emerald-600/20 to-teal-700/15",
    summary: "from-rose-600/20 to-pink-700/15",
  };
  const TYPE_LABEL: Record<string, string> = {
    intro: "引言",
    concept: "核心觀念",
    example: "範例說明",
    practice: "練習",
    summary: "總結",
  };
  const TYPE_ACCENT: Record<string, string> = {
    intro: "bg-blue-500",
    concept: "bg-violet-500",
    example: "bg-amber-500",
    practice: "bg-emerald-500",
    summary: "bg-rose-500",
  };

  return (
    <div className="py-2">
      {/* NotebookLM 風格頂部 */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
        <span className="text-[10px] text-orange-400/80 font-medium tracking-wider uppercase">
          Presentation
        </span>
        <span className="text-[10px] text-gray-600 ml-auto">
          {data.title}
        </span>
      </div>

      {/* 投影片卡片（16:9 比例感） */}
      <div className={`relative rounded-xl overflow-hidden border border-border-subtle bg-gradient-to-br ${TYPE_BG[slide.content_type] || TYPE_BG.concept} shadow-xl`}>
        {/* 頂部色條 */}
        <div className={`h-1 ${TYPE_ACCENT[slide.content_type] || "bg-violet-500"}`} />

        <div className="px-6 py-5 min-h-[200px] flex flex-col">
          {/* 類型標籤 + 頁碼 */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-gray-300 font-medium">
              {TYPE_LABEL[slide.content_type] || slide.content_type}
            </span>
            <span className="text-[10px] text-gray-500 font-mono">
              {currentSlide + 1} / {slides.length}
            </span>
          </div>

          {/* 投影片標題 */}
          <h3 className="text-base font-bold text-white mb-4 leading-snug">
            {slide.title}
          </h3>

          {/* 要點列表 */}
          <ul className="space-y-2.5 flex-1">
            {slide.bullet_points?.map((point, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${TYPE_ACCENT[slide.content_type] || "bg-violet-500"}`} />
                <span className="text-[13px] text-gray-200 leading-relaxed">
                  {point}
                </span>
              </li>
            ))}
          </ul>

          {/* 視覺建議提示 */}
          {slide.visual_suggestion && (
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2">
              <span className="text-[10px] text-gray-500">🎨</span>
              <span className="text-[10px] text-gray-500 italic">
                {slide.visual_suggestion}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 講者筆記（可展開） */}
      {slide.speaker_notes && (
        <button
          onClick={() => setShowNotes(!showNotes)}
          className="w-full mt-2 text-left"
        >
          <div className={`rounded-lg border transition-all ${
            showNotes ? "bg-surface-elevated border-border-subtle" : "bg-transparent border-transparent hover:bg-surface"
          }`}>
            <div className="px-3 py-2 flex items-center gap-2">
              <svg
                className={`w-3 h-3 text-gray-500 transition-transform ${showNotes ? "rotate-90" : ""}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-[10px] text-gray-500 font-medium">講者筆記</span>
            </div>
            {showNotes && (
              <div className="px-3 pb-3">
                <p className="text-[11px] text-gray-400 leading-relaxed pl-5">
                  {slide.speaker_notes}
                </p>
              </div>
            )}
          </div>
        </button>
      )}

      {/* 底部導航 */}
      <div className="flex items-center gap-2 mt-3">
        {/* 左右箭頭 */}
        <button
          onClick={() => onSlideChange(Math.max(0, currentSlide - 1))}
          disabled={currentSlide === 0}
          className="p-1.5 rounded-lg bg-surface-elevated border border-border-subtle text-gray-400 hover:text-white hover:border-gray-600 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* 縮圖軌道 */}
        <div className="flex-1 flex items-center gap-1 overflow-x-auto py-1 px-1">
          {slides.map((s, i) => (
            <button
              key={i}
              onClick={() => onSlideChange(i)}
              className={`shrink-0 px-2 py-1 rounded-md text-[9px] font-medium transition-all truncate max-w-[80px] ${
                i === currentSlide
                  ? "bg-blue-500/25 text-blue-300 border border-blue-500/40 shadow-sm"
                  : "bg-surface text-gray-500 border border-transparent hover:bg-surface-elevated hover:text-gray-300"
              }`}
            >
              {i + 1}. {s.title}
            </button>
          ))}
        </div>

        <button
          onClick={() => onSlideChange(Math.min(slides.length - 1, currentSlide + 1))}
          disabled={currentSlide === slides.length - 1}
          className="p-1.5 rounded-lg bg-surface-elevated border border-border-subtle text-gray-400 hover:text-white hover:border-gray-600 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ── 測驗視圖 ───────────────────────────────── */

function QuizView({
  data,
  answers,
  revealed,
  onAnswer,
  onReveal,
}: {
  data: QuizData;
  answers: Record<number, string>;
  revealed: boolean;
  onAnswer: (id: number, answer: string) => void;
  onReveal: () => void;
}) {
  const questions = data.questions || [];
  const allAnswered = questions.every((q) => answers[q.id]);
  const correctCount = questions.filter(
    (q) => answers[q.id] === q.correct_answer
  ).length;

  const DIFF_COLOR: Record<string, string> = {
    "簡單": "text-emerald-400",
    "中等": "text-amber-400",
    "困難": "text-red-400",
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-gray-300">{data.quiz_title}</p>
        {revealed && (
          <span className="text-xs font-mono text-violet-400">
            {correctCount}/{questions.length} 正確
          </span>
        )}
      </div>

      {questions.map((q) => {
        const selected = answers[q.id];
        const isCorrect = selected === q.correct_answer;
        const optionLetter = (opt: string) => opt.charAt(0);

        return (
          <div
            key={q.id}
            className={`bg-surface border rounded-lg p-3 space-y-2 ${
              revealed
                ? isCorrect
                  ? "border-emerald-500/30"
                  : "border-red-500/30"
                : "border-border-subtle"
            }`}
          >
            {/* 題號 + 題目 */}
            <div className="flex gap-2">
              <span className="text-[10px] text-gray-600 font-mono shrink-0">
                Q{q.id}
              </span>
              <div>
                <p className="text-xs text-gray-200">{q.question}</p>
                <span
                  className={`text-[10px] font-mono ${DIFF_COLOR[q.difficulty] || "text-gray-500"}`}
                >
                  {q.difficulty}
                </span>
              </div>
            </div>

            {/* 選項 */}
            <div className="grid grid-cols-2 gap-1.5 pl-5">
              {q.options.map((opt) => {
                const letter = optionLetter(opt);
                const isSelected = selected === letter;
                const isAnswer = q.correct_answer === letter;

                let optClass =
                  "bg-surface-elevated text-gray-400 border-border-subtle hover:bg-white/[0.08] hover:text-gray-200";
                if (revealed && isAnswer) {
                  optClass =
                    "bg-emerald-500/15 text-emerald-300 border-emerald-500/40";
                } else if (revealed && isSelected && !isAnswer) {
                  optClass = "bg-red-500/15 text-red-300 border-red-500/40";
                } else if (!revealed && isSelected) {
                  optClass =
                    "bg-violet-500/20 text-violet-300 border-violet-500/40";
                }

                return (
                  <button
                    key={opt}
                    onClick={() => !revealed && onAnswer(q.id, letter)}
                    disabled={revealed}
                    className={`text-left text-[11px] px-2 py-1.5 rounded border transition-colors ${optClass}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* 解釋（公佈答案後） */}
            {revealed && (
              <div className="pl-5 pt-1 border-t border-border-subtle">
                <p className="text-[10px] text-gray-500">
                  <span className="text-emerald-400 font-bold">
                    正解：{q.correct_answer}
                  </span>{" "}
                  — {q.explanation}
                </p>
              </div>
            )}
          </div>
        );
      })}

      {/* 交卷按鈕 */}
      {!revealed && (
        <button
          onClick={onReveal}
          disabled={!allAnswered}
          className="w-full py-2 text-xs font-bold bg-violet-500/20 text-violet-300 border border-violet-500/40 rounded-lg hover:bg-violet-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          {allAnswered ? "📝 交卷看結果" : `還有 ${questions.length - Object.keys(answers).length} 題未作答`}
        </button>
      )}
    </div>
  );
}
