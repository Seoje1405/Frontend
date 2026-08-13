// 모바일 카메라 촬영본을 고려한 업로드 용량 상한 — 클라이언트(medication-sheet.tsx)와
// 서버(api/medications/ocr/route.ts) 양쪽에서 동일한 값을 사용해야 하므로 공유 상수로 관리
export const MAX_OCR_IMAGE_BYTES = 15 * 1024 * 1024;
