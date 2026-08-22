import { create } from 'zustand';

interface DeleteTarget {
  medicationId: string;
  medicationName: string;
}

interface NoteDeleteDialogStore {
  target: DeleteTarget | null;
  open: (target: DeleteTarget) => void;
  close: () => void;
}

// 삭제 확인 Dialog를 약물 행(NoteMedItem)이 아닌 (note-shell)layout에 전역으로 마운트하기 위한 스토어
// — 삭제 시 revalidatePath('/note')로 행이 사라지는 것과 Dialog가 닫히는 것이 같은 트랜지션에서 겹치면
// Radix Dialog의 pointer-events 정리 이펙트가 실행되지 못해 전체 클릭이 먹통이 되는 문제를 방지한다.
export const useNoteDeleteDialogStore = create<NoteDeleteDialogStore>((set) => ({
  target: null,
  open: (target) => set({ target }),
  close: () => set({ target: null }),
}));
