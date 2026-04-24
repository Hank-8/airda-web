"use client";

import { motion } from "framer-motion";
import { Calendar, Tag } from "lucide-react";
import { NEWS } from "@/lib/constants";

const categoryColors: Record<string, string> = {
  "活動": "bg-accent-blue/20 text-accent-blue",
  "公告": "bg-accent-green/20 text-accent-green",
  "合作": "bg-blue-500/20 text-blue-400",
};

export default function NewsSection() {
  return (
    <section id="news" className="relative py-20 lg:py-32 overflow-hidden">
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
            最新<span className="text-gradient">消息</span>
          </h2>
          <div className="w-16 h-1 gradient-line rounded-full" />
        </motion.div>

        {/* News List */}
        <div className="space-y-6">
          {NEWS.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card group hover:border-accent-blue/50 hover:shadow-lg hover:shadow-accent-blue/10"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-text-secondary text-sm">
                    <Calendar size={16} />
                    <span>{item.date}</span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      categoryColors[item.category] || "bg-accent-blue/20 text-accent-blue"
                    }`}
                  >
                    {item.category}
                  </span>
                </div>
              </div>
              <h3 className="text-2xl font-bold font-serif mb-3 group-hover:text-accent-blue transition-colors">
                {item.title}
              </h3>
              <p className="text-text-secondary leading-relaxed mb-4">
                {item.summary}
              </p>
              <button className="text-accent-blue hover:text-accent-green transition-colors font-semibold text-sm flex items-center gap-2 group/btn">
                閱讀更多
                <span className="group-hover/btn:translate-x-1 transition-transform">
                  &rarr;
                </span>
              </button>
            </motion.div>
          ))}
        </div>

        {/* View All */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <button className="btn btn-secondary px-8 py-3">
            查看全部消息 &rarr;
          </button>
        </motion.div>
      </div>
    </section>
  );
}
