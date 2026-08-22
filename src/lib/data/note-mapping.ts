import { hashMedColor } from '@/lib/constants/med-colors';
import type {
  MedicationDetailResponse,
  MedicationNoteGroupResponse,
  MedicationNoteItemResponse,
} from '@/types/api';
import dayjs from 'dayjs';
import { parseNicknamePrefix } from './nickname';
import type {
  MedicationEditInitialValues,
  NoteHospitalGroup,
  NoteMedication,
  NoteMedicationDetail,
  NotePrescription,
  NoteStatus,
} from './types';

// 상세 탭(효능·효과/주의사항/부작용)에 대응하는 백엔드 필드가 없어 공통 안내 문구로 채움
const NO_INFO_TEXT = '제공되는 정보가 없습니다.';

// 백엔드는 isActive(boolean)만 제공 — 'stopped'(복용 중단)에 대응하는 데이터가 없어 파생 불가
function toNoteStatus(isActive: boolean): NoteStatus {
  return isActive ? 'active' : 'completed';
}

function toDosageInfo(item: MedicationNoteItemResponse): string[] {
  const info: string[] = [];
  if (item.timesPerDay) info.push(`1일 ${item.timesPerDay}회`);
  if (item.dosagePerTime) info.push(`1회 ${item.dosagePerTime}`);
  if (item.totalDays) info.push(`${item.totalDays}일 복용`);
  return info;
}

function toNoteMedication(item: MedicationNoteItemResponse): NoteMedication {
  // drugType(약 종류) 미제공 시, drugName에 박혀있는 별명으로 대체 표시(대괄호는 이름에서 제거)
  const { nickname, name } = item.drugType
    ? { nickname: null, name: item.drugName }
    : parseNicknamePrefix(item.drugName);

  return {
    id: String(item.medicationId),
    name,
    kind: item.drugType ?? nickname ?? '',
    dosageInfo: toDosageInfo(item),
    status: toNoteStatus(item.isActive),
    color: hashMedColor(item.medicationId),
  };
}

// 그룹 내 약이 모두 복용 완료 상태일 때만 재등록 버튼 노출(진행 중인 처방은 재등록 대상이 아님)
function shouldShowReregistration(medications: NoteMedication[]): boolean {
  return medications.length > 0 && medications.every((med) => med.status === 'completed');
}

export function toNotePrescriptions(groups: MedicationNoteGroupResponse[]): NotePrescription[] {
  const byDate = new Map<string, NoteHospitalGroup[]>();

  for (const group of groups) {
    const medications = group.medications.map(toNoteMedication);
    const hospitalGroup: NoteHospitalGroup = {
      id: `${group.prescriptionDate}-${group.hospitalName ?? 'unknown'}`,
      hospitalName: group.hospitalName ?? undefined,
      medications,
      showReregistration: shouldShowReregistration(medications),
    };

    const list = byDate.get(group.prescriptionDate) ?? [];
    list.push(hospitalGroup);
    byDate.set(group.prescriptionDate, list);
  }

  return Array.from(byDate.entries())
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .map(([prescriptionDate, hospitals]) => ({
      id: prescriptionDate,
      prescriptionDate: dayjs(prescriptionDate).format('YYYY.MM.DD'),
      hospitals,
    }));
}

// 탭 구조(효능·효과/용법·용량/주의사항/부작용)는 유지하되, 대응 필드가 있는 용법·용량만 실데이터를 채움
export function toNoteMedicationDetail(detail: MedicationDetailResponse): NoteMedicationDetail {
  return {
    id: String(detail.medicationId),
    name: detail.drugName,
    kind: detail.drugType ?? '',
    color: hashMedColor(detail.medicationId),
    imageUrl: detail.imageUrl ?? undefined,
    tabs: {
      efficacy: NO_INFO_TEXT,
      dosage: detail.usageStorageInfo ?? NO_INFO_TEXT,
      caution: NO_INFO_TEXT,
      sideEffect: NO_INFO_TEXT,
    },
  };
}

// 수정 폼이 실제 쓰는 필드만 추려 RSC 경계로 넘기는 직렬화량을 최소화
export function toMedicationEditInitialValues(
  detail: MedicationDetailResponse,
): MedicationEditInitialValues {
  return {
    drugNickname: detail.drugNickname,
    drugName: detail.drugName,
    dosagePerTime: detail.dosagePerTime,
    timesPerDay: detail.timesPerDay,
    memo: detail.memo,
    startDate: detail.startDate,
    endDate: detail.endDate,
    hospitalName: detail.hospitalName,
  };
}
