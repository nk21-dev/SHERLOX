"use client";

import React from "react";
import { motion } from "framer-motion";

interface SectionWrapperProps {
  id: string;
  sectorNumber: string; // e.g. "02"
  children: React.ReactNode;
  bgGradient?: string; // Custom subtle background tint
}

export const SectionWrapper: React.FC<SectionWrapperProps> = ({
  id,
  sectorNumber,
  children,
  bgGradient = "from-black via-zinc-950 to-black",
}) => {
  return (
    <section
      id={id}
      className={`relative w-full min-h-screen bg-gradient-to-b ${bgGradient} overflow-hidden py-16 flex flex-col justify-center`}
    >
      {/* Massive Faint Background Sector Watermark */}
      <div className="absolute right-4 md:right-16 top-10 pointer-events-none select-none z-0">
        <span className="font-serif text-[140px] md:text-[220px] font-extrabold text-white/[0.02] tracking-tighter leading-none block">
          {sectorNumber}
        </span>
      </div>

      {/* Scroll-Triggered Cinematic Lift */}
      <motion.div
        initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full"
      >
        {children}
      </motion.div>
    </section>
  );
};

