"use client";

import React from "react";
import { motion } from "framer-motion";

interface SectorGateProps {
  number: string;     // e.g. "02"
  sectorName: string; // e.g. "THE INTEL PARADOX"
  clearance?: string; // e.g. "LEVEL 4 CLEARANCE"
}

export const SectorGate: React.FC<SectorGateProps> = ({
  number,
  sectorName,
  clearance = "RESTRICTED ACCESS",
}) => {
  return (
    <div className="w-full relative py-12 flex items-center justify-center overflow-hidden pointer-events-none z-20">
      {/* Left Laser Seam */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-red-600/40 to-red-500 origin-right"
      />

      {/* Central Security Clearance Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 10 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mx-4 md:mx-8 px-4 py-1.5 rounded-full bg-zinc-950 border border-red-600/40 shadow-[0_0_20px_rgba(239,68,68,0.2)] flex items-center gap-3 backdrop-blur-md"
      >
        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping flex-shrink-0" />
        <span className="font-mono text-[10px] md:text-xs text-red-500 tracking-[0.25em] uppercase font-bold whitespace-nowrap">
          ▲ SECTOR {number} // {sectorName}
        </span>
        <span className="hidden sm:inline font-mono text-[9px] text-zinc-500 tracking-wider border-l border-zinc-800 pl-3 uppercase">
          {clearance}
        </span>
      </motion.div>

      {/* Right Laser Seam */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-red-600/40 to-red-500 origin-left"
      />
    </div>
  );
};
