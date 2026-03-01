"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useWizardStore } from "@/store/wizard";

const STYLE_OPTIONS = [
  { value: "リスト形式", label: "リスト形式（例：3つの方法）" },
  { value: "ストーリー形式", label: "ストーリー形式（体験談）" },
  { value: "問いかけ形式", label: "問いかけ形式（質問で始まる）" },
  { value: "データ・統計形式", label: "データ・統計形式（数字を使う）" },
  { value: "名言・引用形式", label: "名言・引用形式" },
  { value: "衝撃的事実形式", label: "衝撃的事実形式（驚きから始まる）" },
];

export function Step3() {
  const { keywords, tweetStyle, setField, nextStep, prevStep, setLoading, setError, setGeneratedTweet, topic, goal, audience, tone } =
    useWizardStore();
  const [keywordInput, setKeywordInput] = useState("");
  const keywordList = keywords ? keywords.split(",").filter(Boolean) : [];

  const addKeyword = () => {
    if (!keywordInput.trim()) return;
    const updated = [...keywordList, keywordInput.trim()].join(",");
    setField("keywords", updated);
    setKeywordInput("");
  };

  const removeKeyword = (kw: string) => {
    const updated = keywordList.filter((k) => k !== kw).join(",");
    setField("keywords", updated);
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, goal, audience, tone, keywords, tweetStyle }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "生成に失敗しました");
      setGeneratedTweet(data.tweet);
      nextStep();
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">キーワードとスタイル</h2>
        <p className="text-muted-foreground">
          含めたいキーワードや投稿スタイルを選択してください（任意）。
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>キーワード（任意）</Label>
          <div className="flex gap-2">
            <Input
              placeholder="例：AI、副業、月10万"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addKeyword()}
            />
            <Button type="button" variant="outline" onClick={addKeyword}>
              追加
            </Button>
          </div>
          {keywordList.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {keywordList.map((kw) => (
                <Badge key={kw} variant="secondary" className="gap-1">
                  {kw}
                  <button onClick={() => removeKeyword(kw)} className="hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="tweetStyle">投稿スタイル（任意）</Label>
          <Select value={tweetStyle} onValueChange={(v) => setField("tweetStyle", v)}>
            <SelectTrigger id="tweetStyle">
              <SelectValue placeholder="スタイルを選択（任意）" />
            </SelectTrigger>
            <SelectContent>
              {STYLE_OPTIONS.map((opt) => (
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
        <Button onClick={handleGenerate} size="lg" className="min-w-32">
          生成する ✨
        </Button>
      </div>
    </div>
  );
}
