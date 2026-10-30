"use client";

import React, { useState } from "react";
import { PhotoItem } from "@/types/investigation";

export const MultiPinnedPhotos: React.FC<{ photos?: PhotoItem[] }> = ({ photos }) => {
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  if (!photos || photos.length === 0) return null;
  const rotations = [-2.5, 3, -1];

  const handleImageError = (index: number) => {
    setFailedImages((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <div className="flex flex-wrap md:flex-col gap-5 items-center justify-center p-2 flex-shrink-0">
      {photos.map((item, idx) => {
        const hasFailed = failedImages[idx] || !item.url;

        return (
          <div
            key={idx}
            style={{ transform: `rotate(${rotations[idx % rotations.length]}deg)` }}
            className="relative w-44 md:w-56 bg-zinc-100 p-2 pb-4 rounded shadow-2xl border border-zinc-300 hover:rotate-0 hover:scale-105 hover:z-30 transition-all duration-300 group select-none"
          >
            {/* 3D Red Push Pin */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none">
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-red-400 via-red-600 to-red-950 shadow-[0_2px_5px_rgba(0,0,0,0.7)] border border-red-300/60" />
              <div className="w-0.5 h-1 bg-zinc-500" />
            </div>

            {/* Photo Container */}
            <div className="aspect-[4/3] w-full bg-zinc-950 overflow-hidden rounded-sm">
              {!hasFailed && item.url ? (
                <img
                  src={item.url}
                  alt={item.caption}
                  onError={() => handleImageError(idx)}
                  className="w-full h-full object-cover filter contrast-[1.1] grayscale-[25%] group-hover:grayscale-0 transition-all duration-300"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 text-zinc-500 font-mono text-[9px] text-center p-2 uppercase">
                  <span className="text-sm mb-1 text-zinc-600">📷</span>
                  <span>[ ARCHIVE STILL SEALED ]</span>
                </div>
              )}
            </div>

            {/* Caption */}
            <p
              title={item.caption}
              className="font-mono text-[9px] text-zinc-800 uppercase tracking-widest mt-2 text-center font-bold truncate px-1"
            >
              {item.caption}
            </p>
          </div>
        );
      })}
    </div>
  );
};
