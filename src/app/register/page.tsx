"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Navbar from "@/components/Navbar";
import GoogleLoginButton from "@/components/GoogleLoginButton";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("密碼至少需要 6 個字元");
      return;
    }
    if (password !== confirmPassword) {
      setError("兩次輸入的密碼不一致");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
    }
  }

  if (success) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center px-6 pt-16">
          <div className="w-full max-w-sm text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold">註冊成功！</h1>
            <p className="text-sm text-text-secondary">
              請到 <span className="text-foreground">{email}</span> 信箱點擊驗證連結完成註冊。
            </p>
            <p className="text-sm text-text-secondary">
              驗證後即可享受 <span className="text-accent-blue font-medium">30 天免費試用</span>。
            </p>
            <Link
              href="/login"
              className="inline-block mt-4 px-6 py-3 rounded-lg bg-accent-blue text-white text-sm font-medium hover:bg-accent-blue-light transition-all"
            >
              前往登入
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center px-6 pt-16">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">免費註冊</h1>
            <p className="mt-2 text-sm text-text-secondary">
              註冊後享有 <span className="text-accent-blue font-medium">30 天免費試用</span>教案產生器
            </p>
          </div>

          {/* Google */}
          <GoogleLoginButton label="使用 Google 帳號註冊" />

          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-border-subtle" />
            <span className="text-xs text-text-tertiary">或</span>
            <div className="flex-1 h-px bg-border-subtle" />
          </div>

          {/* Email Register */}
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm text-text-secondary mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-border-subtle bg-surface px-4 py-3 text-foreground text-sm outline-none focus:border-accent-blue/50 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] transition-all"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm text-text-secondary mb-2">
                密碼
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-border-subtle bg-surface px-4 py-3 text-foreground text-sm outline-none focus:border-accent-blue/50 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] transition-all"
                placeholder="至少 6 個字元"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm text-text-secondary mb-2">
                確認密碼
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-border-subtle bg-surface px-4 py-3 text-foreground text-sm outline-none focus:border-accent-blue/50 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] transition-all"
                placeholder="再輸入一次密碼"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-accent-blue px-6 py-3 text-white text-sm font-medium hover:bg-accent-blue-light hover:shadow-[0_0_24px_rgba(37,99,235,0.3)] transition-all duration-300 disabled:opacity-50"
            >
              {loading ? "註冊中..." : "註冊"}
            </button>
          </form>

          <p className="text-center text-sm text-text-secondary">
            已有帳號？{" "}
            <Link href="/login" className="text-accent-blue hover:text-accent-blue-light transition-colors">
              登入
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
