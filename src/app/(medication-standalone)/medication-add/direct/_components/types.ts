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
