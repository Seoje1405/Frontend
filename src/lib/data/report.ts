import { apiClient } from '@/lib/api/client';
import { getSeniorBirthDate, getSeniorName } from '@/lib/auth/session';
import type {
  DrugConflictDetailResponse,
  DrugConflictResponse,
  MedicationReportGroupResponse,
} from '@/types/api';
import dayjs from 'dayjs';
import { cache } from 'react';
import { toDrugInteractionPair, toReportHospitalGroups } from './report-mapping';
import type { ReportPatientInfo, ReportSummary } from './types';

export const REPORT_METHOD_NOTE = [
  '약물안전리포트는 최근 90일 이내에 사용한 약물이 대상으로 분석해요.',
  '약물을 중단한 뒤에도 성분이 체내에 남아 다른 약물과 상호작용할 수 있어, 약효가 몸에서 빠지는 기간(최대 7일)을 함께 고려해요.',
  '같은 약물을 동일한 처방기관에서 연속으로 처방받았다면 투약기간을 합쳐서 보여드려요.',
].join(' ');

async function buildPatientInfo(seniorId: number): Promise<ReportPatientInfo> {
  const [seniorName, birthDate] = await Promise.all([getSeniorName(), getSeniorBirthDate()]);

  return {
    patientName: seniorName ?? '-',
    reportDate: dayjs().format('YYYY.MM.DD'),
    // 리포트는 저장되는 엔티티가 아니라 매번 실시간 조회라 백엔드에 대응 ID가 없음 — 각주 표기 전용 합성값
    reportId: `RPT-${seniorId}-${dayjs().format('YYYYMMDD')}`,
    birthDate: birthDate ? dayjs(birthDate).format('YYYY.MM.DD') : '-',
    age: birthDate ? dayjs().diff(dayjs(birthDate), 'year') : 0,
    grade: 'BASIC',
  };
}

export const getReportSummary = cache(async (seniorId: number): Promise<ReportSummary> => {
  // 분석 실행(POST)이 곧 최신 충돌 목록을 응답으로 내려주므로 별도 GET /api/conflicts 호출은 생략
  const [reportGroups, conflicts] = await Promise.all([
    apiClient.get<MedicationReportGroupResponse[]>(`/api/medications/report?seniorId=${seniorId}`),
    apiClient.post<DrugConflictResponse[]>(`/api/conflicts/analysis?seniorId=${seniorId}`),
  ]);

  // 목록엔 conflictDescription이 없어 상세를 병렬로 조회해 채운다
  const conflictDetails = await Promise.all(
    conflicts.map((conflict) =>
      apiClient.get<DrugConflictDetailResponse>(`/api/conflicts/${conflict.conflictId}`),
    ),
  );

  const patient = await buildPatientInfo(seniorId);

  return {
    patient,
    hospitals: toReportHospitalGroups(reportGroups),
    interactions: conflicts.map((conflict, index) =>
      toDrugInteractionPair(conflict, conflictDetails[index]?.conflictDescription ?? ''),
    ),
  };
});
