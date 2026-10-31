'use client';

import React from 'react';

export const ParadoxSection: React.FC = () => {
  return (
    <section id="paradox" className="relative w-full min-h-[200vh] px-4 md:px-8 py-16 z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10 lg:gap-16 items-start relative">
        
        {/* LEFT COLUMN: PINNED IN PLACE */}
        <div className="md:w-5/12 sticky top-28 md:top-36 h-fit flex flex-col gap-4 z-10 pr-4">
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

        {/* RIGHT COLUMN: PORTRAIT FANNED-OUT STACK */}
        <div className="md:w-7/12 flex flex-col items-center justify-start gap-32 pb-48 w-full relative">
          
          {/* CARD 1: TILTS LEFT (-4 DEG) */}
          <div className="sticky top-[110px] md:top-[120px] z-10 w-full max-w-[340px] sm:max-w-[380px] min-h-[420px] md:min-h-[450px] rounded-2xl border border-zinc-800 bg-zinc-950 p-7 shadow-[0_20px_45px_rgba(0,0,0,0.95)] backdrop-blur-xl flex flex-col justify-between -rotate-3 md:-rotate-4 origin-bottom-left transition-transform duration-300">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-5">
                <span className="font-mono text-[11px] text-zinc-400 font-semibold uppercase tracking-wider">
                  01. WIKIPEDIA IS BORING
                </span>
                <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                  DRY FACTS
                </span>
              </div>

              <h3 className="text-2xl font-serif text-white mb-3 leading-snug">
                Cold dates. Zero human drama.
              </h3>

              <p className="text-zinc-400 text-sm leading-relaxed">
                Dense paragraphs written like legal textbooks. It lists numbers and dates, but completely strips away the fear, the private calls, and the actual human motives.
              </p>
            </div>

            <div className="pt-4 border-t border-zinc-900 flex items-center justify-between font-mono text-[10px] text-zinc-600 uppercase">
              <span>EXHIBIT #01</span>
              <span>20 TABS OPEN</span>
            </div>
          </div>

          {/* CARD 2: TILTS RIGHT (+4 DEG) */}
          <div className="sticky top-[150px] md:top-[165px] z-20 w-full max-w-[340px] sm:max-w-[380px] min-h-[420px] md:min-h-[450px] rounded-2xl border border-zinc-800 bg-zinc-950 p-7 shadow-[0_25px_50px_rgba(0,0,0,0.95)] backdrop-blur-xl flex flex-col justify-between rotate-3 md:rotate-4 origin-bottom-right transition-transform duration-300">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-5">
                <span className="font-mono text-[11px] text-amber-400 font-semibold uppercase tracking-wider">
                  02. VIDEO ESSAYS ARE TOO LONG
                </span>
                <span className="text-[10px] font-mono text-amber-500/80 bg-amber-950/20 px-2 py-0.5 rounded border border-amber-800/40">
                  90-MIN DRAIN
                </span>
              </div>

              <h3 className="text-2xl font-serif text-white mb-3 leading-snug">
                Two hours wasted for five minutes of facts.
              </h3>

              <p className="text-zinc-400 text-sm leading-relaxed">
                Slow narrators, endless dramatic pauses, and sponsor breaks just to explain one simple situation. Nobody has two hours to watch a documentary for basic answers.
              </p>
            </div>

            <div className="pt-4 border-t border-zinc-900 flex items-center justify-between font-mono text-[10px] text-zinc-600 uppercase">
              <span>EXHIBIT #02</span>
              <span>120 MIN LOST</span>
            </div>
          </div>

          {/* CARD 3: STRAIGHT CENTER (0 DEG) */}
          <div className="sticky top-[190px] md:top-[210px] z-30 w-full max-w-[340px] sm:max-w-[380px] min-h-[420px] md:min-h-[450px] rounded-2xl border border-red-600/70 bg-zinc-950 p-7 shadow-[0_0_55px_rgba(239,68,68,0.25)] backdrop-blur-xl flex flex-col justify-between rotate-0 transition-transform duration-300">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-5">
                <span className="font-mono text-[11px] text-red-500 font-bold uppercase tracking-wider">
                  03. ENTER SHERLOX
                </span>
                <span className="text-[10px] font-mono text-red-400 bg-red-950/40 px-2.5 py-0.5 rounded border border-red-800/50 font-semibold">
                  SOLVED IN 3 MIN
                </span>
              </div>

              <h3 className="text-2xl font-serif text-white mb-3 leading-snug">
                The smoking gun in three minutes flat.
              </h3>

              <p className="text-zinc-300 text-sm leading-relaxed">
                The real suspects with their lies exposed. The chronological timeline. Real evidence photos pinned to the board. The exact turning point that blew the case wide open.
              </p>
            </div>

            <div className="pt-4 border-t border-zinc-900 flex items-center justify-between font-mono text-[10px] text-red-500/80 uppercase font-semibold">
              <span>EXHIBIT #03</span>
              <span>TRUTH DECLASSIFIED</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default ParadoxSection;
