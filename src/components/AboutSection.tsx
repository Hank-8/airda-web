"use client";

import { motion } from "framer-motion";
import { Award, Users, Zap } from "lucide-react";
import { STATS } from "@/lib/constants";

const statIcons = [
  <Award key="award" size={32} />,
  <Users key="users" size={32} />,
  <Zap key="zap" size={32} />,
];

export default function AboutSection() {
  return (
    <section id="about" className="relative py-20 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold font-serif mb-4">
            關於<span className="text-gradient">我們</span>
          </h2>
          <div className="w-16 h-1 gradient-line rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p className="text-lg text-text-secondary leading-relaxed">
              人工智慧與機器人發展協會（AIRDA）致力於推動台灣 AI
              與機器人技術的發展，連結產業、學術與教育界的力量，共同培育下一代科技人才。
            </p>
            <p className="text-lg text-text-secondary leading-relaxed">
              我們相信，透過系統化的教育培訓、具啟發性的競賽活動，以及緊密的產學合作，能夠讓更多人接觸並掌握人工智慧與機器人技術，為台灣的科技創新注入活力。
            </p>
            <p className="text-lg text-text-secondary leading-relaxed">
              協會匯集了來自各大學、研究機構與科技企業的專家，共同規劃課程、舉辦活動，並提供技術諮詢與資源共享平台。
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 gap-6"
          >
            {STATS.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card group hover:border-accent-blue/50"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-accent-blue/20 to-accent-green/20 group-hover:from-accent-blue/30 group-hover:to-accent-green/30 transition-all">
                    <div className="text-accent-blue group-hover:text-accent-green transition-colors">
                      {statIcons[index]}
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gradient mb-1">
                      {stat.value}
                    </div>
                    <div className="text-text-secondary font-medium">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
