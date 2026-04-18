import { NEWS } from "@/lib/constants";
import ScrollReveal from "./ScrollReveal";

export default function NewsSection() {
  return (
    <section id="news" className="py-24 md:py-32 px-6">
      <div className="mx-auto max-w-6xl">
        {/* Title — blur in */}
        <ScrollReveal animation="blur-in">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            最新消息
          </h2>
          <div className="mt-2 w-16 h-0.5 rounded-full animated-gradient-line" />
        </ScrollReveal>

        {/* News items — alternate slide left/right */}
        <div className="mt-16 space-y-0">
          {NEWS.map((item, i) => (
            <ScrollReveal
              key={item.title}
              animation={i % 2 === 0 ? "slide-left" : "slide-right"}
              delay={i * 120}
              duration={600}
            >
              <article className="group border-b border-border-subtle py-8 first:pt-0 cursor-pointer hover:bg-surface-elevated/50 -mx-4 px-4 rounded-lg transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex items-center gap-3 sm:w-48 shrink-0">
                    <time className="text-sm text-text-tertiary font-mono">
                      {item.date}
                    </time>
                    <span className="text-xs px-2 py-0.5 rounded-full border border-accent-blue/30 text-accent-blue">
                      {item.category}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium group-hover:text-accent-blue-light transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                      {item.summary}
                    </p>
                  </div>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal animation="zoom-in" delay={400}>
          <div className="mt-12 text-center">
            <a
              href="#"
              className="text-sm text-accent-blue hover:text-accent-blue-light transition-colors"
            >
              查看全部消息 &rarr;
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
