"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWizardStore } from "@/store/wizard";

const GOAL_OPTIONS = [
  { value: "フォロワー獲得", label: "フォロワー獲得" },
  { value: "商品・サービス認知", label: "商品・サービス認知" },
  { value: "ブランディング", label: "ブランディング" },
  { value: "情報拡散・バズ", label: "情報拡散・バズ" },
  { value: "エンゲージメント向上", label: "エンゲージメント向上" },
  { value: "集客・リード獲得", label: "集客・リード獲得" },
];

export function Step1() {
  const { topic, goal, setField, nextStep } = useWizardStore();

  const canProceed = topic.trim().length > 0 && goal.length > 0;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">テーマと目的を設定</h2>
        <p className="text-muted-foreground">
          投稿のメインテーマと、この投稿で達成したい目的を入力してください。
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="topic">
            投稿テーマ <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="topic"
            placeholder="例：AIツールを使った副業で月10万円稼ぐ方法"
            value={topic}
            onChange={(e) => setField("topic", e.target.value)}
            rows={3}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground">
            どんな内容について投稿したいかを具体的に書いてください
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="goal">
            投稿の目的 <span className="text-destructive">*</span>
          </Label>
          <Select value={goal} onValueChange={(v) => setField("goal", v)}>
            <SelectTrigger id="goal">
              <SelectValue placeholder="目的を選択してください" />
            </SelectTrigger>
            <SelectContent>
              {GOAL_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={nextStep} disabled={!canProceed} size="lg">
          次へ →
        </Button>
      </div>
    </div>
  );
}
