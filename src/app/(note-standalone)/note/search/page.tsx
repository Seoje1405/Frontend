'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { RecentSearches, useRecentSearches } from './_components/recent-searches';
import { SearchInput } from './_components/search-input';

function NoteSearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const { recents, addRecent, removeRecent, clearAll } = useRecentSearches();

  // 검색어를 쿼리로 들고 목록 페이지(/note)로 돌아가서 그 자리에서 결과를 보여줌
  function goToResults(q: string) {
    const trimmed = q.trim();
    if (!trimmed) return;
    addRecent(trimmed);
    router.push(`/note?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <>
      <h1 className="sr-only">약물 검색</h1>
      <SearchInput value={query} onSearch={setQuery} onSubmit={goToResults} />

      <div className="flex-1 pt-2">
        <RecentSearches
          recents={recents}
          onSelect={goToResults}
          onRemove={removeRecent}
          onClearAll={clearAll}
        />
      </div>
    </>
  );
}

export default function NoteSearchPage() {
  return (
    <Suspense>
      <NoteSearchContent />
    </Suspense>
  );
}
