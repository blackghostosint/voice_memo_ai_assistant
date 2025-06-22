export interface ChatMessage {
  id: string;
  sender: 'user' | 'gemini';
  text: string;
  timestamp: Date;
}

export interface Recording {
  id: string;
  name: string;
  audioBlob: Blob;
  audioURL: string;
  transcript: string | null; // Can be null initially or if transcription fails
  chatHistory: ChatMessage[];
  createdAt: Date;
  durationSeconds: number;
}

// For Gemini API (simplified)
export interface GeminiContentPart {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string; // base64 encoded
  };
}

export interface GeminiSafetyRating {
  category: string;
  probability: string;
}

export interface GeminiCandidate {
  content: {
    parts: GeminiContentPart[];
    role: string;
  };
  finishReason: string;
  index: number;
  safetyRatings: GeminiSafetyRating[];
  // For grounding
  groundingMetadata?: {
    groundingChunks?: Array<{web: {uri: string, title: string}}>;
    searchQueries?: string[];
  }
}

export interface GeminiPromptFeedback {
  safetyRatings: GeminiSafetyRating[];
}

export interface GenerateContentResponse {
  candidates: GeminiCandidate[];
  promptFeedback?: GeminiPromptFeedback;
  text: string; // Convenience accessor for text 
}
