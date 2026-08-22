'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { deleteMedication } from '@/lib/actions/medication';
import { useNoteDeleteDialogStore } from '@/lib/stores/note-delete-dialog-store';
import { useTransition } from 'react';
import { toast } from 'sonner';

// 약물 행(NoteMedItem)이 삭제로 사라져도 Dialog 자체는 언마운트되지 않도록 (note-shell)layout에 고정 마운트
// — 자세한 배경은 note-delete-dialog-store.ts 주석 참고
export function NoteDeleteDialog() {
  const target = useNoteDeleteDialogStore((s) => s.target);
  const close = useNoteDeleteDialogStore((s) => s.close);
  const [isDeleting, startDeleteTransition] = useTransition();

  function handleConfirmDelete() {
    if (!target) return;

    startDeleteTransition(async () => {
      const result = await deleteMedication(Number(target.medicationId));

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      toast.success('약물이 삭제되었어요.');
      close();
    });
  }

  return (
    <Dialog open={target !== null} onOpenChange={(open) => !open && close()}>
      <DialogContent hideClose className="max-w-[calc(390px-2rem)] rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-foreground text-xl font-semibold">
            {target?.medicationName}을(를) 삭제할까요?
          </DialogTitle>
          <DialogDescription className="kr-wrap text-ink-500 mt-1 text-sm">
            삭제한 약물은 복구할 수 없습니다.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-2 flex flex-row gap-2">
          <DialogClose asChild>
            <Button variant="outline" className="flex-1" disabled={isDeleting}>
              취소
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            className="flex-1"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? '삭제 중...' : '삭제'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
