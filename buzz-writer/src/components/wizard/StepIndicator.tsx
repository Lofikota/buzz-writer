"use client";

import type { WizardStep } from "@/types/article";
import { cn } from "@/lib/utils";

const STEPS: { step: WizardStep; label: string }[] = [
  { step: 1, label: "テーマ入力" },
  { step: 2, label: "方向性選択" },
  { step: 3, label: "構成確認" },
  { step: 4, label: "記事生成" },
];

type Props = {
  currentStep: WizardStep;
  onStepClick?: (step: WizardStep) => void;
};

export function StepIndicator({ currentStep, onStepClick }: Props) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {STEPS.map(({ step, label }, index) => {
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;
        const isClickable = isCompleted && onStepClick;

        return (
          <div key={step} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => isClickable && onStepClick(step)}
              disabled={!isClickable}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                isActive && "bg-primary text-primary-foreground",
                isCompleted &&
                  "bg-primary/20 text-primary cursor-pointer hover:bg-primary/30",
                !isActive &&
                  !isCompleted &&
                  "bg-muted text-muted-foreground cursor-default"
              )}
            >
              <span
                className={cn(
                  "flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold",
                  isActive && "bg-primary-foreground text-primary",
                  isCompleted && "bg-primary text-primary-foreground",
                  !isActive && !isCompleted && "bg-muted-foreground/30 text-muted-foreground"
                )}
              >
                {isCompleted ? "✓" : step}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </button>
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  "w-8 h-0.5",
                  step < currentStep ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
