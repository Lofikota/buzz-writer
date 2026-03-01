import { NextResponse } from "next/server";
import { getAnthropicClient, MODEL_ID, MAX_TOKENS } from "@/lib/anthropic";
import { buildOutlinePrompt } from "@/lib/prompts";
import type { ThemeInput, Direction, OutlineResponse } from "@/types/article";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      input: ThemeInput;
      direction: Direction;
    };

    if (!body.input || !body.direction) {
      return NextResponse.json(
        { success: false, error: "入力情報と方向性の選択は必須です" },
        { status: 400 }
      );
    }

    const { system, user } = buildOutlinePrompt(body.input, body.direction);

    const client = getAnthropicClient();
    const response = await client.messages.create({
      model: MODEL_ID,
      max_tokens: MAX_TOKENS,
      system,
      messages: [{ role: "user", content: user }],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) ||
      text.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return NextResponse.json(
        { success: false, error: "AIからの応答を解析できませんでした" },
        { status: 500 }
      );
    }

    const jsonStr = jsonMatch[1] || jsonMatch[0];
    const data = JSON.parse(jsonStr) as OutlineResponse;

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("[API] /api/outline error:", err);
    const message =
      err instanceof Error ? err.message : "構成の生成に失敗しました";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
