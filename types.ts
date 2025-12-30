
export interface SearchResult {
  title: string;
  url: string;
  snippet?: string;
}

export interface AnalysisState {
  isAnalyzing: boolean;
  error: string | null;
  description: string | null;
  matches: SearchResult[];
}

export interface ImageData {
  base64: string;
  mimeType: string;
}
