import Anthropic from "@anthropic-ai/sdk";

export const MODEL_ID = "claude-sonnet-4-20250514";
export const MAX_TOKENS = 4096;

let _client: Anthropic | null = null;

/**
 * Anthropicクライアントを遅延初期化で取得する。
 * APIキーが未設定の場合はわかりやすいエラーをthrowする。
 */
export function getAnthropicClient(): Anthropic {
  if (_client) return _client;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY が設定されていません。.env.local にAPIキーを設定してください。"
    );
  }

  _client = new Anthropic({ apiKey });
  return _client;
}
