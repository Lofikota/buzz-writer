"use client";

import { useArticleStore } from "@/store/articleStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Direction } from "@/types/article";

type Props = {
  onNext: () => void;
  onBack: () => void;
};

export function DirectionStep({ onNext, onBack }: Props) {
  const directions = useArticleStore((s) => s.directions);
  const selectedDirection = useArticleStore((s) => s.selectedDirection);
  const selectDirection = useArticleStore((s) => s.selectDirection);
  const isLoading = useArticleStore((s) => s.isLoading);

  const handleSelect = (direction: Direction) => {
    selectDirection(direction);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold mb-2">Step 2: 方向性を選択</h2>
        <p className="text-muted-foreground">
          AIが提案した3つの方向性から1つを選んでください
        </p>
      </div>

      <div className="grid gap-4">
        {directions.map((direction) => (
          <Card
            key={direction.id}
            className={cn(
              "cursor-pointer transition-all hover:shadow-md",
              selectedDirection?.id === direction.id &&
                "ring-2 ring-primary shadow-md"
            )}
            onClick={() => handleSelect(direction)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-lg leading-tight">
                  {direction.title}
                </CardTitle>
                <Badge
                  variant={
                    selectedDirection?.id === direction.id
                      ? "default"
                      : "outline"
                  }
                >
                  案{direction.id}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">
                  核心メッセージ：
                </span>
                {direction.coreMessage}
              </div>
              <div>
                <span className="font-medium text-orange-600 dark:text-orange-400">
                  バズポイント：
                </span>
                {direction.buzzPoint}
              </div>
              <div>
                <span className="font-medium text-muted-foreground">
                  切り口：
                </span>
                {direction.angle}
              </div>
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
          disabled={!selectedDirection || isLoading}
          size="lg"
        >
          {isLoading ? "構成を生成中..." : "この方向性で構成を作る →"}
        </Button>
      </div>
    </div>
  );
}
