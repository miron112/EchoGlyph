export type BandProfile = {
  group: string;
  confidence: number;
  alternatives: string[];
  image: string;
  accent: string;
  description: string;
  topSongs: string[];
};

export type RecognitionResponse = BandProfile & {
  analyzedAt: string;
  source?: "polza-ai" | "heuristic";
  recognized?: boolean;
  reason?: string;
};

export type DrawingFeatures = {
  inkRatio: number;
  aspectRatio: number;
  bboxCoverage: number;
  centerX: number;
  centerY: number;
  diagonalBias: number;
  diagonalDirection: number;
  verticalSymmetry: number;
  horizontalSymmetry: number;
  roundness: number;
  meanHue: number;
  saturation: number;
  brightness: number;
};

export type RecognitionRequest = {
  image: string;
  features?: DrawingFeatures;
};

export type HistoryItem = {
  id: string;
  drawing: string;
  createdAt: string;
  result: RecognitionResponse;
};
