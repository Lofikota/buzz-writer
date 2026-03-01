import { WizardContainer } from "@/components/wizard/WizardContainer";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted/30 px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight">
            🐦 Buzz Writer
          </h1>
          <p className="mt-2 text-muted-foreground">
            AIがバズるX（Twitter）投稿を自動生成します
          </p>
        </div>
        <WizardContainer />
      </div>
    </main>
  );
}
