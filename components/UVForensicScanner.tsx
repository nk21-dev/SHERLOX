'use client';

import React, { useState, useRef } from 'react';

interface ForensicCase {
  id: string;
  fileNo: string;
  category: string;
  date: string;
  publicCover: {
    agency: string;
    headline: string;
    quote: string;
    stamp: string;
    statement?: string;
  };
  classifiedTruth: {
    source: string;
    headline: string;
    leak: string;
    smokingGun: string;
    stamp: string;
  };
}

const FORENSIC_CASES: ForensicCase[] = [
  {
    id: 'svb',
    fileNo: 'CASE // SVB-0323',
    category: 'FINANCIAL RUN',
    date: 'MARCH 2023',
    publicCover: {
      agency: 'OFFICIAL SEC 8-K FILING',
      headline: 'Routine Balance Sheet Realignment',
      quote: '"Silicon Valley Bank announces routine capital realignment to optimize balance sheet stability. Institutional assets remain robust."',
      stamp: 'OFFICIAL RECORD'
    },
    classifiedTruth: {
      source: 'LEAKED VC TELEGRAM & WHATSAPP NETWORK',
      headline: 'The 10-Hour Twitter Panic',
      leak: '[14:15 PM]: "Pull all capital right now. Don\'t be the last one left holding the bag."',
      smokingGun: 'Panic spread through private founder group chats. $42 Billion was withdrawn in 6 hours, crashing the bank before Monday morning.',
      stamp: 'CONTRADICTION CONFIRMED'
    }
  },
  {
    id: 'kargil',
    fileNo: 'CASE // KGL-0599',
    category: 'DEEP GEOPOLITICS',
    date: 'MAY 1999',
    publicCover: {
      agency: 'FOREIGN MINISTRY PRESS COMMUNIQUÉ',
      headline: 'Independent Local Ridge Incursions',
      quote: '"Spokesmen maintain that independent local freedom fighters occupy northern Himalayan winter ridges without military coordination."',
      stamp: 'DIPLOMATIC STATEMENT'
    },
    classifiedTruth: {
      source: 'INTERCEPTED BEIJING-ISLAMABAD TELEPHONE WIRETAP',
      headline: 'Operation Koh Paima Deception',
      leak: '[AUDIO INTERCEPT]: Telephone transcripts between General Musharraf and his Chief of Staff proving direct army authorship.',
      smokingGun: 'R&AW intercepted the satellite call while Musharraf was visiting China, definitively proving regular army soldiers held the peaks.',
      stamp: 'MILITARY AUTHENTICATED'
    }
  },
  {
    id: 'openai',
    fileNo: 'CASE // OAI-1123',
    category: 'CORPORATE MUTINY',
    date: 'NOVEMBER 2023',
    publicCover: {
      agency: 'OFFICIAL BOARD ANNOUNCEMENT',
      headline: 'Governance & Leadership Transition',
      statement: '"The board of directors announces a standard leadership transition in alignment with non-profit safety mission and candor."',
      quote: '"The board of directors announces a standard leadership transition in alignment with non-profit mission safety."',
      stamp: 'BOARD STATEMENT'
    },
    classifiedTruth: {
      source: 'CONFIDENTIAL RESIGNATION ULTIMATUM',
      headline: '72-Hour Staff Revolt',
      leak: '[MUTINY PETITION]: "Reinstate the CEO by Monday morning, or the entire research lab resigns today."',
      smokingGun: 'Over 700 of 770 employees signed the resignation threat, backed by Microsoft, forcing the non-profit board to dissolve instead.',
      stamp: 'HOSTILE TAKEOVER'
    }
  }
];

interface UVForensicScannerProps {
  onSelectCase?: (query: string) => void;
}

export const UVForensicScanner: React.FC<UVForensicScannerProps> = () => {
  const [beamX, setBeamX] = useState<number>(50); // percentage 0 - 100
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setBeamX(pct);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || !e.touches[0]) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const pct = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setBeamX(pct);
  };

  return (
    <section id="scanner" className="relative w-full py-16 px-4 md:px-8 z-10 select-none">
      {/* Master Framed Lightbox Container */}
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="max-w-7xl mx-auto rounded-3xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-2xl p-6 md:p-12 shadow-[0_30px_90px_rgba(0,0,0,0.95)] relative overflow-hidden cursor-crosshair"
      >
        
        {/* Subtle Cyber-Blueprint Background Dots */}
        <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

        {/* SECTION HEADER WITH NEON BADGE */}
        <div className="text-center max-w-3xl mx-auto mb-12 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/40 border border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.2)] mb-3">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="font-mono text-xs text-red-400 tracking-[0.25em] uppercase font-bold">
              UV TRUTH SCANNER // 365nm SPECTRUM
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-white tracking-tight mt-1">
            Sweep the scanner. <span className="italic text-red-500 font-normal">Burn away the public lie.</span>
          </h2>

          <p className="text-zinc-400 text-sm md:text-base mt-2 font-sans">
            Press releases exist to protect reputations. Glide your cursor across the files to expose the private chats, wiretaps, and hidden moves they tried to bury.
          </p>
        </div>

        {/* 3 STACKED FORENSIC DOSSIER CARDS */}
        <div className="flex flex-col gap-8 relative z-10">
          {FORENSIC_CASES.map((item) => (
            <div 
              key={item.id}
              className="relative w-full rounded-2xl border border-zinc-800/90 bg-zinc-900/40 overflow-hidden shadow-2xl group transition-all duration-300"
            >
              
              {/* TOP CASE META BAR */}
              <div className="flex items-center justify-between px-6 py-2.5 bg-zinc-950 border-b border-zinc-800/80 font-mono text-[10px] text-zinc-500">
                <div className="flex items-center gap-3">
                  <span className="text-red-500 font-bold tracking-widest">{item.fileNo}</span>
                  <span className="text-zinc-700">•</span>
                  <span className="text-zinc-400 uppercase tracking-wider">{item.category}</span>
                </div>
                <span className="tracking-wider">{item.date}</span>
              </div>

              {/* DUAL-PANE FORENSIC COMPARISON */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-800/80 relative">
                
                {/* PANE 1: THE PUBLIC COVER STORY */}
                <div className="p-6 md:p-8 flex flex-col justify-between bg-zinc-950/40 relative">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[10px] text-zinc-500 tracking-wider uppercase font-semibold">
                        [ {item.publicCover.agency} ]
                      </span>
                      <span className="font-mono text-[9px] text-zinc-600 border border-zinc-800 px-2 py-0.5 rounded uppercase">
                        {item.publicCover.stamp}
                      </span>
                    </div>

                    <h3 className="text-xl md:text-2xl font-serif text-zinc-200 mb-3">
                      {item.publicCover.headline}
                    </h3>

                    <p className="text-zinc-400 text-sm md:text-base italic leading-relaxed">
                      {item.publicCover.quote}
                    </p>
                  </div>

                  <div className="pt-4 mt-6 border-t border-zinc-900 font-mono text-[9px] text-zinc-600 uppercase">
                    STATUS: SANITIZED // CONTRADICTED BY EVIDENCE
                  </div>
                </div>

                {/* PANE 2: THE SMOKING GUN (GLOWING CRIMSON FORENSIC REALITY) */}
                <div 
                  className="p-6 md:p-8 flex flex-col justify-between bg-gradient-to-br from-red-950/20 via-zinc-950 to-zinc-950 relative border-l border-red-500/20"
                >
                  {/* Subtle thermal crimson ambient glow */}
                  <div className="absolute right-0 top-0 bottom-0 w-3/4 bg-red-600/[0.04] pointer-events-none" />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[10px] text-red-500 tracking-wider uppercase font-bold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        {item.classifiedTruth.source}
                      </span>
                      <span className="font-mono text-[9px] text-red-400 bg-red-950/50 border border-red-600/40 px-2 py-0.5 rounded uppercase font-bold">
                        {item.classifiedTruth.stamp}
                      </span>
                    </div>

                    <h3 className="text-xl md:text-2xl font-serif text-red-400 mb-3">
                      {item.classifiedTruth.headline}
                    </h3>

                    <div className="p-3.5 rounded-xl bg-black/60 border border-red-600/30 text-red-200 font-mono text-xs leading-relaxed mb-3">
                      {item.classifiedTruth.leak}
                    </div>

                    <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
                      {item.classifiedTruth.smokingGun}
                    </p>
                  </div>

                  <div className="relative z-10 pt-4 mt-6 border-t border-red-950/60 flex items-center justify-between font-mono text-[9px] text-red-500/80 uppercase font-bold">
                    <span>EVIDENCE VERIFIED</span>
                    <span>100% CORRELATED</span>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* DYNAMIC LASER BEAM TRACKING CURSOR */}
        <div
          style={{ left: `${beamX}%` }}
          className="absolute top-0 bottom-0 w-[2px] bg-red-500 shadow-[0_0_25px_rgba(239,68,68,1)] pointer-events-none z-30 transition-[left] duration-75 ease-out hidden md:block"
        >
          <div className="absolute top-20 -translate-x-1/2 px-3 py-1 rounded-full bg-red-600 text-white font-mono text-[9px] font-bold tracking-widest shadow-[0_0_15px_rgba(239,68,68,0.9)] border border-red-400 flex items-center gap-1.5 whitespace-nowrap">
            <span>⌖</span>
            <span>UV BEAM // {Math.round(beamX)}% SPECTRUM</span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default UVForensicScanner;
