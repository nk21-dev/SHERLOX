'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Search, Camera, GitCommit, Eye, Zap } from 'lucide-react';

const FEATURES = [
  {
    icon: Search,
    tag: 'GLOBAL ARCHIVE',
    title: 'Ask about anything.',
    desc: 'From 2,000-year-old ancient wars to yesterday’s corporate collapse. Just type what you want to understand.'
  },
  {
    icon: Camera,
    tag: 'REAL ARCHIVAL PROOF',
    title: 'Real evidence photos.',
    desc: 'Authentic photos, battlefield records, and confidential files pinned directly to your case board.'
  },
  {
    icon: GitCommit,
    tag: 'THE RED THREAD',
    title: 'Follow the timeline.',
    desc: 'See every move in the exact order it happened. You will never ask "who started what?" ever again.'
  },
  {
    icon: Eye,
    tag: 'MOTIVE CHECK',
    title: 'Unmask the dirty secret.',
    desc: 'We put what suspects told reporters side by side with what they were doing in private.'
  },
  {
    icon: Zap,
    tag: 'NO TIME WASTED',
    title: 'Solved in 3 minutes.',
    desc: 'No 90-minute video essays or dry 20-page Wikipedia walls. Just the raw facts and the smoking gun.'
  }
];

export const HorizontalFeatures: React.FC = () => {
  const targetRef = useRef<HTMLDivElement>(null);

  // Track vertical scroll progress inside this section
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Transform vertical scroll (0 to 1) into horizontal translation
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-62%']);

  return (
    <section 
      id="features" 
      ref={targetRef} 
      className="relative h-[250vh] bg-black z-20 select-none"
    >
      {/* Sticky Fullscreen Viewport */}
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden px-6 md:px-14">
        
        {/* Section Header */}
        <div className="max-w-7xl mx-auto w-full mb-8">
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

        {/* Horizontally Moving Track of Bold Cards */}
        <div className="w-full overflow-hidden">
          <motion.div 
            style={{ x }} 
            className="flex gap-6 w-max py-4"
          >
            {FEATURES.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="w-[280px] sm:w-[340px] md:w-[380px] h-[380px] md:h-[420px] rounded-3xl border border-zinc-800 bg-zinc-950 p-7 md:p-8 flex flex-col justify-between hover:border-red-500/50 hover:shadow-[0_0_35px_rgba(239,68,68,0.18)] transition-all duration-300 flex-shrink-0"
                >
                  {/* Card Top: Large Icon & Tag */}
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-red-500 shadow-inner">
                        <Icon className="w-6 h-6 stroke-[1.8]" />
                      </div>
                      <span className="font-mono text-[10px] text-zinc-500 tracking-widest uppercase">
                        {item.tag}
                      </span>
                    </div>

                    {/* Card Title */}
                    <h3 className="text-2xl md:text-3xl font-serif text-white mb-3 leading-snug">
                      {item.title}
                    </h3>

                    {/* Card Description */}
                    <p className="text-zinc-400 text-sm md:text-base leading-relaxed font-sans font-light">
                      {item.desc}
                    </p>
                  </div>

                  {/* Card Bottom Meta */}
                  <div className="pt-4 border-t border-zinc-900 flex items-center justify-between font-mono text-[10px] text-zinc-600 uppercase">
                    <span>CAPABILITY // 0{idx + 1}</span>
                    <span className="text-red-500">READY</span>
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
