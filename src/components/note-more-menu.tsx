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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { deleteMedication } from '@/lib/actions/medication';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

interface NoteMoreMenuProps {
  medicationId: string;
  medicationName: string;
}

export function NoteMoreMenu({ medicationId, medicationName }: NoteMoreMenuProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, startDeleteTransition] = useTransition();

  function handleConfirmDelete() {
    startDeleteTransition(async () => {
      const result = await deleteMedication(Number(medicationId));

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      toast.success('약물이 삭제되었어요.');
      setDeleteDialogOpen(false);
    });
  }

  return (
    <>
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
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 size={15} aria-hidden />
            약물 삭제
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent hideClose className="max-w-[calc(390px-2rem)] rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-foreground text-xl font-semibold">
              {medicationName}을(를) 삭제할까요?
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
    </>
  );
}
