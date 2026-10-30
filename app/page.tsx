"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HeroSection } from "@/components/HeroSection";
import { ClassifiedMarquee } from "@/components/ClassifiedMarquee";
import { IntelParadox } from "@/components/IntelParadox";
import { CaseAnatomy } from "@/components/CaseAnatomy";
import { CaseVault } from "@/components/CaseVault";
import { ScrollProgressHUD } from "@/components/ScrollProgressHUD";
import { Footer } from "@/components/Footer";
import { InvestigationView } from "@/components/InvestigationView";

export default function Home() {
  const [isInvestigating, setIsInvestigating] = useState<boolean>(false);
  const [activeInvestigationQuery, setActiveInvestigationQuery] = useState<string>("");
  const [isIntroActive, setIsIntroActive] = useState<boolean>(true);

  // Transition from landing page into active investigation stream
  const handleLaunchInvestigation = (query: string) => {
    setActiveInvestigationQuery(query);
    setIsInvestigating(true);
    // Smooth scroll to top when opening investigation
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleReturnToArchive = () => {
    setIsInvestigating(false);
  };

  return (
    <main className="relative min-h-screen bg-black text-white selection:bg-red-950 selection:text-red-200">
      {/* Subtle Background Film Grain Overlay */}
      <div className="fixed inset-0 film-grain pointer-events-none z-30" />

      <AnimatePresence mode="wait">
        {isInvestigating ? (
          <motion.div
            key="investigation-stream"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full relative z-40"
          >
            <InvestigationView
              initialQuery={activeInvestigationQuery}
              onBackToArchive={handleReturnToArchive}
            />
          </motion.div>
        ) : (
          <motion.div
            key="archive-landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="w-full"
          >
            {/* Right-Aligned Floating Navigation Rail (Active after intro completes) */}
            <ScrollProgressHUD isVisible={!isIntroActive} />

            {/* Hero Section & Fullscreen Detective Intro */}
            <HeroSection
              onOpenDossier={handleLaunchInvestigation}
              onIntroStateChange={setIsIntroActive}
            />

            {/* Section 1: Continuous Classified Marquee Tape */}
            <ClassifiedMarquee />

            {/* Section 2: Sticky Stacking Cards ("The Intel Paradox") */}
            <IntelParadox />

            {/* Section 3: The 4-Step Case Anatomy (Scroll-Linked Red String) */}
            <CaseAnatomy />

            {/* Section 4: The Declassified Archive (2x2 Case Vault Grid) */}
            <CaseVault onSelectCase={handleLaunchInvestigation} />

            {/* Archival Bureau Footer with Chief Architect Dossier */}
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
