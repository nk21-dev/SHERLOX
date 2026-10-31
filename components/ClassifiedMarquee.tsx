"use client";

import React from "react";
import { motion } from "framer-motion";

const MARQUEE_ITEMS = [
  "WHAT REALLY HAPPENED",
  "THE SMOKING GUN",
  "LEAKED MESSAGES & SECRET CALLS",
  "SCANDALS, WARS & HEISTS",
  "ZERO BORING ESSAYS",
  "SOLVED IN 3 MINUTES",
  "UNMASKING THE REAL MOTIVES",
  "THE UNFILTERED TRUTH"
];

export const ClassifiedMarquee: React.FC = () => {
  return (
    <div className="w-full overflow-hidden border-y border-red-600/30 bg-red-950/20 py-4 backdrop-blur-md select-none">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        className="flex whitespace-nowrap gap-8 items-center shrink-0"
      >
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
          <div key={idx} className="flex items-center gap-8">
            <span className="font-mono text-xs md:text-sm tracking-[0.25em] text-red-400 font-semibold uppercase">
              {item}
            </span>
            <span className="text-red-500 text-xs">✦</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default ClassifiedMarquee;
