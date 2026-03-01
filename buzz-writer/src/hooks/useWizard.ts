"use client";

import { useArticleStore } from "@/store/articleStore";
import type { WizardStep } from "@/types/article";

export function useWizard() {
  const step = useArticleStore((s) => s.step);
  const setStep = useArticleStore((s) => s.setStep);
  const isLoading = useArticleStore((s) => s.isLoading);

  const canGoBack = step > 1 && !isLoading;

  const goToStep = (target: WizardStep) => {
    if (!isLoading) {
      setStep(target);
    }
  };

  const goBack = () => {
    if (canGoBack) {
      setStep((step - 1) as WizardStep);
    }
  };

  return { step, goToStep, goBack, canGoBack, isLoading };
}
