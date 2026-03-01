"use client";

import { useArticleStore } from "@/store/articleStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Props = {
  onNext: () => void;
  onBack: () => void;
};

export function OutlineStep({ onNext, onBack }: Props) {
  const outline = useArticleStore((s) => s.outline);
  const selectedDirection = useArticleStore((s) => s.selectedDirection);
  const moveOutlineItem = useArticleStore((s) => s.moveOutlineItem);
  const removeOutlineItem = useArticleStore((s) => s.removeOutlineItem);
  const isLoading = useArticleStore((s) => s.isLoading);

  const totalChars = outline.reduce((sum, item) => sum + item.charEstimate, 0);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold mb-2">Step 3: 構成を確認</h2>
        <p className="text-muted-foreground">
          見出し構成を確認・編集してください。並び替え・削除が可能です。
        </p>
        {selectedDirection && (
          <p className="text-sm mt-1 font-medium">
            タイトル：{selectedDirection.title}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 text-sm">
        <Badge variant="secondary">セクション数: {outline.length}</Badge>
        <Badge
          variant={
            totalChars >= 3000 && totalChars <= 5000 ? "default" : "destructive"
          }
        >
          合計文字数目安: 約{totalChars.toLocaleString()}字
        </Badge>
      </div>

      <div className="space-y-2">
        {outline.map((item, index) => (
          <Card
            key={item.id}
            className={cn(item.level === 3 && "ml-6")}
          >
            <CardContent className="flex items-center gap-3 py-3">
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-30"
                  onClick={() => moveOutlineItem(item.id, "up")}
                  disabled={index === 0}
                >
                  ▲
                </button>
                <button
                  type="button"
                  className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-30"
                  onClick={() => moveOutlineItem(item.id, "down")}
                  disabled={index === outline.length - 1}
                >
                  ▼
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs shrink-0">
                    H{item.level}
                  </Badge>
                  <span className="font-medium truncate">{item.heading}</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {item.summary}
                </p>
              </div>

              <Badge variant="secondary" className="shrink-0 text-xs">
                {item.charEstimate}字
              </Badge>

              <button
                type="button"
                className="text-muted-foreground hover:text-destructive text-sm shrink-0"
                onClick={() => removeOutlineItem(item.id)}
              >
                ✕
              </button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack} disabled={isLoading}>
          ← 戻る
        </Button>
        <Button
          onClick={onNext}
          disabled={outline.length === 0 || isLoading}
          size="lg"
        >
          {isLoading ? "記事を生成中..." : "この構成で記事を生成 →"}
        </Button>
      </div>
    </div>
  );
}
