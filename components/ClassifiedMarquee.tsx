"use client";

import React from "react";
import { motion } from "framer-motion";

const MARQUEE_ITEMS = [
  "THE UNDENIABLE SEQUENCE OF EVENTS",
  "RECONSTRUCTING SCANDALS, WARS & HEISTS",
  "SMOKING GUN EVIDENCE",
  "3-MINUTE VISUAL DECRYPTION",
  "CLASSIFIED DEPOSITIONS",
  "AUTONOMOUS TIMELINE FORENSICS",
];

export const ClassifiedMarquee: React.FC = () => {
  return (
    <div className="relative w-full overflow-hidden bg-black py-6 z-20">
      {/* Tilted Marquee Tape */}
      <div className="-rotate-1 scale-105 border-y border-red-600/30 bg-red-950/20 py-3.5 backdrop-blur-md overflow-hidden flex whitespace-nowrap select-none shadow-[0_0_25px_rgba(220,38,38,0.15)]">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex items-center gap-8 shrink-0"
        >
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
            <div key={idx} className="flex items-center gap-8 text-xs md:text-sm font-mono tracking-[0.25em] uppercase text-zinc-300">
              <span className="text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">✦</span>
              <span>{item}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

