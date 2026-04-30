"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Trophy, Handshake, Lightbulb } from "lucide-react";

const services = [
  {
    icon: <BookOpen size={40} />,
    title: "AI 教育培訓",
    description: "提供從入門到進階的人工智慧課程，涵蓋機器學習、深度學習、自然語言處理等領域，培養下一代 AI 人才。",
  },
  {
    icon: <Trophy size={40} />,
    title: "機器人競賽",
    description: "舉辦各級機器人競賽活動，從校園到全國賽事，激發青少年對機器人工程的熱情與創造力。",
  },
  {
    icon: <Handshake size={40} />,
    title: "產學合作",
    description: "搭建產業與學術界的橋樑，促進技術交流與成果轉化，推動 AI 與機器人技術的實際應用。",
  },
  {
    icon: <Lightbulb size={40} />,
    title: "教案產生器",
    description: "輸入任意感測器主題，即時產出完整 18 頁教案大綱 — 涵蓋理論講解、動手實作、程式範例與創意挑戰。",
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="relative py-20 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl sm:text-5xl font-bold font-serif mb-4">
            核心<span className="text-gradient">服務與活動</span>
          </h2>
          <div className="w-16 h-1 gradient-line rounded-full mx-auto" />
        </motion.div>

        {/* 3D 卡片翻轉 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" style={{ perspective: "1200px" }}>
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, rotateY: 90 }}
              whileInView={{ opacity: 1, rotateY: 0 }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: "easeOut" as const }}
              viewport={{ once: true, margin: "-50px" }}
              style={{ transformStyle: "preserve-3d" }}
              className="card group hover:border-accent-blue/50 hover:shadow-lg hover:shadow-accent-blue/10"
            >
              <div className="mb-4 p-3 w-fit rounded-lg bg-gradient-to-br from-accent-blue/20 to-accent-green/20 group-hover:from-accent-blue/30 group-hover:to-accent-green/30 transition-all">
                <div className="text-accent-blue group-hover:text-accent-green transition-colors">
                  {service.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold font-serif mb-3 group-hover:text-accent-blue transition-colors">
                {service.title}
              </h3>
              <p className="text-text-secondary leading-relaxed text-sm">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Link href="/lesson-generator" className="btn btn-primary px-10 py-4 text-lg">
            立即使用教案產生器
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
