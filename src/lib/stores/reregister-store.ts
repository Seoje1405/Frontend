import type { MedicationDetailResponse } from '@/types/api';
import { create } from 'zustand';

interface ReregisterStore {
  details: MedicationDetailResponse[];
  hospitalName: string;
  setPrefill: (details: MedicationDetailResponse[], hospitalName: string) => void;
  clear: () => void;
}

// 약물노트 '재등록' 클릭 시 조회한 상세 정보를 medication-add/direct 폼으로 전달하기 위한 임시 저장소
// (ocr-result-store와 동일한 패턴 — 북마크 불필요한 일시적 상태)
export const useReregisterStore = create<ReregisterStore>((set) => ({
  details: [],
  hospitalName: '',
  setPrefill: (details, hospitalName) => set({ details, hospitalName }),
  clear: () => set({ details: [], hospitalName: '' }),
}));
