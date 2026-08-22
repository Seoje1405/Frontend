import { ApiError, apiClient } from '@/lib/api/client';
import type { MedicationDetailResponse } from '@/types/api';
import { NextResponse } from 'next/server';

// 약물노트 '재등록' 버튼처럼 클라이언트 컴포넌트에서 즉시 트리거하는 단건 조회를 위한 프록시
// (Server Component 직접 fetch를 쓸 수 없는 클릭 트리거 케이스)
export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const medicationId = Number(id);
  if (!Number.isInteger(medicationId)) {
    return NextResponse.json({ message: '잘못된 요청입니다.' }, { status: 400 });
  }

  try {
    const detail = await apiClient.get<MedicationDetailResponse>(
      `/api/medications/${medicationId}`,
    );
    return NextResponse.json(detail);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status || 500 });
    }
    throw error;
  }
}
