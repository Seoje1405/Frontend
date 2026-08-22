import { Suspense } from 'react';
import { MedicationSearchForm } from './_components/medication-search-form';

function SearchFormSkeleton() {
  return (
    <div aria-hidden="true" className="bg-surface flex min-h-dvh flex-col">
      {/* TopAppBar */}
      <div className="border-border bg-surface-2 sticky top-0 border-b px-2 pt-[env(safe-area-inset-top)]">
        <div className="flex h-14 items-center gap-3">
          <div className="bg-ink-200 size-9 animate-pulse rounded-md" />
          <div className="bg-ink-200 h-5 w-24 animate-pulse rounded" />
        </div>
      </div>

      {/* 검색창 스켈레톤 */}
      <div className="px-4 pt-4 pb-3">
        <div className="bg-ink-200 h-11 animate-pulse rounded-md" />
      </div>
    </div>
  );
}

export default function MedicationSearchPage() {
  return (
    <Suspense fallback={<SearchFormSkeleton />}>
      <MedicationSearchForm />
    </Suspense>
  );
}
