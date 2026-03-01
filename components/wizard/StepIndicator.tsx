"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Step } from "@/store/wizard";

interface StepIndicatorProps {
  currentStep: Step;
}

const steps = [
  { number: 1, label: "テーマ設定" },
  { number: 2, label: "ターゲット" },
  { number: 3, label: "スタイル" },
  { number: 4, label: "生成結果" },
];

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const progress = ((currentStep - 1) / 3) * 100;

  return (
    <div className="w-full space-y-4">
      <Progress value={progress} className="h-2" />
      <div className="flex justify-between">
        {steps.map((step) => (
          <div key={step.number} className="flex flex-col items-center gap-1">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                currentStep === step.number
                  ? "bg-primary text-primary-foreground"
                  : currentStep > step.number
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {step.number}
            </div>
            <span
              className={cn(
                "text-xs font-medium",
                currentStep >= step.number ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
