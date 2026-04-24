"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } },
};

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F1535] via-[#0A0E27] to-[#0A0E27] opacity-50" />

      {/* Animated particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-accent-blue rounded-full"
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <motion.div
        className="relative z-10 max-w-4xl mx-auto px-4 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo Card */}
        <motion.div variants={itemVariants} className="mb-8 inline-block">
          <div className="card p-8 border-accent-blue/30 bg-surface/50">
            <Image
              src="/logo.png"
              alt="AIRDA"
              width={120}
              height={120}
              className="mx-auto mb-4 rounded-xl bg-white/90 p-2"
            />
            <p className="text-text-secondary text-sm font-medium">
              人工智慧與機器人發展協會
            </p>
          </div>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold font-serif mb-4 leading-tight"
        >
          人工智慧與機器人
          <br />
          <span className="text-gradient">發展協會</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-xl text-text-secondary mb-4 font-medium"
        >
          Artificial Intelligence and Robotics Development Association
        </motion.p>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="text-lg text-text-secondary mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          推動 AI 與機器人技術的創新、教育與產學合作
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link href="/#about" className="btn btn-primary px-8 py-4 text-lg group">
            了解更多
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/#contact" className="btn btn-secondary px-8 py-4 text-lg">
            加入我們
          </Link>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-20 flex justify-center"
        >
          <div className="w-6 h-10 border-2 border-accent-blue rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-accent-blue rounded-full animate-pulse" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
