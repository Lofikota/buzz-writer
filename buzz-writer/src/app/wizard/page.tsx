"use client";

import { useCallback } from "react";
import { useArticleStore } from "@/store/articleStore";
import { useWizard } from "@/hooks/useWizard";
import { useStream } from "@/hooks/useStream";
import { StepIndicator } from "@/components/wizard/StepIndicator";
import { ThemeInputStep } from "@/components/wizard/ThemeInputStep";
import { DirectionStep } from "@/components/wizard/DirectionStep";
import { OutlineStep } from "@/components/wizard/OutlineStep";
import { ArticleStep } from "@/components/wizard/ArticleStep";
import type { WizardStep } from "@/types/article";

export default function WizardPage() {
  const { step, goToStep } = useWizard();

  const themeInput = useArticleStore((s) => s.themeInput);
  const selectedDirection = useArticleStore((s) => s.selectedDirection);
  const outline = useArticleStore((s) => s.outline);
  const setDirections = useArticleStore((s) => s.setDirections);
  const setOutline = useArticleStore((s) => s.setOutline);
  const setLoading = useArticleStore((s) => s.setLoading);
  const setError = useArticleStore((s) => s.setError);
  const reset = useArticleStore((s) => s.reset);

  const { startStream } = useStream();

  // Step1 → Step2: 方向性を生成してから遷移
  const handleStep1Next = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/directions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: themeInput }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setDirections(json.data.directions);
      goToStep(2);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "方向性の生成に失敗しました"
      );
    } finally {
      setLoading(false);
    }
  }, [themeInput, setDirections, setLoading, setError, goToStep]);

  // Step2 → Step3: 構成を生成してから遷移
  const handleStep2Next = useCallback(async () => {
    if (!selectedDirection) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/outline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: themeInput,
          direction: selectedDirection,
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setOutline(json.data.outline);
      goToStep(3);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "構成の生成に失敗しました"
      );
    } finally {
      setLoading(false);
    }
  }, [themeInput, selectedDirection, setOutline, setLoading, setError, goToStep]);

  // Step3 → Step4: 記事生成（ストリーミング）
  const handleStep3Next = useCallback(async () => {
    if (!selectedDirection) return;
    goToStep(4);
    await startStream({
      input: themeInput,
      direction: selectedDirection,
      outline,
    });
  }, [themeInput, selectedDirection, outline, goToStep, startStream]);

  const handleStepClick = useCallback(
    (target: WizardStep) => {
      if (target < step) {
        goToStep(target);
      }
    },
    [step, goToStep]
  );

  const handleReset = useCallback(() => {
    reset();
    goToStep(1);
  }, [reset, goToStep]);

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">BuzzWriter</h1>
        <StepIndicator currentStep={step} onStepClick={handleStepClick} />

        {/* Error display */}
        {useArticleStore.getState().error && step !== 4 && (
          <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-lg text-sm max-w-2xl mx-auto">
            {useArticleStore.getState().error}
          </div>
        )}

        {step === 1 && <ThemeInputStep onNext={handleStep1Next} />}
        {step === 2 && (
          <DirectionStep
            onNext={handleStep2Next}
            onBack={() => goToStep(1)}
          />
        )}
        {step === 3 && (
          <OutlineStep
            onNext={handleStep3Next}
            onBack={() => goToStep(2)}
          />
        )}
        {step === 4 && (
          <ArticleStep onBack={() => goToStep(3)} onReset={handleReset} />
        )}
      </div>
    </main>
  );
}
