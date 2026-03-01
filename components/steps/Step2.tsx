"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWizardStore } from "@/store/wizard";

const TONE_OPTIONS = [
  { value: "熱狂的・情熱的", label: "熱狂的・情熱的" },
  { value: "知的・専門的", label: "知的・専門的" },
  { value: "親しみやすい・カジュアル", label: "親しみやすい・カジュアル" },
  { value: "驚き・衝撃的", label: "驚き・衝撃的" },
  { value: "共感・感動的", label: "共感・感動的" },
  { value: "論理的・データ重視", label: "論理的・データ重視" },
];

export function Step2() {
  const { audience, tone, setField, nextStep, prevStep } = useWizardStore();

  const canProceed = audience.trim().length > 0 && tone.length > 0;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">ターゲットとトーン</h2>
        <p className="text-muted-foreground">
          誰に届けたいか、どんな雰囲気で伝えたいかを設定してください。
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="audience">
            ターゲット層 <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="audience"
            placeholder="例：20〜30代の会社員。副業に興味があり、ITリテラシーが高め"
            value={audience}
            onChange={(e) => setField("audience", e.target.value)}
            rows={3}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground">
            年齢層、職業、興味・関心などを具体的に書いてください
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tone">
            トーン・雰囲気 <span className="text-destructive">*</span>
          </Label>
          <Select value={tone} onValueChange={(v) => setField("tone", v)}>
            <SelectTrigger id="tone">
              <SelectValue placeholder="トーンを選択してください" />
            </SelectTrigger>
            <SelectContent>
              {TONE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep} size="lg">
          ← 前へ
        </Button>
        <Button onClick={nextStep} disabled={!canProceed} size="lg">
          次へ →
        </Button>
      </div>
    </div>
  );
}
