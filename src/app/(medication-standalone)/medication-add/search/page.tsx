'use client';

import { Button } from '@/components/ui/button';
import { useKeywordSearch } from '@/hooks/use-keyword-search';
import { useMedicationDraftStore } from '@/lib/stores/medication-draft-store';
import { cn } from '@/lib/utils';
import type { DrugAutofillResponse, DrugSearchResponse } from '@/types/api';
import { ChevronLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { MedicationSearchInput } from './_components/medication-search-input';
import { MedicationSearchResults } from './_components/medication-search-results';

export default function MedicationSearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cardId = searchParams.get('cardId');
  const addCard = useMedicationDraftStore((s) => s.addCard);
  const [query, setQuery] = useState('');
  const [selectedDrug, setSelectedDrug] = useState<DrugSearchResponse | null>(null);
  const [isConfirming, startConfirmTransition] = useTransition();
  const { results, isLoading, hasQuery, error } = useKeywordSearch<DrugSearchResponse>(
    query,
    '/api/drugs/search',
  );

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  function handleSelect(drug: DrugSearchResponse) {
    setSelectedDrug((prev) => (prev?.itemSeq === drug.itemSeq ? null : drug));
  }

  // 카드 지정 없이(=약 추가하기 흐름) 들어온 경우에만 빈 카드를 새로 만들고, 특정 카드 검색 중이었다면 그 카드로 그대로 복귀
  function handleManualEntry() {
    if (!cardId) addCard();
    router.push('/medication-add/direct');
  }

  function handleConfirm() {
    if (!selectedDrug) return;

    startConfirmTransition(async () => {
      // 자동완성 실패해도 이름만이라도 넘겨줄 수 있도록 개별 try/catch로 처리
      let autoMemo = '';
      try {
        const res = await fetch(
          `/api/drugs/autofill?itemSeq=${encodeURIComponent(selectedDrug.itemSeq)}`,
        );
        if (res.ok) {
          const autofill = (await res.json()) as DrugAutofillResponse;
          autoMemo = autofill.memo ?? '';
        }
      } catch {
        // 무시하고 이름만 전달
      }

      const params = new URLSearchParams({
        drugName: selectedDrug.itemName,
        ts: String(Date.now()),
      });
      if (autoMemo) params.set('autoMemo', autoMemo);
      if (selectedDrug.spcltyPblc) params.set('nickname', selectedDrug.spcltyPblc);
      if (cardId) params.set('cardId', cardId);

      router.push(`/medication-add/direct?${params.toString()}`);
    });
  }

  return (
    <div className="bg-surface flex min-h-dvh flex-col">
      {/* TopAppBar */}
      <header className="z-sticky border-border bg-surface-2 sticky top-0 border-b px-2 pt-[env(safe-area-inset-top)]">
        <div className="flex h-14 items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="뒤로 가기"
            className="text-primary focus-visible:ring-primary -m-2.5 p-2.5 focus-visible:rounded-md focus-visible:ring-2 focus-visible:outline-none"
          >
            <ChevronLeft size={22} aria-hidden />
          </button>
          <h1 className="text-foreground text-xl font-semibold">약 추가하기</h1>
        </div>
      </header>

      {/* 검색창 */}
      <div className="px-4 pt-4 pb-3">
        <MedicationSearchInput value={query} onChange={setQuery} />
      </div>

      {/* 검색 결과 */}
      <div
        className={cn(
          'flex-1 overflow-y-auto px-4 transition-opacity duration-150',
          selectedDrug ? 'pb-[max(7rem,calc(env(safe-area-inset-bottom)+7rem))]' : 'pb-4',
          isLoading && 'opacity-60',
        )}
      >
        <MedicationSearchResults
          results={results}
          selectedItemSeq={selectedDrug?.itemSeq ?? null}
          onSelect={handleSelect}
          hasQuery={hasQuery}
          onManualEntry={handleManualEntry}
        />
      </div>

      {/* 하단 CTA — 선택 시만 표시 */}
      {selectedDrug !== null ? (
        <div className="border-border bg-card fixed bottom-0 left-1/2 w-full max-w-[390px] -translate-x-1/2 border-t px-4 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <Button size="cta" onClick={handleConfirm} disabled={isConfirming}>
            선택하기
          </Button>
        </div>
      ) : null}
    </div>
  );
}
