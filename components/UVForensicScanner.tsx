"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Scan, ShieldAlert, Sparkles, ArrowRight } from "lucide-react";

interface CaseComparison {
  id: string;
  tag: string;
  year: string;
  sanitized: {
    badge: string;
    headline: string;
    statement: string;
    context: string;
  };
  classified: {
    badge: string;
    headline: string;
    statement: string;
    context: string;
    smokingGun: string;
  };
  query: string;
}

const COMPARISON_CASES: CaseComparison[] = [
  {
    id: "SVB-2023",
    tag: "FINANCIAL CASCADE",
    year: "MARCH 2023",
    sanitized: {
      badge: "AUTHORIZED PRESS RELEASE // MARCH 8, 2023",
      headline: "Strategic Balance Sheet Realignment",
      statement:
        '"Silicon Valley Bank announces routine capital realignment to optimize balance sheet stability."',
      context:
        "Official statements downplayed emergency liquidity concerns, assuring depositors that institutional assets remained robust.",
    },
    classified: {
      badge: "SMOKING GUN TRIGGER // LEAKED TELEMETRY",
      headline: "The Hyper-Speed WhatsApp Run",
      statement:
        '[LEAKED WHATSAPP 14:15 PM]: "PULL ALL CAPITAL NOW. $42 BILLION EVAPORATING IN 6 HOURS."',
      context:
        "An unhedged $91B bond bet met instant venture capital coordination. By Friday morning, the bank was seized in negative cash receivership.",
      smokingGun: "Garry Tan & Founders Fund private advisories",
    },
    query: "Silicon Valley Bank liquidity collapse and WhatsApp run",
  },
  {
    id: "KARGIL-1999",
    tag: "GEOPOLITICAL WARFARE",
    year: "MAY 1999",
    sanitized: {
      badge: "MINISTRY BRIEFING // MAY 1999",
      headline: "Local Irregular Border Agitations",
      statement:
        '"Pakistan military spokesmen maintain that irregular local freedom fighters occupy northern Himalayan ridges."',
      context:
        "Government press conferences claimed absolute detachment from military operations across the Line of Control.",
    },
    classified: {
      badge: "MILITARY CONTRADICTION // INTERCEPTED WIRE",
      headline: "Operation Koh Paima Deception",
      statement:
        "[INTERCEPTED BEIJING WIRE]: Direct telephone transcripts between General Musharraf and Lt Gen Aziz proving military authorship.",
      context:
        "Regular Northern Light Infantry troops had secretly occupied 130 fortified Indian winter posts at 16,000 feet without prime ministerial consent.",
      smokingGun: "RAW/NSA recorded phone intercepts in Beijing hotel",
    },
    query: "1999 Kargil strategic timeline and Musharraf phone intercepts",
  },
  {
    id: "OPENAI-2023",
    tag: "CORPORATE COUP",
    year: "NOVEMBER 2023",
    sanitized: {
      badge: "OFFICIAL BLOG POST // NOV 17, 2023",
      headline: "Leadership Transition & Governance",
      statement:
        '"OpenAI board of directors announces a standard leadership transition in alignment with non-profit mission safety."',
      context:
        "Official memo framed the abrupt midday dismissal as deliberate non-profit oversight regarding candor.",
    },
    classified: {
      badge: "HOSTILE COUP // INTERNAL MUTINY",
      headline: "The 72-Hour Weekend Rebellion",
      statement:
        "[CONFIDENTIAL MEMO]: 72-hour board ambush, private mutiny threats, and 95% staff resignation ultimatums.",
      context:
        "Satya Nadella mobilized Microsoft's emergency infrastructure while 700 engineers threatened total exodus to reinstate Sam Altman.",
      smokingGun: "700-signature employee resignation ultimatum",
    },
    query: "OpenAI boardroom coup and Sam Altman return timeline",
  },
];

interface UVForensicScannerProps {
  onSelectCase?: (query: string) => void;
}

export const UVForensicScanner: React.FC<UVForensicScannerProps> = ({
  onSelectCase,
}) => {
  // Slider position from 0 to 100 percentage
  const [sliderPos, setSliderPos] = useState<number>(45);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const tableRef = useRef<HTMLDivElement>(null);

  // Calculate mouse or touch position relative to the table
  const updatePosition = useCallback((clientX: number) => {
    if (!tableRef.current) return;
    const rect = tableRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(percentage);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    updatePosition(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches[0]) {
      updatePosition(e.touches[0].clientX);
    }
  };

  return (
    <section
      id="scanner"
      className="relative z-10 w-full py-28 px-4 sm:px-6 md:px-12 text-white overflow-hidden select-none bg-gradient-to-r from-black via-black/75 to-transparent"
    >
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-red-950/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Section Header */}
      <div className="max-w-4xl mx-auto text-center mb-16 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/80 border border-amber-500/30 text-amber-400 font-mono text-xs tracking-widest uppercase mb-4 shadow-lg">
          <Scan className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
          <span>[ CLASSIFIED FORENSIC INSPECTION // TRUTH SCANNER ]</span>
        </div>

        <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-normal text-zinc-100 tracking-tight leading-tight">
          Sweep the scanner. <br className="hidden sm:inline" />
          <span className="italic text-red-500">Burn away the public lie.</span>
        </h2>

        <p className="mt-4 text-zinc-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-sans">
          Wikipedia and press releases give you sanitized PR. SHERLOX passes an
          ultraviolet forensic beam over the archives to expose what actually went down in private.
        </p>

        {/* Quick Jump Calibration Presets */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mr-1">
            CALIBRATE BEAM:
          </span>
          {[
            { label: "15% SANITIZED PR", pos: 15 },
            { label: "50% FORENSIC SPLIT", pos: 50 },
            { label: "85% FULL X-RAY REVEAL", pos: 85 },
          ].map((preset) => (
            <button
              key={preset.pos}
              onClick={() => setSliderPos(preset.pos)}
              className={`px-3 py-1 rounded-md font-mono text-[10px] tracking-wider uppercase transition-all ${
                Math.abs(sliderPos - preset.pos) < 6
                  ? "bg-red-950 border border-red-600 text-red-300 font-bold shadow-[0_0_10px_rgba(220,38,38,0.3)]"
                  : "bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* The Interactive Lightbox Table */}
      <div
        ref={tableRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onTouchMove={handleTouchMove}
        className="relative max-w-6xl mx-auto bg-zinc-950/85 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 md:p-12 overflow-hidden shadow-2xl cursor-ew-resize group"
      >
        {/* Blueprint Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        {/* Forensic Corner Brackets */}
        <div className="absolute top-4 left-4 font-mono text-zinc-600 text-xs select-none pointer-events-none">
          ┌ REC-365NM // TRUTH-SCAN
        </div>
        <div className="absolute top-4 right-4 font-mono text-zinc-600 text-xs select-none pointer-events-none">
          SEC-03 // DUAL-LAYER ┐
        </div>
        <div className="absolute bottom-4 left-4 font-mono text-zinc-600 text-xs select-none pointer-events-none">
          └ SENSOR: OPTICAL-UV
        </div>
        <div className="absolute bottom-4 right-4 font-mono text-zinc-600 text-xs select-none pointer-events-none">
          SPECTRAL-DENSITY: 99.8% ┘
        </div>

        {/* Header Telemetry Status Bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between pb-6 mb-8 border-b border-zinc-800/80 font-mono text-[10px] tracking-widest text-zinc-500 uppercase">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-zinc-500" />
            <span className="text-zinc-400">LAYER A: SANITIZED PUBLIC PR</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-red-400">
            <Sparkles className="w-3 h-3 text-red-500" />
            <span>BEAM POSITION: {sliderPos.toFixed(0)}%</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="text-red-400 font-semibold">LAYER B: SHERLOX DECLASSIFIED</span>
          </div>
        </div>

        {/* =========================================================================
            THE DUAL-LAYER INSPECTION CANVAS
            ========================================================================= */}
        <div className="relative z-10 min-h-[500px]">
          {/* -----------------------------------------------------------------------
              LAYER 1: "WHAT THE PUBLIC WAS TOLD" (Muted, Sanitized PR)
              ----------------------------------------------------------------------- */}
          <div className="w-full space-y-6">
            {COMPARISON_CASES.map((item) => (
              <div
                key={item.id}
                className="bg-zinc-900/30 border border-zinc-800/60 rounded-2xl p-6 md:p-8 transition-all"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-zinc-500 border border-zinc-800 px-2 py-0.5 rounded uppercase">
                      {item.tag} &bull; {item.year}
                    </span>
                    <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider">
                      {item.sanitized.badge}
                    </span>
                  </div>
                  <span className="font-mono text-[9px] text-zinc-600 uppercase">
                    [ OFFICIAL UNCLASSIFIED RECORD ]
                  </span>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl text-zinc-400 font-normal">
                  {item.sanitized.headline}
                </h3>

                <blockquote className="mt-3 font-sans italic text-zinc-400 text-sm sm:text-base leading-relaxed border-l-2 border-zinc-700 pl-4">
                  {item.sanitized.statement}
                </blockquote>

                <p className="mt-3 text-zinc-500 text-xs sm:text-sm font-sans leading-relaxed">
                  {item.sanitized.context}
                </p>
              </div>
            ))}
          </div>

          {/* -----------------------------------------------------------------------
              LAYER 2: "WHAT SHERLOX UNCOVERS" (The Redacted Reality)
              Revealed strictly to the left of the scanner beam using clipPath!
              ----------------------------------------------------------------------- */}
          <div
            style={{
              clipPath: `inset(0 calc(100% - ${sliderPos}%) 0 0)`,
            }}
            className="absolute inset-0 w-full space-y-6 pointer-events-none transition-[clip-path] duration-75"
          >
            {COMPARISON_CASES.map((item) => (
              <div
                key={item.id}
                className="bg-gradient-to-r from-red-950/60 via-zinc-950/90 to-zinc-950/95 border border-red-600/60 rounded-2xl p-6 md:p-8 shadow-[0_0_35px_rgba(220,38,38,0.18)]"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-red-300 bg-red-950/90 border border-red-600 px-2 py-0.5 rounded uppercase font-semibold">
                      {item.tag} &bull; {item.year}
                    </span>
                    <span className="font-mono text-[10px] text-red-400 uppercase tracking-wider font-bold">
                      {item.classified.badge}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 font-mono text-[9px] text-red-400 bg-red-950/80 border border-red-700/60 px-2 py-0.5 rounded uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    [ FORENSIC PROOF EXPOSED ]
                  </span>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl text-red-100 font-semibold flex items-center gap-2">
                  <span>{item.classified.headline}</span>
                </h3>

                <blockquote className="mt-3 font-mono text-red-300 text-sm sm:text-base font-semibold leading-relaxed border-l-2 border-red-500 pl-4 bg-red-950/30 py-2 rounded-r">
                  {item.classified.statement}
                </blockquote>

                <p className="mt-3 text-zinc-300 text-xs sm:text-sm font-sans leading-relaxed">
                  {item.classified.context}
                </p>

                <div className="mt-4 pt-3 border-t border-red-900/40 flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono text-[11px] text-red-400">
                    <ShieldAlert className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                    <span>SMOKING GUN: {item.classified.smokingGun}</span>
                  </div>

                  {onSelectCase && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCase(item.query);
                      }}
                      className="pointer-events-auto flex items-center gap-1.5 font-mono text-xs text-red-300 hover:text-white px-3 py-1 rounded bg-red-950 hover:bg-red-900 border border-red-600/60 transition-all shadow-md group/btn"
                    >
                      <span>DECRYPT CASE</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* -----------------------------------------------------------------------
              THE SCANNER BEAM: Vertical Glowing Laser Line & Cursor Reticle
              ----------------------------------------------------------------------- */}
          <div
            style={{ left: `${sliderPos}%` }}
            className="absolute top-0 bottom-0 pointer-events-none z-30 transition-[left] duration-75 -translate-x-1/2"
          >
            {/* Vertical Laser Beam with Red Glow */}
            <div className="w-1 h-full bg-gradient-to-b from-transparent via-red-500 to-transparent shadow-[0_0_20px_#ef4444,0_0_40px_#ef4444]" />

            {/* Glowing Center Emitter Node */}
            <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-red-600/30 border border-red-400/80 backdrop-blur-md flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.9)]">
              <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
            </div>

            {/* Floating Handle / Reticle Pill */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-full bg-zinc-950 border border-red-500 text-red-400 font-mono text-[9px] font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(239,68,68,0.7)] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              <span>⌖ UV SCAN // DECLASSIFYING HIDDEN TELEMETRY [ACTIVE]</span>
            </div>

            {/* Bottom Sweep Indicator */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-0.5 rounded bg-zinc-950 border border-zinc-700 text-zinc-400 font-mono text-[8px] uppercase tracking-wider">
              &lang; DRAG SCANNER &rang;
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-10 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left font-mono text-xs text-zinc-500">
          <p>
            Forensic Lightbox Engine &bull; Reconstructing private correspondence, leaked wires, and hidden timelines.
          </p>
          <span className="text-zinc-600">
            HOVER OR DRAG ACROSS TABLE TO REVEAL CLASSIFIED DOSSIERS
          </span>
        </div>
      </div>
    </section>
  );
};

