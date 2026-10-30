"use client";

import React, { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { ClassifiedMarquee } from "@/components/ClassifiedMarquee";
import { IntelParadox } from "@/components/IntelParadox";
import { CaseAnatomy } from "@/components/CaseAnatomy";
import { CaseVault } from "@/components/CaseVault";
import { ScrollProgressHUD } from "@/components/ScrollProgressHUD";
import { Footer } from "@/components/Footer";
import { ClassifiedDossierModal } from "@/components/ClassifiedDossierModal";

export default function Home() {
  const [activeDossierQuery, setActiveDossierQuery] = useState<string>("");
  const [isDossierModalOpen, setIsDossierModalOpen] = useState<boolean>(false);
  const [isIntroActive, setIsIntroActive] = useState<boolean>(true);

  const handleOpenDossier = (query: string) => {
    setActiveDossierQuery(query);
    setIsDossierModalOpen(true);
  };

  return (
    <main className="relative min-h-screen bg-black text-white selection:bg-red-950 selection:text-red-200">
      {/* Subtle Background Film Grain Overlay */}
      <div className="fixed inset-0 film-grain pointer-events-none z-30" />

      {/* Right-Aligned Floating Navigation Rail (Only active after intro completes) */}
      <ScrollProgressHUD isVisible={!isIntroActive} />

      {/* Hero Section & Fullscreen Detective Intro */}
      <HeroSection
        onOpenDossier={handleOpenDossier}
        onIntroStateChange={setIsIntroActive}
      />

      {/* Section 1: Continuous Classified Marquee Tape */}
      <ClassifiedMarquee />

      {/* Section 2: Sticky Stacking Cards ("The Intel Paradox") */}
      <IntelParadox />

      {/* Section 3: The 4-Step Case Anatomy (Scroll-Linked Red String) */}
      <CaseAnatomy />

      {/* Section 4: The Declassified Archive (2x2 Case Vault Grid) */}
      <CaseVault onSelectCase={handleOpenDossier} />

      {/* Archival Bureau Footer with Chief Architect Dossier */}
      <Footer />

      {/* Interactive Classified Dossier Modal */}
      <ClassifiedDossierModal
        isOpen={isDossierModalOpen}
        onClose={() => setIsDossierModalOpen(false)}
        caseQuery={activeDossierQuery}
      />
    </main>
  );
}
