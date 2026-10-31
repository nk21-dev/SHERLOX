'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';

interface CaseVaultProps {
  onSelectCase?: (query: string) => void;
}

const VAULT_CASES = [
  {
    id: 'svb',
    title: 'The Fall of Silicon Valley Bank',
    query: 'The Fall of Silicon Valley Bank collapse',
    tag: 'WALL STREET',
    type: '48-HOUR BANK RUN',
    hook: '$42 Billion was withdrawn in under 10 hours through private group chats.',
  },
  {
    id: 'kargil',
    title: 'Operation Vijay: 1999 Kargil Standoff',
    query: 'Operation Vijay 1999 Kargil War timeline and raw wiretap',
    tag: 'WARFARE',
    type: 'INTERCEPTED WIRETAP',
    hook: 'How sub-zero mountain posts became the trigger for war, proven by an intercepted satellite call.',
  },
  {
    id: 'openai',
    title: 'The OpenAI Boardroom Coup',
    query: 'The OpenAI Boardroom Coup and 72-hour mutiny',
    tag: 'SILICON VALLEY',
    type: '72-HOUR MUTINY',
    hook: 'A secret Friday ambush and a 700-engineer resignation threat that forced the board out.',
  },
  {
    id: 'indus',
    title: 'The Indus Valley Disappearance',
    query: 'The Indus Valley Civilization mystery and decline',
    tag: 'ANCIENT ENIGMA',
    type: 'UNSOLVED ARCHIVE',
    hook: 'A thriving Bronze Age civilization of 5 million people that was abandoned without signs of war.',
  },
];

// Slow-motion Stagger Animation Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.22, // Staggers each card by 0.22s
      delayChildren: 0.15,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 45, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.9, // Deliberate slow-motion entrance
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const CaseVault: React.FC<CaseVaultProps> = ({ onSelectCase }) => {
  return (
    <section 
      id="vault" 
      className="relative w-full min-h-screen bg-black py-28 px-6 md:px-14 z-30 select-none border-t border-zinc-900"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-14">
        
        {/* Header with entrance animation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-900 pb-8 gap-4"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span className="font-mono text-xs text-red-500 tracking-[0.25em] uppercase font-bold">
                // DECLASSIFIED ARCHIVES
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-serif font-light text-white tracking-tight">
              Solved Case Files.
            </h2>
          </div>

          <p className="text-zinc-400 text-sm md:text-base max-w-md font-sans font-light">
            Click any dossier to examine the timeline, suspect motives, and the exact smoking gun evidence.
          </p>
        </motion.div>

        {/* 2x2 Grid with Slow-Motion Staggered Entrance */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {VAULT_CASES.map((item) => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              onClick={() => onSelectCase && onSelectCase(item.query)}
              className="group relative rounded-2xl border border-zinc-800/90 bg-zinc-950 p-7 md:p-8 flex flex-col justify-between hover:border-red-500/60 hover:shadow-[0_0_40px_rgba(239,68,68,0.2)] transition-all duration-300 cursor-pointer"
            >
              <div>
                {/* Meta Header */}
                <div className="flex items-center justify-between font-mono text-[11px] text-zinc-500 mb-4 border-b border-zinc-900 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-red-500 font-bold uppercase">{item.tag}</span>
                    <span className="text-zinc-700">•</span>
                    <span className="text-zinc-400">{item.type}</span>
                  </div>
                  <span className="text-zinc-600 group-hover:text-red-400 transition-colors">↗</span>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-serif text-white group-hover:text-red-300 transition-colors mb-3">
                  {item.title}
                </h3>

                {/* Hook */}
                <p className="text-zinc-400 text-sm leading-relaxed font-sans font-light">
                  "{item.hook}"
                </p>
              </div>

              {/* Card Footer Action */}
              <div className="mt-6 pt-4 border-t border-zinc-900/80 flex items-center justify-between font-mono text-xs">
                <span className="text-zinc-600 uppercase text-[10px] tracking-wider">STATUS: VERIFIED</span>
                <span className="text-red-500 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Inspect Case →
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default CaseVault;
