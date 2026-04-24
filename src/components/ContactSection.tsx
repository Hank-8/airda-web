"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { CONTACT_INFO } from "@/lib/constants";

const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "";

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
    <section id="contact" className="relative py-20 lg:py-32 overflow-hidden">
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
            聯絡<span className="text-gradient">我們</span>
          </h2>
          <div className="w-16 h-1 gradient-line rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <p className="text-lg text-text-secondary leading-relaxed">
              歡迎與我們聯繫，無論是課程諮詢、合作提案或任何問題，我們都樂意為您服務。
            </p>

            <div className="space-y-6">
              {[
                { icon: <Mail size={20} />, label: "Email", value: CONTACT_INFO.email },
                { icon: <Phone size={20} />, label: "電話", value: CONTACT_INFO.phone },
                { icon: <MapPin size={20} />, label: "地址", value: CONTACT_INFO.address },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-accent-blue/20 to-accent-green/20 text-accent-blue shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-sm text-text-tertiary mb-1">{item.label}</div>
                    <div className="text-foreground">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
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
                  className="w-full rounded-lg border border-border-subtle bg-surface px-4 py-3 text-foreground text-sm outline-none focus:border-accent-blue/50 focus:shadow-[0_0_0_3px_rgba(14,165,233,0.15)] transition-all"
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
                  className="w-full rounded-lg border border-border-subtle bg-surface px-4 py-3 text-foreground text-sm outline-none focus:border-accent-blue/50 focus:shadow-[0_0_0_3px_rgba(14,165,233,0.15)] transition-all"
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
                  className="w-full rounded-lg border border-border-subtle bg-surface px-4 py-3 text-foreground text-sm outline-none focus:border-accent-blue/50 focus:shadow-[0_0_0_3px_rgba(14,165,233,0.15)] transition-all resize-none"
                  placeholder="請輸入您的訊息..."
                />
              </div>

              {status === "success" && (
                <div className="rounded-lg border border-accent-green/30 bg-accent-green/10 px-4 py-3 text-sm text-accent-green">
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
                className="w-full btn btn-primary py-3 group"
              >
                {status === "sending" ? (
                  "送出中..."
                ) : (
                  <>
                    送出訊息
                    <Send size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
