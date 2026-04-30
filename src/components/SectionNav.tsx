"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  BarChart3,
  Users,
  Layers,
  Newspaper,
  HelpCircle,
  Mail,
} from "lucide-react";

const SECTIONS = [
  { id: "hero", label: "首頁", icon: Home },
  { id: "stats", label: "數據總覽", icon: BarChart3 },
  { id: "about", label: "關於我們", icon: Users },
  { id: "services", label: "核心服務", icon: Layers },
  { id: "news", label: "最新消息", icon: Newspaper },
  { id: "faq", label: "常見問題", icon: HelpCircle },
  { id: "contact", label: "聯絡我們", icon: Mail },
];

export default function SectionNav() {
  const [active, setActive] = useState("hero");
  const [hovered, setHovered] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { threshold: 0.5 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  // 計算進度（第幾個 / 總數）
  const activeIndex = SECTIONS.findIndex((s) => s.id === active);
  const progress = activeIndex / (SECTIONS.length - 1);

  return (
    <div
      className="fixed left-0 top-1/2 -translate-y-1/2 z-40 hidden lg:block"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => { setExpanded(false); setHovered(null); }}
    >
      {/* 半圓形彈窗容器 */}
      <motion.div
        className="relative"
        animate={{
          width: expanded ? 200 : 24,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 35 }}
      >
        {/* 背景半圓 */}
        <motion.div
          className="absolute inset-y-0 left-0 bg-[#0D1230]/90 backdrop-blur-xl border-r border-t border-b border-white/10"
          style={{
            borderTopRightRadius: "9999px",
            borderBottomRightRadius: "9999px",
          }}
          animate={{
            width: expanded ? 200 : 24,
            opacity: expanded ? 1 : 0.6,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
        />

        {/* 收合時的指示條 */}
        <AnimatePresence>
          {!expanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute left-[8px] top-0 bottom-0 flex flex-col items-center justify-center gap-2"
            >
              {SECTIONS.map((s, i) => (
                <motion.div
                  key={s.id}
                  className="rounded-full"
                  animate={{
                    width: active === s.id ? 8 : 4,
                    height: active === s.id ? 8 : 4,
                    backgroundColor: active === s.id ? "#0EA5E9" : "rgba(255,255,255,0.2)",
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 展開時的選單項 */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.1 }}
              className="relative py-4 pl-5 pr-4 flex flex-col gap-1"
            >
              {/* 進度條 */}
              <div className="absolute left-[18px] top-6 bottom-6 w-[2px] bg-white/5 rounded-full">
                <motion.div
                  className="w-full rounded-full bg-gradient-to-b from-accent-blue to-accent-green"
                  animate={{ height: `${progress * 100}%` }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              </div>

              {SECTIONS.map((section, i) => {
                const Icon = section.icon;
                const isActive = active === section.id;
                const isHovered = hovered === section.id;

                return (
                  <motion.button
                    key={section.id}
                    onClick={() => scrollTo(section.id)}
                    onMouseEnter={() => setHovered(section.id)}
                    onMouseLeave={() => setHovered(null)}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.04, type: "spring", stiffness: 400, damping: 30 }}
                    className="relative flex items-center gap-3 py-2 pl-4 pr-3 rounded-r-full transition-colors"
                  >
                    {/* 活躍指示圓點 */}
                    <motion.div
                      className="absolute left-0 w-[10px] h-[10px] rounded-full"
                      animate={{
                        scale: isActive ? 1 : isHovered ? 0.8 : 0.5,
                        backgroundColor: isActive
                          ? "#0EA5E9"
                          : isHovered
                          ? "rgba(14,165,233,0.5)"
                          : "rgba(255,255,255,0.15)",
                        boxShadow: isActive
                          ? "0 0 12px rgba(14,165,233,0.6)"
                          : "none",
                      }}
                      transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    />

                    {/* Icon */}
                    <motion.div
                      animate={{
                        scale: isActive ? 1.15 : isHovered ? 1.1 : 1,
                        color: isActive
                          ? "#0EA5E9"
                          : isHovered
                          ? "#38BDF8"
                          : "rgba(255,255,255,0.35)",
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <Icon size={16} />
                    </motion.div>

                    {/* Label */}
                    <motion.span
                      className="text-xs font-medium whitespace-nowrap"
                      animate={{
                        color: isActive
                          ? "#FFFFFF"
                          : isHovered
                          ? "rgba(255,255,255,0.8)"
                          : "rgba(255,255,255,0.4)",
                        x: isHovered ? 2 : 0,
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      {section.label}
                    </motion.span>

                    {/* Active 背景高亮 */}
                    {isActive && (
                      <motion.div
                        layoutId="nav-active-bg"
                        className="absolute inset-0 rounded-r-full bg-accent-blue/10 border-r border-accent-blue/20"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
