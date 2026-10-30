import { CaseNoteResponse } from "@/types/investigation";

export const CURATED_FALLBACK_CASES: Record<string, Omit<CaseNoteResponse, "imageUrl" | "gatewayUsed">> = {
  "silicon valley bank": {
    topic: "The Collapse of Silicon Valley Bank",
    imageSearchTerm: "Silicon Valley Bank",
    imageCaption: "EXHIBIT #01 // SVB HEADQUARTERS, SANTA CLARA",
    brief: "In March 2023, the 16th largest US lender vaporized in fewer than 48 hours. A catastrophic panic accelerated through venture capital WhatsApp group chats triggered the first hyper-speed digital bank run in human history.",
    timeline: [
      {
        timestamp: "Wednesday, March 8 // 4:00 PM",
        headline: "The Unhedged Balance Sheet Disclosure",
        detail: "SVB announces a $1.8 billion after-tax loss on bond sales and an emergency $2.25 billion capital raise, blindsiding depositors."
      },
      {
        timestamp: "Thursday, March 9 // 11:30 AM",
        headline: "Founder Fund WhatsApp Syndicate Panic",
        detail: "Prominent VC syndicates advise portfolio founders to pull capital simultaneously, igniting a $42 billion withdrawal request in under 10 hours."
      },
      {
        timestamp: "Friday, March 10 // 8:30 AM",
        headline: "FDIC Receivership Execution",
        detail: "Regulators abruptly halt trading and seize the institution before markets open, leaving $175 billion in deposits in limbo."
      }
    ],
    smokingGun: {
      trigger: "The bank parked $91 billion in long-term held-to-maturity Treasury securities yielding 1.79% right before the Federal Reserve embarked on the fastest rate-hiking cycle in 40 years.",
      verdict: "It was not credit fraud or bad loans that killed SVB, but an elementary duration mismatch amplified by zero-friction mobile banking and venture hiveminds."
    },
    followUpSuggestions: [
      "Did Peter Thiel's Founders Fund warn other VCs?",
      "How did the FDIC cover uninsured deposits?",
      "Who purchased SVB's remaining assets?"
    ]
  },
  "kargil": {
    topic: "The 1999 Kargil Strategic Infiltration",
    imageSearchTerm: "Kargil War",
    imageCaption: "EXHIBIT #02 // TIGER HILL & TOLOLING RIDGE, 16,000 FT",
    brief: "In the sub-zero winter of 1998, Pakistani paramilitary units covertly occupied 130 fortified Indian ridge posts along the Line of Control. The ensuing high-altitude conflict pushed two nuclear-armed states to the precipice of total war.",
    timeline: [
      {
        timestamp: "May 3, 1999",
        headline: "The Shepherd's Warning at Batalik",
        detail: "Local shepherd Tashi Namgyal spots armed intruders dressed in Pathani suits constructing bunkers on unoccupied Indian peaks."
      },
      {
        timestamp: "May 26, 1999",
        headline: "Operation Safed Sagar Air Strikes",
        detail: "The Indian Air Force deploys Mirage 2000s with laser-guided bombs, conducting nighttime precision strikes at 17,000 feet."
      },
      {
        timestamp: "July 4, 1999 // 04:30 AM",
        headline: "The Recapture of Tiger Hill",
        detail: "18 Grenadiers scale a sheer 1,000-foot vertical cliff face in pitch darkness to dislodge the remaining entrenched combatants."
      }
    ],
    smokingGun: {
      trigger: "General Pervez Musharraf conducted 'Operation Koh Paima' in absolute secrecy, failing to brief even the Pakistani Prime Minister or the Navy and Air Chiefs beforehand.",
      verdict: "A tactical military gambit with zero diplomatic exit strategy resulted in international isolation and the eventual military coup that overthrew Pakistan's civilian government."
    },
    followUpSuggestions: [
      "How did intercepted satellite phone calls expose the operation?",
      "What was the role of the Bofors artillery guns?",
      "Why didn't India cross the Line of Control?"
    ]
  },
  "indus valley": {
    topic: "The Enigma of the Indus Valley Civilization",
    imageSearchTerm: "Mohenjo-daro",
    imageCaption: "EXHIBIT #03 // THE GREAT BATH, MOHENJO-DARO",
    brief: "For nearly a millennium, over five million people flourished in master-planned cities with advanced sanitation, standardization, and zero evidence of royalty or warfare. Around 1900 BCE, this sprawling urban network vanished without a single trace of military conquest.",
    timeline: [
      {
        timestamp: "c. 2600 BCE",
        headline: "Rise of the Grid Metropolis",
        detail: "Harappa and Mohenjo-daro pioneer uniform kiln-fired brick ratios, subterranean drainage, and dockyards without constructing palaces or temples."
      },
      {
        timestamp: "c. 1900 BCE",
        headline: "The Drying of the Ghaggar-Hakra",
        detail: "Shifting tectonic plates and monsoonal retreat disrupt primary river courses, collapsing the agrarian foundation of major trade hubs."
      },
      {
        timestamp: "c. 1700 BCE",
        headline: "The Great De-Urbanization Migration",
        detail: "Citizens peacefully abandon monumental multi-story complexes to disperse eastward into smaller rural settlements along the Ganges basin."
      }
    ],
    smokingGun: {
      trigger: "Paleoclimatic lake sediment cores show a sudden, multi-century weakening of the Indian summer monsoon coupled with desiccation of the Saraswati-Ghaggar riverbed.",
      verdict: "There was no invasion or catastrophic massacre; the world's most egalitarian bronze-age civilization succumbed to catastrophic climate aridification that made dense urban living impossible."
    },
    followUpSuggestions: [
      "Why has the Indus script never been deciphered?",
      "Is there evidence of weapons or a standing army?",
      "Where did the surviving populations migrate?"
    ]
  },
  "openai": {
    topic: "The 72-Hour OpenAI Boardroom Coup",
    imageSearchTerm: "Sam Altman",
    imageCaption: "EXHIBIT #04 // OPENAI SAN FRANCISCO HEADQUARTERS",
    brief: "On a Friday afternoon in November 2023, the non-profit board of the world's most valuable AI enterprise fired its charismatic CEO without warning. What followed was a 72-hour weekend mutiny involving Microsoft, 700 protesting engineers, and the near-collapse of generative AI leadership.",
    timeline: [
      {
        timestamp: "Friday, Nov 17 // 12:00 PM",
        headline: "The Unscheduled Google Meet Ambush",
        detail: "Chief Scientist Ilya Sutskever and independent board members inform Sam Altman that he is terminated for not being 'candid in his communications'."
      },
      {
        timestamp: "Saturday, Nov 18 // 9:00 PM",
        headline: "Satya Nadella's Midnight Counter-Offensive",
        detail: "Microsoft secures Altman and Brockman to helm an advanced research division while 95% of OpenAI employees sign an open resignation ultimatum."
      },
      {
        timestamp: "Tuesday, Nov 21 // 10:00 PM",
        headline: "The Total Restoration Agreement",
        detail: "Altman returns triumphant as CEO with the rebellious board dissolved and replaced by corporate veterans Larry Summers and Bret Taylor."
      }
    ],
    smokingGun: {
      trigger: "The non-profit governance charter gave four academic directors absolute fiduciary power to destroy a $90 billion company if they believed AI safety had been compromised, without owing any duty to investors.",
      verdict: "Idealistic non-profit governance clashed violently with commercial hyper-capitalism — and hyper-capitalism mobilized 700 engineers to win the war in 72 hours."
    },
    followUpSuggestions: [
      "What was the specific safety project (Q*) that triggered the board?",
      "Why did Ilya Sutskever reverse his vote on Sunday?",
      "How did Microsoft's 49% stake protect their interests?"
    ]
  }
};

export function getCuratedFallback(query: string): Omit<CaseNoteResponse, "imageUrl" | "gatewayUsed"> {
  const q = query.toLowerCase();
  
  if (q.includes("svb") || q.includes("silicon valley") || q.includes("bank") || q.includes("finance")) {
    return CURATED_FALLBACK_CASES["silicon valley bank"];
  }
  if (q.includes("kargil") || q.includes("war") || q.includes("vijay") || q.includes("pakistan") || q.includes("india")) {
    return CURATED_FALLBACK_CASES["kargil"];
  }
  if (q.includes("indus") || q.includes("harappa") || q.includes("mohenjo") || q.includes("ancient") || q.includes("disappearance")) {
    return CURATED_FALLBACK_CASES["indus valley"];
  }
  if (q.includes("openai") || q.includes("altman") || q.includes("boardroom") || q.includes("coup") || q.includes("ai")) {
    return CURATED_FALLBACK_CASES["openai"];
  }

  // Dynamic generic fallback for any other query
  const cleanTitle = query.replace(/[?.,!]/g, "").trim();
  const formattedTitle = cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1);

  return {
    topic: `The Declassified Files: ${formattedTitle}`,
    imageSearchTerm: cleanTitle,
    imageCaption: `EXHIBIT #01 // ARCHIVAL RECON: ${cleanTitle.toUpperCase()}`,
    brief: `A high-level investigative reconstruction into the critical catalysts behind "${cleanTitle}". Multiple confidential sources and forensic timelines reveal an intricate pattern concealed from mainstream public records.`,
    timeline: [
      {
        timestamp: "PHASE 01 // CATALYST",
        headline: "The Covert Inflection Point",
        detail: `Initial anomalies emerge as quiet operational maneuvers precede the public disclosure of ${cleanTitle}.`
      },
      {
        timestamp: "PHASE 02 // ESCALATION",
        headline: "The Accelerated Convergence",
        detail: `Competing factions and institutional stakeholders collide as internal intelligence fails to contain the expanding crisis.`
      },
      {
        timestamp: "PHASE 03 // AFTERMATH",
        headline: "The Irreversible Reckoning",
        detail: `The decisive collapse forces declassification and re-writes the historical ledger permanently.`
      }
    ],
    smokingGun: {
      trigger: `Critical documentation and internal communiqués directly contradict the authorized press briefings of the era.`,
      verdict: `The outcome of ${cleanTitle} was not an unpredictable catastrophe, but the deliberate consequence of neglected systemic warnings.`
    },
    followUpSuggestions: [
      `Who orchestrated the primary turning point in ${cleanTitle}?`,
      `What classified evidence remains suppressed?`,
      `How does this event continue to impact modern policy?`
    ]
  };
}
