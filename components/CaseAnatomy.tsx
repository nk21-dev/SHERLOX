"use client";

import React, { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  FileText,
  Users,
  AlertOctagon,
  Sparkles,
  Shield,
  Eye,
  KeyRound,
} from "lucide-react";

export const CaseAnatomy: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll-linked progress for red thread uncoiling
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 65%", "end 85%"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 24,
    restDelta: 0.001,
  });

  return (
    <section
      id="anatomy"
      ref={containerRef}
      className="relative w-full bg-black py-28 sm:py-36 px-6 md:px-16 overflow-hidden z-20"
    >
      {/* Background Ambiance */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-red-950/10 rounded-full blur-[200px] pointer-events-none" />

      {/* Header */}
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center mb-24">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-red-500 font-semibold mb-3">
          // CASE ANATOMY
        </span>
        <h2 className="text-4xl sm:text-6xl font-serif font-light text-zinc-100 tracking-tight leading-[1.08]">
          How a SHERLOX dossier operates.
        </h2>
        <p className="text-zinc-400 text-base md:text-lg max-w-xl leading-relaxed mt-4 font-normal">
          Every file is dissected through a 4-tier forensic sequence, uncoiled through the classified red string.
        </p>
      </div>

      {/* Central Interactive Timeline with SVG Red Thread */}
      <div className="relative max-w-5xl mx-auto">
        {/* Central Vertical SVG Red Thread */}
        <div className="absolute left-6 md:left-1/2 -translate-x-1/2 top-4 bottom-4 w-10 flex justify-center pointer-events-none z-10">
          {/* Background thread track */}
          <div className="w-[2px] h-full bg-zinc-800/60" />

          {/* Active Glowing Uncoiling Red Thread */}
          <svg className="absolute inset-0 w-full h-full overflow-visible">
            <motion.line
              x1="50%"
              y1="0%"
              x2="50%"
              y2="100%"
              stroke="#ef4444"
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{ pathLength: smoothProgress }}
              className="drop-shadow-[0_0_12px_rgba(239,68,68,0.9)]"
            />
          </svg>
        </div>

        {/* 4 Connected Evidence Steps */}
        <div className="space-y-16 sm:space-y-24 relative z-20 pl-12 md:pl-0">
          {/* STEP 1: THE CLASSIFIED BRIEF */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
            <div className="md:w-1/2 md:text-right flex flex-col md:items-end">
              <span className="font-mono text-xs text-red-500 tracking-widest uppercase font-semibold mb-1">
                STEP 01 // OBJECTIVE
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-zinc-100 mb-2">
                The Classified Brief
              </h3>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-md font-normal">
                A high-stakes two-sentence mission statement establishing exactly who lost what, who gained power, and what systemic catastrophe was catalyzed.
              </p>
            </div>

            {/* Central Node Badge */}
            <div className="w-10 h-10 rounded-full bg-zinc-950 border-2 border-red-500 shadow-[0_0_16px_rgba(239,68,68,0.6)] flex items-center justify-center shrink-0 z-20">
              <FileText className="w-4 h-4 text-red-400" />
            </div>

            {/* Card Preview */}
            <div className="md:w-1/2 bg-zinc-950/80 border border-zinc-800 p-6 rounded-2xl shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-2">
                <Shield className="w-3.5 h-3.5 text-red-500" />
                <span>EXECUTIVE MEMORANDUM #01</span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 font-mono leading-relaxed border-l-2 border-red-600/60 pl-3 italic">
                &ldquo;Within 36 hours, private WhatsApp syndicates triggered a $42B flight to liquidity, breaking Silicon Valley&apos;s oldest institutional cornerstone.&rdquo;
              </p>
            </div>
          </div>

          {/* STEP 2: THE SUSPECT LINEUP */}
          <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-8 md:gap-16">
            <div className="md:w-1/2 md:text-left flex flex-col md:items-start">
              <span className="font-mono text-xs text-red-500 tracking-widest uppercase font-semibold mb-1">
                STEP 02 // ACTORS
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-zinc-100 mb-2">
                The Suspect Lineup
              </h3>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-md font-normal">
                Polaroid-style investigative dossiers dissecting key players, contrasting their sworn public stances against verified backchannel leverage.
              </p>
            </div>

            {/* Central Node Badge */}
            <div className="w-10 h-10 rounded-full bg-zinc-950 border-2 border-red-500 shadow-[0_0_16px_rgba(239,68,68,0.6)] flex items-center justify-center shrink-0 z-20">
              <Users className="w-4 h-4 text-red-400" />
            </div>

            {/* Card Preview */}
            <div className="md:w-1/2 bg-zinc-950/80 border border-zinc-800 p-6 rounded-2xl shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-3">
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span>PERSON OF INTEREST // FORENSIC PROFILE</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono p-2 bg-zinc-900/60 rounded border border-zinc-800">
                  <span className="text-zinc-200">Stated Goal:</span>
                  <span className="text-emerald-400">&ldquo;Preserve ecosystem safety&rdquo;</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono p-2 bg-red-950/30 rounded border border-red-900/40">
                  <span className="text-zinc-200">Hidden Motive:</span>
                  <span className="text-red-400 font-semibold">&ldquo;Capital & compute control&rdquo;</span>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 3: THE SMOKING GUN */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
            <div className="md:w-1/2 md:text-right flex flex-col md:items-end">
              <span className="font-mono text-xs text-red-500 tracking-widest uppercase font-semibold mb-1 flex items-center gap-1.5 md:justify-end">
                <AlertOctagon className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                STEP 03 // CATALYST
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-zinc-100 mb-2">
                ⚠️ The Smoking Gun
              </h3>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-md font-normal">
                The exact moment of ignition. An intercepted deposition, a leaked contract clause, or a fatal duration mismatch that made collapse inevitable.
              </p>
            </div>

            {/* Central Node Badge */}
            <div className="w-10 h-10 rounded-full bg-red-600 border-2 border-red-400 shadow-[0_0_25px_rgba(239,68,68,0.9)] flex items-center justify-center shrink-0 z-20 animate-pulse">
              <KeyRound className="w-4 h-4 text-white" />
            </div>

            {/* Card Preview */}
            <div className="md:w-1/2 bg-red-950/40 border border-red-600/70 p-6 rounded-2xl shadow-[0_0_30px_rgba(220,38,38,0.25)] backdrop-blur-md">
              <div className="flex items-center justify-between text-xs font-mono text-red-400 mb-2">
                <span>INCIDENT LOG: ZERO-HOUR</span>
                <span className="bg-red-950 px-2 py-0.5 rounded border border-red-600 text-white font-bold">CRITICAL</span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-200 font-mono leading-relaxed">
                Duration mismatch on $91B in hold-to-maturity bonds hit critical unrealized mark-to-market thresholds, triggering algorithmic margin calls.
              </p>
            </div>
          </div>

          {/* STEP 4: THE DETECTIVE DEDUCTION */}
          <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-8 md:gap-16">
            <div className="md:w-1/2 md:text-left flex flex-col md:items-start">
              <span className="font-mono text-xs text-red-500 tracking-widest uppercase font-semibold mb-1">
                STEP 04 // VERDICT
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-zinc-100 mb-2">
                The Detective Deduction
              </h3>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-md font-normal">
                The final forensic synthesis. The undeniable principle, the historic pattern repeated, and the structural law exposed.
              </p>
            </div>

            {/* Central Node Badge */}
            <div className="w-10 h-10 rounded-full bg-zinc-950 border-2 border-red-500 shadow-[0_0_16px_rgba(239,68,68,0.6)] flex items-center justify-center shrink-0 z-20">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>

            {/* Card Preview */}
            <div className="md:w-1/2 bg-zinc-950/80 border border-zinc-800 p-6 rounded-2xl shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400/90 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>FORENSIC TAKEAWAY</span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 font-serif leading-relaxed italic">
                &ldquo;Bank runs in the telegraph era moved at the speed of stagecoaches. In 2023, bank runs move at the speed of WhatsApp notifications.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

