import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight">
            BuzzWriter
          </h1>
          <p className="text-xl text-muted-foreground">
            X（Twitter）でバズる記事を
            <br />
            5〜10分で生成する対話型ツール
          </p>
        </div>

        <div className="space-y-3 text-left bg-muted/50 rounded-lg p-6 text-sm">
          <h2 className="font-semibold text-base text-center mb-4">
            4ステップで完成
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex gap-3 items-start">
              <span className="bg-primary text-primary-foreground rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold shrink-0">
                1
              </span>
              <div>
                <p className="font-medium">テーマ入力</p>
                <p className="text-muted-foreground">テーマ・読者・CTA設定</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <span className="bg-primary text-primary-foreground rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold shrink-0">
                2
              </span>
              <div>
                <p className="font-medium">方向性選択</p>
                <p className="text-muted-foreground">AI提案から1つ選ぶ</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <span className="bg-primary text-primary-foreground rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold shrink-0">
                3
              </span>
              <div>
                <p className="font-medium">構成確認</p>
                <p className="text-muted-foreground">見出しを確認・編集</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <span className="bg-primary text-primary-foreground rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold shrink-0">
                4
              </span>
              <div>
                <p className="font-medium">記事生成</p>
                <p className="text-muted-foreground">ストリーミングで即完成</p>
              </div>
            </div>
          </div>
        </div>

        <Link href="/wizard">
          <Button size="lg" className="text-lg px-8 py-6">
            記事を作成する
          </Button>
        </Link>
      </div>
    </main>
  );
}
