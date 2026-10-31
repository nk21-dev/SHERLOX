'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ForensicDossier {
  id: string;
  fileNo: string;
  category: string;
  date: string;
  publicStory: {
    source: string;
    title: string;
    statement: string;
  };
  smokingGun: {
    title: string;
    leak: string;
    context: string;
  };
}

const DOSSIERS: ForensicDossier[] = [
  {
    id: 'svb',
    fileNo: 'CASE // SVB-0323',
    category: 'FINANCIAL COLLAPSE',
    date: 'MARCH 2023',
    publicStory: {
      source: 'OFFICIAL SEC 8-K FILING',
      title: 'Routine Balance Sheet Realignment',
      statement: '"Silicon Valley Bank announces routine capital realignment to optimize balance sheet stability. Depositor assets remain secure and robust."'
    },
    smokingGun: {
      title: 'The 10-Hour WhatsApp Bank Run',
      leak: '[14:15 PM PRIVATE VC NETWORK]: "Pull all capital right now. Don\'t be the last one left holding the bag."',
      context: 'Panic spread across private founder group chats. $42 Billion was pulled out in under 10 hours, forcing federal regulators to seize the bank.'
    }
  },
  {
    id: 'kargil',
    fileNo: 'CASE // KGL-0599',
    category: 'GEOPOLITICAL WARFARE',
    date: 'MAY 1999',
    publicStory: {
      source: 'MINISTRY PRESS BRIEFING',
      title: 'Independent Local Ridge Incursions',
      statement: '"Government spokesmen maintain that independent local freedom fighters occupy northern Himalayan ridges without regular military coordination."'
    },
    smokingGun: {
      title: 'Operation Koh Paima Deception',
      leak: '[AUDIO INTERCEPT // BEIJING]: Telephone transcripts between General Musharraf and his Chief of Staff proving direct army authorship.',
      context: 'R&AW intercepted the satellite phone call while Musharraf was in China, proving that regular Northern Light Infantry soldiers held the heights.'
    }
  },
  {
    id: 'openai',
    fileNo: 'CASE // OAI-1123',
    category: 'CORPORATE MUTINY',
    date: 'NOVEMBER 2023',
    publicStory: {
      source: 'OFFICIAL BOARD ANNOUNCEMENT',
      title: 'Governance & Leadership Transition',
      statement: '"The board announces a standard leadership transition in alignment with non-profit safety mission and candor in communications."'
    },
    smokingGun: {
      title: 'The 72-Hour Staff Revolt',
      leak: '[MUTINY ULTIMATUM]: "Reinstate the CEO by Monday morning, or the entire research lab walks today."',
      context: 'Over 700 of 770 employees signed a joint resignation letter within 48 hours, backed by Microsoft, forcing the board to dissolve instead.'
    }
  }
];

interface UVForensicScannerProps {
  onSelectCase?: (query: string) => void;
}

export const UVForensicScanner: React.FC<UVForensicScannerProps> = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <section id="scanner" className="relative w-full py-16 px-4 md:px-8 z-10 select-none">
      <div className="max-w-7xl mx-auto rounded-3xl border border-zinc-800/80 bg-zinc-950/70 backdrop-blur-xl p-6 md:p-12 shadow-[0_30px_90px_rgba(0,0,0,0.9)] relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/40 border border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.2)] mb-3">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="font-mono text-xs text-red-400 tracking-[0.25em] uppercase font-bold">
              // FORENSIC TRUTH SCANNER
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-white tracking-tight mt-1">
            The Public Story <span className="italic text-red-500 font-normal">vs. What Actually Happened.</span>
          </h2>

          <p className="text-zinc-400 text-sm md:text-base mt-2 font-sans font-light">
            Press releases exist to protect reputations. Hover over any case file to uncover the leaked messages and intercepted wires.
          </p>
        </div>

        {/* 3 Stacked Classified Dossier Cards */}
        <div className="flex flex-col gap-8">
          {DOSSIERS.map((item) => {
            const isHovered = hoveredCard === item.id;

            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredCard(item.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`relative w-full rounded-2xl border transition-all duration-300 overflow-hidden bg-zinc-950/90 shadow-2xl ${
                  isHovered 
                    ? 'border-red-500/60 shadow-[0_0_40px_rgba(239,68,68,0.2)]' 
                    : 'border-zinc-800/80 hover:border-zinc-700'
                }`}
              >
                {/* Active Laser Sweep on Hover */}
                {isHovered && (
                  <motion.div
                    initial={{ top: '-10%' }}
                    animate={{ top: '110%' }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
                    className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_15px_rgba(239,68,68,0.9)] z-20 pointer-events-none"
                  />
                )}

                {/* Card Top Metadata Header */}
                <div className="flex items-center justify-between px-6 py-3 bg-zinc-950 border-b border-zinc-900 font-mono text-[11px] text-zinc-500">
                  <div className="flex items-center gap-3">
                    <span className="text-red-500 font-bold tracking-widest">{item.fileNo}</span>
                    <span className="text-zinc-700">•</span>
                    <span className="text-zinc-400 font-semibold">{item.category}</span>
                  </div>
                  <span>{item.date}</span>
                </div>

                {/* Card Content Split */}
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-900">
                  
                  {/* LEFT PANE: WHAT THEY TOLD THE PUBLIC */}
                  <div className="p-6 md:p-8 flex flex-col justify-between bg-zinc-950/50">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-[10px] text-zinc-500 tracking-wider uppercase font-semibold">
                          [ {item.publicStory.source} ]
                        </span>
                        <span className="text-[9px] font-mono text-zinc-600 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                          SANITIZED PR
                        </span>
                      </div>

                      <h3 className="text-xl md:text-2xl font-serif text-zinc-200 mb-3">
                        {item.publicStory.title}
                      </h3>

                      <p className="text-zinc-400 text-sm md:text-base italic leading-relaxed">
                        {item.publicStory.statement}
                      </p>
                    </div>

                    <div className="pt-4 mt-6 border-t border-zinc-900/80 font-mono text-[10px] text-zinc-600 uppercase">
                      STATUS: OFFICIAL MEDIA ARCHIVE
                    </div>
                  </div>

                  {/* RIGHT PANE: THE SMOKING GUN (CLASSIFIED TRUTH) */}
                  <div className="p-6 md:p-8 flex flex-col justify-between bg-gradient-to-br from-red-950/20 via-zinc-950 to-zinc-950 relative">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-[10px] text-red-500 tracking-wider uppercase font-bold flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                          THE SMOKING GUN EVIDENCE
                        </span>
                        <span className="text-[9px] font-mono text-red-400 bg-red-950/50 px-2 py-0.5 rounded border border-red-800/60 font-bold uppercase">
                          VERIFIED TRUTH
                        </span>
                      </div>

                      <h3 className="text-xl md:text-2xl font-serif text-red-400 mb-3">
                        {item.smokingGun.title}
                      </h3>

                      {/* Leaked Transcript Highlight Box */}
                      <div className="p-4 rounded-xl bg-black/70 border border-red-600/40 text-red-200 font-mono text-xs md:text-sm leading-relaxed mb-3 shadow-inner">
                        {item.smokingGun.leak}
                      </div>

                      <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
                        {item.smokingGun.context}
                      </p>
                    </div>

                    <div className="pt-4 mt-6 border-t border-red-950/60 flex items-center justify-between font-mono text-[10px] text-red-500/80 uppercase font-semibold">
                      <span>DECRYPTED BY SHERLOX</span>
                      <span>100% CORRELATED</span>
                    </div>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default UVForensicScanner;
