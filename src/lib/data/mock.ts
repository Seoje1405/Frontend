import type {
  ChatErrorFallback,
  ChatMessage,
  ChatScenarioId,
  ChatSuggestion,
  ReportSummary,
} from './types';

// 리포트 - 위험한 상호작용이 있는 경우
export const MOCK_REPORT_SUMMARY_DANGER: ReportSummary = {
  patient: {
    patientName: '김철수',
    reportDate: '2026.05.06',
    reportId: 'RPT-2026-0506-001',
    birthDate: '1994.03.29',
    age: 32,
    grade: 'BASIC',
  },
  hospitals: [
    {
      id: 'hosp-001',
      hospitalName: '서울성모병원',
      medications: [
        {
          id: 'med-001',
          name: '아모디핀정 5mg',
          kind: '혈압약',
          status: 'active',
          color: 'blue',
          hospitalName: '서울성모병원',
          dosagePeriod: { startDate: '2026.05.04', endDate: '2026.05.10' },
          dosePerTime: '1정',
          timesPerDay: 1,
          totalDays: 7,
        },
        {
          id: 'med-002',
          name: '메트포르민정 500mg',
          kind: '당뇨약',
          status: 'active',
          color: 'purple',
          hospitalName: '서울성모병원',
          dosagePeriod: { startDate: '2026.05.04', endDate: '2026.05.10' },
          dosePerTime: '1정',
          timesPerDay: 2,
          totalDays: 7,
        },
      ],
    },
    {
      id: 'hosp-002',
      hospitalName: '연세이비인후과',
      medications: [
        {
          id: 'med-004',
          name: '타이레놀 500mg',
          kind: '해열진통제',
          status: 'completed',
          color: 'orange',
          hospitalName: '연세이비인후과',
          dosagePeriod: { startDate: '2026.04.20', endDate: '2026.04.25' },
          dosePerTime: '1정',
          timesPerDay: 3,
          totalDays: 5,
        },
      ],
    },
  ],
  interactions: [
    {
      id: 'interaction-001',
      drugA: {
        name: '아모디핀정 5mg',
        color: 'blue',
        kind: '고혈압치료제',
        hospitalName: '서울성모병원',
        prescriptionDate: '26.05.04',
      },
      drugB: {
        name: '타이레놀 500mg',
        color: 'orange',
        kind: '해열진통제',
        hospitalName: '연세이비인후과',
        prescriptionDate: '26.04.20',
      },
      severity: 'danger',
      description: '두 약물을 함께 복용할 경우 저혈압 위험이 높아질 수 있어요.',
    },
  ],
};

// 리포트 - 위험한 상호작용이 없는 경우
export const MOCK_REPORT_SUMMARY_SAFE: ReportSummary = {
  patient: {
    patientName: '김철수',
    reportDate: '2026.05.06',
    reportId: 'RPT-2026-0506-002',
    birthDate: '1994.03.29',
    age: 32,
    grade: 'BASIC',
  },
  hospitals: MOCK_REPORT_SUMMARY_DANGER.hospitals,
  interactions: [],
};

// 리포트 - 등록된 약물이 없는 경우
export const MOCK_REPORT_SUMMARY_EMPTY: ReportSummary = {
  patient: {
    patientName: '김철수',
    reportDate: '2026.05.06',
    reportId: 'RPT-2026-0506-003',
    birthDate: '1994.03.29',
    age: 32,
    grade: 'BASIC',
  },
  hospitals: [],
  interactions: [],
};

// 챗봇 - 첫 화면 제안 프롬프트 (빈 채팅창 금지)
export const MOCK_CHAT_SUGGESTIONS: ChatSuggestion[] = [
  {
    id: 'suggestion-registered-drugs',
    label: '등록 약 조회',
    prompt: '저희 부모님이 지금 드시는 약이 뭐가 있어요?',
  },
  {
    id: 'suggestion-side-effects',
    label: '약 부작용 조회',
    prompt: '아모디핀정 부작용이 궁금해요',
  },
  {
    id: 'suggestion-symptom-recommendation',
    label: '증상 기반 약 추천',
    prompt: '머리가 아프다고 하시는데 어떤 약이 좋을까요?',
  },
];

// 챗봇 - 시나리오별 대화 목데이터
export const MOCK_CHAT_SCENARIOS: Record<ChatScenarioId, ChatMessage[]> = {
  'registered-drugs': [
    {
      id: 'msg-001',
      role: 'user',
      content: { type: 'text', text: '저희 부모님이 지금 드시는 약이 뭐가 있어요?' },
      timestamp: '14:02',
    },
    {
      id: 'msg-002',
      role: 'assistant',
      content: {
        type: 'text',
        text: '네, 확인해드릴게요. 현재 서울성모병원에서 처방받아 복용 중인 약이 3건 있어요.',
      },
      timestamp: '14:02',
    },
    {
      id: 'msg-003',
      role: 'assistant',
      content: {
        type: 'drugCards',
        cards: [
          {
            id: 'med-001',
            name: '아모디핀정 5mg',
            kind: '혈압약',
            color: 'blue',
            dosageInfo: ['1일 1회', '1회 1정', '30일 복용'],
            actions: [{ id: 'action-001', label: '자세히 보기', href: '/note/med-001' }],
          },
          {
            id: 'med-002',
            name: '메트포르민정 500mg',
            kind: '당뇨약',
            color: 'purple',
            dosageInfo: ['1일 2회', '1회 1정', '30일 복용'],
            actions: [{ id: 'action-002', label: '자세히 보기', href: '/note/med-002' }],
          },
          {
            id: 'med-003',
            name: '아스피린 프로텍트 100mg',
            kind: '혈전용해제',
            color: 'orange',
            dosageInfo: ['1일 1회', '1회 1정', '30일 복용'],
            actions: [{ id: 'action-003', label: '자세히 보기', href: '/note/med-003' }],
          },
          {
            id: 'med-005',
            name: '암브록솔 염산염정',
            kind: '기관지확장제',
            color: 'purple',
            dosageInfo: ['1일 3회', '식후 복용'],
            actions: [{ id: 'action-006', label: '자세히 보기', href: '/note/med-005' }],
          },
        ],
      },
      timestamp: '14:02',
    },
  ],
  'side-effects': [
    {
      id: 'msg-101',
      role: 'user',
      content: { type: 'text', text: '아모디핀정 부작용이 궁금해요' },
      timestamp: '14:05',
    },
    {
      id: 'msg-102',
      role: 'assistant',
      content: {
        type: 'text',
        text: '아모디핀정 5mg은 부종, 두통, 홍조, 피로감, 어지러움이 나타날 수 있어요. 드물게 심계항진이나 복통, 오심이 생기면 병원에 문의해보시는 게 좋아요.',
      },
      timestamp: '14:05',
    },
    {
      id: 'msg-103',
      role: 'assistant',
      content: {
        type: 'quickReplies',
        text: '다른 약도 확인해보시겠어요?',
        replies: [
          { id: 'reply-001', label: '메트포르민정 확인' },
          { id: 'reply-002', label: '아니요, 괜찮아요' },
        ],
      },
      timestamp: '14:05',
    },
  ],
  'symptom-recommendation': [
    {
      id: 'msg-201',
      role: 'user',
      content: { type: 'text', text: '머리가 아프다고 하시는데 어떤 약이 좋을까요?' },
      timestamp: '14:10',
    },
    {
      id: 'msg-202',
      role: 'assistant',
      content: {
        type: 'text',
        text: '두통 완화에는 타이레놀 500mg을 흔히 사용해요. 다만 이미 드시는 약과 겹치지 않는지 확인이 필요해요.',
      },
      timestamp: '14:10',
    },
    {
      id: 'msg-203',
      role: 'assistant',
      content: {
        type: 'drugCards',
        cards: [
          {
            id: 'med-004',
            name: '타이레놀 500mg',
            kind: '해열진통제',
            color: 'blue',
            dosageInfo: ['1회 1~2정', '4~6시간 간격'],
            caution: '간장 질환이 있거나 음주 습관이 있다면 복용 전 의사와 상담하세요.',
            actions: [
              { id: 'action-004', label: '등록하기', href: '/medication-add' },
              { id: 'action-005', label: '자세히 보기', href: '/note/med-004' },
            ],
          },
        ],
      },
      timestamp: '14:10',
    },
  ],
};

// 챗봇 - 에러 응답 3단계 폴백
export const MOCK_CHAT_ERROR_FALLBACKS: ChatErrorFallback[] = [
  {
    stage: 1,
    text: '죄송해요, 잘 이해하지 못했어요. 조금 다르게 말씀해주시겠어요?',
  },
  {
    stage: 2,
    text: '여전히 답변드리기 어려운 질문이네요. 아래 항목 중에서 찾아보시겠어요?',
    quickReplies: [
      { id: 'fallback-reply-001', label: '등록 약 목록 보기' },
      { id: 'fallback-reply-002', label: '처음으로' },
    ],
  },
  {
    stage: 3,
    text: '제가 도와드리기 어려운 내용인 것 같아요. 홈 화면에서 직접 확인해보시겠어요?',
    quickReplies: [{ id: 'fallback-reply-003', label: '홈으로 이동' }],
  },
];
