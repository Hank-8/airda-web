import { STATS } from "@/lib/constants";
import ScrollReveal from "./ScrollReveal";

export default function AboutSection() {
  return (
    <section id="about" className="py-24 md:py-32 px-6">
      <div className="mx-auto max-w-6xl">
        {/* Title — slide in from left */}
        <ScrollReveal animation="fade-left">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            關於我們
          </h2>
          <div className="mt-2 w-16 h-0.5 rounded-full animated-gradient-line" />
        </ScrollReveal>

        <div className="mt-16 grid md:grid-cols-2 gap-16">
          {/* Text — flip in from X axis */}
          <ScrollReveal animation="flip-x" delay={150}>
            <div className="space-y-6 text-text-secondary leading-relaxed">
              <p>
                人工智慧與機器人發展協會（AIRDA）致力於推動台灣 AI
                與機器人技術的發展，連結產業、學術與教育界的力量，共同培育下一代科技人才。
              </p>
              <p>
                我們相信，透過系統化的教育培訓、具啟發性的競賽活動，以及緊密的產學合作，能夠讓更多人接觸並掌握人工智慧與機器人技術，為台灣的科技創新注入活力。
              </p>
              <p>
                協會匯集了來自各大學、研究機構與科技企業的專家，共同規劃課程、舉辦活動，並提供技術諮詢與資源共享平台。
              </p>
            </div>
          </ScrollReveal>

          {/* Stats — each card zooms in with staggered delay */}
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3 gap-4">
            {STATS.map((stat, i) => (
              <ScrollReveal key={stat.label} animation="zoom-in" delay={250 + i * 150}>
                <div className="rounded-xl border border-border-subtle bg-surface p-6 text-center hover:border-accent-blue/30 hover:shadow-[0_0_20px_rgba(37,99,235,0.1)] transition-all duration-300">
                  <div className="text-3xl font-bold text-accent-blue">
                    {stat.value}
                  </div>
                  <div className="mt-2 text-sm text-text-secondary">
                    {stat.label}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
