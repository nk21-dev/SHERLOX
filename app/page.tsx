"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HeroSection } from "@/components/HeroSection";
import { ClassifiedMarquee } from "@/components/ClassifiedMarquee";
import { IntelParadox } from "@/components/IntelParadox";
import { UVForensicScanner } from "@/components/UVForensicScanner";
import { CaseVault } from "@/components/CaseVault";
import { ScrollProgressHUD } from "@/components/ScrollProgressHUD";
import { Footer } from "@/components/Footer";
import { PreFooterCTA } from "@/components/PreFooterCTA";
import { InvestigationView } from "@/components/InvestigationView";

export default function Home() {
  const [isInvestigating, setIsInvestigating] = useState<boolean>(false);
  const [activeInvestigationQuery, setActiveInvestigationQuery] = useState<string>("");
  const [isIntroActive, setIsIntroActive] = useState<boolean>(true);

  // Check if there is an active investigation in the current tab session on mount
  useEffect(() => {
    try {
      const savedDossier = sessionStorage.getItem("sherlox_active_dossier");
      const savedMessages = sessionStorage.getItem("sherlox_chat_history");

      if (savedDossier || savedMessages) {
        const parsedDossier = savedDossier ? JSON.parse(savedDossier) : null;
        const parsedMessages = savedMessages ? JSON.parse(savedMessages) : [];

        if (parsedDossier || (Array.isArray(parsedMessages) && parsedMessages.length > 0)) {
          setIsInvestigating(true); // Jump straight to chat
          setIsIntroActive(false);   // Bypass intro video
        }
      }
    } catch (e) {
      console.error("Error restoring session dossier", e);
    }
  }, []);

  // Transition from landing page into active investigation stream
  const handleLaunchInvestigation = (query: string) => {
    setActiveInvestigationQuery(query);
    setIsInvestigating(true);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Cleanly clear session and return to default hero screen
  const handleReturnToArchive = () => {
    try {
      sessionStorage.removeItem("sherlox_active_dossier");
      sessionStorage.removeItem("sherlox_chat_history");
    } catch (e) {
      console.error("Error clearing sessionStorage", e);
    }
    setActiveInvestigationQuery("");
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

            {/* Section 3: The UV Forensic Lightbox (X-Ray Truth Scanner) */}
            <UVForensicScanner onSelectCase={handleLaunchInvestigation} />

            {/* Section 4: The Declassified Archive (2x2 Case Vault Grid) */}
            <CaseVault onSelectCase={handleLaunchInvestigation} />

            {/* Pre-Footer Action Section */}
            <PreFooterCTA onStartInvestigation={() => handleLaunchInvestigation("")} />

            {/* Archival Bureau Footer with Chief Architect Dossier */}
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
