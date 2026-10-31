'use client';

import React from 'react';

export const ParadoxSection: React.FC = () => {
  return (
    <section id="paradox" className="relative w-full min-h-[190vh] px-4 md:px-8 py-16 z-10">
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

        {/* RIGHT COLUMN: FANNED-OUT 3-CARD EVIDENCE SPREAD */}
        <div className="md:w-7/12 flex flex-col items-center justify-start gap-28 pb-48 w-full relative">
          
          {/* CARD 1: TILTS LEFT & SHIFTS LEFT */}
          <div className="sticky top-[90px] md:top-[100px] z-10 w-full max-w-[340px] sm:max-w-[370px] min-h-[440px] md:min-h-[470px] rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-[0_20px_45px_rgba(0,0,0,0.95)] backdrop-blur-xl flex flex-col justify-between -rotate-6 md:-rotate-8 -translate-x-3 md:-translate-x-7 origin-bottom-left transition-all duration-300">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-900 pb-2.5 mb-3">
                <span className="font-mono text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">
                  01. WIKIPEDIA IS BORING
                </span>
                <span className="text-[9px] font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                  DRY FACTS
                </span>
              </div>

              <h3 className="text-xl font-serif text-white mb-2 leading-snug">
                Cold dates. Zero human drama.
              </h3>

              <p className="text-zinc-400 text-xs leading-relaxed">
                Dense walls of text written like legal textbooks. Names and dates with zero emotional tension.
              </p>
            </div>

            {/* Evidence Visual: Dusty Document */}
            <div className="my-3 rounded-lg border border-zinc-800 bg-zinc-900/80 p-3 flex flex-col gap-1.5 font-mono text-[10px] text-zinc-500 relative overflow-hidden select-none">
              <div className="flex items-center justify-between text-zinc-600 text-[9px] border-b border-zinc-800/80 pb-1">
                <span>DOCUMENT #4082</span>
                <span className="text-red-500/80 font-bold">[REDACTED FOOTNOTE]</span>
              </div>
              <div className="space-y-1 py-1">
                <div className="h-2 w-full bg-zinc-800 rounded-sm" />
                <div className="h-2 w-5/6 bg-zinc-800 rounded-sm" />
                <div className="h-2 w-4/6 bg-zinc-800/60 rounded-sm" />
              </div>
              <span className="text-[9px] text-zinc-600 italic">"Refer to subsection 14.B for official timeline..."</span>
            </div>

            <div className="pt-3 border-t border-zinc-900 flex items-center justify-between font-mono text-[9px] text-zinc-600 uppercase">
              <span>EXHIBIT #01</span>
              <span>20 TABS OPEN</span>
            </div>
          </div>

          {/* CARD 2: TILTS RIGHT & SHIFTS RIGHT */}
          <div className="sticky top-[130px] md:top-[140px] z-20 w-full max-w-[340px] sm:max-w-[370px] min-h-[440px] md:min-h-[470px] rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-[0_25px_50px_rgba(0,0,0,0.95)] backdrop-blur-xl flex flex-col justify-between rotate-6 md:rotate-8 translate-x-3 md:translate-x-7 origin-bottom-right transition-all duration-300">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-900 pb-2.5 mb-3">
                <span className="font-mono text-[10px] text-amber-400 font-semibold uppercase tracking-wider">
                  02. 2-HOUR VIDEO ESSAYS
                </span>
                <span className="text-[9px] font-mono text-amber-500/80 bg-amber-950/20 px-2 py-0.5 rounded border border-amber-800/40">
                  TIME SINK
                </span>
              </div>

              <h3 className="text-xl font-serif text-white mb-2 leading-snug">
                Two hours wasted for five minutes of facts.
              </h3>

              <p className="text-zinc-400 text-xs leading-relaxed">
                Slow narration and sponsor breaks just to answer one simple question.
              </p>
            </div>

            {/* Evidence Visual: Video Scrubber Trap */}
            <div className="my-3 rounded-lg border border-amber-900/40 bg-zinc-900/90 p-3 flex flex-col gap-2 font-mono text-[10px] relative overflow-hidden select-none">
              <div className="flex items-center justify-between text-zinc-500 text-[9px]">
                <span className="text-amber-400">▶ SPONSOR SEGMENT 04</span>
                <span>00:14:22 / 02:15:00</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden relative">
                <div className="h-full w-[12%] bg-amber-500" />
              </div>
              <div className="flex justify-between text-[9px] text-zinc-600">
                <span>BUFFERING CHAPTER 1...</span>
                <span className="text-amber-500/70">120 MIN LEFT</span>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-900 flex items-center justify-between font-mono text-[9px] text-zinc-600 uppercase">
              <span>EXHIBIT #02</span>
              <span>120 MIN LOST</span>
            </div>
          </div>

          {/* CARD 3: CENTER ANCHOR (0 DEG) */}
          <div className="sticky top-[170px] md:top-[180px] z-30 w-full max-w-[340px] sm:max-w-[370px] min-h-[440px] md:min-h-[470px] rounded-2xl border border-red-600/80 bg-zinc-950 p-6 shadow-[0_0_60px_rgba(239,68,68,0.3)] backdrop-blur-xl flex flex-col justify-between rotate-0 translate-x-0 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-900 pb-2.5 mb-3">
                <span className="font-mono text-[10px] text-red-500 font-bold uppercase tracking-wider">
                  03. ENTER SHERLOX
                </span>
                <span className="text-[9px] font-mono text-red-400 bg-red-950/40 px-2 py-0.5 rounded border border-red-800/50 font-semibold">
                  SOLVED IN 3 MIN
                </span>
              </div>

              <h3 className="text-xl font-serif text-white mb-2 leading-snug">
                The smoking gun in three minutes flat.
              </h3>

              <p className="text-zinc-300 text-xs leading-relaxed">
                The real suspects with their lies unmasked. The chronological timeline. The turning point that blew the case wide open.
              </p>
            </div>

            {/* Evidence Visual: Crime Board Red Pin */}
            <div className="my-3 rounded-lg border border-red-600/40 bg-red-950/20 p-3 flex flex-col gap-2 font-mono text-[10px] relative overflow-hidden select-none">
              <div className="flex items-center justify-between text-[9px]">
                <span className="text-red-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  SMOKING GUN IDENTIFIED
                </span>
                <span className="text-red-500 font-mono">100% MATCH</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                <div className="h-full w-full bg-gradient-to-r from-red-600 to-amber-500" />
              </div>
              <span className="text-[9px] text-zinc-400 italic">"Leaked timestamp matches the bank wire transfer."</span>
            </div>

            <div className="pt-3 border-t border-zinc-900 flex items-center justify-between font-mono text-[9px] text-red-500/90 uppercase font-semibold">
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
