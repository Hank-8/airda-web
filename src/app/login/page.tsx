"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Navbar from "@/components/Navbar";
import GoogleLoginButton from "@/components/GoogleLoginButton";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/lesson-generator";

  const supabase = createClient();

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(
        error.message === "Invalid login credentials"
          ? "帳號或密碼錯誤"
          : error.message
      );
      setLoading(false);
    } else {
      window.location.href = redirect;
    }
  }

  return (
    <div className="w-full max-w-sm space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold">登入</h1>
        <p className="mt-2 text-sm text-text-secondary">
          登入以使用教案產生器
        </p>
      </div>

      {/* Google Login */}
      <GoogleLoginButton redirectTo={redirect} />

      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-border-subtle" />
        <span className="text-xs text-text-tertiary">或</span>
        <div className="flex-1 h-px bg-border-subtle" />
      </div>

      {/* Email Login */}
      <form onSubmit={handleEmailLogin} className="space-y-4">
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
            placeholder="輸入密碼"
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
          {loading ? "登入中..." : "登入"}
        </button>
      </form>

      <p className="text-center text-sm text-text-secondary">
        還沒有帳號？{" "}
        <Link
          href="/register"
          className="text-accent-blue hover:text-accent-blue-light transition-colors"
        >
          免費註冊
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center px-6 pt-16">
        <Suspense>
          <LoginForm />
        </Suspense>
      </main>
    </>
  );
}
