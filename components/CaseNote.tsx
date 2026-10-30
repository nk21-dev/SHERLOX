"use client";

import React from "react";
import { CaseNoteResponse } from "@/types/investigation";
import { PinnedPhoto } from "./PinnedPhoto";

interface CaseNoteProps {
  data: CaseNoteResponse;
}

export const CaseNote: React.FC<CaseNoteProps> = ({ data }) => {
  return (
    <article className="w-full bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-2xl flex flex-col md:flex-row gap-6 md:gap-8 items-start my-6 relative overflow-hidden transition-all duration-300 hover:border-zinc-700/80">
      {/* Background forensic watermark */}
      <div className="absolute -right-12 -bottom-12 text-zinc-900/40 font-mono text-8xl font-black select-none pointer-events-none -rotate-12">
        CLASSIFIED
      </div>

      {/* Left Side: Tactile Polaroid Photo */}
      <div className="w-full md:w-auto flex justify-center md:block flex-shrink-0 pt-2">
        <PinnedPhoto
          src={data.imageUrl || null}
          caption={data.imageCaption || "EXHIBIT // CRIME SCENE RECON"}
          rotation={-1.8}
        />
      </div>

      {/* Right Side: The 3-Step Narrative */}
      <div className="flex-1 flex flex-col gap-5 z-10 w-full min-w-0">
        {/* Header & Badges */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-950/80 border border-red-700/60 text-red-400 font-mono text-[10px] tracking-wider uppercase font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              CASE FILE DECLASSIFIED
            </span>

            {data.gatewayUsed && (
              <span className="font-mono text-[9px] text-zinc-500 tracking-widest uppercase border border-zinc-800/80 px-2 py-0.5 rounded">
                GATEWAY: {data.gatewayUsed.toUpperCase()}
              </span>
            )}
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl font-normal text-zinc-100 tracking-tight leading-snug">
            {data.topic}
          </h3>

          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mt-2.5">
            {data.brief}
          </p>
        </div>

        {/* The 3 Key Events (Timeline with subtle red thread) */}
        <div className="relative pl-6 space-y-4 border-l border-red-600/30 my-1">
          {data.timeline?.map((event, idx) => (
            <div key={idx} className="relative group">
              {/* Timeline red pin node */}
              <div className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-zinc-950 border-2 border-red-500 group-hover:scale-125 transition-transform" />

              <div className="flex flex-col">
                <span className="font-mono text-xs text-red-500 font-semibold tracking-wide uppercase">
                  {event.timestamp}
                </span>
                <h4 className="text-zinc-100 font-medium text-sm sm:text-base mt-0.5">
                  {event.headline}
                </h4>
                <p className="text-zinc-400 text-xs sm:text-sm mt-0.5 leading-relaxed">
                  {event.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* The Smoking Gun / Final Verdict Box */}
        <div className="border border-red-600/40 bg-red-950/20 rounded-xl p-4 mt-1 shadow-[0_0_20px_rgba(220,38,38,0.06)]">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-sm">⚠️</span>
            <span className="font-mono text-xs font-bold text-red-400 tracking-wider uppercase">
              THE SMOKING GUN &amp; VERDICT
            </span>
          </div>

          <p className="text-xs sm:text-sm text-zinc-300 font-mono leading-relaxed mb-2">
            <span className="text-red-400 font-semibold uppercase">Trigger: </span>
            {data.smokingGun?.trigger}
          </p>

          <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed pt-2 border-t border-red-900/40">
            <span className="font-semibold text-zinc-100">Deduction: </span>
            {data.smokingGun?.verdict}
          </p>
        </div>
      </div>
    </article>
  );
};
