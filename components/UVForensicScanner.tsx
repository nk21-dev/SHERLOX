'use client';

import React, { useState, useRef, useCallback } from 'react';

interface CaseItem {
  id: string;
  topic: string;
  date: string;
  publicStory: {
    badge: string;
    headline: string;
    statement: string;
    footnote: string;
  };
  classifiedTruth: {
    badge: string;
    headline: string;
    leak: string;
    evidence: string;
  };
}

const CASES: CaseItem[] = [
  {
    id: 'svb',
    topic: 'Silicon Valley Bank Collapse',
    date: 'March 2023',
    publicStory: {
      badge: 'OFFICIAL PR STATEMENT',
      headline: 'Strategic Balance Sheet Realignment',
      statement: '"Silicon Valley Bank announces routine capital realignment to optimize balance sheet stability. Client deposits and institutional assets remain robust."',
      footnote: 'Filed with Securities & Exchange Commission'
    },
    classifiedTruth: {
      badge: '⚠️ THE SMOKING GUN // LEAKED TRANSCRIPT',
      headline: 'The 10-Hour Twitter & WhatsApp Run',
      leak: '[14:15 PM PRIVATE VC CHAT]: "Pull all capital right now. Don\'t be the last one holding the bag."',
      evidence: 'Within 6 hours, panicked founders withdrew $42 Billion. By Friday morning, the bank was seized in negative cash.'
    }
  },
  {
    id: 'kargil',
    topic: 'The 1999 Kargil Standoff',
    date: 'May 1999',
    publicStory: {
      badge: 'OFFICIAL MILITARY COMMUNIQUÉ',
      headline: 'Local Irregular Border Agitations',
      statement: '"Spokesmen maintain that independent local freedom fighters occupy northern Himalayan winter ridges beyond the Line of Control."',
      footnote: 'Official Foreign Ministry Press Briefing'
    },
    classifiedTruth: {
      badge: '⚠️ INTERCEPTED MILITARY WIRETAP',
      headline: 'Operation Koh Paima Deception',
      leak: '[INTERCEPTED BEIJING WIRE]: Telephone transcripts between General Musharraf and his Chief of Staff proving direct army authorship.',
      evidence: 'Regular Northern Light Infantry soldiers had occupied 130 fortified Indian winter posts without civilian cabinet consent.'
    }
  },
  {
    id: 'openai',
    topic: 'The OpenAI Boardroom Firing',
    date: 'November 2023',
    publicStory: {
      badge: 'OFFICIAL BLOG RELEASE',
      headline: 'Leadership Transition & Governance',
      statement: '"The board of directors announces a standard leadership transition in alignment with non-profit safety mission and fiduciary duty."',
      footnote: 'Official OpenAI Board Communication'
    },
    classifiedTruth: {
      badge: '⚠️ THE 72-HOUR REBELLION',
      headline: 'Ambush, Firing & Staff Mutiny',
      leak: '[CONFIDENTIAL ULTIMATUM]: "Reinstate the CEO by Monday morning, or the entire research lab walks."',
      evidence: 'Over 700 employees signed a joint resignation letter within 48 hours, forcing the board members to resign instead.'
    }
  }
];

interface UVForensicScannerProps {
  onSelectCase?: (query: string) => void;
}

export const UVForensicScanner: React.FC<UVForensicScannerProps> = ({ onSelectCase }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 to 100
  const [isDragging, setIsDragging] = useState(false);
  const scannerRef = useRef<HTMLDivElement>(null);

  const activeCase = CASES[activeTab];

  const handleMove = useCallback((clientX: number) => {
    if (!scannerRef.current) return;
    const rect = scannerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clampedPercentage = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(clampedPercentage);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    handleMove(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    e.stopPropagation();
    handleMove(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    e.stopPropagation();
    setIsDragging(false);
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
            Slide the laser across to burn away the official press release and reveal the leaked reality beneath.
          </p>
        </div>

        {/* Case Switcher Tabs */}
        <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
          {CASES.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(idx)}
              className={`px-4 py-2 rounded-xl font-mono text-xs transition-all cursor-pointer ${
                activeTab === idx
                  ? 'bg-red-950/60 border border-red-600/80 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                  : 'bg-zinc-900/60 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {item.topic}
            </button>
          ))}
        </div>

        {/* The X-Ray Scanner Display Box */}
        <div
          ref={scannerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="relative w-full min-h-[380px] md:min-h-[340px] rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden cursor-ew-resize touch-none shadow-2xl"
        >
          {/* LAYER 1 (BASE): THE PUBLIC SANITIZED PR STORY */}
          <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between bg-zinc-900/70 text-zinc-300 pointer-events-none">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
                <span className="font-mono text-[10px] text-zinc-500 tracking-wider uppercase font-semibold">
                  {activeCase.publicStory.badge}
                </span>
                <span className="font-mono text-[10px] text-zinc-500">{activeCase.date}</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-serif text-white mb-4">
                {activeCase.publicStory.headline}
              </h3>
              <p className="text-zinc-400 text-base md:text-lg italic leading-relaxed max-w-xl">
                {activeCase.publicStory.statement}
              </p>
            </div>
            <div className="pt-4 border-t border-zinc-800/80 font-mono text-[10px] text-zinc-600 uppercase">
              STATUS: SANITIZED // {activeCase.publicStory.footnote}
            </div>
          </div>

          {/* LAYER 2 (TOP / REVEALED): THE CLASSIFIED FORENSIC REALITY */}
          <div
            style={{
              clipPath: `inset(0 0 0 ${sliderPos}%)`,
            }}
            className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between bg-zinc-950 text-white pointer-events-none border-l border-red-500"
          >
            {/* Subtle red ambient glow behind the revealed truth */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-red-950/15 pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between border-b border-red-950/60 pb-3 mb-4">
                <span className="font-mono text-[10px] text-red-500 tracking-wider uppercase font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  {activeCase.classifiedTruth.badge}
                </span>
                <span className="font-mono text-[10px] text-red-400/80">EVIDENCE CONFIRMED</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-serif text-red-400 mb-4">
                {activeCase.classifiedTruth.headline}
              </h3>
              <p className="text-red-200 text-base md:text-lg font-medium leading-relaxed max-w-xl">
                {activeCase.classifiedTruth.leak}
              </p>
              <p className="text-zinc-400 text-sm mt-3 leading-relaxed max-w-xl">
                {activeCase.classifiedTruth.evidence}
              </p>
            </div>
            <div className="relative z-10 pt-4 border-t border-red-950/60 font-mono text-[10px] text-red-500/80 uppercase font-bold">
              FORENSIC DECRYPTION // RAW INTERCEPTED TELEMETRY
            </div>
          </div>

          {/* THE GLOWING LASER BEAM SLIDER HANDLE */}
          <div
            style={{ left: `${sliderPos}%` }}
            className="absolute top-0 bottom-0 w-[2px] bg-red-500 shadow-[0_0_20px_rgba(239,68,68,1)] pointer-events-none z-30"
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-red-600 text-white font-mono text-[10px] font-bold tracking-widest shadow-[0_0_15px_rgba(239,68,68,0.8)] border border-red-400 flex items-center gap-1 whitespace-nowrap">
              <span>⟷</span>
              <span>SLIDE TO REVEAL</span>
            </div>
          </div>

        </div>

        {/* Optional Action: Deep Dive Button below the scanner box if user wants to investigate */}
        {onSelectCase && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => onSelectCase(activeCase.topic)}
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900/80 hover:bg-red-950/40 border border-zinc-800 hover:border-red-500/50 text-zinc-300 hover:text-white font-mono text-xs transition-all cursor-pointer shadow-lg"
            >
              <span>DEEP DIVE INVESTIGATION: {activeCase.topic.toUpperCase()}</span>
              <span className="text-red-400 group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        )}

      </div>
    </section>
  );
};

export default UVForensicScanner;
