import {
  applyCardChange,
  createCard,
} from '@/app/(medication-standalone)/medication-add/direct/_components/card-factory';
import type { MedicationCard } from '@/app/(medication-standalone)/medication-add/direct/_components/types';
import { create } from 'zustand';

interface OcrMeta {
  ocrResultId: number | null;
  prescriptionDate: string | null;
}

interface MedicationDraftStore {
  cards: MedicationCard[];
  hospitalName: string;
  ocrMeta: OcrMeta;
  addCard: () => void;
  addCardWithDrug: (payload: {
    medicationName: string;
    nickname?: string;
    autoMemo?: string;
  }) => void;
  updateCard: (id: string, payload: Partial<MedicationCard>) => void;
  removeCard: (id: string) => void;
  setCards: (cards: MedicationCard[]) => void;
  setHospitalName: (hospitalName: string) => void;
  setOcrMeta: (ocrMeta: OcrMeta) => void;
  reset: () => void;
}

const initialOcrMeta: OcrMeta = { ocrResultId: null, prescriptionDate: null };

// 약 등록 폼(direct)의 카드/병원명/OCR 메타를 컴포넌트 바깥에 보관하는 임시 저장소
// direct <-> search 페이지 왕복 시 컴포넌트가 리마운트돼도 입력값이 유지되도록 함
export const useMedicationDraftStore = create<MedicationDraftStore>((set) => ({
  cards: [createCard()],
  hospitalName: '',
  ocrMeta: initialOcrMeta,
  addCard: () => set((state) => ({ cards: [...state.cards, createCard()] })),
  addCardWithDrug: (payload) =>
    set((state) => {
      // 아무것도 입력되지 않은 빈 카드를 제거 후 새 카드 추가
      const withoutEmpty = state.cards.filter(
        (c) => c.medicationName.trim() !== '' || c.nickname.trim() !== '',
      );
      return {
        cards: [
          ...withoutEmpty,
          createCard({
            medicationName: payload.medicationName,
            nickname: payload.nickname ?? '',
            autoMemo: payload.autoMemo ?? '',
          }),
        ],
      };
    }),
  updateCard: (id, payload) =>
    set((state) => ({
      cards: state.cards.map((card) => (card.id === id ? applyCardChange(card, payload) : card)),
    })),
  removeCard: (id) =>
    set((state) => {
      const filtered = state.cards.filter((c) => c.id !== id);
      return { cards: filtered.length > 0 ? filtered : [createCard()] };
    }),
  setCards: (cards) => set({ cards }),
  setHospitalName: (hospitalName) => set({ hospitalName }),
  setOcrMeta: (ocrMeta) => set({ ocrMeta }),
  reset: () => set({ cards: [createCard()], hospitalName: '', ocrMeta: initialOcrMeta }),
}));
