"use client";

import { motion } from "framer-motion";
import { Award, Users, Zap } from "lucide-react";
import { STATS } from "@/lib/constants";

const statIcons = [
  <Award key="award" size={32} />,
  <Users key="users" size={32} />,
  <Zap key="zap" size={32} />,
];

const paragraphs = [
  "人工智慧與機器人發展協會（AIRDA）致力於推動台灣 AI 與機器人技術的發展，連結產業、學術與教育界的力量，共同培育下一代科技人才。",
  "我們相信，透過系統化的教育培訓、具啟發性的競賽活動，以及緊密的產學合作，能夠讓更多人接觸並掌握人工智慧與機器人技術，為台灣的科技創新注入活力。",
  "協會匯集了來自各大學、研究機構與科技企業的專家，共同規劃課程、舉辦活動，並提供技術諮詢與資源共享平台。",
];

export default function AboutSection() {
  return (
    <section id="about" className="relative py-20 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title — 從左滑入 */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" as const }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold font-serif mb-4">
            關於<span className="text-gradient">我們</span>
          </h2>
          <div className="w-16 h-1 gradient-line rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* 左欄 — 段落逐行浮現 */}
          <div className="space-y-6">
            {paragraphs.map((text, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.6, delay: i * 0.2, ease: "easeOut" as const }}
                viewport={{ once: true, margin: "-30px" }}
                className="text-lg text-text-secondary leading-relaxed"
              >
                {text}
              </motion.p>
            ))}
          </div>

          {/* 右欄 — 統計卡片從右翻轉進場 */}
          <div className="grid grid-cols-1 gap-6" style={{ perspective: "800px" }}>
            {STATS.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, rotateX: 45, y: 40 }}
                whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
                transition={{ duration: 0.7, delay: index * 0.15, ease: "easeOut" as const }}
                viewport={{ once: true, margin: "-30px" }}
                className="card group hover:border-accent-blue/50"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-accent-blue/20 to-accent-green/20 group-hover:from-accent-blue/30 group-hover:to-accent-green/30 transition-all">
                    <div className="text-accent-blue group-hover:text-accent-green transition-colors">
                      {statIcons[index]}
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gradient mb-1">{stat.value}</div>
                    <div className="text-text-secondary font-medium">{stat.label}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
