export interface PhotoItem {
  url: string | null;
  caption: string;
}

export interface TimelineEvent {
  timestamp: string;
  phase?: string;
  headline: string;
  detail: string;
}

export interface SmokingGun {
  trigger: string;
  verdict: string;
}

export interface CaseNoteResponse {
  formalTopic: string;
  threatLevel?: string;
  brief: string;
  images?: { query: string; caption: string }[];
  resolvedImages?: PhotoItem[];
  timeline: TimelineEvent[];
  smokingGun: SmokingGun;
  followUpSuggestions: string[];
  gateway?: string;
  topic?: string;
  imageUrl?: string | null;
  imageCaption?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content?: string;
  caseNote?: CaseNoteResponse;
  timestamp: string;
}
