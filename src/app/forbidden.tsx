import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import Link from 'next/link';

export default function ForbiddenPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center font-sans">
      <main className="bg-surface flex w-full max-w-[390px] flex-1 flex-col items-center justify-center p-8">
        <div className="bg-secondary mb-8 flex h-20 w-20 items-center justify-center rounded-2xl">
          <Lock className="text-primary" size={40} strokeWidth={1.8} />
        </div>

        <h1 className="text-ink-900 text-2xl font-bold">접근할 수 없어요</h1>

        <p className="text-ink-700 kr-wrap mt-4 text-center text-base">
          이 페이지에 접근할 권한이 없어요.
        </p>

        <div className="mt-8 w-full">
          <Button size="cta" asChild>
            <Link href="/home">홈으로 가기</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
