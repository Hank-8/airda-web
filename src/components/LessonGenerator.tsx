"use client";

import { useState } from "react";
import { generateLessonPlan, type LessonPlan, type LessonSlide } from "@/lib/lesson-template";
import { downloadLessonPPTX } from "@/lib/download-pptx";
import ScrollReveal from "./ScrollReveal";

const slideTypeColors: Record<string, string> = {
  cover: "border-accent-blue text-accent-blue",
  toc: "border-accent-cyan text-accent-cyan",
  rules: "border-yellow-500 text-yellow-500",
  objective: "border-emerald-500 text-emerald-500",
  theory: "border-violet-500 text-violet-500",
  transition: "border-orange-500 text-orange-500",
  "hands-on": "border-rose-500 text-rose-500",
  timer: "border-amber-500 text-amber-500",
  code: "border-green-500 text-green-500",
  creative: "border-pink-500 text-pink-500",
  cleanup: "border-slate-400 text-slate-400",
  sharing: "border-sky-500 text-sky-500",
  goodbye: "border-indigo-500 text-indigo-500",
  "teacher-note": "border-teal-500 text-teal-500",
  extension: "border-purple-500 text-purple-500",
};

const slideTypeLabels: Record<string, string> = {
  cover: "封面",
  toc: "目錄",
  rules: "規矩",
  objective: "目標",
  theory: "理論",
  transition: "過渡",
  "hands-on": "實作",
  timer: "計時",
  code: "程式",
  creative: "創意",
  cleanup: "整理",
  sharing: "分享",
  goodbye: "結尾",
  "teacher-note": "備註",
  extension: "延伸",
};

function SlideCard({ slide, index }: { slide: LessonSlide; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const colorClass = slideTypeColors[slide.type] || "border-border-subtle text-text-secondary";
  const label = slideTypeLabels[slide.type] || slide.type;

  return (
    <ScrollReveal
      animation={index % 3 === 0 ? "fade-left" : index % 3 === 1 ? "zoom-in" : "fade-right"}
      delay={index * 60}
      duration={500}
    >
      <div
        className={`group rounded-xl border bg-surface overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(37,99,235,0.08)] ${
          expanded ? "border-accent-blue/40" : "border-border-subtle hover:border-accent-blue/20"
        }`}
        onClick={() => setExpanded(!expanded)}
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-4">
          <span className="text-2xl">{slide.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-text-tertiary">
                #{slide.slideNumber.toString().padStart(2, "0")}
              </span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full border ${colorClass}`}
              >
                {label}
              </span>
            </div>
            <h4 className="text-sm font-medium truncate">{slide.title}</h4>
          </div>
          <svg
            className={`w-4 h-4 text-text-tertiary transition-transform duration-300 ${
              expanded ? "rotate-180" : ""
            }`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </div>

        {/* Expanded content */}
        <div
          className={`overflow-hidden transition-all duration-400 ease-out ${
            expanded ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 pb-4 border-t border-border-subtle pt-3">
            <div
              className={`text-sm leading-relaxed space-y-1 ${
                slide.type === "code" ? "font-mono text-xs bg-[#0d1117] rounded-lg p-4" : "text-text-secondary"
              }`}
            >
              {slide.content.map((line, i) => (
                <p key={i} className={line === "" ? "h-2" : ""}>
                  {line.startsWith("【") ? (
                    <span className="text-foreground font-medium">{line}</span>
                  ) : line.startsWith("•") || line.startsWith("✅") || line.startsWith("⚠️") || line.startsWith("📝") || line.startsWith("🤔") || line.startsWith("💡") || line.startsWith("📸") || line.startsWith("🏆") || line.startsWith("🧹") || line.startsWith("👏") || line.startsWith("💬") ? (
                    <span>{line}</span>
                  ) : line.match(/^\d+\./) ? (
                    <span>{line}</span>
                  ) : (
                    line
                  )}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

export default function LessonGenerator() {
  const [topic, setTopic] = useState("");
  const [plan, setPlan] = useState<LessonPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPPTX = async () => {
    if (!plan) return;
    setIsDownloading(true);
    try {
      await downloadLessonPPTX(plan.topic);
    } catch (e) {
      console.error("PPTX generation failed:", e);
      alert("PPTX 產生失敗，請確認後端服務已啟動。");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleGenerate = () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    setPlan(null);

    // Simulate generation delay for effect
    setTimeout(() => {
      const result = generateLessonPlan(topic.trim());
      setPlan(result);
      setIsGenerating(false);
    }, 800);
  };

  return (
    <div className="space-y-12">
      {/* Input section */}
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            placeholder="輸入教案主題，例如：顏色感測器、雷射測距、超音波..."
            className="flex-1 rounded-xl border border-border-subtle bg-surface px-5 py-3.5 text-foreground text-sm outline-none focus:border-accent-blue/50 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)] transition-all placeholder:text-text-tertiary"
          />
          <button
            onClick={handleGenerate}
            disabled={!topic.trim() || isGenerating}
            className="px-8 py-3.5 rounded-xl bg-accent-blue text-white text-sm font-medium hover:bg-accent-blue-light hover:shadow-[0_0_24px_rgba(37,99,235,0.4)] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4 31.4" strokeLinecap="round" />
                </svg>
                產生中...
              </span>
            ) : (
              "產生教案"
            )}
          </button>
        </div>

        {/* Quick topic suggestions */}
        <div className="mt-4 flex flex-wrap gap-2">
          {["顏色感測器", "雷射測距", "超音波感測器", "循線感測器", "陀螺儀", "溫濕度感測器"].map(
            (suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  setTopic(suggestion);
                }}
                className="text-xs px-3 py-1.5 rounded-full border border-border-subtle text-text-secondary hover:text-foreground hover:border-accent-blue/30 transition-colors"
              >
                {suggestion}
              </button>
            )
          )}
        </div>
      </div>

      {/* Generating animation */}
      {isGenerating && (
        <div className="flex flex-col items-center gap-4 py-12">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-2 border-accent-blue/20" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent-blue animate-spin" />
            <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-accent-cyan animate-spin" style={{ animationDirection: "reverse", animationDuration: "0.8s" }} />
          </div>
          <p className="text-sm text-text-secondary">
            正在產生「{topic}」教案...
          </p>
        </div>
      )}

      {/* Generated plan */}
      {plan && !isGenerating && (
        <div className="space-y-8">
          {/* Plan header */}
          <ScrollReveal animation="blur-in">
            <div className="rounded-2xl border border-accent-blue/20 bg-surface p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold">{plan.topic}</h3>
                  <p className="text-sm text-text-secondary mt-1">
                    {plan.subtitle}
                  </p>
                </div>
                <div className="flex gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent-blue">
                      {plan.totalSlides}
                    </div>
                    <div className="text-xs text-text-tertiary">投影片</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent-cyan">
                      {plan.estimatedTime.replace("（2 節課）", "")}
                    </div>
                    <div className="text-xs text-text-tertiary">授課時間</div>
                  </div>
                </div>
              </div>

              {/* Progress bar showing slide type distribution */}
              <div className="mt-6 flex rounded-full overflow-hidden h-2 bg-surface-elevated">
                <div className="bg-accent-blue" style={{ width: "5.5%" }} title="封面" />
                <div className="bg-cyan-500" style={{ width: "5.5%" }} title="目錄" />
                <div className="bg-yellow-500" style={{ width: "5.5%" }} title="規矩" />
                <div className="bg-emerald-500" style={{ width: "5.5%" }} title="目標" />
                <div className="bg-violet-500" style={{ width: "22%" }} title="理論 x4" />
                <div className="bg-orange-500" style={{ width: "5.5%" }} title="過渡" />
                <div className="bg-rose-500" style={{ width: "5.5%" }} title="實作" />
                <div className="bg-amber-500" style={{ width: "5.5%" }} title="計時" />
                <div className="bg-green-500" style={{ width: "5.5%" }} title="程式" />
                <div className="bg-pink-500" style={{ width: "5.5%" }} title="創意" />
                <div className="bg-slate-400" style={{ width: "5.5%" }} title="整理" />
                <div className="bg-sky-500" style={{ width: "5.5%" }} title="分享" />
                <div className="bg-indigo-500" style={{ width: "5.5%" }} title="結尾" />
                <div className="bg-teal-500" style={{ width: "5.5%" }} title="備註" />
                <div className="bg-purple-500" style={{ width: "5.5%" }} title="延伸" />
              </div>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                {[
                  { color: "bg-violet-500", label: "理論講解" },
                  { color: "bg-rose-500", label: "動手實作" },
                  { color: "bg-green-500", label: "程式教學" },
                  { color: "bg-pink-500", label: "創意挑戰" },
                  { color: "bg-teal-500", label: "教師資源" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${item.color}`} />
                    <span className="text-[10px] text-text-tertiary">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Download PDF button */}
              <div className="mt-6 pt-6 border-t border-border-subtle">
                <button
                  onClick={handleDownloadPPTX}
                  disabled={isDownloading}
                  className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-accent-blue text-white text-sm font-medium hover:bg-accent-blue-light hover:shadow-[0_0_24px_rgba(37,99,235,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDownloading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4 31.4" strokeLinecap="round" />
                      </svg>
                      PPTX 產生中...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                      下載 PPTX 教案
                    </>
                  )}
                </button>
              </div>
            </div>
          </ScrollReveal>

          {/* Slide cards grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {plan.slides.map((slide, i) => (
              <SlideCard key={slide.slideNumber} slide={slide} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
