export type DosingTime = 'morning' | 'noon' | 'night';

export type MedicationCard = {
  id: string;
  nickname: string;
  medicationName: string;
  frequency: 1 | 2 | 3 | null;
  dosagePerOnce: string;
  dosingTimes: DosingTime[];
  memo: string;
  autoMemo: string;
  startDate: Date | null;
  endDate: Date | null;
};

export type CardAction =
  | { type: 'ADD_CARD' }
  | {
      type: 'ADD_CARD_WITH_DRUG';
      payload: Pick<MedicationCard, 'medicationName'> & { autoMemo?: string };
    }
  | { type: 'ADD_CARDS_FROM_OCR'; payload: MedicationCard[] }
  | { type: 'REMOVE_CARD'; id: string }
  | { type: 'UPDATE_CARD'; id: string; payload: Partial<MedicationCard> };
