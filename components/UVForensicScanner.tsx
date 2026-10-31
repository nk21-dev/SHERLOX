'use client';

import React, { useState, useRef } from 'react';

const COMPARISON_CASES = [
  {
    topic: "Silicon Valley Bank Collapse",
    date: "March 2023",
    publicLie: {
      headline: "The Official Press Release",
      quote: '"We are executing routine capital adjustments to strengthen our balance sheet and ensure client stability."'
    },
    hiddenTruth: {
      headline: "The Private Group Chats",
      quote: '"Pull all your money out right now. Don\'t be the last one left holding the bag."',
      fact: "In under 10 hours, private founder WhatsApp groups triggered a $42 Billion bank run."
    }
  },
  {
    topic: "The 1999 Kargil Standoff",
    date: "May 1999",
    publicLie: {
      headline: "The Official Briefing",
      quote: '"The government maintains that only local independent fighters occupy the northern Himalayan heights."'
    },
    hiddenTruth: {
      headline: "The Intercepted Wiretap",
      quote: '"The Army Chief personally approved the ridge incursions while traveling abroad in Beijing."',
      fact: "Leaked phone transcripts between General Musharraf and his Chief of Staff proved direct military command."
    }
  },
  {
    topic: "The OpenAI Boardroom Firing",
    date: "November 2023",
    publicLie: {
      headline: "The Official Blog Post",
      quote: '"The board of directors announces a planned leadership transition in alignment with non-profit safety mission."'
    },
    hiddenTruth: {
      headline: "The 72-Hour Mutiny",
      quote: '"Bring the CEO back by Monday morning, or the entire company resigns today."',
      fact: "Over 700 employees signed a joint resignation ultimatum within 48 hours, forcing the board out."
    }
  }
];

interface UVForensicScannerProps {
  onSelectCase?: (query: string) => void;
}

export const UVForensicScanner: React.FC<UVForensicScannerProps> = ({ onSelectCase }) => {
  const [sliderPos, setSliderPos] = useState(50); // 0 to 100%
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const updateSlider = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = Math.round((x / rect.width) * 100);
    setSliderPos(percentage);
  };

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) {
      updateSlider(e.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      updateSlider(e.touches[0].clientX);
    }
  };

  return (
    <section id="scanner" className="relative w-full py-16 px-4 md:px-8 z-10 select-none">
      <div className="max-w-7xl mx-auto rounded-3xl border border-zinc-800/80 bg-zinc-950/70 backdrop-blur-xl p-6 md:p-12 shadow-2xl relative">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="font-mono text-xs text-red-500 tracking-[0.25em] uppercase font-bold">
            // THE REALITY SCANNER
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-white tracking-tight mt-2">
            The Public Story <span className="italic text-red-500 font-normal">vs. What Actually Happened.</span>
          </h2>
          <p className="text-zinc-400 text-sm md:text-base mt-3 leading-relaxed font-sans font-light">
            Press releases exist to protect reputations. Drag the slider across to see the private chats, wiretaps, and hidden moves they tried to bury.
          </p>
        </div>

        {/* Column Labels */}
        <div className="flex items-center justify-between text-xs font-mono tracking-wider uppercase pb-3 border-b border-zinc-900 mb-6 px-2">
          <span className="text-zinc-500">← WHAT THEY TOLD THE PUBLIC</span>
          <span className="text-red-400 font-semibold">WHAT WAS HAPPENING IN PRIVATE →</span>
        </div>

        {/* The Interactive Comparison Table */}
        <div 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchMove={handleTouchMove}
          onClick={(e) => updateSlider(e.clientX)}
          className="relative w-full rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden cursor-ew-resize py-4"
        >
          {/* Comparison Rows */}
          <div className="flex flex-col divide-y divide-zinc-800/80">
            {COMPARISON_CASES.map((item, idx) => (
              <div 
                key={idx} 
                onClick={() => onSelectCase?.(item.topic)}
                className={`relative py-6 px-6 md:px-8 transition-colors ${onSelectCase ? 'hover:bg-zinc-800/20' : ''}`}
              >
                {/* Topic Header */}
                <div className="flex items-center justify-between text-xs font-mono text-zinc-500 mb-3">
                  <span className="text-zinc-300 font-semibold uppercase">{item.topic}</span>
                  <span>{item.date}</span>
                </div>

                {/* 2-Column Responsive View */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  
                  {/* Left: Sanitized PR */}
                  <div className="flex flex-col gap-1.5 pr-4 border-r border-zinc-800/50">
                    <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
                      Official Press Release
                    </span>
                    <p className="text-zinc-300 text-sm md:text-base italic leading-relaxed">
                      {item.publicLie.quote}
                    </p>
                  </div>

                  {/* Right: The Uncovered Truth */}
                  <div className="flex flex-col gap-1.5 pl-0 md:pl-4">
                    <span className="text-[11px] font-mono text-red-500 uppercase tracking-wider font-semibold">
                      The Real Truth
                    </span>
                    <p className="text-red-400 text-sm md:text-base font-medium leading-relaxed">
                      {item.hiddenTruth.quote}
                    </p>
                    <p className="text-zinc-400 text-xs mt-1 leading-normal">
                      {item.hiddenTruth.fact}
                    </p>
                  </div>

                </div>

              </div>
            ))}
          </div>

          {/* Draggable Divider Handle */}
          <div 
            style={{ left: `${sliderPos}%` }}
            className="absolute top-0 bottom-0 w-[2px] bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.9)] pointer-events-none hidden md:block"
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full bg-red-600 text-white font-mono text-[9px] font-bold tracking-widest shadow-xl flex items-center gap-1 whitespace-nowrap">
              <span>⟷</span>
              <span>SLIDE</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default UVForensicScanner;
