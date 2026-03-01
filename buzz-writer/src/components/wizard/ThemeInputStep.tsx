"use client";

import { useArticleStore } from "@/store/articleStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BUZZ_INTENSITY_LABELS } from "@/types/article";
import type { BuzzIntensity } from "@/types/article";

type Props = {
  onNext: () => void;
};

export function ThemeInputStep({ onNext }: Props) {
  const themeInput = useArticleStore((s) => s.themeInput);
  const setThemeInput = useArticleStore((s) => s.setThemeInput);
  const isLoading = useArticleStore((s) => s.isLoading);

  const isValid = themeInput.theme.trim() && themeInput.targetAudience.trim();

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold mb-2">Step 1: テーマを入力</h2>
        <p className="text-muted-foreground">
          バズ記事のテーマと条件を設定してください
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="theme">
            メインテーマ <span className="text-destructive">*</span>
          </Label>
          <Input
            id="theme"
            placeholder="例：エンジニアの年収1000万の現実"
            value={themeInput.theme}
            onChange={(e) => setThemeInput({ theme: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetAudience">
            ターゲット読者 <span className="text-destructive">*</span>
          </Label>
          <Input
            id="targetAudience"
            placeholder="例：20〜30代のITエンジニア、転職を考えている層"
            value={themeInput.targetAudience}
            onChange={(e) => setThemeInput({ targetAudience: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="seoKeywords">SEOキーワード（カンマ区切り）</Label>
          <Input
            id="seoKeywords"
            placeholder="例：エンジニア, 年収, 転職, キャリア"
            value={themeInput.seoKeywords}
            onChange={(e) => setThemeInput({ seoKeywords: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="uniqueAngle">独自視点・角度（任意）</Label>
          <Textarea
            id="uniqueAngle"
            placeholder="例：年収1000万より大事なものがある、という逆張り視点"
            rows={2}
            value={themeInput.uniqueAngle}
            onChange={(e) => setThemeInput({ uniqueAngle: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ctaContent">CTA内容（採用/集客/商品など）</Label>
          <Input
            id="ctaContent"
            placeholder="例：自社の採用ページへの誘導"
            value={themeInput.ctaContent}
            onChange={(e) => setThemeInput({ ctaContent: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>バズ狙いの強度</Label>
          <Select
            value={themeInput.buzzIntensity}
            onValueChange={(v) =>
              setThemeInput({ buzzIntensity: v as BuzzIntensity })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(
                Object.entries(BUZZ_INTENSITY_LABELS) as [
                  BuzzIntensity,
                  string,
                ][]
              ).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={onNext} disabled={!isValid || isLoading} size="lg">
          {isLoading ? "生成中..." : "方向性を提案してもらう →"}
        </Button>
      </div>
    </div>
  );
}
