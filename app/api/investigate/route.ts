import { NextResponse } from "next/server";
import { fetchWikiImage } from "@/lib/wikimedia";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    if (!query || typeof query !== "string" || !query.trim()) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const rawApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!rawApiKey) {
      console.error("[SHERLOX ERROR] Missing GEMINI_API_KEY in environment variables.");
      return NextResponse.json(
        {
          error: "GEMINI_API_KEY is not defined in .env.local. Please add it and restart the server.",
        },
        { status: 500 }
      );
    }

    // Strip quotes or whitespace
    const apiKey = rawApiKey.replace(/^["']|["']$/g, "").trim();

    const systemPrompt = `
You are SHERLOX, an elite intelligence historian and forensic investigator.
Your mission: Given ANY user question or topic (e.g., "tell me about subash chandra bose", "fall of SVB", "kargil war 1999"), reconstruct the TRUE historical/factual case file.

STRICT FACTUAL MANDATES:
1. NO GENERIC CORPORATE JARGON. Never use vague phrases like "Initial anomalies emerge", "institutional stakeholders", or "systemic warnings".
2. EXTRACT THE FORMAL TOPIC: Clean casual prompts. If input is "tell me about subash chandra bose", set formalTopic to "Netaji Subhas Chandra Bose & The Declassified INA Archives".
3. REAL DATES, REAL NAMES & REAL OPERATIONS: Include authentic milestones (e.g., 1941 Great Escape disguised as Ziauddin, Azad Hind Fauj in Singapore, 1945 Taihoku aerodrome controversy, Mukherjee Commission).
4. MULTIPLE ARCHIVAL PHOTOS: Provide 2 to 3 distinct Wikipedia search queries for authentic images (e.g., the person, their army/documents, and the location).

Return ONLY valid JSON matching this schema:
{
  "formalTopic": "Clean Historical/Forensic Title",
  "threatLevel": "DECLASSIFIED // HIGH HISTORICAL VALUE",
  "brief": "Exactly 2 high-tension, fact-packed sentences summarizing who they were, the core struggle, and the real historical stakes.",
  "images": [
    { "query": "Exact search term for photo 1 (e.g. Subhas Chandra Bose portrait)", "caption": "EXHIBIT A // SUBJECT PORTRAIT" },
    { "query": "Exact search term for photo 2 (e.g. Indian National Army Azad Hind Fauj)", "caption": "EXHIBIT B // THE AZAD HIND RECON" },
    { "query": "Exact search term for photo 3 (e.g. INA memorial Singapore or Red Fort trials)", "caption": "EXHIBIT C // DECLASSIFIED FILES" }
  ],
  "timeline": [
    {
      "timestamp": "Precise historical date or period (e.g. January 1941)",
      "phase": "PHASE 01 // THE ESCAPE / THE SPARK",
      "headline": "Specific factual event title",
      "detail": "Specific names, routes, secret allies, or documents involved."
    },
    {
      "timestamp": "Precise historical date or period (e.g. July 1943)",
      "phase": "PHASE 02 // MILITARY ESCALATION",
      "headline": "Specific factual event title",
      "detail": "Concrete actions, operational names, and strategic conflicts."
    },
    {
      "timestamp": "Precise historical date or period (e.g. August 1945 & Aftermath)",
      "phase": "PHASE 03 // THE ENIGMA / AFTERMATH",
      "headline": "The unverified disappearance or critical historical turning point",
      "detail": "Declassified commission records, disputed findings, and long-term legacy."
    }
  ],
  "smokingGun": {
    "trigger": "The single most decisive quote, telegram, or documented turning point.",
    "verdict": "The undeniable historical deduction explaining why this event fundamentally shifted history."
  },
  "followUpSuggestions": [
    "Three specific, high-intrigue factual questions related to this exact case"
  ]
}
`;

    const requestPayload = {
      contents: [
        {
          role: "user",
          parts: [
            { text: systemPrompt },
            { text: `INVESTIGATE THIS TOPIC: "${query.trim()}"` },
          ],
        },
      ],
      generationConfig: {
        response_mime_type: "application/json",
      },
    };

    // Candidate models in preference order (handles Google model versioning and demand spikes)
    const candidateModels = [
      "gemini-2.0-flash",
      "gemini-3.5-flash",
      "gemini-3.5-flash-lite",
      "gemini-3.8-flash",
      "gemini-flash-latest",
    ];

    let geminiRes: Response | null = null;
    let errText = "";

    for (const model of candidateModels) {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      try {
        geminiRes = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestPayload),
        });

        if (geminiRes.ok) break;

        errText = await geminiRes.text();
        console.warn(`[GEMINI ${model} ATTEMPT]: HTTP ${geminiRes.status}: ${errText}`);

        // If 404 (model superseded) or 503 (demand spike), automatically proceed to next candidate model
        if (geminiRes.status !== 404 && geminiRes.status !== 503) {
          break;
        }
      } catch (fetchErr: any) {
        console.warn(`[GEMINI ${model} NETWORK ERROR]:`, fetchErr.message);
      }
    }

    if (!geminiRes || !geminiRes.ok) {
      console.error("[GEMINI API FAILURE]:", geminiRes?.status, errText);
      return NextResponse.json(
        { error: `Gemini API failed: ${errText || "No response received"}` },
        { status: geminiRes?.status || 500 }
      );
    }

    const geminiData = await geminiRes.json();
    const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) throw new Error("No text returned from Gemini");

    const parsed = JSON.parse(rawText);

    // Fetch up to 3 authentic images concurrently from Wikimedia
    const resolvedImages = await Promise.all(
      (parsed.images || []).slice(0, 3).map(async (img: any) => {
        const url = await fetchWikiImage(img.query);
        return {
          url: url || null,
          caption: img.caption || "ARCHIVAL EVIDENCE",
        };
      })
    );

    return NextResponse.json({
      ...parsed,
      resolvedImages,
      gateway: "GEMINI-PRO-DIRECT",
    });
  } catch (error: any) {
    console.error("[API ROUTE EXCEPTION]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to reconstruct dossier" },
      { status: 500 }
    );
  }
}
