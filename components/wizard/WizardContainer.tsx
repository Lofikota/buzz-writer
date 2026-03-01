"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useWizardStore } from "@/store/wizard";
import { StepIndicator } from "./StepIndicator";
import { Step1 } from "@/components/steps/Step1";
import { Step2 } from "@/components/steps/Step2";
import { Step3 } from "@/components/steps/Step3";
import { Step4 } from "@/components/steps/Step4";

const stepComponents = {
  1: Step1,
  2: Step2,
  3: Step3,
  4: Step4,
};

export function WizardContainer() {
  const { step } = useWizardStore();
  const StepComponent = stepComponents[step];

  return (
    <div className="mx-auto w-full max-w-2xl">
      <Card className="shadow-lg">
        <CardHeader className="pb-2">
          <StepIndicator currentStep={step} />
        </CardHeader>
        <CardContent className="pt-6">
          <StepComponent />
        </CardContent>
      </Card>
    </div>
  );
}
