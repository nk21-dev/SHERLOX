import { NextRequest, NextResponse } from "next/server";
import { CaseNoteResponse } from "@/types/investigation";
import { fetchWikiImage } from "@/lib/wikimedia";
import { getCuratedFallback } from "@/lib/fallbackCases";

const SYSTEM_PROMPT = `You are SHERLOX — an elite AI Detective Bureau intelligence analyst.
Your mission: Reconstruct real-world history, corporate scandals, geopolitical events, and internet drama into FBI-style declassified case files.
Tone: Forensic, analytical, gripping, noir editorial. No fluff, no generic encyclopedic introductions.

You MUST return ONLY valid JSON matching this exact schema:
{
  "topic": "Concise official case title",
  "imageSearchTerm": "Specific Wikipedia search term for an authentic historical or news photo (e.g. 'Silicon Valley Bank headquarters', 'Kargil War', 'Mohenjo-daro')",
  "imageCaption": "EXHIBIT #01 // BRIEF FORENSIC LABEL IN MONOSPACE",
  "brief": "Exactly two punchy, suspenseful sentences summarizing the core mystery, turning point, or collapse.",
  "timeline": [
    {
      "timestamp": "Precise time or date (e.g. 'Wednesday 4:00 PM')",
      "headline": "Short punchy turning point headline",
      "detail": "One sharp sentence outlining the covert action, catalyst, or mistake."
    },
    {
      "timestamp": "Precise time or date",
      "headline": "Short punchy turning point headline",
      "detail": "One sharp sentence outlining the covert action, catalyst, or mistake."
    },
    {
      "timestamp": "Precise time or date",
      "headline": "Short punchy turning point headline",
      "detail": "One sharp sentence outlining the covert action, catalyst, or mistake."
    }
  ],
  "smokingGun": {
    "trigger": "The exact catalyst quote, leaked memo, bank wire, or fatal tactical blunder.",
    "verdict": "One or two sentences revealing the undeniable, counter-intuitive truth or final verdict."
  },
  "followUpSuggestions": [
    "Short investigative follow-up question 1",
    "Short investigative follow-up question 2",
    "Short investigative follow-up question 3"
  ]
}`;

/**
 * Call Gemini API (gemini-2.0-flash / gemini-1.5-flash)
 */
async function callGemini(query: string, apiKey: string): Promise<CaseNoteResponse> {
  const models = ["gemini-2.0-flash", "gemini-1.5-flash"];
  let lastError: Error | null = null;

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `${SYSTEM_PROMPT}\n\nCase to investigate: "${query}"` }],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.35,
          },
        }),
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Gemini HTTP ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) throw new Error("Gemini returned empty content");

      const parsed: CaseNoteResponse = JSON.parse(rawText);
      return { ...parsed, gatewayUsed: "gemini" };
    } catch (err: any) {
      lastError = err;
      // If 429 or quota limit, break to trigger Groq failover immediately
      if (err?.message?.includes("429") || err?.message?.includes("RESOURCE_EXHAUSTED")) {
        break;
      }
    }
  }

  throw lastError || new Error("Gemini generation failed");
}

/**
 * Call Groq API (llama-3.3-70b-versatile)
 */
async function callGroq(query: string, apiKey: string): Promise<CaseNoteResponse> {
  const url = "https://api.groq.com/openai/v1/chat/completions";
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    signal: controller.signal,
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Investigate and declassify this case: "${query}"` },
      ],
      response_format: { type: "json_object" },
      temperature: 0.35,
    }),
  });

  clearTimeout(timeoutId);

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Groq HTTP ${res.status}: ${errorText}`);
  }

  const data = await res.json();
  const rawText = data?.choices?.[0]?.message?.content;
  if (!rawText) throw new Error("Groq returned empty content");

  const parsed: CaseNoteResponse = JSON.parse(rawText);
  return { ...parsed, gatewayUsed: "groq" };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = (body?.query || "").trim();

    if (!query) {
      return NextResponse.json({ error: "Missing inquiry query." }, { status: 400 });
    }

    const geminiKey = process.env.GEMINI_API_KEY?.trim();
    const groqKey = process.env.GROQ_API_KEY?.trim();

    const isGeminiConfigured = !!geminiKey && !geminiKey.includes("your_gemini_api_key");
    const isGroqConfigured = !!groqKey && !groqKey.includes("your_groq_api_key");

    let caseNote: CaseNoteResponse | null = null;

    // 1. Try Gemini first if configured
    if (isGeminiConfigured) {
      try {
        caseNote = await callGemini(query, geminiKey);
      } catch (geminiError: any) {
        console.warn("[SHERLOX ENGINE] Gemini gateway failed or rate-limited. Failing over to Groq...", geminiError?.message);
      }
    }

    // 2. If Gemini failed or was not configured, try Groq
    if (!caseNote && isGroqConfigured) {
      try {
        caseNote = await callGroq(query, groqKey);
      } catch (groqError: any) {
        console.warn("[SHERLOX ENGINE] Groq gateway failed:", groqError?.message);
      }
    }

    // 3. Fallback to curated case intelligence if keys are not provided or both failed
    if (!caseNote) {
      console.info("[SHERLOX ENGINE] Dual-gateway standby: generating curated archival intelligence for:", query);
      const fallback = getCuratedFallback(query);
      caseNote = {
        ...fallback,
        gatewayUsed: "archive-fallback",
      };
    }

    // 4. Server-side Wikimedia image fetch
    const wikiSearchTerm = caseNote.imageSearchTerm || caseNote.topic || query;
    let imageUrl = await fetchWikiImage(wikiSearchTerm);

    // If initial wiki search returned null, try the topic itself
    if (!imageUrl && caseNote.topic !== wikiSearchTerm) {
      imageUrl = await fetchWikiImage(caseNote.topic);
    }

    const finalResponse: CaseNoteResponse = {
      ...caseNote,
      imageUrl: imageUrl || null,
    };

    return NextResponse.json(finalResponse);
  } catch (err: any) {
    console.error("[SHERLOX ENGINE] Investigation error:", err);
    return NextResponse.json(
      { error: "Investigation decryption failed. Neural link interrupted." },
      { status: 500 }
    );
  }
}
