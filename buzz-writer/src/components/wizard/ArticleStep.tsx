"use client";

import { useCallback } from "react";
import { useArticleStore } from "@/store/articleStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Props = {
  onBack: () => void;
  onReset: () => void;
};

export function ArticleStep({ onBack, onReset }: Props) {
  const articleContent = useArticleStore((s) => s.articleContent);
  const isLoading = useArticleStore((s) => s.isLoading);
  const error = useArticleStore((s) => s.error);
  const selectedDirection = useArticleStore((s) => s.selectedDirection);

  const charCount = articleContent.length;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(articleContent);
      alert("クリップボードにコピーしました！");
    } catch {
      // fallback
      const textarea = document.createElement("textarea");
      textarea.value = articleContent;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      alert("クリップボードにコピーしました！");
    }
  }, [articleContent]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([articleContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedDirection?.title || "article"}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [articleContent, selectedDirection]);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold mb-2">Step 4: 記事生成</h2>
        <div className="flex items-center gap-3">
          <Badge variant={isLoading ? "secondary" : "default"}>
            {isLoading ? "生成中..." : "生成完了"}
          </Badge>
          <Badge variant="outline">{charCount.toLocaleString()}文字</Badge>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm">
          {error}
        </div>
      )}

      <Card>
        <CardContent className="p-6">
          {articleContent ? (
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
              {articleContent}
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <div className="text-center space-y-2">
                <div className="animate-pulse text-4xl">✍️</div>
                <p>記事を生成しています...</p>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-12">
              記事がここに表示されます
            </p>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3 justify-between pt-4">
        <Button variant="outline" onClick={onBack} disabled={isLoading}>
          ← 構成に戻る
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleCopy}
            disabled={!articleContent || isLoading}
          >
            全文コピー
          </Button>
          <Button
            variant="outline"
            onClick={handleDownload}
            disabled={!articleContent || isLoading}
          >
            MDダウンロード
          </Button>
          <Button onClick={onReset} variant="secondary">
            新しい記事を作る
          </Button>
        </div>
      </div>
    </div>
  );
}
