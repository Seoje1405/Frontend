'use client';

import { Search, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export function NoteSearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') ?? '';

  function goToSearch() {
    router.push(query ? `/note/search?q=${encodeURIComponent(query)}` : '/note/search');
  }

  return (
    <div className="border-line bg-card focus-within:ring-primary relative flex w-full items-center gap-2.5 rounded-xl border px-3.5 py-3 transition-colors focus-within:ring-2">
      <button
        type="button"
        aria-label="약명, 약 종류, 병원명으로 검색"
        onClick={goToSearch}
        className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
      >
        <Search size={17} className="text-ink-400 shrink-0" aria-hidden />
        {query ? (
          <span className="text-foreground truncate text-sm">{query}</span>
        ) : (
          <span className="text-ink-500 text-sm">약명, 약 종류, 병원명을 입력하세요</span>
        )}
      </button>
      {query ? (
        <button
          type="button"
          aria-label="검색 결과 지우기"
          onClick={() => router.push('/note')}
          className="text-ink-400 hover:text-ink-700 focus-visible:ring-primary -m-2.5 shrink-0 rounded-md p-2.5 transition-colors focus-visible:ring-1 focus-visible:outline-none"
        >
          <X size={15} aria-hidden />
        </button>
      ) : null}
    </div>
  );
}
