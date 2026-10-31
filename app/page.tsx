"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HeroSection } from "@/components/HeroSection";
import { ClassifiedMarquee } from "@/components/ClassifiedMarquee";
import { ParadoxSection } from "@/components/ParadoxSection";
import { UVForensicScanner } from "@/components/UVForensicScanner";
import { CaseVault } from "@/components/CaseVault";
import { ScrollProgressHUD } from "@/components/ScrollProgressHUD";
import { SectorGate } from "@/components/SectorGate";
import { SectionWrapper } from "@/components/SectionWrapper";
import { PreFooterCTA } from "@/components/PreFooterCTA";
import { Footer } from "@/components/Footer";
import { InvestigationView } from "@/components/InvestigationView";

export default function Home() {
  const [isInvestigating, setIsInvestigating] = useState<boolean>(false);
  const [activeInvestigationQuery, setActiveInvestigationQuery] = useState<string>("");
  const [isIntroActive, setIsIntroActive] = useState<boolean>(true);
  const [hasCompletedIntro, setHasCompletedIntro] = useState<boolean>(false);

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
          setHasCompletedIntro(true);
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
    setIsIntroActive(false);
    setHasCompletedIntro(true);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Keep user in investigation room with a fresh empty chat
  const handleNewInvestigation = () => {
    setActiveInvestigationQuery("");
    setIsInvestigating(true);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Return to the bureau landing page without replaying the intro
  const handleReturnToArchive = () => {
    setActiveInvestigationQuery("");
    setIsInvestigating(false);
    setIsIntroActive(false);
    setHasCompletedIntro(true); // Sherlock remains settled on the right
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleIntroStateChange = (isActive: boolean) => {
    setIsIntroActive(isActive);
    if (!isActive) {
      setHasCompletedIntro(true);
    }
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
              onNewInvestigation={handleNewInvestigation}
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
              onIntroStateChange={handleIntroStateChange}
              initialVideoDone={hasCompletedIntro}
            />

            {/* Transition Gate 01 */}
            <SectorGate
              number="01"
              sectorName="RECON REGISTRY"
              clearance="ARCHIVE ACTIVE"
            />

            {/* Section 1: Continuous Classified Marquee Tape */}
            <ClassifiedMarquee />

            {/* Transition Gate 02 */}
            <SectorGate
              number="02"
              sectorName="THE INTEL PARADOX"
              clearance="LEVEL 3 CLEARANCE"
            />

            {/* Section 2: Sticky Stacking Cards ("The Intel Paradox") */}
            <ParadoxSection />

            {/* Transition Gate 03 */}
            <SectorGate
              number="03"
              sectorName="UV FORENSIC SCANNER"
              clearance="EVIDENCE LAB"
            />

            {/* Section 3: The UV Forensic Lightbox (X-Ray Truth Scanner) */}
            <SectionWrapper
              id="scanner"
              sectorNumber="03"
              bgGradient="from-black via-zinc-950 to-black"
            >
              <UVForensicScanner onSelectCase={handleLaunchInvestigation} />
            </SectionWrapper>

            {/* Transition Gate 04 */}
            <SectorGate
              number="04"
              sectorName="CASE VAULT"
              clearance="DECLASSIFIED"
            />

            {/* Section 4: The Declassified Archive (2x2 Case Vault Grid) */}
            <SectionWrapper
              id="vault"
              sectorNumber="04"
              bgGradient="from-black via-red-950/15 to-black"
            >
              <CaseVault onSelectCase={handleLaunchInvestigation} />
            </SectionWrapper>

            {/* Transition Gate 05 */}
            <SectorGate
              number="05"
              sectorName="INTERROGATION CONSOLE"
              clearance="READY FOR QUERY"
            />

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
