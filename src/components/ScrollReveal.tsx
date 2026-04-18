"use client";

import { useEffect, useRef } from "react";

export type RevealAnimation =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "zoom-in"
  | "zoom-out"
  | "rotate-in"
  | "rotate-left"
  | "rotate-right"
  | "flip-x"
  | "flip-y"
  | "slide-up"
  | "slide-left"
  | "slide-right"
  | "blur-in";

export default function ScrollReveal({
  children,
  delay = 0,
  duration = 700,
  animation = "fade-up",
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  animation?: RevealAnimation;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.style.transitionDuration = `${duration}ms`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.classList.add("revealed");
          }, delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, duration]);

  return (
    <div ref={ref} className={`scroll-reveal sr-${animation} ${className}`}>
      {children}
    </div>
  );
}
