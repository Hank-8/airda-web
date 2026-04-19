"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useDashboard } from "@/components/wukong/DashboardContext";
import type { AIAnalysisResult } from "@/types/wukong";
import NotebookLMToolbar from "@/components/wukong/NotebookLMToolbar";
import { FASTAPI } from "@/lib/wukong/config";

type CameraState = "idle" | "active" | "error";

const SUBJECT_COLORS: Record<string, string> = {
  "國文": "bg-red-500/20 text-red-400 border-red-500/30",
  "英文": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "數學": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "社會": "bg-green-500/20 text-green-400 border-green-500/30",
  "自然": "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "未分類": "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

const DIFFICULTY_COLORS: Record<string, string> = {
  "簡單": "text-emerald-400",
  "中等": "text-amber-400",
  "困難": "text-red-400",
};

export default function CameraFeedPanel() {
  const { triggerRefresh } = useDashboard();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraState, setCameraState] = useState<CameraState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [processing, setProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<AIAnalysisResult | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [answerRecorded, setAnswerRecorded] = useState(false);
  const [snapshot, setSnapshot] = useState<string | null>(null);

  // ── 開啟鏡頭 ───────────────────────────────
  const startCamera = useCallback(async () => {
    try {
      setCameraState("idle");
      setErrorMsg("");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: "environment",
        },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setCameraState("active");
    } catch (err) {
      setCameraState("error");
      setErrorMsg(
        err instanceof DOMException && err.name === "NotAllowedError"
          ? "請允許瀏覽器存取鏡頭權限"
          : "無法開啟鏡頭，請確認 Logitech C270 已連接"
      );
    }
  }, []);

  // ── 關閉鏡頭 ───────────────────────────────
  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraState("idle");
  }, []);

  // ── 擷取畫面 → 送 AI ─────────────────────
  const captureAndAnalyze = useCallback(async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || cameraState !== "active") return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(video, 0, 0);
    setSnapshot(canvas.toDataURL("image/png"));

    setProcessing(true);
    setLastResult(null);
    setShowSolution(false);
    setAnswerRecorded(false);

    const blob = await new Promise<Blob>((resolve) =>
      canvas.toBlob((b) => resolve(b!), "image/png")
    );

    const formData = new FormData();
    formData.append("file", blob, `capture_${Date.now()}.png`);

    try {
      const res = await fetch(`${FASTAPI}/api/scanner/upload`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const errText = await res.text();
        setLastResult({
          recognized_text: `後端錯誤 (${res.status}): ${errText}`,
          subject: "未分類",
          difficulty: "中等",
          question_summary: "",
          solution: "",
          explanation: "",
          key_concepts: [],
          confidence: 0,
          captured_at: new Date().toISOString(),
          image_path: "",
        });
        return;
      }
      const data: AIAnalysisResult = await res.json();
      setLastResult(data);
      triggerRefresh();
    } catch {
      setLastResult({
        recognized_text: "後端連線失敗，請確認 FastAPI 運行中 (port 8000)",
        subject: "未分類",
        difficulty: "中等",
        question_summary: "",
        solution: "",
        explanation: "",
        key_concepts: [],
        confidence: 0,
        captured_at: new Date().toISOString(),
        image_path: "",
      });
    } finally {
      setProcessing(false);
    }
  }, [cameraState, triggerRefresh]);

  // ── 記錄答題結果 ──────────────────────────
  const recordAnswer = useCallback(
    async (isCorrect: boolean) => {
      if (!lastResult || answerRecorded) return;

      try {
        await fetch(`${FASTAPI}/api/analytics/quiz/record`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject: lastResult.subject,
            question_summary: lastResult.question_summary,
            is_correct: isCorrect,
            correct_answer: lastResult.solution,
            difficulty: lastResult.difficulty,
            ai_explanation: lastResult.explanation,
          }),
        });
        setAnswerRecorded(true);
        triggerRefresh();
      } catch {
        // silently fail
      }
    },
    [lastResult, answerRecorded, triggerRefresh]
  );

  // ── 自動開啟鏡頭 ──────────────────────────
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  const vw = videoRef.current?.videoWidth ?? 0;
  const vh = videoRef.current?.videoHeight ?? 0;

  return (
    <div className="bg-surface border border-accent-cyan/20 rounded-xl overflow-hidden flex flex-col">
      {/* 標題列 */}
      <div className="px-4 py-3 border-b border-border-subtle flex items-center justify-between">
        <h2 className="text-sm font-bold text-accent-cyan">
          ☁️ 筋斗雲 — AI 視覺之眼
        </h2>
        <span
          className={`text-xs font-mono ${
            cameraState === "active"
              ? "text-emerald-400"
              : cameraState === "error"
                ? "text-red-400"
                : "text-gray-500"
          }`}
        >
          {cameraState === "active"
            ? "● 鏡頭在線"
            : cameraState === "error"
              ? "● 鏡頭錯誤"
              : "○ 鏡頭離線"}
        </span>
      </div>

      {/* 畫面區域 */}
      <div className="relative flex-1 min-h-[280px] bg-black flex items-center justify-center">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-contain ${cameraState === "active" && !snapshot ? "block" : "hidden"}`}
        />

        {snapshot && (
          <img
            src={snapshot}
            alt="擷取快照"
            className="w-full h-full object-contain"
          />
        )}

        {cameraState !== "active" && !snapshot && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600">
            <svg
              className="mb-3 w-16 h-16 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm">{errorMsg || "正在連線鏡頭..."}</p>
            {cameraState === "error" && (
              <button
                onClick={startCamera}
                className="mt-3 px-4 py-1.5 text-xs bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/20 transition-colors"
              >
                重新連線
              </button>
            )}
          </div>
        )}

        {processing && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm text-accent-cyan">AI 分析中...</p>
            </div>
          </div>
        )}

        {snapshot && !processing && (
          <button
            onClick={() => setSnapshot(null)}
            className="absolute top-2 right-2 px-2.5 py-1 text-[10px] bg-black/70 text-gray-300 border border-gray-600 rounded-lg hover:bg-black/90 transition-colors"
          >
            ✕ 返回即時畫面
          </button>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* AI 分析結果 */}
      {lastResult && lastResult.question_summary && (
        <div className="px-4 py-3 border-t border-border-subtle bg-surface max-h-[320px] overflow-y-auto space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-[11px] px-2 py-0.5 rounded border ${SUBJECT_COLORS[lastResult.subject] || SUBJECT_COLORS["未分類"]}`}
            >
              {lastResult.subject}
            </span>
            <span
              className={`text-[11px] font-mono ${DIFFICULTY_COLORS[lastResult.difficulty] || "text-gray-400"}`}
            >
              {lastResult.difficulty}
            </span>
            <span className="text-[10px] text-gray-600 font-mono ml-auto">
              信心度 {Math.round(lastResult.confidence * 100)}%
            </span>
          </div>

          <p className="text-sm text-gray-200 font-medium">
            {lastResult.question_summary}
          </p>

          {lastResult.key_concepts.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {lastResult.key_concepts.map((c, i) => (
                <span
                  key={i}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-surface-elevated text-gray-400 border border-border-subtle"
                >
                  #{c}
                </span>
              ))}
            </div>
          )}

          <button
            onClick={() => setShowSolution(!showSolution)}
            className="text-xs text-accent-cyan hover:underline"
          >
            {showSolution ? "▼ 收起解題" : "▶ 查看解題與解釋"}
          </button>

          {showSolution && (
            <div className="space-y-2 pl-2 border-l-2 border-accent-cyan/20">
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                  解題步驟
                </p>
                <p className="text-xs text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {lastResult.solution}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                  觀念解釋
                </p>
                <p className="text-xs text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {lastResult.explanation}
                </p>
              </div>
            </div>
          )}

          {!answerRecorded ? (
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => recordAnswer(true)}
                className="flex-1 py-1.5 text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/30 transition-colors"
              >
                ✓ 我答對了
              </button>
              <button
                onClick={() => recordAnswer(false)}
                className="flex-1 py-1.5 text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                ✗ 我答錯了
              </button>
            </div>
          ) : (
            <p className="text-[11px] text-gray-500 text-center pt-1">
              已記錄，繼續下一題吧！
            </p>
          )}
        </div>
      )}

      {lastResult && lastResult.question_summary && (
        <NotebookLMToolbar analysisResult={lastResult} />
      )}

      {lastResult && !lastResult.question_summary && (
        <div className="px-4 py-3 border-t border-border-subtle bg-surface">
          <p className="text-xs text-gray-300 whitespace-pre-wrap leading-relaxed">
            {lastResult.recognized_text || "（未辨識到內容）"}
          </p>
        </div>
      )}

      {/* 底部控制列 */}
      <div className="px-4 py-2.5 border-t border-border-subtle flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs font-mono text-gray-500">
          {cameraState === "active" && (
            <span>
              解析度:{" "}
              <span className="text-accent-cyan">
                {vw}x{vh || "..."}
              </span>
            </span>
          )}
        </div>

        {snapshot && !processing ? (
          <button
            onClick={() => { setSnapshot(null); setLastResult(null); }}
            className="px-4 py-1.5 text-sm font-bold bg-gray-700/40 text-gray-300 border border-gray-600/40 rounded-lg hover:bg-gray-600/40 transition-colors"
          >
            📷 重新擷取
          </button>
        ) : (
          <button
            onClick={captureAndAnalyze}
            disabled={cameraState !== "active" || processing}
            className="px-4 py-1.5 text-sm font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-lg hover:bg-amber-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            {processing ? "AI 分析中..." : "🙋 不懂！擷取分析"}
          </button>
        )}
      </div>
    </div>
  );
}
