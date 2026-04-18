import Link from "next/link";
import { SERVICES } from "@/lib/constants";
import ScrollReveal from "./ScrollReveal";

function ServiceIcon({ type }: { type: string }) {
  const className = "w-10 h-10 text-accent-blue icon-spin-hover";

  switch (type) {
    case "education":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15v-3.75m0 0h-.008v.008H6.75V11.25Z" />
        </svg>
      );
    case "trophy":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0 1 16.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.023 6.023 0 0 1-2.27.308 6.023 6.023 0 0 1-2.27-.308" />
        </svg>
      );
    case "handshake":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
        </svg>
      );
    default:
      return null;
  }
}

const cardAnimations = ["rotate-left", "fade-up", "rotate-right"] as const;

export default function ServicesSection() {
  return (
    <section id="services" className="py-24 md:py-32 px-6">
      <div className="mx-auto max-w-6xl">
        {/* Title — fade right */}
        <ScrollReveal animation="fade-right">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            核心服務與活動
          </h2>
          <div className="mt-2 w-16 h-0.5 rounded-full animated-gradient-line" />
        </ScrollReveal>

        {/* Cards — each rotates in from different direction */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {SERVICES.map((service, i) => (
            <ScrollReveal
              key={service.title}
              animation={cardAnimations[i]}
              delay={i * 150}
              duration={800}
            >
              <div className="group rounded-xl border border-border-subtle bg-surface p-8 h-full hover:border-accent-blue/30 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(37,99,235,0.12)] transition-all duration-300">
                <div className="mb-6">
                  <ServiceIcon type={service.icon} />
                </div>
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-text-secondary leading-relaxed text-sm">
                  {service.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Lesson Generator CTA */}
        <ScrollReveal animation="zoom-in" delay={500} duration={800}>
          <div className="mt-16 rounded-2xl border border-accent-blue/20 bg-gradient-to-br from-accent-blue/5 to-transparent p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl md:text-2xl font-bold">
                教案產生器
              </h3>
              <p className="mt-2 text-text-secondary text-sm max-w-lg">
                輸入任意感測器主題，即時產出完整 18 頁教案大綱 — 涵蓋理論講解、動手實作、程式範例與創意挑戰。
              </p>
            </div>
            <Link
              href="/lesson-generator"
              className="shrink-0 px-8 py-3 rounded-full bg-accent-blue text-white font-medium text-sm hover:bg-accent-blue-light hover:shadow-[0_0_24px_rgba(37,99,235,0.4)] transition-all duration-300"
            >
              立即使用
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
