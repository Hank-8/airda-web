"use client";

import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";

const ACCENT_COLORS = {
  cyan: "bg-accent-cyan",
  amber: "bg-accent-amber",
  emerald: "bg-accent-emerald",
} as const;

const ACCENT_TEXT = {
  cyan: "text-accent-cyan",
  amber: "text-accent-amber",
  emerald: "text-accent-emerald",
} as const;

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  accent?: keyof typeof ACCENT_COLORS;
  children: React.ReactNode;
}

export default function Modal({ open, onClose, title, accent = "cyan", children }: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  // Mount → animate in
  useEffect(() => {
    if (open) {
      setMounted(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    } else {
      setVisible(false);
      const timer = setTimeout(() => setMounted(false), 200);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // ESC to close
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  if (!mounted) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`relative w-full max-w-2xl max-h-[85vh] bg-black border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-200 ${
          visible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Accent top bar */}
        <div className={`h-0.5 ${ACCENT_COLORS[accent]}`} />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <h2 className={`text-base font-bold ${ACCENT_TEXT[accent]}`}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/[0.06] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
