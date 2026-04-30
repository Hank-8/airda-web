"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.5 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" as const } },
};

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        poster=""
      >
        <source src="/hero-video.webm" type="video/webm" />
      </video>

      {/* Dark overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#0A0E27]" />

      {/* Subtle animated grain */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
      }} />

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-6 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs text-white/70">
            <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
            AI × 機器人教育平台
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-6xl lg:text-8xl font-bold font-serif leading-[1.1] tracking-tight"
        >
          <span className="text-white">人工智慧與機器人</span>
          <br />
          <span className="text-gradient">發展協會</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="mt-6 text-lg sm:text-xl text-white/50 tracking-[0.2em] uppercase font-light"
        >
          Artificial Intelligence and Robotics Development Association
        </motion.p>

        {/* Divider */}
        <motion.div variants={itemVariants} className="mt-8 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="mt-8 text-lg sm:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed"
        >
          推動 AI 與機器人技術的創新、教育與產學合作
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="/#about"
            className="btn btn-primary px-10 py-4 text-base group"
          >
            了解更多
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/lesson-generator"
            className="px-10 py-4 rounded-lg border border-white/15 bg-white/5 backdrop-blur-sm text-white/80 text-base font-medium hover:bg-white/10 hover:border-white/25 transition-all"
          >
            教案產生器
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="w-6 h-6 text-white/30" />
      </motion.div>
    </section>
  );
}
