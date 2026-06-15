import { ChevronRight, ClipboardPlus, PencilLine } from 'lucide-react';

export default function MedicationBottomSheet() {
  return (
    <div className="bg-card flex w-full flex-col gap-6 rounded-t-2xl px-6 pt-8 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">어떻게 등록할까요?</h2>
        <p className="text-ink-500 kr-wrap text-base">원하시는 등록 방식을 선택해주세요.</p>
      </div>
      <div className="flex w-full flex-col gap-3">
        <button
          type="button"
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
          <ChevronRight aria-hidden="true" className="text-muted-foreground h-5 w-5 shrink-0" />
        </button>
        <button
          type="button"
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
          <ChevronRight aria-hidden="true" className="text-muted-foreground h-5 w-5 shrink-0" />
        </button>
      </div>
    </div>
  );
}
