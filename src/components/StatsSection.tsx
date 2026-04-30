"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Handshake, FileText, Sparkles } from "lucide-react";

const stats = [
  { icon: <Users size={24} />, value: 500, suffix: "+", label: "協會會員" },
  { icon: <Handshake size={24} />, value: 50, suffix: "+", label: "合作夥伴" },
  { icon: <FileText size={24} />, value: 18, suffix: "頁", label: "標準教案" },
  { icon: <Sparkles size={24} />, value: 2024, suffix: "", label: "成立年份" },
];

function AnimatedCounter({ value, suffix, duration = 2 }: { value: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const end = value;
    const stepTime = (duration * 1000) / end;
    const increment = Math.max(1, Math.floor(end / 60));

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime * increment);

    return () => clearInterval(timer);
  }, [inView, value, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function StatsSection() {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E27] via-[#0D1230] to-[#0A0E27]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className="card p-6 lg:p-8 hover:border-accent-blue/40 transition-all">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-accent-blue/20 to-accent-green/20 flex items-center justify-center text-accent-blue group-hover:text-accent-green transition-colors">
                  {stat.icon}
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-gradient mb-2">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-white/50">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
