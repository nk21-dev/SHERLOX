'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface UVForensicScannerProps {
  onSelectCase?: (query: string) => void;
}

export const UVForensicScanner: React.FC<UVForensicScannerProps> = () => {
  return (
    <section id="scanner" className="relative w-full py-16 px-4 md:px-8 z-10 select-none">
      <div className="max-w-7xl mx-auto rounded-3xl border border-zinc-800/80 bg-zinc-950/70 backdrop-blur-xl p-6 md:p-12 shadow-[0_30px_90px_rgba(0,0,0,0.9)] relative">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="font-mono text-xs text-red-500 tracking-[0.25em] uppercase font-bold">
            // THE FORENSIC TOOLKIT
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-white tracking-tight mt-2">
            How SHERLOX <span className="italic text-red-500 font-normal">cracks the case.</span>
          </h2>
          <p className="text-zinc-400 text-sm md:text-base mt-2 font-sans font-light">
            We don't summarize articles. We reconstruct the crime board, unmask the key players, and find the smoking gun in three minutes.
          </p>
        </div>

        {/* BENTO GRID (2 ROWS, ASYMMETRIC TILES) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* CARD 1 (SPAN 2): THE RED THREAD TIMELINE */}
          <motion.div
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            className="md:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 md:p-8 flex flex-col justify-between hover:border-zinc-700 transition-all shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[10px] text-red-500 font-bold tracking-widest uppercase">
                  TOOL 01 // CRIME BOARD
                </span>
                <span className="font-mono text-[9px] text-zinc-500 border border-zinc-800 px-2 py-0.5 rounded">
                  CHRONOLOGICAL
                </span>
              </div>

              <h3 className="text-2xl font-serif text-white mb-2">
                The Red-Thread Timeline
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-xl">
                Never ask "who made the first move?" SHERLOX uncoils the chronological sequence of events, connecting private calls, wire transfers, and public leaks.
              </p>
            </div>

            {/* Visual: Glowing Red String Connecting 3 Timestamp Pins */}
            <div className="mt-8 pt-6 border-t border-zinc-800/80 relative">
              {/* Animated Connecting Red Thread with Traveling Data Pulse */}
              <div className="absolute top-1/2 left-8 right-8 h-[2px] bg-red-950 -translate-y-1/2 overflow-hidden hidden sm:block">
                {/* The Glowing Traveling Pulse */}
                <motion.div
                  animate={{ x: ['-100%', '300%'] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-24 h-full bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_15px_rgba(239,68,68,1)]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
                <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 flex flex-col gap-1">
                  <span className="font-mono text-[10px] text-zinc-500">WEDNESDAY 16:00</span>
                  <span className="text-xs text-zinc-200 font-medium">The Spark</span>
                  <span className="text-[11px] text-zinc-500 leading-tight">Quiet $1.8B loss announced</span>
                </div>

                <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 flex flex-col gap-1">
                  <span className="font-mono text-[10px] text-zinc-500">THURSDAY 09:00</span>
                  <span className="text-xs text-zinc-200 font-medium">The Whisper Network</span>
                  <span className="text-[11px] text-zinc-500 leading-tight">Private WhatsApp panic begins</span>
                </div>

                <div className="bg-zinc-950 p-3.5 rounded-xl border border-red-600/60 shadow-[0_0_15px_rgba(239,68,68,0.2)] flex flex-col gap-1">
                  <span className="font-mono text-[10px] text-red-400 font-bold">THURSDAY 14:15 ⚠️</span>
                  <span className="text-xs text-red-300 font-medium">The Smoking Gun</span>
                  <span className="text-[11px] text-zinc-400 leading-tight">"Pull your money out now"</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CARD 2 (SPAN 1): THE SUSPECT LINEUP */}
          <motion.div
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            className="md:col-span-1 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 md:p-8 flex flex-col justify-between hover:border-zinc-700 transition-all shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[10px] text-amber-400 font-bold tracking-widest uppercase">
                  TOOL 02 // DOSSIER
                </span>
                <span className="font-mono text-[9px] text-zinc-500 border border-zinc-800 px-2 py-0.5 rounded">
                  PLAYERS
                </span>
              </div>

              <h3 className="text-2xl font-serif text-white mb-2">
                The Suspect Lineup
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Every key figure has a stated public goal, and a hidden motive. We put both side by side.
              </p>
            </div>

            {/* Visual: Mini Suspect Card */}
            <div className="mt-6 p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col gap-2.5">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                <span className="text-xs text-white font-medium">The Catalyst</span>
                <span className="font-mono text-[9px] text-red-400 bg-red-950/40 px-2 py-0.5 rounded border border-red-800/40 font-bold">
                  MOTIVE UNMASKED
                </span>
              </div>

              <div className="flex flex-col gap-1 text-[11px]">
                <span className="text-zinc-500 font-mono">STATED GOAL:</span>
                <span className="text-zinc-300">"Stay calm. The balance sheet is completely safe."</span>
              </div>

              <div className="flex flex-col gap-1 text-[11px] pt-1">
                <span className="text-red-400 font-mono font-bold">HIDDEN REALITY:</span>
                <span className="text-red-200">Sold $3.6M in stock days before the collapse.</span>
              </div>
            </div>
          </motion.div>

          {/* CARD 3 (SPAN 1): THE SMOKING GUN */}
          <motion.div
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            className="md:col-span-1 rounded-2xl border border-red-600/50 bg-gradient-to-br from-red-950/20 via-zinc-950 to-zinc-950 p-6 md:p-8 flex flex-col justify-between shadow-[0_0_40px_rgba(239,68,68,0.15)] transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[10px] text-red-500 font-bold tracking-widest uppercase flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  TOOL 03 // CATALYST
                </span>
                <span className="font-mono text-[9px] text-red-400 border border-red-800/50 px-2 py-0.5 rounded">
                  TURNING POINT
                </span>
              </div>

              <h3 className="text-2xl font-serif text-white mb-2">
                The Smoking Gun
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                The exact turning point where everything blew open. An intercepted wire, a leaked message, or a fatal mistake.
              </p>
            </div>

            {/* Visual: Glowing Red Radar Alert */}
            <div className="mt-6 p-4 rounded-xl bg-black/80 border border-red-600/40 flex flex-col gap-2">
              <div className="flex items-center gap-2 font-mono text-[10px] text-red-400 font-bold">
                <span>⚠️ FATAL TRIGGER</span>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-400">100% CORRELATED</span>
              </div>
              <p className="text-xs text-red-200 italic font-mono leading-relaxed">
                "Panic spread faster than the bank's wire system could physically settle transactions."
              </p>
            </div>
          </motion.div>

          {/* CARD 4 (SPAN 2): THE FORENSIC DEDUCTION */}
          <motion.div
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            className="md:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 md:p-8 flex flex-col justify-between hover:border-zinc-700 transition-all shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[10px] text-zinc-400 font-bold tracking-widest uppercase">
                  TOOL 04 // THE VERDICT
                </span>
                <span className="font-mono text-[9px] text-zinc-500 border border-zinc-800 px-2 py-0.5 rounded">
                  NO ESSAYS
                </span>
              </div>

              <h3 className="text-2xl font-serif text-white mb-2">
                The Final Deduction
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-xl">
                Not a 20-page Wikipedia summary. A razor-sharp, counter-intuitive conclusion that explains what actually happened behind the news headlines.
              </p>
            </div>

            {/* Visual: Stamped Intelligence Report */}
            <div className="mt-6 p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[10px] text-zinc-500 uppercase">THE DEDUCTION</span>
                <p className="text-xs text-zinc-200 font-serif italic">
                  "SVB wasn't killed by bad balance sheets. It was assassinated by the world's first hyperspeed Twitter bank run."
                </p>
              </div>

              <div className="px-3 py-1.5 rounded-lg border border-red-500/60 bg-red-950/40 text-red-400 font-mono text-[10px] font-bold tracking-widest uppercase whitespace-nowrap shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                CASE SOLVED
              </div>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};

export default UVForensicScanner;
