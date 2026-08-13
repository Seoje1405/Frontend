import { ApiError, apiClient } from '@/lib/api/client';
import type { HospitalSearchResponse } from '@/types/api';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// 타이핑마다 호출되는 자동완성 검색 — 클라이언트에서 debounce 후 이 라우트를 호출
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const keyword = request.nextUrl.searchParams.get('keyword')?.trim();
  if (!keyword) {
    return NextResponse.json({ message: '검색어를 입력해주세요.' }, { status: 400 });
  }

  try {
    const query = new URLSearchParams({ keyword });
    const results = await apiClient.get<HospitalSearchResponse[]>(
      `/api/hospitals/search?${query.toString()}`,
    );
    return NextResponse.json(results);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status || 500 });
    }
    throw error;
  }
}
