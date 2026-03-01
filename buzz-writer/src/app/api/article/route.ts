import { getAnthropicClient, MODEL_ID, MAX_TOKENS } from "@/lib/anthropic";
import { buildArticlePrompt } from "@/lib/prompts";
import type { ThemeInput, Direction, OutlineItem } from "@/types/article";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      input: ThemeInput;
      direction: Direction;
      outline: OutlineItem[];
    };

    if (!body.input || !body.direction || !body.outline?.length) {
      return new Response(
        JSON.stringify({ error: "入力情報、方向性、構成はすべて必須です" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { system, user } = buildArticlePrompt(
      body.input,
      body.direction,
      body.outline
    );

    const client = getAnthropicClient();
    const stream = client.messages.stream({
      model: MODEL_ID,
      max_tokens: MAX_TOKENS,
      system,
      messages: [{ role: "user", content: user }],
    });

    // SSEストリーム作成
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              // 改行を \n（リテラル）にエンコードしてSSE行分割バグを防ぐ
              const encoded = event.delta.text.replace(/\n/g, "\\n");
              const chunk = `data: ${encoded}\n\n`;
              controller.enqueue(encoder.encode(chunk));
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          console.error("[API] /api/article stream error:", err);
          const errorMsg =
            err instanceof Error ? err.message : "ストリーミング中にエラー";
          controller.enqueue(
            encoder.encode(`data: [ERROR] ${errorMsg}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("[API] /api/article error:", err);
    const message =
      err instanceof Error ? err.message : "記事生成の開始に失敗しました";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
