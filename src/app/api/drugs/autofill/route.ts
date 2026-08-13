import { ApiError, apiClient } from '@/lib/api/client';
import type { DrugAutofillResponse } from '@/types/api';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const itemSeq = request.nextUrl.searchParams.get('itemSeq')?.trim();
  if (!itemSeq) {
    return NextResponse.json({ message: 'itemSeq가 필요합니다.' }, { status: 400 });
  }

  try {
    const result = await apiClient.get<DrugAutofillResponse>(
      `/api/search/drugs/${encodeURIComponent(itemSeq)}/autofill`,
    );
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status || 500 });
    }
    throw error;
  }
}
