// ============================================================
// 공통
// ============================================================

export interface ApiResponse<T> {
  success: boolean;
  status: number;
  data: T;
  timestamp: string; // ISO 8601 datetime
}

// ============================================================
// 공통 열거형
// ============================================================

export type Gender = 'MALE' | 'FEMALE';

export type MealTime = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'BEDTIME';

export type OcrType = 'PRESCRIPTION' | 'DRUG_BAG' | 'DRUG_BOX';

export type DateMode = 'PAST' | 'TODAY' | 'FUTURE';

export type CompletedStatus = 'COMPLETED' | 'INCOMPLETE';

export type ConflictSeverity = 'CONTRAINDICATED' | 'CAUTION';

export type OAuthProvider = 'KAKAO' | 'NAVER';

// ============================================================
// Auth — 회원/인증
// ============================================================

export interface AuthResponse {
  userId: number;
  accessToken: string;
  refreshToken: string;
  provider: OAuthProvider;
  isNewUser: boolean;
  expiresIn: number; // 초
}

// ============================================================
// Senior — 부모님 정보
// ============================================================

export interface SeniorCreateRequest {
  name: string;
  gender: Gender;
  birthDate: string; // 'YYYY-MM-DD'
  phoneNumber: string; // e.g. '01012345678'
  verificationCode: string;
  breakfastTime?: string; // 'HH:mm', default '08:00'
  lunchTime?: string; // 'HH:mm', default '12:00'
  dinnerTime?: string; // 'HH:mm', default '18:00'
}

export interface PhoneVerificationSendRequest {
  phoneNumber: string;
}

export interface PhoneVerificationSendResponse {
  verificationCode: string;
}

export interface SeniorMealTimeUpdateRequest {
  breakfastTime: string; // 'HH:mm'
  lunchTime: string; // 'HH:mm'
  dinnerTime: string; // 'HH:mm'
}

export interface SeniorResponse {
  seniorId: number;
  name: string;
  gender: Gender;
  birthDate: string;
  phoneNumber: string;
  breakfastTime: string;
  lunchTime: string;
  dinnerTime: string;
}

// ============================================================
// OCR — 이미지 분석
// ============================================================

export interface ParsedOcrData {
  drugName: string | null;
  dosagePerTime: string | null;
  timesPerDay: number | null;
  totalDays: number | null;
}

export interface OcrResultResponse {
  ocrResultId: number;
  rawText: string;
  parsedDrugs: ParsedOcrData[];
  prescriptionDate: string | null; // 'YYYY-MM-DD'
}

// ============================================================
// Medication — 약 등록/관리
// ============================================================

export interface MedicationCreateRequest {
  seniorId: number;
  ocrResultId?: number | null;
  drugInfoId?: number | null;
  drugName: string;
  dosagePerTime?: string | null;
  timesPerDay?: number | null;
  totalDays?: number | null;
  startDate: string; // 'YYYY-MM-DD'
  prescriptionDate?: string | null;
  hospitalName?: string | null;
  memo?: string | null;
}

export interface MedicationUpdateRequest {
  drugName?: string | null;
  dosagePerTime?: string | null;
  timesPerDay?: number | null; // 변경 시 스케줄 재생성
  totalDays?: number | null;
  startDate?: string | null;
  hospitalName?: string | null;
  memo?: string | null;
}

export interface MedicationResponse {
  medicationId: number;
  hospitalName: string | null;
  drugName: string;
  dosagePerTime: string | null;
  timesPerDay: number | null;
  totalDays: number | null;
  startDate: string;
  endDate: string | null;
  schedules: MealTime[];
}

export interface MedicationDetailResponse {
  medicationId: number;
  drugName: string;
  drugNickname: string | null;
  drugType: string | null;
  imageUrl: string | null;
  dosagePerTime: string | null;
  timesPerDay: number | null;
  totalDays: number | null;
  startDate: string;
  endDate: string | null;
  prescriptionDate: string | null;
  hospitalName: string | null;
  usageStorageInfo: string | null;
  memo: string | null;
  isActive: boolean;
  drugInfoId: number | null;
}

export interface MedicationLogToggleRequest {
  mealTime: MealTime;
  date?: string; // 'YYYY-MM-DD', 생략 시 오늘
}

export interface MedicationLogToggleResponse {
  medicationId: number;
  mealTime: MealTime;
  isTaken: boolean;
  completedStatus: CompletedStatus;
}

export interface MedicationNoteItemResponse {
  medicationId: number;
  drugName: string;
  drugType: string | null;
  imageUrl: string | null;
  timesPerDay: number | null;
  dosagePerTime: string | null;
  startDate: string;
  endDate: string | null;
  totalDays: number | null;
  isActive: boolean;
}

export interface MedicationNoteGroupResponse {
  prescriptionDate: string;
  hospitalName: string | null;
  medications: MedicationNoteItemResponse[];
}

export interface MedicationGroupItemResponse {
  medicationId: number;
  drugName: string;
  drugType: string | null;
  imageUrl: string | null;
  timesPerDay: number | null;
  dosagePerTime: string | null;
  startDate: string;
  endDate: string | null;
  totalDays: number | null;
  usageStorageInfo: string | null;
  memo: string | null;
}

export interface MedicationReportItemResponse {
  drugName: string;
  drugType: string | null;
  startDate: string;
  endDate: string | null;
  totalDays: number | null;
  reportDate: string; // 처방일 or 등록일
}

export interface MedicationReportGroupResponse {
  hospitalName: string | null;
  medications: MedicationReportItemResponse[];
}

export interface MedicationDepletionResponse {
  medicationId: number;
  drugName: string;
  drugNickname: string | null;
  remainingDays: number; // 음수 = 이미 지남, 0 = 오늘
  endDate: string;
}

// ============================================================
// Drug Search — 약품 검색 (Elasticsearch)
// Drug — 약품 정보 (MySQL 폴백)
// ============================================================

export interface DrugSearchResponse {
  itemSeq: string; // 품목기준코드
  itemName: string;
  entpName: string | null;
  prductType: string | null;
  spcltyPblc: string | null; // 전문/일반 의약품 구분
  itemImage: string | null;
}

export interface DrugAutofillResponse {
  drugName: string;
  drugType: string | null;
  memo: string | null; // 복용방법 + 보관방법 자동 생성
}

// ============================================================
// Home — 홈 복약 카드
// ============================================================

export interface MedicationCardResponse {
  medicationId: number;
  drugName: string;
  drugNickname: string | null;
  drugType: string | null;
  imageUrl: string | null;
  dosagePerTime: string | null;
  timesPerDay: number | null;
  totalDays: number | null;
  isTaken: boolean | null; // 오늘/미래만; 과거는 null
  completedStatus: CompletedStatus | null; // 과거 전용
}

export interface HospitalGroupResponse {
  hospitalId: number | null;
  hospitalName: string | null;
  medications: MedicationCardResponse[];
}

export interface MealGroupResponse {
  mealTime: MealTime;
  mealTimeCompleted: boolean | null; // 오늘 전용
  hospitalGroups: HospitalGroupResponse[];
}

export interface HomeCardResponse {
  date: string;
  mode: DateMode;
  mealGroups: MealGroupResponse[];
}

// ============================================================
// Hospital — 병원 검색 (Elasticsearch)
// ============================================================

export interface HospitalSearchResponse {
  id: number;
  name: string;
  address: string | null;
  phoneNumber: string | null;
}

// ============================================================
// DrugConflict — 약물 상호작용
// ============================================================

export interface ConflictDrug {
  medicationId: number;
  drugType: string | null;
  drugName: string;
  drugNickname: string | null;
  hospitalName: string | null;
  prescriptionDate: string | null; // 'YYYY-MM-DD', 없으면 startDate로 폴백
}

export interface DrugConflictResponse {
  conflictId: number;
  drug1: ConflictDrug;
  drug2: ConflictDrug;
  severity: ConflictSeverity;
  severityLabel: string;
  isResolved: boolean;
}

export interface DrugConflictDetailResponse {
  conflictId: number;
  drug1: ConflictDrug;
  drug2: ConflictDrug;
  severity: ConflictSeverity;
  severityLabel: string;
  conflictDescription: string | null;
  isResolved: boolean;
  createdAt: string; // ISO 8601 datetime
}
