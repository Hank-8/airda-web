"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "AIRDA 協會提供哪些服務？",
    answer: "我們提供 AI 教育培訓課程、機器人競賽活動、產學合作媒合，以及 AI 教案自動產生器等工具。課程涵蓋從入門到進階的 Arduino、機器學習、深度學習等領域。",
  },
  {
    question: "教案產生器如何使用？",
    answer: "登入後前往「教案產生器」頁面，輸入感測器主題（如超音波、顏色感測器），系統會透過 AI 自動產出完整 18 頁教案，包含理論講解、接線步驟、Arduino 程式碼和創意挑戰，可直接下載 PPTX 檔案。",
  },
  {
    question: "如何加入協會？",
    answer: "點擊首頁「加入我們」或透過聯絡表單聯繫我們。無論是學校教師、學生、企業或研究機構，都歡迎加入。新會員享有 30 天免費試用所有工具。",
  },
  {
    question: "支援哪些硬體平台？",
    answer: "目前主要支援 Matrix Mini R4 主控板，相容 Arduino IDE 開發環境。感測器涵蓋超音波、顏色、雷射測距、陀螺儀、溫濕度等，也支援 PS2 搖桿控制。",
  },
  {
    question: "課程適合什麼年齡層？",
    answer: "我們的課程設計適合國小高年級到國中生（約 10-15 歲），教案採用生活化比喻和動手實作的方式，讓學生能輕鬆理解複雜的 AI 與機器人概念。",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs text-white/60 mb-6">
            <HelpCircle size={14} />
            FAQ
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold font-serif">
            常見<span className="text-gradient">問題</span>
          </h2>
        </motion.div>

        {/* 摺紙展開 — scaleY 從 0 展開 */}
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scaleY: 0.3, originY: 0 }}
              whileInView={{ opacity: 1, scaleY: 1 }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" as const }}
              viewport={{ once: true, margin: "-20px" }}
              style={{ transformOrigin: "top" }}
            >
              <div
                className={`card cursor-pointer transition-all ${
                  openIndex === i
                    ? "border-accent-blue/30 bg-accent-blue/5"
                    : "hover:border-white/15"
                }`}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-base font-medium text-white/90">{faq.question}</h3>
                  <ChevronDown
                    size={18}
                    className={`text-white/40 shrink-0 transition-transform duration-300 ${
                      openIndex === i ? "rotate-180" : ""
                    }`}
                  />
                </div>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="mt-4 text-sm text-white/50 leading-relaxed">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
