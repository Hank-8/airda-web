import Image from "next/image";
import Link from "next/link";
import { NAV_LINKS, SOCIAL_LINKS } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-[#060918]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-blue to-accent-green flex items-center justify-center">
                <span className="text-white font-bold text-sm">AR</span>
              </div>
              <div>
                <div className="font-bold text-sm font-serif">AIRDA</div>
                <div className="text-text-tertiary text-xs">協會</div>
              </div>
            </div>
            <p className="text-sm text-text-tertiary leading-relaxed">
              人工智慧與機器人發展協會
              <br />
              Artificial Intelligence and Robotics
              <br />
              Development Association
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-medium mb-4">快速連結</h4>
            <div className="space-y-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-text-tertiary hover:text-accent-blue transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-medium mb-4">社群媒體</h4>
            <div className="space-y-3">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-text-tertiary hover:text-accent-blue transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border-subtle text-center text-xs text-text-tertiary">
          &copy; 2026 AIRDA 人工智慧與機器人發展協會. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
