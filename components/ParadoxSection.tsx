"use client";

import React from "react";

export const ParadoxSection: React.FC = () => {
  return (
    <section id="paradox" className="relative z-10 w-full min-h-[260vh] px-6 md:px-16 py-24 bg-gradient-to-r from-black via-black/80 to-transparent">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 lg:gap-20 items-start relative z-10">
        {/* LEFT COLUMN: PINNED IN PLACE */}
        <div className="md:w-5/12 sticky top-32 h-fit flex flex-col gap-4 z-10">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="font-mono text-xs text-red-500 tracking-[0.25em] uppercase font-bold">
              // THE INTEL PARADOX
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light text-zinc-100 tracking-tight leading-[1.1]">
            Why modern research is broken.
          </h2>

          <p className="text-zinc-400 text-base md:text-lg leading-relaxed mt-2 max-w-md">
            Wikipedia gives you cold dates stripped of human fear. 2-hour video essays drain your life for 4 minutes of real insight. SHERLOX reconstructs the true psychological war in three minutes.
          </p>

          <div className="pt-4 flex items-center gap-3">
            <span className="font-mono text-xs text-zinc-600 uppercase tracking-widest">
              [ 3-TIER DECK STACK ✦ SCROLL TO DECRYPT ]
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: STACKING CARDS ON SCROLL */}
        <div className="md:w-7/12 flex flex-col gap-32 pb-48 w-full">
          {/* CARD 1: THE WIKIPEDIA PROBLEM */}
          <div className="sticky top-32 w-full bg-zinc-950/85 backdrop-blur-md border border-zinc-800 rounded-3xl p-8 md:p-10 shadow-2xl shadow-black/90 transition-transform duration-300">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-6">
              <span className="font-mono text-xs text-zinc-500 tracking-widest uppercase">
                01 // ACADEMIC COMPILATION
              </span>
              <span className="font-mono text-[10px] text-zinc-400 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800 uppercase">
                STATUS: STERILE ACADEMIA
              </span>
            </div>

            <h3 className="text-2xl md:text-3xl font-serif text-zinc-100 mb-4">
              The Wikipedia Problem
            </h3>

            <p className="text-zinc-400 text-base md:text-lg leading-relaxed">
              Dense paragraphs and cold dates. It strips away the fear, the adrenaline, the private phone calls, and the hidden motives that actually drove the decisions. You close the tab in 30 seconds.
            </p>

            <div className="mt-8 pt-4 border-t border-zinc-900/80 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
              <span className="font-mono text-xs text-zinc-600 uppercase tracking-wider">
                Outcome: High cognitive fatigue, zero retained conviction
              </span>
            </div>
          </div>

          {/* CARD 2: THE 2-HOUR VIDEO ESSAY TRAP */}
          <div className="sticky top-40 w-full bg-zinc-950/85 backdrop-blur-md border border-zinc-800 rounded-3xl p-8 md:p-10 shadow-2xl shadow-black/90 transition-transform duration-300">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-6">
              <span className="font-mono text-xs text-zinc-500 tracking-widest uppercase">
                02 // CONTENT INFLATION
              </span>
              <span className="font-mono text-[10px] text-amber-500/90 bg-amber-950/20 px-3 py-1 rounded-full border border-amber-800/40 uppercase">
                STATUS: TIME DRAIN
              </span>
            </div>

            <h3 className="text-2xl md:text-3xl font-serif text-zinc-100 mb-4">
              The 2-Hour Video Essay Trap
            </h3>

            <p className="text-zinc-400 text-base md:text-lg leading-relaxed">
              90 minutes of monotone narration, sponsor reads, and dramatic pauses just to get 4 minutes of actual insight. Nobody has the time to sit through high-school level filler.
            </p>

            <div className="mt-8 pt-4 border-t border-zinc-900/80 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500/60" />
              <span className="font-mono text-xs text-zinc-600 uppercase tracking-wider">
                Outcome: 120 minutes lost on speculative commentary
              </span>
            </div>
          </div>

          {/* CARD 3: THE SHERLOX DECRYPTION */}
          <div className="sticky top-48 w-full bg-zinc-950/85 backdrop-blur-md border border-red-600/50 rounded-3xl p-8 md:p-10 shadow-[0_0_50px_rgba(239,68,68,0.2)] transition-transform duration-300">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-6">
              <span className="font-mono text-xs text-red-500 tracking-widest uppercase font-bold">
                03 // FORENSIC RECONSTRUCTION
              </span>
              <span className="font-mono text-[10px] text-red-500 bg-red-950/40 px-3 py-1 rounded-full border border-red-800/50 uppercase font-semibold">
                STATUS: SOLVED
              </span>
            </div>

            <h3 className="text-2xl md:text-3xl font-serif text-zinc-100 mb-4">
              The SHERLOX Decryption
            </h3>

            <p className="text-zinc-300 text-base md:text-lg leading-relaxed">
              Interactive FBI dossier. Key suspects with unmasked motives. The chronological red-string timeline. Real photos held by physical pins. The exact smoking gun trigger revealed in 3 minutes.
            </p>

            <div className="mt-8 pt-4 border-t border-zinc-900/80 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              <span className="font-mono text-xs text-red-500/90 uppercase tracking-wider font-semibold">
                Decryption Velocity: 3 minutes to master any historic or corporate enigma
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ParadoxSection;
