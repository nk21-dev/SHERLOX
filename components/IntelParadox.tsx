"use client";

import React from "react";
import { ShieldAlert, Clock, CheckCircle2, AlertTriangle, Layers } from "lucide-react";

export const IntelParadox: React.FC = () => {
  return (
    <div className="relative w-full py-12 z-20">
      <div className="min-h-[200vh] relative max-w-7xl mx-auto px-6 md:px-16 flex flex-col md:flex-row gap-12 lg:gap-16">
        {/* Left Sticky Column */}
        <div className="md:w-5/12 sticky top-32 h-fit flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-red-500 font-semibold">
              // THE PARADOX
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light text-zinc-100 tracking-tight leading-[1.08]">
            Why modern research is broken.
          </h2>

          <p className="text-zinc-400 text-base md:text-lg leading-relaxed mt-2 font-normal">
            Wikipedia gives you raw dates without tension. 2-hour video essays drain your time. SHERLOX reconstructs the human conflict in three minutes.
          </p>

          <div className="mt-6 flex items-center gap-4 text-xs font-mono text-zinc-500">
            <span className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-zinc-400" />
              <span>3-TIER DECK STACK</span>
            </span>
            <span>•</span>
            <span>SCROLL TO DECRYPT</span>
          </div>
        </div>

        {/* Right Sticky Stacking Cards Column */}
        <div className="md:w-7/12 flex flex-col gap-12 md:gap-24 pb-32">
          {/* Card 1: The Wikipedia Problem */}
          <div className="sticky top-32 z-10 bg-zinc-950/90 border border-zinc-800/80 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl transition-transform duration-300">
            <div className="flex items-center justify-between border-b border-zinc-800/60 pb-5 mb-6">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-400">
                01 // ACADEMIC COMPILATION
              </span>
              <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700/60 text-[11px] font-mono text-zinc-400 font-medium">
                STATUS: STERILE ACADEMIA
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif text-zinc-100 mb-4">
              The Wikipedia Problem
            </h3>

            <p className="text-zinc-400 text-base sm:text-lg leading-relaxed font-normal">
              Dense paragraphs and cold dates. It strips away the fear, the adrenaline, and the hidden motives that actually drove the decisions.
            </p>

            <div className="mt-8 flex items-center gap-2 text-xs font-mono text-zinc-500 pt-4 border-t border-zinc-900">
              <Clock className="w-3.5 h-3.5 text-zinc-500" />
              <span>Outcome: High cognitive fatigue, zero retained conviction</span>
            </div>
          </div>

          {/* Card 2: The 2-Hour Video Essay Trap */}
          <div className="sticky top-40 z-20 bg-zinc-950/95 border border-amber-600/30 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl transition-transform duration-300">
            <div className="flex items-center justify-between border-b border-amber-900/30 pb-5 mb-6">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-amber-500">
                02 // CONTENT INFLATION
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-950/60 border border-amber-700/60 text-[11px] font-mono text-amber-300 font-medium flex items-center gap-1.5">
                <AlertTriangle className="w-3 h-3 text-amber-400" />
                STATUS: TIME DRAIN
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif text-zinc-100 mb-4">
              The 2-Hour Video Essay Trap
            </h3>

            <p className="text-zinc-300 text-base sm:text-lg leading-relaxed font-normal">
              90 minutes of monotone narration and sponsor breaks just to get 4 minutes of actual insight. Nobody has the time.
            </p>

            <div className="mt-8 flex items-center gap-2 text-xs font-mono text-amber-500/80 pt-4 border-t border-zinc-900">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Outcome: 120 minutes lost on speculative filler</span>
            </div>
          </div>

          {/* Card 3: The SHERLOX Decryption */}
          <div className="sticky top-48 z-30 bg-zinc-950 border border-red-600/60 rounded-3xl p-8 sm:p-10 shadow-[0_0_50px_rgba(220,38,38,0.28)] backdrop-blur-2xl transition-transform duration-300">
            <div className="flex items-center justify-between border-b border-red-900/40 pb-5 mb-6">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-red-500">
                03 // FORENSIC RECONSTRUCTION
              </span>
              <span className="px-3 py-1 rounded-full bg-red-950/80 border border-red-600/60 text-[11px] font-mono text-red-300 font-semibold flex items-center gap-1.5 shadow-[0_0_12px_rgba(239,68,68,0.3)]">
                <CheckCircle2 className="w-3 h-3 text-red-400" />
                STATUS: SOLVED
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif text-zinc-100 mb-4">
              The SHERLOX Decryption
            </h3>

            <p className="text-zinc-200 text-base sm:text-lg leading-relaxed font-normal">
              Interactive FBI dossier. Key suspects with unmasked motives. The chronological red-string timeline. The exact smoking gun trigger.
            </p>

            <div className="mt-8 flex items-center gap-2 text-xs font-mono text-red-400 pt-4 border-t border-zinc-900">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>Decryption Velocity: 3 minutes to master any historic or corporate enigma</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

