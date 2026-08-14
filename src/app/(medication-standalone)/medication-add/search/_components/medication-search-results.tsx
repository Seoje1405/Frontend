'use client';

import type { DrugSearchResponse } from '@/types/api';
import Link from 'next/link';
import { MedicationResultItem } from './medication-result-item';

interface MedicationSearchResultsProps {
  results: DrugSearchResponse[];
  selectedItemSeq: string | null;
  onSelect: (drug: DrugSearchResponse) => void;
  hasQuery: boolean;
}

export function MedicationSearchResults({
  results,
  selectedItemSeq,
  onSelect,
  hasQuery,
}: MedicationSearchResultsProps) {
  return (
    <>
      {/* 스크린 리더에게 검색 결과 변화를 알리는 live region */}
      <div role="status" aria-live="polite" className="sr-only">
        {hasQuery &&
          (results.length === 0 ? '검색 결과가 없습니다' : `검색 결과 ${results.length}건`)}
      </div>

      {!hasQuery && (
        <div className="flex flex-col items-center gap-3 py-14 text-center">
          <p className="text-muted-foreground kr-wrap text-sm">
            약 이름, 제조사 또는 분류로 검색하세요.
          </p>
          <Link
            href="/medication-add/direct"
            className="text-primary text-sm font-medium underline-offset-4 hover:underline"
          >
            직접 입력하기
          </Link>
        </div>
      )}

      {hasQuery && results.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <p className="text-muted-foreground kr-wrap text-sm">검색 결과가 없어요.</p>
          <Link
            href="/medication-add/direct"
            className="text-primary text-sm font-medium underline-offset-4 hover:underline"
          >
            찾는 약이 없나요? 직접 입력하기
          </Link>
        </div>
      )}

      {hasQuery && results.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground text-xs">검색 결과 {results.length}건</p>
          <ul className="flex flex-col gap-2" aria-label="검색 결과 목록">
            {results.map((drug) => (
              <li key={drug.itemSeq}>
                <MedicationResultItem
                  drug={drug}
                  isSelected={selectedItemSeq === drug.itemSeq}
                  onSelect={() => onSelect(drug)}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
