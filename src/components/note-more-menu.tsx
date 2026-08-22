'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNoteDeleteDialogStore } from '@/lib/stores/note-delete-dialog-store';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface NoteMoreMenuProps {
  medicationId: string;
  medicationName: string;
}

// 실제 삭제 확인 Dialog는 (note-shell)layout에 전역 마운트된 NoteDeleteDialog가 담당
// — 이 컴포넌트는 목록 항목과 함께 언마운트되므로 Dialog를 직접 소유하면 안 됨 (note-delete-dialog-store.ts 참고)
export function NoteMoreMenu({ medicationId, medicationName }: NoteMoreMenuProps) {
  const router = useRouter();
  const openDeleteDialog = useNoteDeleteDialogStore((s) => s.open);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`${medicationName} 더보기`}
          className="text-ink-700 focus-visible:ring-primary -m-2.5 rounded-md p-2.5 hover:opacity-70 focus-visible:ring-2 focus-visible:outline-none"
        >
          <MoreVertical size={18} aria-hidden />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="cursor-pointer gap-2"
          onClick={() => router.push(`/note/${medicationId}/edit`)}
        >
          <Pencil size={15} className="text-ink-500" aria-hidden />
          약물 수정
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-danger focus:text-danger focus:bg-danger-bg cursor-pointer gap-2"
          onClick={() => openDeleteDialog({ medicationId, medicationName })}
        >
          <Trash2 size={15} aria-hidden />
          약물 삭제
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
