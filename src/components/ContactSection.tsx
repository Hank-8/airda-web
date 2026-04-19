"use client";

import { useState } from "react";
import { CONTACT_INFO } from "@/lib/constants";
import ScrollReveal from "./ScrollReveal";

const WEB3FORMS_KEY = "38153966-fb12-403e-bc0f-24d0c57b068a";

export default function ContactSection() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!WEB3FORMS_KEY) {
      setStatus("error");
      return;
    }

    setStatus("sending");
    const form = e.currentTarget;
    const data = new FormData(form);
    data.append("access_key", WEB3FORMS_KEY);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data,
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="py-24 md:py-32 px-6">
      <div className="mx-auto max-w-6xl">
        {/* Title — rotate in */}
        <ScrollReveal animation="rotate-in">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            聯絡我們
          </h2>
          <div className="mt-2 w-16 h-0.5 rounded-full animated-gradient-line" />
        </ScrollReveal>

        <div className="mt-16 grid md:grid-cols-2 gap-16">
          {/* Contact info — slide in from left */}
          <ScrollReveal animation="fade-left" delay={150}>
            <div className="space-y-8">
              <p className="text-text-secondary leading-relaxed">
                歡迎與我們聯繫，無論是課程諮詢、合作提案或任何問題，我們都樂意為您服務。
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <svg className="w-5 h-5 text-accent-blue mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                  <div>
                    <div className="text-sm text-text-tertiary mb-1">Email</div>
                    <div className="text-foreground">{CONTACT_INFO.email}</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <svg className="w-5 h-5 text-accent-blue mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                  </svg>
                  <div>
                    <div className="text-sm text-text-tertiary mb-1">電話</div>
                    <div className="text-foreground">{CONTACT_INFO.phone}</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <svg className="w-5 h-5 text-accent-blue mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                  <div>
                    <div className="text-sm text-text-tertiary mb-1">地址</div>
                    <div className="text-foreground">{CONTACT_INFO.address}</div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Contact form — flip in from Y axis */}
          <ScrollReveal animation="flip-y" delay={250}>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <input type="hidden" name="subject" value="AIRDA 官網聯絡表單" />
              <div>
                <label htmlFor="name" className="block text-sm text-text-secondary mb-2">
                  姓名
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full rounded-lg border border-border-subtle bg-surface px-4 py-3 text-foreground text-sm outline-none focus:border-accent-blue/50 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] transition-all"
                  placeholder="您的姓名"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm text-text-secondary mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full rounded-lg border border-border-subtle bg-surface px-4 py-3 text-foreground text-sm outline-none focus:border-accent-blue/50 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] transition-all"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm text-text-secondary mb-2">
                  訊息
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="w-full rounded-lg border border-border-subtle bg-surface px-4 py-3 text-foreground text-sm outline-none focus:border-accent-blue/50 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] transition-all resize-none"
                  placeholder="請輸入您的訊息..."
                />
              </div>

              {status === "success" && (
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
                  訊息已送出，我們會盡快回覆您！
                </div>
              )}
              {status === "error" && (
                <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
                  送出失敗，請稍後再試或直接寄信至 {CONTACT_INFO.email}
                </div>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full rounded-lg bg-accent-blue px-6 py-3 text-white text-sm font-medium hover:bg-accent-blue-light hover:shadow-[0_0_24px_rgba(37,99,235,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "sending" ? "送出中..." : "送出訊息"}
              </button>
            </form>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
