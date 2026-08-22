'use client';

import {
  Drawer,
  DrawerDescription,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
} from '@/components/ui/drawer';
import { MAX_OCR_IMAGE_BYTES } from '@/lib/constants/upload';
import { useMedicationDraftStore } from '@/lib/stores/medication-draft-store';
import { useMedicationSheetStore } from '@/lib/stores/medication-sheet-store';
import { useOcrResultStore } from '@/lib/stores/ocr-result-store';
import type { OcrResultResponse } from '@/types/api';
import { ChevronRight, ClipboardPlus, PencilLine } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { ChangeEvent } from 'react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Drawer as DrawerPrimitive } from 'vaul';
import type { ImageSource } from './image-source-sheet';
import { ImageSourceSheet } from './image-source-sheet';

export function MedicationSheet() {
  const isOpen = useMedicationSheetStore((s) => s.isOpen);
  const close = useMedicationSheetStore((s) => s.close);
  const setOcrResult = useOcrResultStore((s) => s.setResult);
  const resetDraft = useMedicationDraftStore((s) => s.reset);
  const router = useRouter();
  const [imageSourceOpen, setImageSourceOpen] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const albumInputRef = useRef<HTMLInputElement>(null);

  function handleDirectInput() {
    close();
    resetDraft();
    router.push('/medication-add/direct');
  }

  function handleImageSelect(src: ImageSource) {
    if (src === 'camera') cameraInputRef.current?.click();
    else albumInputRef.current?.click();
  }

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (file.size > MAX_OCR_IMAGE_BYTES) {
      toast.error('이미지 용량이 너무 커요. 15MB 이하 사진을 선택해주세요.');
      return;
    }

    const formData = new FormData();
    formData.set('image', file);

    const toastId = toast.loading('사진을 분석하고 있어요...');
    try {
      const res = await fetch('/api/medications/ocr', { method: 'POST', body: formData });
      const json = (await res.json()) as OcrResultResponse | { message: string };
      if (!res.ok) {
        throw new Error('message' in json ? json.message : '사진 분석에 실패했어요.');
      }

      setOcrResult(json as OcrResultResponse);
      toast.success('사진 분석이 완료됐어요.', { id: toastId });
      close();
      router.push('/medication-add/direct');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '사진 분석에 실패했어요.', {
        id: toastId,
      });
    }
  }

  return (
    <>
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        ref={albumInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <Drawer open={isOpen} onOpenChange={(open) => !open && close()}>
        <DrawerPortal>
          <DrawerOverlay className="bg-black/40" />
          <DrawerPrimitive.Content className="z-modal bg-card fixed inset-x-0 bottom-0 mx-auto flex h-auto w-full max-w-[390px] flex-col rounded-t-2xl focus:outline-none">
            {/* drag handle */}
            <div className="bg-ink-300 mx-auto mt-3 mb-2 h-1.5 w-12 rounded-full" />
            <div className="flex flex-col gap-6 px-6 pt-4 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
              <div className="flex flex-col gap-2">
                <DrawerTitle className="text-2xl font-bold">어떻게 등록할까요?</DrawerTitle>
                <DrawerDescription className="text-muted-foreground kr-wrap text-base">
                  원하시는 등록 방식을 선택해주세요.
                </DrawerDescription>
              </div>
              <div className="flex w-full flex-col gap-3">
                <button
                  type="button"
                  onClick={() => setImageSourceOpen(true)}
                  className="hover:bg-accent hover:border-primary focus-visible:ring-primary flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-colors duration-150 focus-visible:ring-1 focus-visible:outline-none active:opacity-90"
                >
                  <div className="bg-med-blue-bg flex h-12 w-12 shrink-0 items-center justify-center rounded-lg">
                    <ClipboardPlus aria-hidden="true" className="text-primary h-6 w-6" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="text-foreground text-base font-semibold">
                      처방전 &amp; 약봉투 등록
                    </span>
                    <span className="text-muted-foreground kr-wrap text-sm">
                      사진 촬영으로 한 번에 쉽게 등록해요.
                    </span>
                  </div>
                  <ChevronRight
                    aria-hidden="true"
                    className="text-muted-foreground h-5 w-5 shrink-0"
                  />
                </button>
                <button
                  type="button"
                  onClick={handleDirectInput}
                  className="hover:bg-accent hover:border-primary focus-visible:ring-primary flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-colors duration-150 focus-visible:ring-1 focus-visible:outline-none active:opacity-90"
                >
                  <div className="bg-med-blue-bg flex h-12 w-12 shrink-0 items-center justify-center rounded-lg">
                    <PencilLine aria-hidden="true" className="text-ink-700 h-6 w-6" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="text-foreground text-base font-semibold">직접 입력</span>
                    <span className="text-muted-foreground kr-wrap text-sm">
                      약 이름과 복용법을 직접 작성해주세요.
                    </span>
                  </div>
                  <ChevronRight
                    aria-hidden="true"
                    className="text-muted-foreground h-5 w-5 shrink-0"
                  />
                </button>
              </div>
            </div>
          </DrawerPrimitive.Content>
        </DrawerPortal>
      </Drawer>

      <ImageSourceSheet
        open={imageSourceOpen}
        onOpenChange={setImageSourceOpen}
        onSelect={handleImageSelect}
      />
    </>
  );
}
