import Image from "next/image";
import { NAV_LINKS } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-[#060609]">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid sm:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/logo.jpg"
                alt="AIRDA"
                width={32}
                height={32}
                className="rounded mix-blend-screen"
              />
              <span className="font-semibold">AIRDA</span>
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
                <a
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-text-tertiary hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-medium mb-4">社群媒體</h4>
            <div className="space-y-3">
              <a href="#" className="block text-sm text-text-tertiary hover:text-foreground transition-colors">
                Facebook
              </a>
              <a href="#" className="block text-sm text-text-tertiary hover:text-foreground transition-colors">
                Instagram
              </a>
              <a href="#" className="block text-sm text-text-tertiary hover:text-foreground transition-colors">
                YouTube
              </a>
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
