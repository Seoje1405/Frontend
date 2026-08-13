import { ApiError, apiClient } from '@/lib/api/client';
import { getSeniorId } from '@/lib/auth/session';
import { MAX_OCR_IMAGE_BYTES } from '@/lib/constants/upload';
import type { OcrResultResponse, OcrType } from '@/types/api';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const VALID_OCR_TYPES: OcrType[] = ['PRESCRIPTION', 'DRUG_BAG', 'DRUG_BOX'];

// 대용량 이미지 업로드 — Server Action의 전역 bodySizeLimit(모든 서버 액션에 영향)을 올리지 않기 위해
// Route Handler로 분리해 여기서만 큰 바디를 받는다
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const seniorId = await getSeniorId();
  if (!seniorId) {
    return NextResponse.json({ message: '등록된 부모님 정보가 없습니다.' }, { status: 401 });
  }

  const formData = await request.formData();
  const image = formData.get('image');
  if (!(image instanceof File)) {
    return NextResponse.json({ message: '이미지 파일이 필요합니다.' }, { status: 400 });
  }

  if (image.size > MAX_OCR_IMAGE_BYTES) {
    return NextResponse.json(
      { message: '이미지 용량이 너무 커요. 15MB 이하 사진을 선택해주세요.' },
      { status: 400 },
    );
  }

  const ocrTypeRaw = formData.get('ocrType');
  const ocrType: OcrType | undefined = VALID_OCR_TYPES.includes(ocrTypeRaw as OcrType)
    ? (ocrTypeRaw as OcrType)
    : undefined;

  const upstreamForm = new FormData();
  upstreamForm.set('image', image);

  const query = new URLSearchParams({ seniorId: String(seniorId) });
  if (ocrType) query.set('ocrType', ocrType);

  try {
    const result = await apiClient.post<OcrResultResponse>(
      `/api/ocr?${query.toString()}`,
      upstreamForm,
    );
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status || 500 });
    }
    throw error;
  }
}
