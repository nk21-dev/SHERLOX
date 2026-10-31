"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, FolderLock } from "lucide-react";

interface CaseVaultItem {
  id: string;
  title: string;
  category: string;
  tags: string[];
  summary: string;
  clearance: string;
  query: string;
}

const VAULT_CASES: CaseVaultItem[] = [
  {
    id: "CASE-01",
    title: "The Fall of Silicon Valley Bank",
    category: "Financial Cascade",
    tags: ["Finance", "Bank Run", "48-Hour Collapse"],
    summary: "$42 Billion withdrawn in 10 hours through private group chats.",
    clearance: "TOP SECRET // DECLASSIFIED",
    query: "Silicon Valley Bank liquidity collapse",
  },
  {
    id: "CASE-02",
    title: "The 1999 Kargil Strategic Recon",
    category: "Geopolitical History",
    tags: ["Geopolitics", "Operation Vijay", "Declassified"],
    summary: "How high-altitude winter posts became the trigger for a sub-zero tactical war.",
    clearance: "MILITARY INTEL // LEVEL 4",
    query: "1999 Kargil strategic timeline",
  },
  {
    id: "CASE-03",
    title: "The OpenAI Boardroom Exile",
    category: "Corporate Coup",
    tags: ["Corporate Coup", "72-Hour Mutiny", "Board Mutiny"],
    summary: "A non-profit board, a secret Friday meeting, and a weekend rebellion.",
    clearance: "AGI SAFETY // ARCHIVED",
    query: "OpenAI boardroom coup and Sam Altman return",
  },
  {
    id: "CASE-04",
    title: "The Indus Valley Disappearance",
    category: "Ancient Enigma",
    tags: ["Ancient Mystery", "Lost Metropolis", "Hydrology"],
    summary: "A thriving civilization of 5 million people abandoned without evidence of invasion.",
    clearance: "CIVIC ARCHAEOLOGY // RESTRICTED",
    query: "Indus Valley Civilization mystery and decline",
  },
];

interface CaseVaultProps {
  onSelectCase: (query: string) => void;
}

export const CaseVault: React.FC<CaseVaultProps> = ({ onSelectCase }) => {
  return (
    <section id="vault" className="relative w-full py-20 px-4 md:px-8 z-10">
      {/* The Framed Dossier Page */}
      <div className="max-w-7xl mx-auto rounded-3xl border border-zinc-800/80 bg-zinc-950/60 backdrop-blur-xl p-6 md:p-12 shadow-[0_25px_60px_rgba(0,0,0,0.85)] relative">
        
        {/* Page Header */}
        <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-8">
          <span className="font-mono text-xs text-red-500 tracking-[0.25em] uppercase font-bold">
            // DOSSIER PAGE 04 ✦ DECLASSIFIED ARCHIVES
          </span>
          <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">
            4 RECONSTRUCTED CASES
          </span>
        </div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-zinc-900 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FolderLock className="w-4 h-4 text-red-500" />
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-red-500 font-semibold">
                // THE ARCHIVE VAULT
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-light text-zinc-100 tracking-tight leading-[1.08]">
              Declassified Case Files.
            </h2>
          </div>
          <p className="text-zinc-400 text-sm sm:text-base max-w-md font-normal leading-relaxed">
            Select any investigation below to inspect primary forensic milestones, suspect alignments, and the verified chain of causation.
          </p>
        </div>

        {/* 2x2 Case Vault Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {VAULT_CASES.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={() => onSelectCase(item.query)}
              className="group relative bg-zinc-950/80 border border-zinc-800/80 hover:border-red-600/60 rounded-3xl p-8 sm:p-10 cursor-pointer transition-all duration-300 shadow-xl hover:shadow-[0_0_40px_rgba(220,38,38,0.22)] backdrop-blur-xl flex flex-col justify-between"
            >
              <div>
                {/* Card Top Metadata */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[11px] font-mono tracking-widest text-zinc-500 uppercase">
                    {item.clearance}
                  </span>
                  <div className="w-8 h-8 rounded-full border border-zinc-800 group-hover:border-red-500/80 group-hover:bg-red-950/50 flex items-center justify-center text-zinc-400 group-hover:text-red-400 transition-colors">
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl sm:text-3xl font-serif text-zinc-100 group-hover:text-white transition-colors mb-4">
                  {item.title}
                </h3>

                {/* Summary Quote */}
                <p className="text-zinc-400 text-base leading-relaxed font-light mb-6">
                  &ldquo;{item.summary}&rdquo;
                </p>
              </div>

              {/* Tags & Action Link */}
              <div className="pt-6 border-t border-zinc-900 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-mono px-2.5 py-1 rounded bg-zinc-900/80 border border-zinc-800 text-zinc-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <span className="text-xs font-mono font-semibold tracking-wider text-red-500 group-hover:text-red-400 flex items-center gap-1">
                  DECRYPT CASE →
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

