'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Search, Camera, GitCommit, Eye, Clock } from 'lucide-react';

export const HorizontalFeatures: React.FC = () => {
  const targetRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  });

  const rawX = useTransform(scrollYProgress, [0, 1], ['0%', '-64%']);
  const x = useSpring(rawX, { stiffness: 85, damping: 24, mass: 0.2, restDelta: 0.001 });

  return (
    <section 
      id="features" 
      ref={targetRef} 
      className="relative h-[220vh] bg-black z-20 select-none"
    >
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden px-6 md:px-14">
        
        {/* Section Header */}
        <div className="max-w-7xl mx-auto w-full mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="font-mono text-xs text-red-500 tracking-[0.25em] uppercase font-bold">
              // BUILT FOR FAST ANSWERS
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-white tracking-tight">
            Everything you need to <span className="italic text-red-500 font-normal">crack any mystery.</span>
          </h2>
        </div>

        {/* Horizontally Moving Track of Pinned Cards */}
        <div className="w-full overflow-hidden">
          <motion.div 
            style={{ x }} 
            className="flex gap-7 w-max py-6 will-change-transform"
          >

            {/* ======================================================== */}
            {/* CARD 1: GLOBAL ARCHIVE (COORDINATE RADAR)                 */}
            {/* ======================================================== */}
            <div
              style={{ transform: 'rotate(-1.5deg)' }}
              className="relative w-[300px] sm:w-[350px] md:w-[380px] h-[450px] md:h-[480px] rounded-3xl border border-zinc-800 bg-zinc-950 p-6 md:p-7 flex flex-col justify-between hover:border-red-500/50 hover:shadow-[0_0_35px_rgba(239,68,68,0.2)] hover:rotate-0 transition-all duration-300 flex-shrink-0 group"
            >
              {/* 3D Red Push Pin */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-red-400 via-red-600 to-red-950 shadow-[0_2px_5px_rgba(0,0,0,0.8)] border border-red-300/50" />
                <div className="w-0.5 h-1 bg-zinc-400" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-red-500 shadow-inner">
                    <Search className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <span className="font-mono text-[10px] text-zinc-500 tracking-widest uppercase">
                    ANCIENT TO MODERN
                  </span>
                </div>
                <h3 className="text-2xl font-serif text-white mb-2 leading-snug">Ask about anything.</h3>
                <p className="text-zinc-400 text-xs md:text-sm leading-relaxed font-sans font-light">
                  From 2,000-year-old ancient wars to yesterday’s corporate collapse. Just type what you want to understand.
                </p>
              </div>

              {/* TACTICAL GRAPHIC: COORDINATE RADAR */}
              <div className="my-3 w-full aspect-[16/9] bg-zinc-900/90 rounded-xl overflow-hidden border border-zinc-800 relative flex items-center justify-center p-3">
                <div className="absolute inset-0 bg-[radial-gradient(#3f3f46_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
                <div className="relative w-24 h-24 rounded-full border border-red-500/30 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border border-zinc-700 border-dashed" />
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 rounded-full border-t-2 border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]"
                  />
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                </div>
                <div className="absolute bottom-2 left-3 font-mono text-[8px] text-zinc-400 bg-black/80 px-2 py-0.5 rounded border border-zinc-800 uppercase tracking-wider">
                  ⌖ GLOBAL RECON // 2,400 YEARS ARCHIVED
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-900 flex items-center justify-between font-mono text-[10px] text-zinc-600 uppercase">
                <span>CAPABILITY // 01</span>
                <span className="text-red-500 font-semibold">VERIFIED</span>
              </div>
            </div>

            {/* ======================================================== */}
            {/* CARD 2: REAL EVIDENCE (OPTICAL VIEWFINDER HUD)            */}
            {/* ======================================================== */}
            <div
              style={{ transform: 'rotate(1.5deg)' }}
              className="relative w-[300px] sm:w-[350px] md:w-[380px] h-[450px] md:h-[480px] rounded-3xl border border-zinc-800 bg-zinc-950 p-6 md:p-7 flex flex-col justify-between hover:border-red-500/50 hover:shadow-[0_0_35px_rgba(239,68,68,0.2)] hover:rotate-0 transition-all duration-300 flex-shrink-0 group"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-red-400 via-red-600 to-red-950 shadow-[0_2px_5px_rgba(0,0,0,0.8)] border border-red-300/50" />
                <div className="w-0.5 h-1 bg-zinc-400" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-red-500 shadow-inner">
                    <Camera className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <span className="font-mono text-[10px] text-zinc-500 tracking-widest uppercase">
                    ARCHIVAL EVIDENCE
                  </span>
                </div>
                <h3 className="text-2xl font-serif text-white mb-2 leading-snug">Real evidence photos.</h3>
                <p className="text-zinc-400 text-xs md:text-sm leading-relaxed font-sans font-light">
                  Authentic photos, battlefield records, and confidential files pinned directly to your case board.
                </p>
              </div>

              {/* TACTICAL GRAPHIC: VIEWFINDER HUD */}
              <div className="my-3 w-full aspect-[16/9] bg-zinc-900/90 rounded-xl overflow-hidden border border-zinc-800 relative flex flex-col justify-between p-3.5">
                <div className="flex justify-between items-center font-mono text-[9px] text-zinc-500">
                  <span className="text-red-500 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    OPTICAL 4K
                  </span>
                  <span>ISO 800 // 1/250s</span>
                </div>
                {/* Viewfinder crosshairs */}
                <div className="self-center relative flex items-center justify-center">
                  <div className="w-12 h-12 border border-zinc-600/60 rounded-full flex items-center justify-center">
                    <div className="w-2 h-0.5 bg-red-500" />
                    <div className="h-2 w-0.5 bg-red-500 absolute" />
                  </div>
                </div>
                <div className="font-mono text-[8px] text-zinc-400 bg-black/80 px-2 py-0.5 rounded border border-zinc-800 uppercase tracking-wider self-start">
                  EXHIBIT // FORENSIC OPTICAL STILL
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-900 flex items-center justify-between font-mono text-[10px] text-zinc-600 uppercase">
                <span>CAPABILITY // 02</span>
                <span className="text-red-500 font-semibold">VERIFIED</span>
              </div>
            </div>

            {/* ======================================================== */}
            {/* CARD 3: THE TIMELINE (RED STRING CRIME WEB)              */}
            {/* ======================================================== */}
            <div
              style={{ transform: 'rotate(-1deg)' }}
              className="relative w-[300px] sm:w-[350px] md:w-[380px] h-[450px] md:h-[480px] rounded-3xl border border-zinc-800 bg-zinc-950 p-6 md:p-7 flex flex-col justify-between hover:border-red-500/50 hover:shadow-[0_0_35px_rgba(239,68,68,0.2)] hover:rotate-0 transition-all duration-300 flex-shrink-0 group"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-red-400 via-red-600 to-red-950 shadow-[0_2px_5px_rgba(0,0,0,0.8)] border border-red-300/50" />
                <div className="w-0.5 h-1 bg-zinc-400" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-red-500 shadow-inner">
                    <GitCommit className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <span className="font-mono text-[10px] text-zinc-500 tracking-widest uppercase">
                    CHRONOLOGICAL CHAIN
                  </span>
                </div>
                <h3 className="text-2xl font-serif text-white mb-2 leading-snug">Follow the timeline.</h3>
                <p className="text-zinc-400 text-xs md:text-sm leading-relaxed font-sans font-light">
                  See every move in the exact order it happened. You will never ask "who started what?" ever again.
                </p>
              </div>

              {/* TACTICAL GRAPHIC: ANIMATED RED STRING WEB */}
              <div className="my-3 w-full aspect-[16/9] bg-zinc-900/90 rounded-xl overflow-hidden border border-zinc-800 relative flex items-center justify-between p-4">
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <path d="M 40 45 Q 160 20 280 45" stroke="#ef4444" strokeWidth="2" fill="none" opacity="0.6" strokeDasharray="4 2" />
                  <path d="M 40 45 Q 160 70 280 45" stroke="#dc2626" strokeWidth="1.5" fill="none" opacity="0.8" />
                </svg>
                <div className="relative z-10 w-8 h-8 rounded-full bg-black border border-red-500 flex items-center justify-center shadow-[0_0_8px_rgba(239,68,68,0.8)]">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                </div>
                <div className="relative z-10 w-8 h-8 rounded-full bg-black border border-amber-500 flex items-center justify-center shadow-[0_0_8px_rgba(245,158,11,0.8)]">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                </div>
                <div className="relative z-10 w-8 h-8 rounded-full bg-black border border-red-500 flex items-center justify-center shadow-[0_0_8px_rgba(239,68,68,0.8)]">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                </div>
                <div className="absolute bottom-2 left-3 font-mono text-[8px] text-zinc-400 bg-black/80 px-2 py-0.5 rounded border border-zinc-800 uppercase tracking-wider">
                  EXHIBIT // CRIME BOARD YARN
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-900 flex items-center justify-between font-mono text-[10px] text-zinc-600 uppercase">
                <span>CAPABILITY // 03</span>
                <span className="text-red-500 font-semibold">VERIFIED</span>
              </div>
            </div>

            {/* ======================================================== */}
            {/* CARD 4: MOTIVE CHECK (REDACTED CLASSIFIED FILE)          */}
            {/* ======================================================== */}
            <div
              style={{ transform: 'rotate(2deg)' }}
              className="relative w-[300px] sm:w-[350px] md:w-[380px] h-[450px] md:h-[480px] rounded-3xl border border-zinc-800 bg-zinc-950 p-6 md:p-7 flex flex-col justify-between hover:border-red-500/50 hover:shadow-[0_0_35px_rgba(239,68,68,0.2)] hover:rotate-0 transition-all duration-300 flex-shrink-0 group"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-red-400 via-red-600 to-red-950 shadow-[0_2px_5px_rgba(0,0,0,0.8)] border border-red-300/50" />
                <div className="w-0.5 h-1 bg-zinc-400" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-red-500 shadow-inner">
                    <Eye className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <span className="font-mono text-[10px] text-zinc-500 tracking-widest uppercase">
                    MOTIVE CHECK
                  </span>
                </div>
                <h3 className="text-2xl font-serif text-white mb-2 leading-snug">Unmask the dirty secret.</h3>
                <p className="text-zinc-400 text-xs md:text-sm leading-relaxed font-sans font-light">
                  We put what suspects told reporters side by side with what they were doing in private.
                </p>
              </div>

              {/* TACTICAL GRAPHIC: REDACTED CLASSIFIED FILE */}
              <div className="my-3 w-full aspect-[16/9] bg-zinc-900/90 rounded-xl overflow-hidden border border-zinc-800 p-3 flex flex-col justify-between relative">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-1">
                  <span className="font-mono text-[9px] text-zinc-500">DECLASSIFIED FILE</span>
                  <span className="font-mono text-[8px] text-red-500 font-bold bg-red-950/40 px-1.5 py-0.5 rounded border border-red-800/40">TOP SECRET</span>
                </div>
                <div className="space-y-1.5 my-1">
                  <div className="h-2 w-full bg-black rounded flex items-center px-1">
                    <span className="text-[7px] font-mono text-red-400/80">SUBJECT SOLD $3.6M STOCK</span>
                  </div>
                  <div className="h-2 w-4/5 bg-black rounded flex items-center px-1">
                    <span className="text-[7px] font-mono text-zinc-600">████████████████</span>
                  </div>
                </div>
                <div className="font-mono text-[8px] text-zinc-400 bg-black/80 px-2 py-0.5 rounded border border-zinc-800 uppercase tracking-wider self-start">
                  EXHIBIT // REDACTED CLASSIFIED MEMO
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-900 flex items-center justify-between font-mono text-[10px] text-zinc-600 uppercase">
                <span>CAPABILITY // 04</span>
                <span className="text-red-500 font-semibold">VERIFIED</span>
              </div>
            </div>

            {/* ======================================================== */}
            {/* CARD 5: FAST VERDICT (3-MINUTE CHRONOMETER)              */}
            {/* ======================================================== */}
            <div
              style={{ transform: 'rotate(0deg)' }}
              className="relative w-[300px] sm:w-[350px] md:w-[380px] h-[450px] md:h-[480px] rounded-3xl border border-zinc-800 bg-zinc-950 p-6 md:p-7 flex flex-col justify-between hover:border-red-500/50 hover:shadow-[0_0_35px_rgba(239,68,68,0.2)] transition-all duration-300 flex-shrink-0 group"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-red-400 via-red-600 to-red-950 shadow-[0_2px_5px_rgba(0,0,0,0.8)] border border-red-300/50" />
                <div className="w-0.5 h-1 bg-zinc-400" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-red-500 shadow-inner">
                    <Clock className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <span className="font-mono text-[10px] text-zinc-500 tracking-widest uppercase">
                    NO TIME WASTED
                  </span>
                </div>
                <h3 className="text-2xl font-serif text-white mb-2 leading-snug">Solved in 3 minutes.</h3>
                <p className="text-zinc-400 text-xs md:text-sm leading-relaxed font-sans font-light">
                  No 90-minute video essays or dry 20-page Wikipedia walls. Just the raw facts and the smoking gun.
                </p>
              </div>

              {/* TACTICAL GRAPHIC: 3-MINUTE CHRONOMETER */}
              <div className="my-3 w-full aspect-[16/9] bg-zinc-900/90 rounded-xl overflow-hidden border border-zinc-800 flex items-center justify-center p-3 relative">
                <div className="relative w-20 h-20 rounded-full border border-zinc-700 flex items-center justify-center shadow-inner">
                  <div className="w-16 h-16 rounded-full border border-red-500/40 border-dashed" />
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    className="absolute top-2 w-0.5 h-8 bg-red-500 origin-bottom shadow-[0_0_6px_rgba(239,68,68,1)]"
                  />
                  <span className="w-2 h-2 rounded-full bg-white z-10" />
                </div>
                <div className="absolute bottom-2 left-3 font-mono text-[8px] text-zinc-400 bg-black/80 px-2 py-0.5 rounded border border-zinc-800 uppercase tracking-wider">
                  EXHIBIT // 03:00.00 ZERO-FLUFF CHRONO
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-900 flex items-center justify-between font-mono text-[10px] text-zinc-600 uppercase">
                <span>CAPABILITY // 05</span>
                <span className="text-red-500 font-semibold">VERIFIED</span>
              </div>
            </div>

          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default HorizontalFeatures;
