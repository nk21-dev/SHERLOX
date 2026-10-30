"use client";

import React, { useState } from "react";

interface PinnedPhotoProps {
  src: string | null;
  caption: string;
  rotation?: number; // e.g. -2 or 1.5
}

export const PinnedPhoto: React.FC<PinnedPhotoProps> = ({
  src,
  caption,
  rotation = -1.5,
}) => {
  const [imageError, setImageError] = useState<boolean>(false);

  return (
    <div
      style={{ transform: `rotate(${rotation}deg)` }}
      className="relative w-full max-w-[240px] md:max-w-[280px] bg-zinc-100 p-2.5 pb-5 rounded shadow-[0_12px_30px_rgba(0,0,0,0.85)] border border-zinc-300/40 transition-transform hover:rotate-0 duration-300 group flex-shrink-0"
    >
      {/* 3D Red Push Pin */}
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none">
        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-red-400 via-red-600 to-red-950 shadow-[0_3px_6px_rgba(0,0,0,0.6)] border border-red-300/50" />
        <div className="w-1 h-1.5 bg-zinc-400/80 -mt-0.5" />
      </div>

      {/* Archival Photo Container */}
      <div className="relative aspect-[4/3] w-full bg-zinc-950 overflow-hidden rounded-sm">
        {src && !imageError ? (
          <img
            src={src}
            alt={caption}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover filter contrast-[1.15] grayscale-[40%] group-hover:grayscale-0 transition-all duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 text-zinc-500 p-4 text-center">
            <span className="font-mono text-base mb-1">📷</span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">
              [ ARCHIVAL STILL CLASSIFIED ]
            </span>
            <span className="font-mono text-[8px] text-zinc-600 mt-1 uppercase">
              WIKIMEDIA PUBLIC DOMAIN
            </span>
          </div>
        )}
      </div>

      {/* Handwritten/Typewriter Caption */}
      <p
        title={caption}
        className="font-mono text-[10px] text-zinc-700 uppercase tracking-widest mt-2.5 text-center font-semibold truncate px-1"
      >
        {caption}
      </p>
    </div>
  );
};

