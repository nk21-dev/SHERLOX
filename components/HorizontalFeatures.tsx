'use client';

import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Search, Camera, GitCommit, Eye, Clock } from 'lucide-react';

const FEATURES = [
  {
    icon: Search,
    tag: 'ANCIENT TO MODERN',
    title: 'Ask about anything.',
    desc: 'From 2,000-year-old ancient wars to yesterday’s corporate collapse. Just type what you want to understand.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Old-world-map.jpg/800px-Old-world-map.jpg',
    caption: 'EXHIBIT // 1565 ANCIENT ARCHIVE MAP',
    rotation: -1.5,
  },
  {
    icon: Camera,
    tag: 'ARCHIVAL EVIDENCE',
    title: 'Real evidence photos.',
    desc: 'Authentic photos, battlefield records, and confidential files pinned directly to your case board.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Magnifying_glass_on_antique_table.jpg/800px-Magnifying_glass_on_antique_table.jpg',
    caption: 'EXHIBIT // FORENSIC OPTICAL STILL',
    rotation: 1.5,
  },
  {
    icon: GitCommit,
    tag: 'CHRONOLOGICAL CHAIN',
    title: 'Follow the timeline.',
    desc: 'See every move in the exact order it happened. You will never ask "who started what?" ever again.',
    imageUrl: 'https://images.unsplash.com/photo-1453733197669-e747d28c319d?auto=format&fit=crop&w=600&q=80',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Old-world-map.jpg/800px-Old-world-map.jpg',
    caption: 'EXHIBIT // CONNECTING THE DOTS',
    rotation: -1,
  },
  {
    icon: Eye,
    tag: 'MOTIVE CHECK',
    title: 'Unmask the dirty secret.',
    desc: 'We put what suspects told reporters side by side with what they were doing in private.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/NSALibertyReport.p13.jpg/800px-NSALibertyReport.p13.jpg',
    caption: 'EXHIBIT // REDACTED CLASSIFIED FILE',
    rotation: 2,
  },
  {
    icon: Clock,
    tag: 'NO TIME WASTED',
    title: 'Solved in 3 minutes.',
    desc: 'No 90-minute video essays or dry 20-page Wikipedia walls. Just the raw facts and the smoking gun.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Pocket_Watch_%28Savonette%29.jpg/800px-Pocket_Watch_%28Savonette%29.jpg',
    caption: 'EXHIBIT // 3-MINUTE CHRONOMETER',
    rotation: 0,
  }
];

export const HorizontalFeatures: React.FC = () => {
  const targetRef = useRef<HTMLDivElement>(null);

  // Bi-directional fluid scroll tracking
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  });

  // Raw translation from 0% to -64%
  const rawX = useTransform(scrollYProgress, [0, 1], ['0%', '-64%']);

  // Spring physics for buttery momentum in BOTH directions (scroll down & scroll up)
  const x = useSpring(rawX, { 
    stiffness: 85, 
    damping: 24, 
    mass: 0.2, 
    restDelta: 0.001 
  });

  return (
    <section 
      id="features" 
      ref={targetRef} 
      className="relative h-[220vh] bg-black z-20 select-none"
    >
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden px-6 md:px-14">
        
        {/* Section Header */}
        <div className="max-w-7xl mx-auto w-full mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="font-mono text-xs text-red-500 tracking-[0.25em] uppercase font-bold">
              // BUILT FOR FAST ANSWERS
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-white tracking-tight">
            Everything you need to <span className="italic text-red-500 font-normal">crack any mystery.</span>
          </h2>
        </div>

        {/* Horizontally Moving Track of Pinned Cards */}
        <div className="w-full overflow-hidden">
          <motion.div 
            style={{ x }} 
            className="flex gap-7 w-max py-6 will-change-transform"
          >
            {FEATURES.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  style={{ transform: `rotate(${item.rotation}deg)` }}
                  className="relative w-[300px] sm:w-[350px] md:w-[380px] h-[450px] md:h-[480px] rounded-3xl border border-zinc-800 bg-zinc-950 p-6 md:p-7 flex flex-col justify-between hover:border-red-500/50 hover:shadow-[0_0_35px_rgba(239,68,68,0.2)] hover:rotate-0 transition-all duration-300 flex-shrink-0 group"
                >
                  {/* 3D Red Push Pin */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-red-400 via-red-600 to-red-950 shadow-[0_2px_5px_rgba(0,0,0,0.8)] border border-red-300/50" />
                    <div className="w-0.5 h-1 bg-zinc-400" />
                  </div>

                  {/* Card Top: Icon & Metadata */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-red-500 shadow-inner">
                        <Icon className="w-5 h-5 stroke-[1.8]" />
                      </div>
                      <span className="font-mono text-[10px] text-zinc-500 tracking-widest uppercase">
                        {item.tag}
                      </span>
                    </div>

                    <h3 className="text-2xl font-serif text-white mb-2 leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-zinc-400 text-xs md:text-sm leading-relaxed font-sans font-light">
                      {item.desc}
                    </p>
                  </div>

                  {/* EMBEDDED REAL EVIDENCE PHOTO (WITH ZERO BROKEN IMAGE GLITCH) */}
                  <div className="my-3 w-full aspect-[16/9] bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800/80 relative">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title}
                      onError={(e) => {
                        // Fallback to ancient map if secondary network has hiccup
                        (e.target as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Old-world-map.jpg/800px-Old-world-map.jpg';
                      }}
                      className="w-full h-full object-cover filter contrast-[1.15] grayscale-[30%] group-hover:grayscale-0 transition-all duration-300"
                    />
                    <div className="absolute bottom-1.5 left-2 font-mono text-[8px] bg-black/85 px-2 py-0.5 rounded text-zinc-400 border border-zinc-800 uppercase tracking-wider">
                      {item.caption}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-3 border-t border-zinc-900 flex items-center justify-between font-mono text-[10px] text-zinc-600 uppercase">
                    <span>CAPABILITY // 0{idx + 1}</span>
                    <span className="text-red-500 font-semibold">VERIFIED</span>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default HorizontalFeatures;
