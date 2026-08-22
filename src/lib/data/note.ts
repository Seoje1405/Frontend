import { ApiError, apiClient } from '@/lib/api/client';
import type { MedicationDetailResponse, MedicationNoteGroupResponse } from '@/types/api';
import { cache } from 'react';
import {
  toMedicationEditInitialValues,
  toNoteMedicationDetail,
  toNotePrescriptions,
} from './note-mapping';
import type { MedicationEditInitialValues, NoteMedicationDetail, NotePrescription } from './types';

export const getNotePrescriptions = cache(
  async (seniorId: number, isActive?: boolean): Promise<NotePrescription[]> => {
    const query = new URLSearchParams({ seniorId: String(seniorId) });
    if (isActive !== undefined) query.set('isActive', String(isActive));

    const groups = await apiClient.get<MedicationNoteGroupResponse[]>(
      `/api/medications/notes?${query.toString()}`,
    );
    return toNotePrescriptions(groups);
  },
);

// 상세 화면(탭 매핑)과 수정 폼(원본 필드 그대로) 양쪽에서 공유하는 캐시된 원본 조회
const fetchMedicationDetail = cache(
  async (medicationId: number): Promise<MedicationDetailResponse | undefined> => {
    try {
      return await apiClient.get<MedicationDetailResponse>(`/api/medications/${medicationId}`);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return undefined;
      throw error;
    }
  },
);

export async function getMedicationDetail(
  medicationId: number,
): Promise<NoteMedicationDetail | undefined> {
  const detail = await fetchMedicationDetail(medicationId);
  return detail ? toNoteMedicationDetail(detail) : undefined;
}

// 수정 폼 초기값 채우기 전용 — 폼이 실제 쓰는 필드만 추려 RSC 경계로 넘김(server-serialization)
export async function getMedicationForEdit(
  medicationId: number,
): Promise<MedicationEditInitialValues | undefined> {
  const detail = await fetchMedicationDetail(medicationId);
  return detail ? toMedicationEditInitialValues(detail) : undefined;
}
