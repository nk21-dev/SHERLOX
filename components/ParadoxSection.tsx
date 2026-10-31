"use client";

import React from "react";

export const ParadoxSection: React.FC = () => {
  return (
    <section id="paradox" className="relative w-full min-h-[160vh] md:min-h-[175vh] px-4 md:px-8 py-10 md:py-12 z-10">
      {/* The Framed Dossier Page */}
      <div className="max-w-7xl mx-auto rounded-3xl border border-zinc-800/80 bg-zinc-950/60 backdrop-blur-xl p-6 md:p-12 shadow-[0_25px_60px_rgba(0,0,0,0.85)] relative">
        
        {/* Page Header Stamp */}
        <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-8">
          <span className="font-mono text-xs text-red-500 tracking-[0.25em] uppercase font-bold">
            // DOSSIER PAGE 02 ✦ THE INTEL PARADOX
          </span>
          <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">
            RESTRICTED RESEARCH FILE
          </span>
        </div>

        <div className="flex flex-col md:flex-row gap-12 items-start">
          {/* Left Pinned Title */}
          <div className="md:w-5/12 sticky top-32 h-fit flex flex-col gap-4">
            <h2 className="text-4xl sm:text-5xl font-serif font-light text-zinc-100 tracking-tight leading-[1.1]">
              Why modern research is broken.
            </h2>
            <p className="text-zinc-400 text-base leading-relaxed">
              Wikipedia gives you dry footnotes with zero human tension. 2-hour video essays drain your afternoon for four minutes of real insight. SHERLOX reconstructs the true human conflict in three minutes.
            </p>
          </div>

          {/* Right Stacking Cards */}
          <div className="md:w-7/12 flex flex-col gap-16 pb-6 w-full">
            {/* Card 1 */}
            <div className="sticky top-32 w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl p-7 shadow-xl">
              <span className="font-mono text-[11px] text-zinc-500 uppercase">THE WIKIPEDIA TRAP</span>
              <h3 className="text-2xl font-serif text-white mt-2 mb-3">Wikipedia tells you what happened, never why.</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">Dense paragraphs, cold dates, and zero human tension. It reads like a legal deposition written by a committee. You close the tab in thirty seconds.</p>
            </div>

            {/* Card 2 */}
            <div className="sticky top-40 w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl p-7 shadow-xl">
              <span className="font-mono text-[11px] text-amber-500/90 uppercase">THE VIDEO ESSAY SINK</span>
              <h3 className="text-2xl font-serif text-white mt-2 mb-3">Video essays demand two hours of your life.</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">Ninety minutes of slow pacing, filler monologues, and sponsor plugs just to get five minutes of actual revelation. Nobody has the time.</p>
            </div>

            {/* Card 3 */}
            <div className="sticky top-48 w-full bg-zinc-950 border border-red-600/50 rounded-2xl p-7 shadow-[0_0_40px_rgba(239,68,68,0.25)]">
              <span className="font-mono text-[11px] text-red-500 uppercase font-bold">THE SHERLOX DECRYPTION</span>
              <h3 className="text-2xl font-serif text-white mt-2 mb-3">The smoking gun in three minutes flat.</h3>
              <p className="text-zinc-300 text-sm leading-relaxed">The key players with their hidden motives unmasked. The chronological timeline. Real archival photos held by physical pins. The exact trigger that blew the lid open.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ParadoxSection;
