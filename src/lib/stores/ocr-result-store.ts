import type { OcrResultResponse } from '@/types/api';
import { create } from 'zustand';

interface OcrResultStore {
  result: OcrResultResponse | null;
  setResult: (result: OcrResultResponse) => void;
  clear: () => void;
}

// OCR 스캔 결과(다건 배열)를 medication-sheet → medication-add/direct 로 전달하기 위한 임시 저장소
// URL로 넘기기엔 데이터가 크고, 북마크/공유가 필요 없는 일시적 상태라 zustand를 사용
export const useOcrResultStore = create<OcrResultStore>((set) => ({
  result: null,
  setResult: (result) => set({ result }),
  clear: () => set({ result: null }),
}));
