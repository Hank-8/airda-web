"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { NAV_LINKS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });

    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );

    return () => {
      window.removeEventListener("scroll", onScroll);
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-border-subtle"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-6xl flex items-center justify-between px-6 h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-blue to-accent-green flex items-center justify-center group-hover:shadow-lg group-hover:shadow-accent-blue/50 transition-all duration-300">
            <span className="text-white font-bold text-sm">AR</span>
          </div>
          <div className="hidden sm:block">
            <div className="text-white font-bold text-sm leading-tight font-serif">AIRDA</div>
            <div className="text-text-secondary text-xs">協會</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors ${
                link.href === "/lesson-generator"
                  ? "text-accent-blue hover:text-accent-blue-light font-medium"
                  : "text-text-secondary hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Auth button */}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-text-tertiary truncate max-w-[120px]">
                {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="text-xs px-3 py-1.5 rounded-full border border-border-subtle text-text-secondary hover:text-foreground hover:border-foreground/20 transition-colors"
              >
                登出
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm px-5 py-2 rounded-full bg-accent-blue text-white font-medium hover:bg-accent-blue-light transition-all"
            >
              登入
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="選單"
        >
          <span
            className={`block w-5 h-0.5 bg-foreground transition-transform ${
              menuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-foreground transition-opacity ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-foreground transition-transform ${
              menuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0a0a0f]/95 backdrop-blur-xl border-b border-border-subtle">
          <div className="flex flex-col px-6 py-4 gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`text-base transition-colors ${
                  link.href === "/lesson-generator"
                    ? "text-accent-blue hover:text-accent-blue-light font-medium"
                    : "text-text-secondary hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile auth */}
            {user ? (
              <div className="pt-2 border-t border-border-subtle space-y-3">
                <div className="text-sm text-text-tertiary truncate">{user.email}</div>
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="text-sm text-text-secondary hover:text-foreground transition-colors"
                >
                  登出
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="text-base text-accent-blue hover:text-accent-blue-light font-medium transition-colors"
              >
                登入
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
