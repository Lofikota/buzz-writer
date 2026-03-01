import type { ThemeInput, Direction, OutlineItem } from "@/types/article";
import { BUZZ_INTENSITY_LABELS } from "@/types/article";

// ============================================
// プロンプトテンプレート集
// すべてのClaudeへのプロンプトはここに集約する
// ============================================

const SYSTEM_BASE = `あなたはX（Twitter）でバズる記事を書くプロのライターです。
以下の原則を常に守ってください：

【記事設計の原則】
- 表の目的：読者が共感する普遍的テーマを入口にする
- 裏の目的：ビジネスの採用・集客CTAに自然に誘導する
- バズ設計：賛否が生まれる尖った主張＋シェアされるひと言を必ず入れる
- 導線：共感 → 独自視点・価値提供 → CTA（採用/集客）

【文体ルール】
- 一文は60文字以内を基本とする
- 漢字率30%以下を目安に（読みやすさ重視）
- 「〜です。〜ます。」の連続を避け、体言止め・倒置法を混ぜる
- 冒頭3行で読者の心を掴む（問いかけ or 断言 or 意外な事実）
- 各セクション冒頭にフックを入れる`;

/** Step2: 方向性提案プロンプト */
export function buildDirectionsPrompt(input: ThemeInput): {
  system: string;
  user: string;
} {
  return {
    system: SYSTEM_BASE,
    user: `以下の条件で、X（Twitter）でバズる記事の方向性を3案考えてください。

【入力条件】
- メインテーマ: ${input.theme}
- ターゲット読者: ${input.targetAudience}
- SEOキーワード: ${input.seoKeywords}
- 独自視点・角度: ${input.uniqueAngle || "（AIにお任せ）"}
- CTA内容: ${input.ctaContent}
- バズ狙いの強度: ${BUZZ_INTENSITY_LABELS[input.buzzIntensity]}

【各案に含めるもの】
1. title: 記事タイトル案（30〜50文字、数字や断言を含む）
2. coreMessage: この記事で伝えたい核心メッセージ（1文）
3. buzzPoint: なぜバズるか（賛否ポイント/共感ポイント）
4. angle: 切り口の説明（2〜3文）

以下のJSON形式で出力してください：
\`\`\`json
{
  "directions": [
    {
      "id": 1,
      "title": "...",
      "coreMessage": "...",
      "buzzPoint": "...",
      "angle": "..."
    }
  ]
}
\`\`\`

JSONのみを出力し、それ以外のテキストは含めないでください。`,
  };
}

/** Step3: 構成生成プロンプト */
export function buildOutlinePrompt(
  input: ThemeInput,
  direction: Direction
): { system: string; user: string } {
  return {
    system: SYSTEM_BASE,
    user: `以下の方向性に基づいて、記事の構成（見出し一覧）を作成してください。

【選択された方向性】
- タイトル: ${direction.title}
- 核心メッセージ: ${direction.coreMessage}
- バズポイント: ${direction.buzzPoint}
- 切り口: ${direction.angle}

【元の入力条件】
- メインテーマ: ${input.theme}
- ターゲット読者: ${input.targetAudience}
- SEOキーワード: ${input.seoKeywords}
- CTA内容: ${input.ctaContent}
- バズ狙いの強度: ${BUZZ_INTENSITY_LABELS[input.buzzIntensity]}

【構成ルール】
- H2見出し: 4〜6個
- H3見出し: 必要に応じて各H2の下に1〜3個
- 合計文字数: 3000〜5000字の範囲でAIが最適判断
- 各セクションの文字数目安を含める
- 冒頭セクション: 読者の共感を掴むフック
- 中盤: 独自視点と価値提供
- 終盤: 自然なCTA誘導
- 必ず1つは「シェアされやすい尖った主張」のセクションを入れる

以下のJSON形式で出力してください：
\`\`\`json
{
  "outline": [
    {
      "id": "1",
      "heading": "見出しテキスト",
      "level": 2,
      "charEstimate": 500,
      "summary": "このセクションで書く内容の要約"
    }
  ],
  "totalChars": 4000
}
\`\`\`

JSONのみを出力し、それ以外のテキストは含めないでください。`,
  };
}

/** Step4: 記事生成プロンプト */
export function buildArticlePrompt(
  input: ThemeInput,
  direction: Direction,
  outline: OutlineItem[]
): { system: string; user: string } {
  const outlineText = outline
    .map((item) => {
      const prefix = item.level === 2 ? "##" : "###";
      return `${prefix} ${item.heading}（${item.charEstimate}字目安）\n  内容: ${item.summary}`;
    })
    .join("\n\n");

  const totalChars = outline.reduce((sum, item) => sum + item.charEstimate, 0);

  return {
    system: SYSTEM_BASE,
    user: `以下の構成に基づいて、X（Twitter）でバズる記事の本文を書いてください。

【タイトル】
${direction.title}

【核心メッセージ】
${direction.coreMessage}

【バズポイント】
${direction.buzzPoint}

【元の入力条件】
- メインテーマ: ${input.theme}
- ターゲット読者: ${input.targetAudience}
- SEOキーワード: ${input.seoKeywords}
- CTA内容: ${input.ctaContent}
- バズ狙いの強度: ${BUZZ_INTENSITY_LABELS[input.buzzIntensity]}

【構成】
${outlineText}

【執筆ルール】
- 合計文字数: 約${totalChars}字（${totalChars - 500}〜${totalChars + 500}字）
- Markdown形式で出力（## と ### を使用）
- SEOキーワードを自然に散りばめる
- 最後にCTAを自然に組み込む
- 「これは引用したくなる」と思える一文を最低2つ入れる（**太字**にする）
- 一文は40〜50文字以内を厳守する
- 段落は3〜4文ごとに空行を入れて区切る
- 各H2セクションの後は必ず空行を入れる

【冒頭（最初の ## の前）の書き方 ★最重要】
以下の3点を必ず守ること：
1. 難しい言葉・漢語・専門用語を一切使わない（中学生でも読める日本語）
2. 読者が「これ自分のことだ」と思う具体的な場面・感情を描写する（1〜2文）
3. 「でも、実は○○だった」という意外な事実か「あなたも○○じゃないか？」という問いかけで終わる

悪い例：「自己分析を繰り返し、適職診断を何度も受け、本質的な問いに向き合い続けても答えが出ない」
良い例：「転職サイトを開いては閉じる。もう何百回目だろう。やりたいことが、わからない。」

【構成の書き方ルール】
- ## 見出し の直後は必ず空行を1行入れてから本文を書く
- 各セクションは「フック1文 → 具体例・説明 → まとめ」の流れで書く
- セクションをまたぐときは話題の接続が自然になるよう1文でブリッジを入れる

記事本文のみをMarkdown形式で出力してください。メタ情報や説明は含めないでください。`,
  };
}
