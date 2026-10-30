"use client";

import React from "react";
import { CaseNoteResponse } from "@/types/investigation";
import { MultiPinnedPhotos } from "./MultiPinnedPhotos";

interface CaseNoteProps {
  data: CaseNoteResponse;
}

export const CaseNote: React.FC<CaseNoteProps> = ({ data }) => {
  // Normalize images for the pinboard
  const displayPhotos =
    data.resolvedImages && data.resolvedImages.length > 0
      ? data.resolvedImages
      : data.imageUrl
      ? [{ url: data.imageUrl, caption: data.imageCaption || "EXHIBIT A // ARCHIVAL EVIDENCE" }]
      : [];

  const title = data.formalTopic || data.topic || "Declassified Investigation File";
  const threatLevel = data.threatLevel || "DECLASSIFIED // HIGH HISTORICAL VALUE";
  const gateway = data.gateway || "GEMINI-PRO-DIRECT";

  return (
    <article className="w-full bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-2xl flex flex-col lg:flex-row gap-6 md:gap-8 items-start my-6 relative overflow-hidden transition-all duration-300 hover:border-zinc-700/80">
      {/* Background forensic watermark */}
      <div className="absolute -right-12 -bottom-12 text-zinc-900/35 font-mono text-8xl font-black select-none pointer-events-none -rotate-12">
        CLASSIFIED
      </div>

      {/* Left Side: Multi-Photo Pinned Crime Wall */}
      {displayPhotos.length > 0 && (
        <div className="w-full lg:w-auto flex justify-center lg:block flex-shrink-0 pt-2">
          <MultiPinnedPhotos photos={displayPhotos} />
        </div>
      )}

      {/* Right Side: The 3-Step Narrative & Historical Rigor */}
      <div className="flex-1 flex flex-col gap-5 z-10 w-full min-w-0">
        {/* Header & Clearance Badges */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-950/80 border border-red-700/60 text-red-400 font-mono text-[10px] tracking-wider uppercase font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              {threatLevel}
            </span>

            <span className="font-mono text-[9px] text-zinc-500 tracking-widest uppercase border border-zinc-800/80 px-2 py-0.5 rounded">
              GATEWAY: {gateway}
            </span>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-zinc-100 tracking-tight leading-snug">
            {title}
          </h3>

          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mt-3 border-l-2 border-red-600/40 pl-3.5 italic font-sans">
            {data.brief}
          </p>
        </div>

        {/* Chronological Milestone Timeline */}
        <div className="relative pl-6 space-y-5 border-l border-red-600/30 my-2">
          {data.timeline?.map((event, idx) => (
            <div key={idx} className="relative group">
              {/* Timeline pin node */}
              <div className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-zinc-950 border-2 border-red-500 group-hover:scale-125 transition-transform" />

              <div className="flex flex-col">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-red-500 font-semibold tracking-wide uppercase">
                    {event.timestamp}
                  </span>
                  {event.phase && (
                    <span className="font-mono text-[10px] text-zinc-500 tracking-widest uppercase bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
                      {event.phase}
                    </span>
                  )}
                </div>

                <h4 className="text-zinc-100 font-medium text-sm sm:text-base mt-1">
                  {event.headline}
                </h4>

                <p className="text-zinc-400 text-xs sm:text-sm mt-0.5 leading-relaxed font-sans">
                  {event.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* The Smoking Gun / Decisive Verdict Box */}
        <div className="border border-red-600/40 bg-red-950/20 rounded-xl p-4 sm:p-5 mt-1 shadow-[0_0_20px_rgba(220,38,38,0.06)]">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm">⚠️</span>
            <span className="font-mono text-xs font-bold text-red-400 tracking-wider uppercase">
              THE SMOKING GUN &amp; HISTORICAL VERDICT
            </span>
          </div>

          <p className="text-xs sm:text-sm text-zinc-300 font-mono leading-relaxed mb-2.5">
            <span className="text-red-400 font-semibold uppercase">Decisive Trigger: </span>
            {data.smokingGun?.trigger}
          </p>

          <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed pt-2.5 border-t border-red-900/40 font-sans">
            <span className="font-semibold text-zinc-100 font-mono text-xs uppercase mr-1">Historical Deduction:</span>
            {data.smokingGun?.verdict}
          </p>
        </div>
      </div>
    </article>
  );
};
