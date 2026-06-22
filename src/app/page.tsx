import { Button } from '@/components/ui/button';
import { Pill } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center font-sans">
      <main className="bg-surface flex w-full max-w-[390px] flex-1 flex-col items-center justify-center p-8 shadow-sm">
        <div className="bg-secondary mb-8 flex h-20 w-20 items-center justify-center rounded-2xl">
          <Pill className="text-primary" size={40} strokeWidth={1.8} />
        </div>

        <h1 className="text-ink-900 text-2xl font-bold">온길 (Ongil)</h1>

        <p className="text-ink-700 kr-wrap mt-4 text-center text-base">
          부모님의 건강한 일상을 지키는
          <br />
          스마트 복약 관리 서비스입니다.
        </p>

        <div className="mt-8 w-full">
          <Button size="cta" asChild>
            <Link href="/onboarding">시작하기</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
