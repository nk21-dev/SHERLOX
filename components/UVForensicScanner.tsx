'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface UVForensicScannerProps {
  onSelectCase?: (query: string) => void;
}

export const UVForensicScanner: React.FC<UVForensicScannerProps> = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 25,
    restDelta: 0.001,
  });

  const pathLength = useTransform(smoothProgress, [0.08, 0.85], [0, 1]);

  const node1Opacity = useTransform(smoothProgress, [0.05, 0.2], [0.3, 1]);
  const node1Scale = useTransform(smoothProgress, [0.05, 0.2], [0.95, 1]);

  const node2Opacity = useTransform(smoothProgress, [0.35, 0.5], [0.3, 1]);
  const node2Scale = useTransform(smoothProgress, [0.35, 0.5], [0.95, 1]);

  const node3Opacity = useTransform(smoothProgress, [0.65, 0.82], [0.3, 1]);
  const node3Scale = useTransform(smoothProgress, [0.65, 0.82], [0.95, 1]);

  return (
    <section
      id="anatomy"
      ref={containerRef}
      className="relative h-[260vh] bg-black z-20 select-none"
    >
      {/* Sticky Fullscreen Inspection Canvas */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center py-10 px-6 md:px-14 overflow-hidden bg-black">
        
        {/* Section Header (Eyebrow removed, human text) */}
        <div className="max-w-4xl mx-auto w-full text-center mb-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-white tracking-tight">
            How a case is <span className="italic text-red-500 font-normal">broken down.</span>
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-2 font-sans font-light max-w-lg mx-auto">
            We follow the private messages, the hidden money, and the exact fatal mistake.
          </p>
        </div>

        {/* Central Crime Board Interactive Area */}
        <div className="relative max-w-6xl w-full mx-auto flex items-center justify-center my-4">
          
          {/* SVG Connecting Red Yarn */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 hidden md:block">
            <path
              d="M 180 240 Q 360 80, 560 240 T 940 240"
              fill="none"
              stroke="#27272a"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            <motion.path
              d="M 180 240 Q 360 80, 560 240 T 940 240"
              fill="none"
              stroke="#ef4444"
              strokeWidth="3"
              style={{ pathLength }}
              className="drop-shadow-[0_0_12px_rgba(239,68,68,0.9)]"
            />
          </svg>

          {/* 3 Evidence Nodes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full relative z-20 items-center">
            
            {/* CARD 1: THE SUSPECT */}
            <motion.div
              style={{ opacity: node1Opacity, scale: node1Scale }}
              className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 flex flex-col justify-between shadow-2xl relative"
            >
              <div className="border-b border-zinc-900 pb-2.5 mb-4">
                <span className="font-mono text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                  THE SUSPECT
                </span>
              </div>

              <h3 className="text-xl font-serif text-white mb-2">Unmasking the Players</h3>
              <p className="text-zinc-400 text-xs leading-relaxed mb-4">
                Every person involved has a stated public goal and a dirty secret. We put both side by side.
              </p>

              <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 flex flex-col gap-1.5 text-xs">
                <span className="font-mono text-[10px] text-zinc-500 uppercase">PUBLIC STORY:</span>
                <span className="text-zinc-300 text-xs leading-snug">"The bank balance sheet is completely safe."</span>
                <span className="font-mono text-[10px] text-red-400 uppercase pt-2 font-bold">HIDDEN TRUTH:</span>
                <span className="text-red-200 text-xs font-semibold leading-snug">Sold $3.6M in stock days before the run.</span>
              </div>
            </motion.div>

            {/* CARD 2: THE TIMELINE */}
            <motion.div
              style={{ opacity: node2Opacity, scale: node2Scale }}
              className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 flex flex-col justify-between shadow-2xl relative"
            >
              <div className="border-b border-zinc-900 pb-2.5 mb-4">
                <span className="font-mono text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                  THE TIMELINE
                </span>
              </div>

              <h3 className="text-xl font-serif text-white mb-2">The Exact Sequence</h3>
              <p className="text-zinc-400 text-xs leading-relaxed mb-4">
                Never ask "who made the first move?" Every text, wire transfer, and meeting is arranged in order.
              </p>

              <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 flex flex-col gap-2">
                <div className="flex items-center justify-between font-mono text-[10px] text-zinc-400">
                  <span>WED 16:00</span>
                  <span className="text-zinc-500">The Quiet Spark</span>
                </div>
                <div className="flex items-center justify-between font-mono text-[10px] text-amber-400 font-semibold">
                  <span>THU 09:00</span>
                  <span>WhatsApp Panic Starts</span>
                </div>
                <div className="flex items-center justify-between font-mono text-[10px] text-red-400 font-bold">
                  <span>THU 14:15</span>
                  <span>Bank Servers Crash</span>
                </div>
              </div>
            </motion.div>

            {/* CARD 3: THE SMOKING GUN */}
            <motion.div
              style={{ opacity: node3Opacity, scale: node3Scale }}
              className="rounded-2xl border border-red-600/70 bg-gradient-to-br from-red-950/20 via-zinc-950 to-zinc-950 p-6 flex flex-col justify-between shadow-[0_0_40px_rgba(239,68,68,0.2)] relative"
            >
              <div className="border-b border-zinc-900 pb-2.5 mb-4">
                <span className="font-mono text-[10px] text-red-500 font-bold uppercase tracking-wider">
                  THE SMOKING GUN
                </span>
              </div>

              <h3 className="text-xl font-serif text-white mb-2">The Turning Point</h3>
              <p className="text-zinc-400 text-xs leading-relaxed mb-4">
                The exact 30-second catalyst where there was no turning back and the entire event exploded.
              </p>

              <div className="p-3.5 rounded-xl bg-black border border-red-600/50 flex flex-col gap-1.5 shadow-inner">
                <div className="font-mono text-[10px] text-red-400 font-bold uppercase flex items-center justify-between">
                  <span>⚠️ FATAL TRIGGER</span>
                  <span className="text-zinc-500">100% MATCH</span>
                </div>
                <p className="text-xs text-red-200 italic font-mono leading-snug">
                  "Pull all capital right now. Don't be the last one holding the bag."
                </p>
                <span className="text-[10px] text-zinc-500 font-mono pt-1">$42B withdrawn in 10 hours</span>
              </div>
            </motion.div>

          </div>
        </div>

      </div>
    </section>
  );
};
