import type { MealTime } from '@/types/api';

export type MedColor = 'blue' | 'purple' | 'orange';
export type MealType = 'morning' | 'noon' | 'night';

export type Medication = {
  id: number;
  name: string;
  kind?: string;
  use: string[];
  color: MedColor;
  checked: boolean;
  mealTime: MealTime; // 병합 표시(night = DINNER+BEDTIME) 이전의 실제 백엔드 값 — 토글 요청에 필요
  editable: boolean; // 토글 API는 "오늘"만 허용 — 과거/미래 날짜 조회 시 false
};

export type HospitalGroup = {
  id?: number;
  hospital?: string;
  medications: Medication[];
};

export type MealGroup = {
  mealname: string;
  mealType: MealType;
  time: string;
  dateTime: string;
  hospitals: HospitalGroup[];
};

export type NextMedication = {
  time: string;
  name: string;
  extraCount: number;
};

export type CurrentCardData = {
  id: string;
  patientName: string;
  total: number;
  completed: number;
  nextMedication?: NextMedication;
};

export type ExpiryAlertData = {
  id: number;
  medicationName: string;
  daysLeft: number;
  totalDays: number;
};

// 약물노트 타입
export type NoteStatus = 'active' | 'completed' | 'stopped';

export type NoteMedication = {
  id: string;
  name: string;
  kind: string;
  dosageInfo: string[];
  status: NoteStatus;
  color: MedColor;
};

export type NoteHospitalGroup = {
  id: string;
  hospitalName?: string;
  medications: NoteMedication[];
  showReregistration: boolean;
};

export type NotePrescription = {
  id: string;
  prescriptionDate: string;
  hospitals: NoteHospitalGroup[];
};

export type NoteMedicationDetail = {
  id: string;
  name: string;
  kind: string;
  color: MedColor;
  imageUrl?: string;
  tabs: {
    efficacy: string;
    dosage: string;
    caution: string;
    sideEffect: string;
  };
};

// 리포트 타입 (환자당 최신 1건 기준)
export type ReportGrade = 'BASIC';

export type ReportPatientInfo = {
  patientName: string;
  reportDate: string; // 리포트 생성 기준일, 'YYYY.MM.DD'
  reportId: string; // PDF 하단 각주에만 노출되는 리포트 식별자
  birthDate: string; // 'YYYY.MM.DD'
  age: number;
  grade: ReportGrade;
};

export type DrugInteractionSeverity = 'danger' | 'caution';

export type DrugInteractionDrug = {
  name: string;
  color: MedColor;
  kind: string; // 제품종류
  hospitalName?: string; // 처방기관
  prescriptionDate: string; // 처방날짜, 'YY.MM.DD'
};

export type DrugInteractionPair = {
  id: string;
  drugA: DrugInteractionDrug;
  drugB: DrugInteractionDrug;
  severity: DrugInteractionSeverity;
  description: string;
};

// 리포트에 포함된 약물 (약물노트의 NoteMedication과 별개 — 처방 상세 정보를 포함)
export type ReportMedicationStatus = 'active' | 'completed';

export type ReportMedication = {
  id: string;
  name: string;
  kind: string;
  color: MedColor;
  status: ReportMedicationStatus;
  hospitalName?: string;
  dosagePeriod: { startDate: string; endDate: string };
  dosePerTime: string; // 1회 투약량
  timesPerDay: number; // 1일 투여횟수
  totalDays: number; // 총 투여일수
};

export type ReportHospitalGroup = {
  id: string;
  hospitalName?: string;
  medications: ReportMedication[];
};

export type ReportSummary = {
  patient: ReportPatientInfo;
  hospitals: ReportHospitalGroup[];
  interactions: DrugInteractionPair[];
};

// 챗봇 타입
export type ChatRole = 'user' | 'assistant';

// 첫 화면 진입 시 제시하는 제안 프롬프트 (빈 채팅창 금지)
export type ChatSuggestion = {
  id: string;
  label: string;
  prompt: string;
};

export type ChatQuickReply = {
  id: string;
  label: string; // QUICK_REPLY_LABEL_MAX_LENGTH 이하
};

export type ChatDrugCardAction = {
  id: string;
  label: string;
  href: string; // 기존 라우트(약물노트 상세, 약 등록 플로우 등)로 이동, 대화 내에서 처리하지 않음
};

export type ChatDrugCard = {
  id: string;
  name: string;
  kind: string;
  color: MedColor;
  dosageInfo: string[];
  caution?: string;
  actions: ChatDrugCardAction[]; // DRUG_CARD_ACTION_MAX_COUNT 이하
};

// 에러 응답 3단계 폴백: 1) 재표현 요청 2) quick-reply 안내 3) 핵심 액션/처음으로 안내
export type ChatErrorFallbackStage = 1 | 2 | 3;

export type ChatErrorFallback = {
  stage: ChatErrorFallbackStage;
  text: string;
  quickReplies?: ChatQuickReply[];
};

export type ChatMessageContent =
  | { type: 'text'; text: string }
  | { type: 'drugCards'; cards: ChatDrugCard[]; moreCount?: number }
  | { type: 'quickReplies'; text: string; replies: ChatQuickReply[] }
  | { type: 'errorFallback'; fallback: ChatErrorFallback };

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: ChatMessageContent;
  timestamp: string; // 'HH:mm'
};

export type ChatScenarioId = 'registered-drugs' | 'side-effects' | 'symptom-recommendation';

// 어시스턴트 응답 요청 입력: 사용자 텍스트 입력 또는 quick-reply 선택
// API 연동 시에도 이 형태가 실제 요청 payload의 기반이 된다
export type ChatReplyInput =
  | { kind: 'userText'; text: string; fallbackStage: ChatErrorFallbackStage }
  | { kind: 'quickReply'; replyId: string };
