# BuzzWriter - Xバズ記事生成ツール

## プロジェクト概要

X（Twitter）向けSEO・バズ記事を5〜10分で生成する対話型ツール。
全自動ではなく、4ステップの対話形式でユーザーが判断を入れながら記事を完成させる。

### 記事設計の核心

- **表の目的**: 読者が共感する普遍的テーマを入口にする
- **裏の目的**: ビジネスの採用・集客CTAに自然に誘導する
- **バズ設計**: 賛否が生まれる尖った主張＋シェアされるひと言を必ず入れる
- **導線**: 共感 → 独自視点・価値提供 → CTA（採用/集客）
- **主軸**: Xバズ狙い（SEOは副次的）
- **対象言語**: 日本語のみ

## 技術スタック

- Next.js 14（App Router）
- TypeScript（strict mode）
- Tailwind CSS v4
- shadcn/ui
- Anthropic SDK（claude-sonnet-4-20250514）
- SSEストリーミング（記事生成API）
- Zustand（状態管理）

## コマンド

```bash
npm run dev      # 開発サーバー起動（http://localhost:3000）
npm run build    # プロダクションビルド
npm run lint     # ESLintチェック
```

## フォルダ構成

```
src/
├── app/
│   ├── page.tsx                    # ホーム画面
│   ├── layout.tsx                  # ルートレイアウト
│   ├── wizard/page.tsx             # ウィザード画面（メイン機能）
│   └── api/
│       ├── directions/route.ts     # 方向性提案API（JSON返却）
│       ├── outline/route.ts        # 構成生成API（JSON返却）
│       └── article/route.ts        # 記事生成API（SSEストリーミング）
├── components/
│   ├── wizard/
│   │   ├── StepIndicator.tsx       # ステップ進捗バー
│   │   ├── ThemeInputStep.tsx      # Step1: テーマ入力フォーム
│   │   ├── DirectionStep.tsx       # Step2: 方向性カード選択
│   │   ├── OutlineStep.tsx         # Step3: 構成確認・編集
│   │   └── ArticleStep.tsx         # Step4: 記事表示・コピー
│   └── ui/                         # shadcn/uiコンポーネント
├── hooks/
│   ├── useWizard.ts                # ステップ管理hook
│   └── useStream.ts                # SSEストリーミングhook
├── lib/
│   ├── anthropic.ts                # Anthropicクライアント初期化
│   ├── prompts.ts                  # プロンプトテンプレート集（★重要）
│   └── utils.ts                    # shadcn/uiユーティリティ
├── store/
│   └── articleStore.ts             # Zustandストア
└── types/
    └── article.ts                  # 型定義
```

## 開発ルール

### コーディング規約

- コンポーネントはすべてTypeScript（`.tsx`）
- APIルートはすべてエラーハンドリング必須（try-catch + 適切なステータスコード）
- **プロンプトはすべて `src/lib/prompts.ts` に集約する**（APIルートやコンポーネントに直接書かない）
- 状態管理は Zustand の `useArticleStore` に集約
- クライアントコンポーネントには `"use client"` を明記

### API設計

| エンドポイント | メソッド | 入力 | 出力 |
|---|---|---|---|
| `/api/directions` | POST | `ThemeInput` | `Direction[]`（JSON） |
| `/api/outline` | POST | `ThemeInput` + `Direction` | `OutlineItem[]`（JSON） |
| `/api/article` | POST | `ThemeInput` + `Direction` + `OutlineItem[]` | テキスト（SSE） |

### 生成フロー

```
Step1: テーマ入力 → /api/directions → Step2: 方向性選択
→ /api/outline → Step3: 構成確認 → /api/article（SSE）→ Step4: 記事表示
```

### プロンプト修正時の注意

- `src/lib/prompts.ts` の `SYSTEM_BASE` がすべてのAPI呼び出しの共通システムプロンプト
- `buildDirectionsPrompt()`: 方向性提案用（JSON出力を指示）
- `buildOutlinePrompt()`: 構成生成用（JSON出力を指示）
- `buildArticlePrompt()`: 記事本文生成用（Markdown出力を指示）
- プロンプト変更時は対応するAPIルートのJSON/テキストパースに影響がないか確認

### 環境変数

```
ANTHROPIC_API_KEY=  # 必須。Anthropic ConsoleのAPIキー
```

## 注意事項

- `.env.local` はgitignoreされている。`.env.example` をコピーして使用する
- ストリーミング中はUIをブロックしない（`useStream` hookが管理）
- 記事保存機能は未実装（将来的にlocalStorageで対応予定）
- 将来Vercelにデプロイする可能性あり
