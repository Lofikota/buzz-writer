import { create } from "zustand";

export type Step = 1 | 2 | 3 | 4;

export interface WizardState {
  step: Step;
  // Step 1: Topic & Goal
  topic: string;
  goal: string;
  // Step 2: Target Audience & Tone
  audience: string;
  tone: string;
  // Step 3: Keywords & Style
  keywords: string;
  tweetStyle: string;
  // Step 4: Result
  generatedTweet: string;
  isLoading: boolean;
  error: string | null;
}

interface WizardActions {
  setStep: (step: Step) => void;
  nextStep: () => void;
  prevStep: () => void;
  setField: <K extends keyof WizardState>(key: K, value: WizardState[K]) => void;
  setGeneratedTweet: (tweet: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState: WizardState = {
  step: 1,
  topic: "",
  goal: "",
  audience: "",
  tone: "",
  keywords: "",
  tweetStyle: "",
  generatedTweet: "",
  isLoading: false,
  error: null,
};

export const useWizardStore = create<WizardState & WizardActions>((set) => ({
  ...initialState,

  setStep: (step) => set({ step }),

  nextStep: () =>
    set((state) => ({
      step: Math.min(state.step + 1, 4) as Step,
    })),

  prevStep: () =>
    set((state) => ({
      step: Math.max(state.step - 1, 1) as Step,
    })),

  setField: (key, value) => set({ [key]: value } as Partial<WizardState>),

  setGeneratedTweet: (tweet) => set({ generatedTweet: tweet }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  reset: () => set(initialState),
}));
