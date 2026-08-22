import { BottomNav } from '@/components/layout/bottom-nav';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { NoteSearchBar } from './note/_components/note-search-bar';

const MedicationSheet = dynamic(() =>
  import('@/components/layout/medication-sheet').then((m) => m.MedicationSheet),
);

const NoteDeleteDialog = dynamic(() =>
  import('@/components/layout/note-delete-dialog').then((m) => m.NoteDeleteDialog),
);

export default function NoteShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="border-line bg-surface-2 z-sticky fixed top-0 left-1/2 w-full max-w-[390px] -translate-x-1/2 border-b px-4 pt-[calc(1rem+env(safe-area-inset-top))] pb-3">
        <Suspense fallback={<div className="border-line bg-card h-[3.125rem] rounded-xl border" />}>
          <NoteSearchBar />
        </Suspense>
      </header>
      <main className="mx-auto mt-(--header-height) max-w-[390px] pb-(--bottom-nav-actual-height)">
        {children}
      </main>
      <BottomNav className="z-sticky fixed bottom-0 left-1/2 w-full max-w-[390px] -translate-x-1/2" />
      <MedicationSheet />
      <NoteDeleteDialog />
    </>
  );
}
