import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(37, 99, 235, 0.12) 0%, transparent 70%)",
        }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Floating decorative elements */}
      <div className="absolute top-1/4 left-[10%] w-2 h-2 rounded-full bg-accent-blue/30 animate-float" />
      <div
        className="absolute top-1/3 right-[15%] w-1.5 h-1.5 rounded-full bg-accent-cyan/30"
        style={{ animation: "float 4s ease-in-out 1s infinite" }}
      />
      <div
        className="absolute bottom-1/3 left-[20%] w-1 h-1 rounded-full bg-accent-blue-light/20"
        style={{ animation: "float 3.5s ease-in-out 0.5s infinite" }}
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl">
        {/* Logo */}
        <div className="animate-hero-1 mb-8">
          <Image
            src="/logo.jpg"
            alt="人工智慧與機器人發展協會"
            width={280}
            height={100}
            className="mix-blend-screen"
            preload={true}
          />
        </div>

        {/* Chinese title */}
        <h1 className="animate-hero-2 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
          人工智慧與機器人
          <br />
          <span className="text-accent-blue">發展協會</span>
        </h1>

        {/* English subtitle */}
        <p className="animate-hero-3 mt-4 text-sm md:text-base text-text-secondary tracking-widest uppercase">
          Artificial Intelligence and Robotics Development Association
        </p>

        {/* Animated gradient divider */}
        <div className="animate-hero-3 mt-6 w-24 h-0.5 rounded-full animated-gradient-line" />

        {/* Slogan */}
        <p className="animate-hero-3 mt-6 text-lg md:text-xl text-text-secondary max-w-xl">
          推動 AI 與機器人技術的創新、教育與產學合作
        </p>

        {/* CTA */}
        <div className="animate-hero-4 mt-10 flex flex-col sm:flex-row gap-4">
          <a
            href="#about"
            className="px-8 py-3 rounded-full bg-accent-blue text-white font-medium text-sm hover:bg-accent-blue-light hover:shadow-[0_0_24px_rgba(37,99,235,0.4)] transition-all duration-300"
          >
            了解更多
          </a>
          <a
            href="#contact"
            className="px-8 py-3 rounded-full border border-border-subtle text-text-secondary font-medium text-sm hover:text-foreground hover:border-foreground/20 transition-colors"
          >
            加入我們
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 animate-hero-4">
        <div className="w-5 h-9 rounded-full border-2 border-text-tertiary flex items-start justify-center p-1">
          <div
            className="w-1 h-2 rounded-full bg-text-tertiary"
            style={{ animation: "scrollBounce 1.8s ease-in-out infinite" }}
          />
        </div>
      </div>
    </section>
  );
}
