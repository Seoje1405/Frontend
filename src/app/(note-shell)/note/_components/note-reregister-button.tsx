'use client';

import { Button } from '@/components/ui/button';
import { useReregisterStore } from '@/lib/stores/reregister-store';
import type { MedicationDetailResponse } from '@/types/api';
import { RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';

interface NoteReregisterButtonProps {
  hospitalName?: string;
  medicationIds: string[];
}

export function NoteReregisterButton({ hospitalName, medicationIds }: NoteReregisterButtonProps) {
  const router = useRouter();
  const setPrefill = useReregisterStore((s) => s.setPrefill);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      try {
        const details = await Promise.all(
          medicationIds.map(async (id) => {
            const res = await fetch(`/api/medications/${id}`);
            if (!res.ok) throw new Error('약 정보를 불러오지 못했어요.');
            return (await res.json()) as MedicationDetailResponse;
          }),
        );
        setPrefill(details, hospitalName ?? '');
        router.push('/medication-add/direct');
      } catch {
        toast.error('약 정보를 불러오지 못했어요. 다시 시도해주세요.');
      }
    });
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={isPending}
      onClick={handleClick}
      className="border-primary text-primary hover:bg-accent mt-4 w-full gap-1.5"
    >
      <RefreshCw size={14} aria-hidden className={isPending ? 'animate-spin' : undefined} />
      {isPending ? '불러오는 중...' : '약물 재등록'}
    </Button>
  );
}
