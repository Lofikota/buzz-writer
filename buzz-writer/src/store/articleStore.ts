import { create } from "zustand";
import type {
  ArticleState,
  ThemeInput,
  Direction,
  OutlineItem,
  WizardStep,
} from "@/types/article";

const initialThemeInput: ThemeInput = {
  theme: "",
  targetAudience: "",
  seoKeywords: "",
  uniqueAngle: "",
  ctaContent: "",
  buzzIntensity: "empathy",
};

type ArticleActions = {
  setStep: (step: WizardStep) => void;
  setThemeInput: (input: Partial<ThemeInput>) => void;
  setDirections: (directions: Direction[]) => void;
  selectDirection: (direction: Direction) => void;
  setOutline: (outline: OutlineItem[]) => void;
  updateOutlineItem: (id: string, updates: Partial<OutlineItem>) => void;
  removeOutlineItem: (id: string) => void;
  moveOutlineItem: (id: string, direction: "up" | "down") => void;
  appendArticleContent: (chunk: string) => void;
  setArticleContent: (content: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
};

const initialState: ArticleState = {
  step: 1,
  themeInput: initialThemeInput,
  directions: [],
  selectedDirection: null,
  outline: [],
  articleContent: "",
  isLoading: false,
  error: null,
};

export const useArticleStore = create<ArticleState & ArticleActions>(
  (set) => ({
    ...initialState,

    setStep: (step) => set({ step }),

    setThemeInput: (input) =>
      set((state) => ({
        themeInput: { ...state.themeInput, ...input },
      })),

    setDirections: (directions) => set({ directions }),

    selectDirection: (direction) => set({ selectedDirection: direction }),

    setOutline: (outline) => set({ outline }),

    updateOutlineItem: (id, updates) =>
      set((state) => ({
        outline: state.outline.map((item) =>
          item.id === id ? { ...item, ...updates } : item
        ),
      })),

    removeOutlineItem: (id) =>
      set((state) => ({
        outline: state.outline.filter((item) => item.id !== id),
      })),

    moveOutlineItem: (id, direction) =>
      set((state) => {
        const idx = state.outline.findIndex((item) => item.id === id);
        if (idx === -1) return state;
        const newIdx = direction === "up" ? idx - 1 : idx + 1;
        if (newIdx < 0 || newIdx >= state.outline.length) return state;
        const newOutline = [...state.outline];
        [newOutline[idx], newOutline[newIdx]] = [
          newOutline[newIdx],
          newOutline[idx],
        ];
        return { outline: newOutline };
      }),

    appendArticleContent: (chunk) =>
      set((state) => ({
        articleContent: state.articleContent + chunk,
      })),

    setArticleContent: (content) => set({ articleContent: content }),

    setLoading: (loading) => set({ isLoading: loading }),

    setError: (error) => set({ error }),

    reset: () => set(initialState),
  })
);
