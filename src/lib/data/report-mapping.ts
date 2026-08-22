import { hashMedColor } from '@/lib/constants/med-colors';
import type {
  ConflictDrug,
  DrugConflictResponse,
  MedicationReportGroupResponse,
  MedicationReportItemResponse,
} from '@/types/api';
import dayjs from 'dayjs';
import { parseNicknamePrefix } from './nickname';
import type {
  DrugInteractionDrug,
  DrugInteractionPair,
  MedColor,
  ReportHospitalGroup,
  ReportMedication,
  ReportMedicationStatus,
} from './types';

// 진행 중인 약(endDate 없음)이 아니면 endDate와 오늘 날짜를 비교해 파생(백엔드는 status를 내려주지 않음)
function toReportMedicationStatus(endDate: string | null): ReportMedicationStatus {
  if (!endDate) return 'active';
  return dayjs(endDate).isBefore(dayjs(), 'day') ? 'completed' : 'active';
}

// 보고서 항목엔 medicationId가 없어 색상 해시에 쓸 안정적인 숫자 키가 없음 — 그룹 내 등장 순서로 대체
function toReportMedication(
  item: MedicationReportItemResponse,
  hospitalName: string | null,
  colorIndex: number,
  colorOrder: MedColor[],
): ReportMedication {
  // drugType 미제공 시 drugName의 '[별명]' 접두사를 걷어내 별명을 종류 자리에 대신 표시
  const { nickname, name } = item.drugType
    ? { nickname: null, name: item.drugName }
    : parseNicknamePrefix(item.drugName);

  return {
    id: `${hospitalName ?? 'unknown'}-${item.drugName}-${item.startDate}`,
    name,
    kind: item.drugType ?? nickname ?? '',
    color: colorOrder[colorIndex % colorOrder.length],
    status: toReportMedicationStatus(item.endDate),
    hospitalName: hospitalName ?? undefined,
    dosagePeriod: { startDate: item.startDate, endDate: item.endDate ?? '복용중' },
    totalDays: item.totalDays ?? 0,
  };
}

const COLOR_ORDER: MedColor[] = ['blue', 'purple', 'orange'];

export function toReportHospitalGroups(
  groups: MedicationReportGroupResponse[],
): ReportHospitalGroup[] {
  let colorIndex = 0;

  return groups.map((group, groupIndex) => ({
    id: `${group.hospitalName ?? 'unknown'}-${groupIndex}`,
    hospitalName: group.hospitalName ?? undefined,
    medications: group.medications.map((item) =>
      toReportMedication(item, group.hospitalName, colorIndex++, COLOR_ORDER),
    ),
  }));
}

function toInteractionDrug(drug: ConflictDrug): DrugInteractionDrug {
  // drugType 미제공 시 drugName의 '[별명]' 접두사를 걷어내 별명을 종류 자리에 대신 표시
  const { nickname, name } = drug.drugType
    ? { nickname: null, name: drug.drugName }
    : parseNicknamePrefix(drug.drugName);

  return {
    name,
    color: hashMedColor(drug.medicationId),
    kind: drug.drugType ?? nickname ?? '',
    hospitalName: drug.hospitalName ?? undefined,
    prescriptionDate: drug.prescriptionDate ? dayjs(drug.prescriptionDate).format('YY.MM.DD') : '-',
  };
}

// 목록(GET /api/conflicts)엔 conflictDescription이 없어, 상세 조회 결과를 별도로 받아 합친다
export function toDrugInteractionPair(
  conflict: DrugConflictResponse,
  description: string,
): DrugInteractionPair {
  return {
    id: String(conflict.conflictId),
    drugA: toInteractionDrug(conflict.drug1),
    drugB: toInteractionDrug(conflict.drug2),
    severity: conflict.severity === 'CONTRAINDICATED' ? 'danger' : 'caution',
    description,
  };
}
