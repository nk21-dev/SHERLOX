'use client';

import React from 'react';

export const ParadoxSection: React.FC = () => {
  return (
    <section id="paradox" className="relative w-full min-h-[190vh] px-4 md:px-8 py-16 z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10 lg:gap-16 items-start relative">
        
        {/* LEFT COLUMN: PINNED IN PLACE */}
        <div className="md:w-5/12 sticky top-28 md:top-32 h-fit flex flex-col gap-4 z-10 pr-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="font-mono text-xs text-red-500 tracking-[0.25em] uppercase font-bold">
              // THE PROBLEM
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-serif font-light text-white tracking-tight leading-[1.1]">
            Why finding the truth is painful.
          </h2>

          <p className="text-zinc-400 text-base md:text-lg leading-relaxed mt-2 font-sans font-light">
            When big events or scandals happen, you are forced to choose between dry academic pages or 2-hour video essays. We built SHERLOX to give you the real story in three minutes.
          </p>
        </div>

        {/* RIGHT COLUMN: STACKING DECK (ALL 3 HEADERS STAY VISIBLE) */}
        <div className="md:w-7/12 flex flex-col gap-28 pb-40 w-full relative">
          
          {/* CARD 1: THE WIKIPEDIA PROBLEM */}
          <div className="sticky top-[110px] md:top-[120px] z-10 w-full rounded-2xl border border-zinc-800 bg-zinc-950/95 p-6 md:p-8 shadow-[0_15px_35px_rgba(0,0,0,0.9)] backdrop-blur-xl transition-all">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-4">
              <span className="font-mono text-[11px] text-zinc-400 font-semibold uppercase tracking-wider">
                01. WIKIPEDIA IS BORING
              </span>
              <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-2.5 py-0.5 rounded border border-zinc-800">
                DRY FACTS
              </span>
            </div>

            <h3 className="text-2xl font-serif text-white mb-2">
              Cold dates. Zero human drama.
            </h3>

            <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
              Dense paragraphs written like legal textbooks. It lists dates and numbers, but strips away the panic, the private calls, and the actual motives. You close the tab feeling bored.
            </p>
          </div>

          {/* CARD 2: THE 2-HOUR VIDEO ESSAY */}
          <div className="sticky top-[185px] md:top-[200px] z-20 w-full rounded-2xl border border-zinc-800 bg-zinc-950/95 p-6 md:p-8 shadow-[0_20px_45px_rgba(0,0,0,0.95)] backdrop-blur-xl transition-all">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-4">
              <span className="font-mono text-[11px] text-amber-400 font-semibold uppercase tracking-wider">
                02. VIDEO ESSAYS ARE TOO LONG
              </span>
              <span className="text-[10px] font-mono text-amber-500/80 bg-amber-950/20 px-2.5 py-0.5 rounded border border-amber-800/40">
                90-MIN DRAIN
              </span>
            </div>

            <h3 className="text-2xl font-serif text-white mb-2">
              Two hours wasted for five minutes of facts.
            </h3>

            <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
              Slow narrators, endless dramatic pauses, and sponsor breaks just to explain one simple situation. Nobody has two hours to watch an essay for basic answers.
            </p>
          </div>

          {/* CARD 3: THE SHERLOX SMOKING GUN */}
          <div className="sticky top-[260px] md:top-[280px] z-30 w-full rounded-2xl border border-red-600/60 bg-zinc-950 p-6 md:p-8 shadow-[0_25px_60px_rgba(239,68,68,0.2)] backdrop-blur-xl transition-all">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-4">
              <span className="font-mono text-[11px] text-red-500 font-bold uppercase tracking-wider">
                03. ENTER SHERLOX
              </span>
              <span className="text-[10px] font-mono text-red-400 bg-red-950/40 px-2.5 py-0.5 rounded border border-red-800/50 font-semibold">
                SOLVED IN 3 MIN
              </span>
            </div>

            <h3 className="text-2xl font-serif text-white mb-2">
              The smoking gun in three minutes flat.
            </h3>

            <p className="text-zinc-300 text-sm md:text-base leading-relaxed">
              The real suspects with their lies exposed. The chronological timeline. Real evidence photos pinned to the board. The exact turning point that blew the case wide open.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};

export default ParadoxSection;
