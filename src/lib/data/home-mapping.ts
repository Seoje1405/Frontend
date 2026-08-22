import type { SessionMealTimes } from '@/lib/auth/session';
import { hashMedColor } from '@/lib/constants/med-colors';
import { parseNicknamePrefix } from '@/lib/data/nickname';
import { fromHHmm } from '@/lib/schema/meal-time';
import type {
  DateMode,
  HomeCardResponse,
  HospitalGroupResponse,
  MealGroupResponse,
  MealTime,
  MedicationCardResponse,
} from '@/types/api';
import type {
  CurrentCardData,
  HospitalGroup,
  MealGroup,
  MealType,
  Medication,
  NextMedication,
} from './types';

// BEDTIME은 별도 시간대로 숨기지 않고 저녁(night) 그룹에 병합 표시(복약 누락 방지 우선)
const MEAL_TIME_TO_TYPE: Record<MealTime, MealType> = {
  BREAKFAST: 'morning',
  LUNCH: 'noon',
  DINNER: 'night',
  BEDTIME: 'night',
};

const MEAL_TYPE_LABEL: Record<MealType, string> = {
  morning: '아침',
  noon: '점심',
  night: '저녁',
};

const MEAL_TYPE_ORDER: MealType[] = ['morning', 'noon', 'night'];

function isCounted(med: MedicationCardResponse, mode: DateMode): boolean {
  return mode === 'PAST' ? med.completedStatus !== null : med.isTaken !== null;
}

function isDone(med: MedicationCardResponse, mode: DateMode): boolean {
  return mode === 'PAST' ? med.completedStatus === 'COMPLETED' : med.isTaken === true;
}

function toDosageInfo(med: MedicationCardResponse): string[] {
  const info: string[] = [];
  if (med.timesPerDay) info.push(`1일 ${med.timesPerDay}회`);
  if (med.dosagePerTime) info.push(`1회 ${med.dosagePerTime}`);
  if (med.totalDays) info.push(`${med.totalDays}일 복용`);
  return info;
}

function toMedication(med: MedicationCardResponse, mealTime: MealTime, mode: DateMode): Medication {
  // drugType(약 종류) 미제공 시, drugName에 박혀있는 별명으로 대체 표시(대괄호는 이름에서 제거)
  const { nickname, name } = med.drugType
    ? { nickname: null, name: med.drugName }
    : parseNicknamePrefix(med.drugName);

  return {
    id: med.medicationId,
    name,
    kind: med.drugType ?? nickname ?? undefined,
    use: toDosageInfo(med),
    color: hashMedColor(med.medicationId),
    checked: isDone(med, mode),
    mealTime,
    editable: mode === 'TODAY',
  };
}

function toHospitalGroup(
  group: HospitalGroupResponse,
  mealTime: MealTime,
  mode: DateMode,
): HospitalGroup {
  return {
    id: group.hospitalId ?? undefined,
    hospital: group.hospitalName ?? undefined,
    medications: group.medications.map((med) => toMedication(med, mealTime, mode)),
  };
}

// 같은 병원(hospitalId)이 여러 mealGroup(예: DINNER, BEDTIME)에 걸쳐 나오면 하나로 합침
function mergeHospitalGroups(base: HospitalGroup[], extra: HospitalGroup[]): HospitalGroup[] {
  // hospitalId가 없는 병원은 이름으로 구분(동일 키로 묶여 서로 다른 병원이 병합되는 것 방지)
  const keyOf = (group: HospitalGroup) =>
    group.id != null ? `id:${group.id}` : `name:${group.hospital ?? ''}`;
  const merged = new Map(
    base.map((group) => [keyOf(group), { ...group, medications: [...group.medications] }]),
  );

  for (const group of extra) {
    const key = keyOf(group);
    const existing = merged.get(key);
    if (existing) {
      existing.medications.push(...group.medications);
    } else {
      merged.set(key, { ...group, medications: [...group.medications] });
    }
  }

  return Array.from(merged.values());
}

function formatMealTimeLabel(mealType: MealType, mealTimes: SessionMealTimes | undefined): string {
  const hhmm = mealTimes?.[mealType];
  return hhmm ? fromHHmm(hhmm) : MEAL_TYPE_LABEL[mealType];
}

export function toMealGroups(
  mealGroups: MealGroupResponse[],
  mode: DateMode,
  dateISO: string,
  mealTimes: SessionMealTimes | undefined,
): MealGroup[] {
  const buckets = new Map<MealType, HospitalGroup[]>();

  for (const group of mealGroups) {
    const feType = MEAL_TIME_TO_TYPE[group.mealTime];
    const converted = group.hospitalGroups.map((g) => toHospitalGroup(g, group.mealTime, mode));
    buckets.set(feType, mergeHospitalGroups(buckets.get(feType) ?? [], converted));
  }

  return MEAL_TYPE_ORDER.filter((type) => (buckets.get(type)?.length ?? 0) > 0).map((type) => {
    const hhmm = mealTimes?.[type];
    return {
      mealname: MEAL_TYPE_LABEL[type],
      mealType: type,
      time: formatMealTimeLabel(type, mealTimes),
      dateTime: hhmm ? `${dateISO}T${hhmm}` : dateISO,
      hospitals: buckets.get(type) ?? [],
    };
  });
}

export function deriveCurrentCard(
  home: HomeCardResponse,
  patientName: string,
  mealTimes: SessionMealTimes | undefined,
): Omit<CurrentCardData, 'id'> {
  const entries: { med: MedicationCardResponse; feType: MealType }[] = [];
  for (const group of home.mealGroups) {
    const feType = MEAL_TIME_TO_TYPE[group.mealTime];
    for (const hospitalGroup of group.hospitalGroups) {
      for (const med of hospitalGroup.medications) {
        entries.push({ med, feType });
      }
    }
  }

  const counted = entries.filter(({ med }) => isCounted(med, home.mode));
  const total = counted.length;
  const completed = counted.filter(({ med }) => isDone(med, home.mode)).length;

  let nextMedication: NextMedication | undefined;
  if (home.mode === 'TODAY') {
    const incomplete = counted.filter(({ med }) => !isDone(med, home.mode));
    const nextType = MEAL_TYPE_ORDER.find((type) =>
      incomplete.some((entry) => entry.feType === type),
    );
    const next = incomplete.find((entry) => entry.feType === nextType);

    if (next && nextType) {
      nextMedication = {
        time: formatMealTimeLabel(nextType, mealTimes),
        name: next.med.drugName,
        extraCount: incomplete.length - 1,
      };
    }
  }

  return { patientName, total, completed, nextMedication };
}
