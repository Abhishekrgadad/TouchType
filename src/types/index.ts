export type TestMode = 'time' | 'words' | 'custom';
export type TimeOption = 15 | 30 | 60 | 120;
export type WordOption = 10 | 25 | 50 | 100;

export interface TypingStats {
  wpm: number;
  cpm: number;
  accuracy: number;
  errors: number;
  streak: number;
  rawWpm: number;
}

export interface TestSettings {
  mode: TestMode;
  timeLimit?: TimeOption;
  wordCount?: WordOption;
  customText?: string;
  language: string;
  includeCaps: boolean;
  includePunctuation: boolean;
  includeNumbers: boolean;
  includeSpecialChars: boolean;
}