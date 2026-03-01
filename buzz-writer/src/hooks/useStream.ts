"use client";

import { useCallback, useRef } from "react";
import { useArticleStore } from "@/store/articleStore";

export function useStream() {
  const abortRef = useRef<AbortController | null>(null);
  const setLoading = useArticleStore((s) => s.setLoading);
  const setError = useArticleStore((s) => s.setError);
  const appendArticleContent = useArticleStore((s) => s.appendArticleContent);
  const setArticleContent = useArticleStore((s) => s.setArticleContent);

  const startStream = useCallback(
    async (body: Record<string, unknown>) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setArticleContent("");
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/article", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: controller.signal,
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => null);
          throw new Error(
            errorData?.error || `APIエラー: ${res.status}`
          );
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("ストリームを取得できませんでした");

        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const text = decoder.decode(value, { stream: true });
          const lines = text.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const raw = line.slice(6);
              if (raw === "[DONE]") break;
              // サーバーでエンコードした \n を実際の改行に戻す
              const data = raw.replace(/\\n/g, "\n");
              appendArticleContent(data);
            }
          }
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        setError(
          err instanceof Error ? err.message : "記事生成中にエラーが発生しました"
        );
      } finally {
        setLoading(false);
        abortRef.current = null;
      }
    },
    [setLoading, setError, appendArticleContent, setArticleContent]
  );

  const cancelStream = useCallback(() => {
    abortRef.current?.abort();
    setLoading(false);
  }, [setLoading]);

  return { startStream, cancelStream };
}
