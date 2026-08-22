import { getMedicationDetail } from '@/lib/data/note';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MedAddCta } from './_components/med-add-cta';
import { MedDetailHero } from './_components/med-detail-hero';
import { MedDetailTabs } from './_components/med-detail-tabs';

type Params = Promise<{ id: string }>;

export default async function MedicationDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const medicationId = Number(id);
  if (!Number.isInteger(medicationId)) notFound();

  const detail = await getMedicationDetail(medicationId);
  if (!detail) notFound();

  return (
    <>
      {/* 헤더 */}
      <header className="z-sticky border-line bg-surface-2 sticky top-0 border-b px-2 pt-[env(safe-area-inset-top)]">
        <div className="flex h-14 items-center gap-3">
          <Link
            href="/note"
            aria-label="뒤로 가기"
            className="text-ink-700 focus-visible:ring-primary -m-2.5 rounded-md p-2.5 focus-visible:ring-2 focus-visible:outline-none"
          >
            <ChevronLeft size={22} aria-hidden />
          </Link>
          <p className="text-foreground text-xl font-semibold">약 상세 정보</p>
        </div>
      </header>

      {/* 본문 */}
      <main className="flex flex-1 flex-col pb-[max(7rem,calc(env(safe-area-inset-bottom)+7rem))]">
        <MedDetailHero
          name={detail.name}
          kind={detail.kind}
          color={detail.color}
          imageUrl={detail.imageUrl}
        />
        <MedDetailTabs detail={detail} />
      </main>

      {/* 하단 CTA */}
      <MedAddCta medicationName={detail.name} />
    </>
  );
}
