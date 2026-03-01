// ============================================
// バズ記事生成ツール 型定義
// ============================================

/** バズ狙いの強度 */
export type BuzzIntensity = "empathy" | "controversy" | "provocative";

/** バズ強度のラベル */
export const BUZZ_INTENSITY_LABELS: Record<BuzzIntensity, string> = {
  empathy: "共感重視",
  controversy: "賛否狙い",
  provocative: "炎上覚悟",
};

/** Step1: テーマ入力 */
export type ThemeInput = {
  theme: string;
  targetAudience: string;
  seoKeywords: string;
  uniqueAngle: string;
  ctaContent: string;
  buzzIntensity: BuzzIntensity;
};

/** Step2: 方向性案 */
export type Direction = {
  id: number;
  title: string;
  coreMessage: string;
  buzzPoint: string;
  angle: string;
};

/** Step3: 構成アイテム */
export type OutlineItem = {
  id: string;
  heading: string;
  level: 2 | 3;
  charEstimate: number;
  summary: string;
};

/** ウィザードのステップ */
export type WizardStep = 1 | 2 | 3 | 4;

/** 記事生成の全体状態 */
export type ArticleState = {
  step: WizardStep;
  themeInput: ThemeInput;
  directions: Direction[];
  selectedDirection: Direction | null;
  outline: OutlineItem[];
  articleContent: string;
  isLoading: boolean;
  error: string | null;
};

/** API共通レスポンス */
export type ApiResponse<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: string;
};

/** 方向性APIレスポンス */
export type DirectionsResponse = {
  directions: Direction[];
};

/** 構成APIレスポンス */
export type OutlineResponse = {
  outline: OutlineItem[];
  totalChars: number;
};
