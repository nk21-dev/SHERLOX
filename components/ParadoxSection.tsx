'use client';

import React from 'react';

// Swap these image paths with your own files in public/media/
const CARD_IMAGES = {
  card1: "/media/paradox-card1.jpg", // Card 1 Image Placeholder (Wikipedia / Document)
  card2: "/media/paradox-card2.jpg", // Card 2 Image Placeholder (Video essay / Time drain)
  card3: "/media/paradox-card3.jpg", // Card 3 Image Placeholder (Sherlox / Crime board)
};

export const ParadoxSection: React.FC = () => {
  return (
    <section id="paradox" className="relative w-full min-h-[140vh] md:min-h-[150vh] px-4 md:px-8 py-16 z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10 lg:gap-16 items-start relative">
        
        {/* LEFT COLUMN: PINNED IN PLACE (Eyebrow removed) */}
        <div className="md:w-5/12 sticky top-28 md:top-36 h-fit flex flex-col gap-4 z-10 pr-4">
          <h2 className="text-4xl sm:text-5xl font-serif font-light text-red-500 tracking-tight leading-[1.1] drop-shadow-[0_0_25px_rgba(239,68,68,0.25)]">
            Why finding the truth is painful.
          </h2>

          <p className="text-zinc-400 text-base md:text-lg leading-relaxed mt-2 font-sans font-light">
            When big events or scandals happen, you are forced to choose between dry academic pages or 2-hour video essays. We built SHERLOX to give you the real story in three minutes.
          </p>
        </div>

        {/* RIGHT COLUMN: FANNED-OUT STACK WITH REAL IMAGES */}
        <div className="md:w-7/12 flex flex-col items-center justify-start gap-20 pb-8 w-full relative">
          
          {/* CARD 1: TILTS LEFT (-8 DEG) */}
          <div className="sticky top-[90px] md:top-[100px] z-10 w-full max-w-[340px] sm:max-w-[370px] min-h-[430px] md:min-h-[460px] rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-[0_20px_45px_rgba(0,0,0,0.95)] backdrop-blur-xl flex flex-col justify-between -rotate-6 md:-rotate-8 -translate-x-3 md:-translate-x-7 origin-bottom-left transition-all duration-300">
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

            {/* REAL IMAGE CONTAINER FOR CARD 1 */}
            <div className="my-3 w-full aspect-[16/10] bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 relative">
              <img
                src={CARD_IMAGES.card1}
                alt="Wikipedia is boring"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Fallback if local image is not yet loaded
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=600&q=80";
                }}
                className="w-full h-full object-cover filter contrast-[1.15] grayscale-[30%]"
              />
              <div className="absolute bottom-1.5 left-2 font-mono text-[8px] bg-black/85 px-2 py-0.5 rounded text-zinc-400 border border-zinc-800 uppercase tracking-wider">
                EXHIBIT // DUSTY ARCHIVE
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-900 flex items-center justify-between font-mono text-[9px] text-zinc-600 uppercase">
              <span>EXHIBIT #01</span>
              <span>20 TABS OPEN</span>
            </div>
          </div>

          {/* CARD 2: TILTS RIGHT (+8 DEG) */}
          <div className="sticky top-[130px] md:top-[140px] z-20 w-full max-w-[340px] sm:max-w-[370px] min-h-[430px] md:min-h-[460px] rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-[0_25px_50px_rgba(0,0,0,0.95)] backdrop-blur-xl flex flex-col justify-between rotate-6 md:rotate-8 translate-x-3 md:translate-x-7 origin-bottom-right transition-all duration-300">
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

            {/* REAL IMAGE CONTAINER FOR CARD 2 */}
            <div className="my-3 w-full aspect-[16/10] bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 relative">
              <img
                src={CARD_IMAGES.card2}
                alt="2-hour video essays"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80";
                }}
                className="w-full h-full object-cover filter contrast-[1.15] grayscale-[30%]"
              />
              <div className="absolute bottom-1.5 left-2 font-mono text-[8px] bg-black/85 px-2 py-0.5 rounded text-amber-400/80 border border-zinc-800 uppercase tracking-wider">
                EXHIBIT // RUNTIME DRAIN
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-900 flex items-center justify-between font-mono text-[9px] text-zinc-600 uppercase">
              <span>EXHIBIT #02</span>
              <span>120 MIN LOST</span>
            </div>
          </div>

          {/* CARD 3: CENTER ANCHOR (0 DEG) */}
          <div className="sticky top-[170px] md:top-[180px] z-30 w-full max-w-[340px] sm:max-w-[370px] min-h-[430px] md:min-h-[460px] rounded-2xl border border-red-600/80 bg-zinc-950 p-6 shadow-[0_0_60px_rgba(239,68,68,0.3)] backdrop-blur-xl flex flex-col justify-between rotate-0 translate-x-0 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-900 pb-2.5 mb-3">
                <span className="font-mono text-[10px] text-red-500 font-bold uppercase tracking-wider">
                  03. ENTER SHERLOX
                </span>
                <span className="text-[9px] font-mono text-red-400 bg-red-950/40 px-2.5 py-0.5 rounded border border-red-800/50 font-semibold">
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

            {/* REAL IMAGE CONTAINER FOR CARD 3 */}
            <div className="my-3 w-full aspect-[16/10] bg-zinc-900 rounded-xl overflow-hidden border border-red-950 relative">
              <img
                src={CARD_IMAGES.card3}
                alt="Enter Sherlox"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80";
                }}
                className="w-full h-full object-cover filter contrast-[1.15]"
              />
              <div className="absolute bottom-1.5 left-2 font-mono text-[8px] bg-black/90 px-2 py-0.5 rounded text-red-400 border border-red-900/60 uppercase tracking-wider font-bold">
                EXHIBIT // THE SMOKING GUN
              </div>
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
