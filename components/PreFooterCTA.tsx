"use client";

import React from "react";

interface PreFooterCTAProps {
  onStartInvestigation: () => void;
}

export const PreFooterCTA: React.FC<PreFooterCTAProps> = ({
  onStartInvestigation,
}) => {
  return (
    <section className="relative w-full py-8 md:py-10 px-4 md:px-8 z-10">
      <div className="max-w-7xl mx-auto rounded-3xl border border-red-900/40 bg-zinc-950/70 backdrop-blur-xl p-10 md:p-16 text-center shadow-[0_0_50px_rgba(239,68,68,0.15)] relative">
        <h2 className="text-3xl md:text-5xl font-serif text-white font-light">
          Ready to interrogate history?
        </h2>
        <p className="text-zinc-400 max-w-lg mx-auto text-sm md:text-base mt-3">
          Drop any corporate scandal, geopolitical standoff, or ancient enigma into the archive.
        </p>
        <button 
          onClick={onStartInvestigation}
          className="mt-8 px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-medium rounded-xl shadow-lg shadow-red-600/30 transition-all cursor-pointer text-sm"
        >
          Start an Investigation →
        </button>
      </div>
    </section>
  );
};

export default PreFooterCTA;
