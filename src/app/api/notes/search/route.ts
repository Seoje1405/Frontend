import { ApiError, apiClient } from '@/lib/api/client';
import { getSeniorId } from '@/lib/auth/session';
import { toNotePrescriptions } from '@/lib/data/note-mapping';
import type { MedicationNoteGroupResponse } from '@/types/api';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// 타이핑마다 호출되는 자동완성 검색 — 클라이언트에서 debounce 후 이 라우트를 호출
export const dynamic = 'force-dynamic';

const PERIOD_VALUES = ['1w', '1m', '3m', '1y'] as const;
type Period = (typeof PERIOD_VALUES)[number];

function isPeriod(value: string | null): value is Period {
  return value !== null && (PERIOD_VALUES as readonly string[]).includes(value);
}

export async function GET(request: NextRequest) {
  const keyword = request.nextUrl.searchParams.get('keyword')?.trim();
  if (!keyword) {
    return NextResponse.json({ message: '검색어를 입력해주세요.' }, { status: 400 });
  }

  const seniorId = await getSeniorId();
  if (!seniorId) {
    return NextResponse.json({ message: '등록된 부모님 정보가 없습니다.' }, { status: 401 });
  }

  const period = request.nextUrl.searchParams.get('period');

  try {
    const query = new URLSearchParams({ seniorId: String(seniorId), keyword });
    if (isPeriod(period)) query.set('period', period);

    const groups = await apiClient.get<MedicationNoteGroupResponse[]>(
      `/api/medications/notes/search?${query.toString()}`,
    );
    return NextResponse.json(toNotePrescriptions(groups));
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status || 500 });
    }
    throw error;
  }
}
