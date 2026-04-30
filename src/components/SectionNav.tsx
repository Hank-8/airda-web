"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const SECTIONS = [
  { id: "hero", label: "首頁" },
  { id: "stats", label: "數據" },
  { id: "about", label: "關於" },
  { id: "services", label: "服務" },
  { id: "news", label: "消息" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "聯絡" },
];

export default function SectionNav() {
  const [active, setActive] = useState("hero");

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

  return (
    <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-end gap-4">
      {SECTIONS.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => scrollTo(id)}
          className="group flex items-center gap-3"
        >
          {/* Label — 只在 hover 時顯示 */}
          <span
            className="text-xs text-white/0 group-hover:text-white/70 transition-all duration-300 translate-x-2 group-hover:translate-x-0 pointer-events-none select-none"
          >
            {label}
          </span>

          {/* Dot */}
          <motion.span
            className="relative block rounded-full transition-all duration-300"
            style={{
              width: active === id ? 12 : 8,
              height: active === id ? 12 : 8,
            }}
          >
            {/* Glow ring */}
            {active === id && (
              <motion.span
                layoutId="nav-glow"
                className="absolute inset-[-3px] rounded-full border border-accent-blue/50"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span
              className={`block w-full h-full rounded-full transition-colors duration-300 ${
                active === id
                  ? "bg-accent-blue"
                  : "bg-white/20 group-hover:bg-white/50"
              }`}
            />
          </motion.span>
        </button>
      ))}
    </nav>
  );
}
