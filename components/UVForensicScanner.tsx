'use client';

import React, { useState, useRef } from 'react';

interface ComparisonCase {
  id: string;
  topic: string;
  date: string;
  publicLie: {
    label: string;
    headline: string;
    statement: string;
  };
  classifiedTruth: {
    label: string;
    headline: string;
    leak: string;
    fact: string;
  };
}

const CASES: ComparisonCase[] = [
  {
    id: 'svb',
    topic: 'Silicon Valley Bank Collapse',
    date: 'March 2023',
    publicLie: {
      label: 'OFFICIAL PRESS RELEASE',
      headline: 'Strategic Balance Sheet Realignment',
      statement: '"Silicon Valley Bank announces routine capital adjustments to optimize balance sheet stability. Institutional assets remain robust."'
    },
    classifiedTruth: {
      label: '⚠️ LEAKED PRIVATE CHATS',
      headline: 'The 10-Hour Group Chat Run',
      leak: '[14:15 PM PRIVATE VC CHAT]: "Pull all capital right now. Don\'t be the last one left holding the bag."',
      fact: 'Within 6 hours, panicked founders withdrew $42 Billion, forcing regulators to seize the bank.'
    }
  },
  {
    id: 'kargil',
    topic: 'The 1999 Kargil Standoff',
    date: 'May 1999',
    publicLie: {
      label: 'OFFICIAL COMMUNIQUÉ',
      headline: 'Local Irregular Border Agitations',
      statement: '"Spokesmen maintain that only independent local freedom fighters occupy northern Himalayan winter ridges."'
    },
    classifiedTruth: {
      label: '⚠️ INTERCEPTED WIRETAP',
      headline: 'Operation Koh Paima Deception',
      leak: '[INTERCEPTED BEIJING WIRE]: Direct telephone transcripts between General Musharraf and his Chief of Staff proving military command.',
      fact: 'Regular Northern Light Infantry soldiers had occupied 130 fortified Indian winter posts without civilian cabinet consent.'
    }
  },
  {
    id: 'openai',
    topic: 'The OpenAI Boardroom Firing',
    date: 'November 2023',
    publicLie: {
      label: 'OFFICIAL BLOG RELEASE',
      headline: 'Leadership Transition & Governance',
      statement: '"The board of directors announces a standard leadership transition in alignment with non-profit safety mission and fiduciary duty."'
    },
    classifiedTruth: {
      label: '⚠️ THE 72-HOUR REBELLION',
      headline: 'Ambush, Firing & Staff Mutiny',
      leak: '[CONFIDENTIAL ULTIMATUM]: "Reinstate the CEO by Monday morning, or the entire research lab walks."',
      fact: 'Over 700 employees signed a joint resignation letter within 48 hours, forcing the board members out instead.'
    }
  }
];

interface UVForensicScannerProps {
  onSelectCase?: (query: string) => void;
}

export const UVForensicScanner: React.FC<UVForensicScannerProps> = () => {
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 to 100
  const containerRef = useRef<HTMLDivElement>(null);

  // Hyper-sensitive cursor tracking: moving mouse instantly glides the laser
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(3, Math.min(97, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || !e.touches[0]) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = Math.max(3, Math.min(97, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  return (
    <section id="scanner" className="relative w-full py-16 px-4 md:px-8 z-10 select-none">
      <div className="max-w-7xl mx-auto rounded-3xl border border-zinc-800/80 bg-zinc-950/70 backdrop-blur-xl p-6 md:p-12 shadow-2xl relative">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="font-mono text-xs text-red-500 tracking-[0.25em] uppercase font-bold">
            // THE REALITY SCANNER
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-white tracking-tight mt-2">
            The Public Story <span className="italic text-red-500 font-normal">vs. What Actually Happened.</span>
          </h2>
          <p className="text-zinc-400 text-sm md:text-base mt-2 font-sans font-light">
            Glide your mouse across the files to burn away the polite press release and reveal the raw truth underneath.
          </p>
        </div>

        {/* Master Comparison Box (All 3 Cases Stacked Vertically) */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          className="relative w-full rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden cursor-crosshair shadow-2xl"
        >
          {/* ========================================================= */}
          {/* LAYER 1: BASE LAYER (THE SANITIZED PUBLIC PR STATEMENTS)  */}
          {/* ========================================================= */}
          <div className="w-full flex flex-col divide-y divide-zinc-800/80 bg-zinc-900/60 text-zinc-300 pointer-events-none">
            {CASES.map((item) => (
              <div key={item.id} className="p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-3">
                    <span className="font-mono text-[10px] text-zinc-500 tracking-wider uppercase font-semibold">
                      {item.publicLie.label}
                    </span>
                    <span className="font-mono text-[10px] text-zinc-500">{item.date}</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-serif text-white mb-2">
                    {item.topic}
                  </h3>
                  <p className="text-zinc-400 text-sm md:text-base italic leading-relaxed max-w-2xl">
                    {item.publicLie.statement}
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-zinc-800/60 font-mono text-[9px] text-zinc-600 uppercase">
                  STATUS: OFFICIAL ARCHIVE RECORD
                </div>
              </div>
            ))}
          </div>

          {/* ========================================================= */}
          {/* LAYER 2: REVEALED LAYER (THE CLASSIFIED FORENSIC REALITY) */}
          {/* ========================================================= */}
          <div
            style={{
              clipPath: `inset(0 0 0 ${sliderPos}%)`,
            }}
            className="absolute inset-0 w-full h-full flex flex-col divide-y divide-red-950/80 bg-zinc-950 text-white pointer-events-none"
          >
            {CASES.map((item) => (
              <div key={item.id} className="p-6 md:p-8 flex flex-col justify-between relative bg-zinc-950">
                {/* Subtle red glow in revealed area */}
                <div className="absolute right-0 top-0 bottom-0 w-3/4 bg-red-950/15 pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between border-b border-red-950/60 pb-2 mb-3">
                    <span className="font-mono text-[10px] text-red-500 tracking-wider uppercase font-bold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                      {item.classifiedTruth.label}
                    </span>
                    <span className="font-mono text-[10px] text-red-400/80">EVIDENCE CONFIRMED</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-serif text-red-400 mb-2">
                    {item.classifiedTruth.headline}
                  </h3>
                  <p className="text-red-200 text-sm md:text-base font-medium leading-relaxed max-w-2xl">
                    {item.classifiedTruth.leak}
                  </p>
                  <p className="text-zinc-400 text-xs md:text-sm mt-2 leading-relaxed max-w-2xl">
                    {item.classifiedTruth.fact}
                  </p>
                </div>

                <div className="relative z-10 pt-3 mt-3 border-t border-red-950/60 font-mono text-[9px] text-red-500/80 uppercase font-bold">
                  FORENSIC TRUTH DECLASSIFIED
                </div>
              </div>
            ))}
          </div>

          {/* ========================================================= */}
          {/* THE GLOWING LASER BEAM (INSTANT CURSOR TRACKING)          */}
          {/* ========================================================= */}
          <div
            style={{ left: `${sliderPos}%` }}
            className="absolute top-0 bottom-0 w-[2px] bg-red-500 shadow-[0_0_20px_rgba(239,68,68,1)] pointer-events-none z-30 transition-[left] duration-75 ease-out"
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-red-600 text-white font-mono text-[10px] font-bold tracking-widest shadow-[0_0_15px_rgba(239,68,68,0.9)] border border-red-400 flex items-center gap-1.5 whitespace-nowrap">
              <span>⌖</span>
              <span>UNMASK TRUTH</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default UVForensicScanner;
