"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  FileText,
  Clock,
  Sparkles,
  ChevronRight,
  BookmarkCheck,
  Compass,
} from "lucide-react";

export interface DossierData {
  caseId: string;
  title: string;
  category: string;
  timePeriod: string;
  keyActors: string[];
  summary: string;
  chronology: { milestone: string; event: string; context: string }[];
}

interface ClassifiedDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseQuery: string;
}

export const ClassifiedDossierModal: React.FC<ClassifiedDossierModalProps> = ({
  isOpen,
  onClose,
  caseQuery,
}) => {
  const getDossier = (query: string): DossierData => {
    const q = query.toLowerCase();

    if (q.includes("indus") || q.includes("harappa") || q.includes("mohenjo")) {
      return {
        caseId: "ARC-INDUS-1900-BCE",
        title: "The Enigma of the Indus Valley De-urbanization",
        category: "Ancient Civilizations",
        timePeriod: "c. 2600 – 1900 BCE",
        keyActors: ["Harappan Civic Guilds", "Ghaggar-Hakra Hydrological Shifts", "Mesopotamian Maritime Traded Networks"],
        summary:
          "Spanning over a million square kilometers with master-planned brick grids, sophisticated sanitation, and undeciphered script, the Mature Harappan culture vanished without signs of military conquest. Reconstructing climate shifts, drying river basins, and trade disruption.",
        chronology: [
          { milestone: "c. 2500 BCE", event: "Peak urbanization with standardized weights and hydraulic architecture at Mohenjo-Daro.", context: "Golden Age" },
          { milestone: "c. 1900 BCE", event: "Weakening monsoon patterns cause shift from perennial to seasonal river systems.", context: "Ecological Shift" },
          { milestone: "c. 1700 BCE", event: "Gradual decentralization into smaller agrarian settlements in the Gangetic plains.", context: "Transition" },
        ],
      };
    }

    if (q.includes("kargil") || q.includes("1999")) {
      return {
        caseId: "ARC-KARGIL-1999",
        title: "The 1999 Kargil Strategic & Diplomatic Timeline",
        category: "Geopolitical History",
        timePeriod: "May – July 1999",
        keyActors: ["Indian Armed Forces (Operation Vijay)", "Northern Light Infantry", "Diplomatic Channels (Washington Summit)"],
        summary:
          "High-altitude warfare contested across precipitous Himalayan ridge-lines at 18,000 feet. SHERLOX reconstructs the covert intrusions along the Line of Control, tactical air operations (Safed Sagar), and decisive international diplomatic pressure.",
        chronology: [
          { milestone: "Early May 1999", event: "Local shepherds report armed irregulars occupying winter-vacated bunkers along Batalik and Dras.", context: "Detection" },
          { milestone: "June 13, 1999", event: "Recapture of Tololing ridge breaks the operational deadlock.", context: "Turning Point" },
          { milestone: "July 4, 1999", event: "Recapture of Tiger Hill; subsequent diplomatic declaration in Washington mandates complete withdrawal.", context: "Resolution" },
        ],
      };
    }

    if (q.includes("koh-i-noor") || q.includes("diamond")) {
      return {
        caseId: "ARC-KOHINOOR-1304",
        title: "The Odyssey of the Mountain of Light",
        category: "Imperial Relics & Treaties",
        timePeriod: "14th Century – 1849 CE",
        keyActors: ["Kakatiya Dynasty", "Mughal Peacock Throne", "Nader Shah", "Maharaja Ranjit Singh", "Lord Dalhousie"],
        summary:
          "Surfacing from the Kollur mines of Golconda, the 105.6-carat gemstone was passed through violent conquests, imperial sieges, and dynastic collapses before the controversial Treaty of Lahore transferred custody to Queen Victoria.",
        chronology: [
          { milestone: "1310 CE", event: "Alauddin Khalji's general Malik Kafur seizes the stone from the Kakatiya treasury in Warangal.", context: "Initial Record" },
          { milestone: "1739 CE", event: "Nader Shah of Persia sacks Delhi, plunders the Peacock Throne, and coins the name 'Koh-i-Noor'.", context: "Persian Campaign" },
          { milestone: "1849 CE", event: "Annexation of the Punjab; 10-year-old Maharaja Duleep Singh signs the Treaty of Lahore under British Regency.", context: "Treaty Transfer" },
        ],
      };
    }

    if (q.includes("svb") || q.includes("silicon valley")) {
      return {
        caseId: "ARC-SVB-2023",
        title: "The Anatomy of the Silicon Valley Bank Cascade",
        category: "Financial Systems",
        timePeriod: "March 8 – 10, 2023",
        keyActors: ["SVB Asset-Liability Committee", "Venture Syndicate Backchannels", "Federal Deposit Insurance Corporation"],
        summary:
          "The fastest bank run in modern financial history: $42 billion in digital withdrawals in a single business day, precipitated by duration mismatch on long-dated Treasuries and coordinated private group chat alerts.",
        chronology: [
          { milestone: "March 8, 2023", event: "SVB announces a $1.8B after-tax loss on securities sale and emergency equity raise.", context: "Announcement" },
          { milestone: "March 9, 2023", event: "Syndicate alert cascade leads to unprecedented $42B withdrawal velocity in under 10 hours.", context: "Digital Run" },
          { milestone: "March 10, 2023", event: "Regulators step in, closing the institution before market open.", context: "Receivership" },
        ],
      };
    }

    if (q.includes("roman") || q.includes("rome")) {
      return {
        caseId: "ARC-ROME-476",
        title: "The Structural Dissolution of Western Rome",
        category: "Imperial Dissolution",
        timePeriod: "c. 376 – 476 CE",
        keyActors: ["Emperor Romulus Augustulus", "General Odoacer", "Foederati Confederations"],
        summary:
          "A century-long compound decline driven by fiscal debasement, plague depopulation, frontier reliance on mercenary foederati, and institutional fragmentation culminating in the cession of imperial insignia to Constantinople.",
        chronology: [
          { milestone: "378 CE", event: "Battle of Adrianople shatters the core myth of Roman tactical invincibility.", context: "Frontier Crisis" },
          { milestone: "410 CE", event: "Alaric's Visigoths sack Rome for the first time in 800 years.", context: "Psychological Shock" },
          { milestone: "476 CE", event: "Odoacer deposes the boy-emperor Romulus Augustulus, sending the imperial regalia eastward.", context: "Imperial Close" },
        ],
      };
    }

    if (q.includes("openai") || q.includes("boardroom") || q.includes("altman")) {
      return {
        caseId: "ARC-OAI-2023",
        title: "The Five-Day Governance Crisis at OpenAI",
        category: "Corporate & AI Governance",
        timePeriod: "November 17 – 21, 2023",
        keyActors: ["Non-Profit Board of Directors", "Sam Altman & Greg Brockman", "Microsoft Executive Suite", "700+ Core Employees"],
        summary:
          "An ideological clash between non-profit safety oversight and high-capital frontier AI development sparked a weekend mutiny where 95% of staff signed open resignation letters, forcing a boardroom reconstitute within 108 hours.",
        chronology: [
          { milestone: "Nov 17, 2023", event: "Board unexpectedly removes CEO Sam Altman; Greg Brockman resigns in solidarity.", context: "Removal" },
          { milestone: "Nov 19, 2023", event: "Microsoft offers to absorb the entire research team into an independent division.", context: "Strategic Leverage" },
          { milestone: "Nov 21, 2023", event: "Agreement in principle reached for Altman's return with a reconstituted board of directors.", context: "Reinstatement" },
        ],
      };
    }

    // Default dynamic dossier
    const cleanTag = (query.replace(/[^a-zA-Z0-9]/g, "").toUpperCase() || "HISTORIC").slice(0, 8);
    return {
      caseId: `ARC-${cleanTag}-ARCHIVE`,
      title: query ? `Investigation: ${query}` : "Archival Reconstruction",
      category: "Classified Historical File",
      timePeriod: "Chronological Sequence Reconstructed",
      keyActors: ["Key Historical Figures", "Diplomatic Conduits", "Institutional Archives"],
      summary: `The SHERLOX archival engine has reconstructed the evidence chain and primary source accounts concerning "${query}". Cross-referencing sworn testimonies, diplomatic dispatches, and financial ledger data.`,
      chronology: [
        { milestone: "Phase 1", event: "Primary source verification across decentralized and institutional libraries.", context: "Compilation" },
        { milestone: "Phase 2", event: "Reconciliation of conflicting accounts to isolate the factual baseline.", context: "Forensics" },
        { milestone: "Phase 3", event: "Definitive dossier compiled for independent historical inspection.", context: "Archive" },
      ],
    };
  };

  const dossier = getDossier(caseQuery);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
          {/* Subtle frosted backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-zinc-950/90 border border-zinc-800/80 rounded-3xl shadow-2xl text-zinc-100 p-6 sm:p-8 font-sans z-10 backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800/60 pb-5 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-[0.2em] font-medium text-amber-500/90">
                  {dossier.category}
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-xs font-mono text-zinc-400">
                  {dossier.caseId}
                </span>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors"
                aria-label="Close dossier"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Title in Editorial Serif */}
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-normal tracking-tight text-zinc-100 leading-snug">
                {dossier.title}
              </h2>
              <div className="flex items-center gap-2 mt-3 text-xs text-zinc-400">
                <Clock className="w-3.5 h-3.5 text-zinc-500" />
                <span>Chronology Span: <strong className="text-zinc-300 font-medium">{dossier.timePeriod}</strong></span>
              </div>
            </div>

            {/* Key Entities */}
            <div className="mb-6 bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-4">
              <span className="text-[11px] uppercase tracking-wider font-medium text-zinc-400 block mb-2.5">
                Key Entities & Historical Actors
              </span>
              <div className="flex flex-wrap gap-2">
                {dossier.keyActors.map((actor, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-3 py-1 bg-zinc-800/50 border border-zinc-700/50 text-zinc-300 rounded-full"
                  >
                    {actor}
                  </span>
                ))}
              </div>
            </div>

            {/* Executive Synthesis */}
            <div className="mb-6">
              <p className="text-sm md:text-base leading-relaxed text-zinc-300 font-light">
                {dossier.summary}
              </p>
            </div>

            {/* Chronological Sequence */}
            <div className="mb-8">
              <h4 className="text-xs uppercase tracking-wider font-medium text-zinc-400 mb-3.5 flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-amber-500" />
                Chronological Sequence
              </h4>
              <div className="space-y-2.5">
                {dossier.chronology.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-zinc-900/30 border border-zinc-800/60 rounded-xl text-xs flex flex-col sm:flex-row sm:items-start justify-between gap-2 hover:border-zinc-700/70 transition-colors"
                  >
                    <div>
                      <span className="font-medium text-red-400/90 mr-2">{item.milestone}</span>
                      <span className="text-zinc-300">{item.event}</span>
                    </div>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest shrink-0 self-start sm:self-auto bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                      {item.context}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Close button */}
            <div className="pt-4 border-t border-zinc-800/60 flex items-center justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-xs tracking-wide rounded-xl transition-all shadow-md flex items-center gap-1.5"
              >
                Close Dossier <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
