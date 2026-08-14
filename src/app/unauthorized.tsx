import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center font-sans">
      <main className="bg-surface flex w-full max-w-[390px] flex-1 flex-col items-center justify-center p-8">
        <div className="bg-secondary mb-8 flex h-20 w-20 items-center justify-center rounded-2xl">
          <ShieldAlert className="text-primary" size={40} strokeWidth={1.8} />
        </div>

        <h1 className="text-ink-900 text-2xl font-bold">로그인이 필요해요</h1>

        <p className="text-ink-700 kr-wrap mt-4 text-center text-base">
          세션이 만료되었거나 로그인되지 않았어요.
          <br />
          다시 로그인해주세요.
        </p>

        <div className="mt-8 w-full">
          <Button size="cta" asChild>
            <Link href="/onboarding">로그인하러 가기</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
