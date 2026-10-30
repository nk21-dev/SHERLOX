export interface TimelineEvent {
  timestamp: string;
  headline: string;
  detail: string;
}

export interface SmokingGun {
  trigger: string;
  verdict: string;
}

export interface CaseNoteResponse {
  topic: string;
  imageSearchTerm: string;
  imageCaption: string;
  brief: string;
  timeline: TimelineEvent[];
  smokingGun: SmokingGun;
  followUpSuggestions: string[];
  imageUrl?: string | null;
  gatewayUsed?: "gemini" | "groq" | "archive-fallback";
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content?: string;
  caseNote?: CaseNoteResponse;
  timestamp: string;
}
