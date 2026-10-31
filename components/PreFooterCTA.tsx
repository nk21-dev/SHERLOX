"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

interface PreFooterCTAProps {
  onStartInvestigation: () => void;
}

export const PreFooterCTA: React.FC<PreFooterCTAProps> = ({
  onStartInvestigation,
}) => {
  return (
    <section className="relative z-10 w-full py-24 px-6 md:px-16 border-t border-zinc-900/60 bg-gradient-to-b from-transparent via-black/80 to-black text-center overflow-hidden">
      {/* Background Central Crimson Radial Flare */}
      <div className="bg-red-600/10 blur-[120px] w-96 h-96 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full" />

      <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
        {/* Amber Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-900/90 border border-amber-500/30 text-amber-400 font-mono text-xs tracking-widest uppercase mb-2 shadow-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span>[ THE BUREAU IS OPEN // UNLIMITED DECLASSIFICATIONS ]</span>
        </div>

        {/* Editorial Headline */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-light text-zinc-100 mt-4 tracking-tight leading-tight">
          Ready to interrogate <span className="italic text-red-500">history?</span>
        </h2>

        {/* Subtitle */}
        <p className="text-zinc-400 max-w-xl mx-auto mt-4 text-base sm:text-lg leading-relaxed font-sans">
          Step into the interrogation room. Drop any corporate scandal, geopolitical standoff, or ancient enigma into the neural archive.
        </p>

        {/* Action Button */}
        <button
          onClick={onStartInvestigation}
          className="mt-8 inline-flex items-center gap-3 px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-medium text-base rounded-2xl shadow-[0_0_35px_rgba(239,68,68,0.4)] hover:shadow-[0_0_50px_rgba(239,68,68,0.7)] transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer group active:scale-98"
        >
          <span>START INVESTIGATION</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
};

