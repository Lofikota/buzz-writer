"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, RotateCcw } from "lucide-react";
import { useWizardStore } from "@/store/wizard";

export function Step4() {
  const { generatedTweet, setGeneratedTweet, prevStep, reset, isLoading, error } = useWizardStore();
  const [copied, setCopied] = useState(false);

  const charCount = generatedTweet.length;
  const isOver = charCount > 140;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedTweet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-muted-foreground">AIがバズ投稿を生成中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">エラーが発生しました</h2>
          <p className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">{error}</p>
        </div>
        <div className="flex justify-between">
          <Button variant="outline" onClick={prevStep} size="lg">
            ← 前へ
          </Button>
          <Button variant="outline" onClick={reset} size="lg">
            <RotateCcw className="mr-2 h-4 w-4" />
            最初から
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">生成完了！</h2>
        <p className="text-muted-foreground">
          AIが生成したX（Twitter）投稿です。編集してからコピーしてください。
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">投稿テキスト</span>
          <Badge variant={isOver ? "destructive" : "secondary"}>
            {charCount} / 140文字
          </Badge>
        </div>
        <Textarea
          value={generatedTweet}
          onChange={(e) => setGeneratedTweet(e.target.value)}
          rows={6}
          className="resize-none text-base leading-relaxed"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <div className="flex gap-2">
          <Button variant="outline" onClick={prevStep}>
            ← 前へ
          </Button>
          <Button variant="outline" onClick={reset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            最初から
          </Button>
        </div>
        <Button onClick={handleCopy} size="lg" className="min-w-40">
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              コピーしました！
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              クリップボードにコピー
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
