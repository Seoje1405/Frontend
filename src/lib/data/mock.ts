import type {
  ChatErrorFallback,
  ChatMessage,
  ChatScenarioId,
  ChatSuggestion,
  NoteMedicationDetail,
  NotePrescription,
  ReportSummary,
} from './types';

export const MOCK_NOTE_PRESCRIPTIONS: NotePrescription[] = [
  {
    id: 'presc-001',
    prescriptionDate: '2026.05.10',
    hospitals: [
      {
        id: 'hosp-001',
        hospitalName: '서울성모병원',
        showReregistration: false,
        medications: [
          {
            id: 'med-001',
            name: '아모디핀정 5mg',
            kind: '혈압약',
            dosageInfo: ['1일 1회', '1회 1정', '30일 복용'],
            status: 'active',
            color: 'blue',
          },
          {
            id: 'med-002',
            name: '메트포르민정 500mg',
            kind: '당뇨약',
            dosageInfo: ['1일 2회', '1회 1정', '30일 복용'],
            status: 'active',
            color: 'purple',
          },
          {
            id: 'med-003',
            name: '아스피린 프로텍트 100mg',
            kind: '혈전용해제',
            dosageInfo: ['1일 1회', '1회 1정', '30일 복용'],
            status: 'completed',
            color: 'orange',
          },
        ],
      },
    ],
  },
  {
    id: 'presc-002',
    prescriptionDate: '2026.04.15',
    hospitals: [
      {
        id: 'hosp-002',
        showReregistration: true,
        medications: [
          {
            id: 'med-004',
            name: '타이레놀 500mg',
            kind: '해열진통제',
            dosageInfo: ['1일 3회', '1회 1정', '5일 복용'],
            status: 'stopped',
            color: 'blue',
          },
          {
            id: 'med-005',
            name: '암브록솔 염산염정',
            kind: '기관지확장제',
            dosageInfo: ['1일 3회', '식후 30분', '5일 복용'],
            status: 'completed',
            color: 'purple',
          },
        ],
      },
    ],
  },
];

export const MOCK_MEDICATION_DETAILS: NoteMedicationDetail[] = [
  {
    id: 'med-001',
    name: '아모디핀정 5mg',
    kind: '혈압약',
    color: 'blue',
    tabs: {
      efficacy:
        '고혈압, 만성 안정형 협심증, 혈관경련성 협심증(이형 협심증)의 치료에 사용합니다. 혈관의 평활근에 작용하여 혈관을 이완시키고 혈압을 낮춥니다.',
      dosage:
        '성인: 1일 1회 5mg을 경구 투여합니다. 필요에 따라 1일 최대 10mg까지 증량할 수 있습니다. 반드시 의사의 지시에 따라 복용하세요.',
      caution:
        '임부 또는 임신 가능성이 있는 여성에게는 투여하지 않습니다. 중증 저혈압 환자에게는 주의가 필요합니다. 자몽주스와의 병용을 피하세요.',
      sideEffect:
        '부종, 두통, 홍조, 피로감, 어지러움이 나타날 수 있습니다. 드물게 심계항진, 복통, 오심이 발생할 수 있으며, 이 경우 의사와 상담하세요.',
    },
  },
  {
    id: 'med-002',
    name: '메트포르민정 500mg',
    kind: '당뇨약',
    color: 'purple',
    tabs: {
      efficacy:
        '제2형 당뇨병의 혈당 조절에 사용합니다. 특히 비만을 동반한 환자에서 식이 요법만으로 혈당 조절이 되지 않을 때 사용합니다.',
      dosage:
        '성인: 초기 1일 2~3회 500mg을 식사와 함께 복용합니다. 위장 장애를 줄이기 위해 식사 중 또는 식사 직후에 복용하세요.',
      caution:
        '신장 기능이 저하된 환자에게는 투여하지 않습니다. CT 조영제 검사 전후 일시적으로 복용을 중단해야 합니다.',
      sideEffect:
        '오심, 구토, 설사, 복통 등의 소화기계 증상이 나타날 수 있으며, 대부분 치료 초기에 발생하고 시간이 지나면 사라집니다.',
    },
  },
  {
    id: 'med-003',
    name: '아스피린 프로텍트 100mg',
    kind: '혈전용해제',
    color: 'orange',
    tabs: {
      efficacy:
        '심근경색 및 뇌졸중의 재발 방지, 혈전 예방에 사용합니다. 혈소판 응집을 억제하여 혈액이 굳는 것을 막습니다.',
      dosage:
        '성인: 1일 1회 100mg을 식후에 복용합니다. 장용정이므로 씹거나 부수지 말고 통째로 삼키세요.',
      caution:
        '소화성 궤양 환자, 출혈 경향이 있는 환자에게는 주의가 필요합니다. 수술 전 의사에게 복용 사실을 반드시 알리세요.',
      sideEffect:
        '위장 장애, 구역질, 소화불량이 나타날 수 있습니다. 드물게 위장 출혈, 이명, 두드러기가 발생할 수 있습니다.',
    },
  },
  {
    id: 'med-004',
    name: '타이레놀 500mg',
    kind: '해열진통제',
    color: 'blue',
    tabs: {
      efficacy: '두통, 치통, 근육통, 관절통, 생리통 등의 통증 완화 및 발열 증상 완화에 사용합니다.',
      dosage:
        '성인 및 12세 이상: 1회 1~2정(500mg~1000mg), 4~6시간 간격으로 복용합니다. 1일 최대 4000mg을 초과하지 마세요.',
      caution:
        '간장 질환이 있는 환자 및 음주 습관이 있는 사람은 복용 전 의사와 상담하세요. 다른 해열진통제와 동시에 복용하지 마세요.',
      sideEffect:
        '드물게 간 독성, 피부 발진, 혈액 이상이 나타날 수 있습니다. 과용량 복용 시 즉시 응급실을 방문하세요.',
    },
  },
  {
    id: 'med-005',
    name: '암브록솔 염산염정',
    kind: '기관지확장제',
    color: 'purple',
    tabs: {
      efficacy:
        '급성 및 만성 기관지염, 폐렴, 기관지 천식 등에 수반되는 가래 배출을 용이하게 합니다.',
      dosage: '성인: 1일 3회 1정씩 식후에 복용합니다. 충분한 수분 섭취가 효과를 높입니다.',
      caution: '임부에게는 투여하지 않습니다. 신장 기능 장애 환자는 주의하여 복용하세요.',
      sideEffect: '오심, 구토, 설사 등의 소화기계 이상 반응이 드물게 나타날 수 있습니다.',
    },
  },
];

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
