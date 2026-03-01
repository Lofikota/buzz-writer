import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { topic, goal, audience, tone, keywords, tweetStyle } = await req.json();

    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === "your_api_key_here") {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY が設定されていません。.env.local を確認してください。" },
        { status: 500 }
      );
    }

    const prompt = `あなたはX（Twitter）でバズる投稿を作るプロのコピーライターです。

以下の条件でX（Twitter）投稿を作成してください。

【トピック】
${topic}

【目的・ゴール】
${goal}

【ターゲット層】
${audience}

【トーン・雰囲気】
${tone}

【キーワード】
${keywords || "指定なし"}

【投稿スタイル】
${tweetStyle || "指定なし"}

【要件】
- 280文字以内（日本語の場合は140文字以内）
- ハッシュタグを1〜3個含める
- エンゲージメント（いいね・リポスト）を最大化する構成
- 読んだ人が思わずシェアしたくなる内容
- 冒頭1行でスクロールを止めるフックを入れる

投稿文のみを出力してください。説明や前置きは不要です。`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type");
    }

    return NextResponse.json({ tweet: content.text });
  } catch (error) {
    console.error("Generation error:", error);
    const message = error instanceof Error ? error.message : "生成中にエラーが発生しました";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
