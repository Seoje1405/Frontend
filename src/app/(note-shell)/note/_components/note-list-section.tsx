import { getNotePrescriptions } from '@/lib/data/note';
import { FileX } from 'lucide-react';
import { NoteListClient } from './note-list-client';

interface NoteListSectionProps {
  seniorId: number;
}

export async function NoteListSection({ seniorId }: NoteListSectionProps) {
  const prescriptions = await getNotePrescriptions(seniorId);

  if (prescriptions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 px-6 py-20 text-center">
        <FileX size={40} className="text-ink-400" aria-hidden />
        <p className="text-foreground text-xl font-semibold">등록된 약물이 없습니다</p>
        <p className="kr-wrap text-ink-500 text-sm">약을 등록하면 이곳에서 확인할 수 있어요.</p>
      </div>
    );
  }

  return <NoteListClient prescriptions={prescriptions} />;
}
