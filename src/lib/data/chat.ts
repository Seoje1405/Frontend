import { TYPING_DELAY_MS, matchChatScenario } from '@/lib/constants/chat';
import dayjs from 'dayjs';
import { MOCK_CHAT_ERROR_FALLBACKS, MOCK_CHAT_SCENARIOS, MOCK_CHAT_SUGGESTIONS } from './mock';
import type {
  ChatErrorFallback,
  ChatErrorFallbackStage,
  ChatMessage,
  ChatMessageContent,
  ChatReplyInput,
  ChatScenarioId,
  ChatSuggestion,
} from './types';

export function getChatSuggestions(): ChatSuggestion[] {
  return MOCK_CHAT_SUGGESTIONS;
}

export function getChatScenario(id: ChatScenarioId): ChatMessage[] {
  return MOCK_CHAT_SCENARIOS[id];
}

export function getChatErrorFallback(stage: ChatErrorFallbackStage): ChatErrorFallback {
  const fallback = MOCK_CHAT_ERROR_FALLBACKS.find((item) => item.stage === stage);
  if (!fallback) {
    throw new Error(`정의되지 않은 에러 폴백 단계입니다: ${stage}`);
  }
  return fallback;
}

export function createMessage(role: ChatMessage['role'], content: ChatMessageContent): ChatMessage {
  return { id: crypto.randomUUID(), role, content, timestamp: dayjs().format('HH:mm') };
}

// 목데이터 시나리오를 실제 대화에 이어붙일 때, 같은 시나리오가 재사용되어도
// React key와 시각이 겹치지 않도록 새로 발급해서 복제한다.
function replayAssistantMessages(scenarioId: ChatScenarioId): ChatMessage[] {
  return getChatScenario(scenarioId)
    .filter((message) => message.role === 'assistant')
    .map((message) => createMessage(message.role, message.content));
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// quick-reply 중 어시스턴트 메시지 응답이 필요한 것만 여기서 처리한다.
// 대화 초기화·홈 이동처럼 API와 무관한 순수 화면 동작은 chat-screen.tsx에 남겨둔다.
const QUICK_REPLY_HANDLERS: Record<string, () => ChatMessage[]> = {
  'reply-001': () => {
    // 챗봇 연동 API가 아직 없어 목데이터 시나리오 그대로 유지(약물노트 실API 연동과는 무관한 스코프)
    const text =
      '메트포르민정 500mg은 오심, 구토, 설사, 복통 등의 소화기계 증상이 나타날 수 있으며, 대부분 치료 초기에 발생하고 시간이 지나면 사라집니다.';
    return [createMessage('assistant', { type: 'text', text })];
  },
  'reply-002': () => [
    createMessage('assistant', {
      type: 'text',
      text: '네, 알겠습니다! 다른 궁금한 점 있으면 언제든 물어보세요.',
    }),
  ],
  'fallback-reply-001': () => replayAssistantMessages('registered-drugs'),
};

/**
 * 어시스턴트가 다음에 보여줄 메시지를 결정하는 단일 진입점.
 *
 * TODO(API 연동 - Phase 2): 백엔드 스펙이 확정되면 이 함수 내부만 아래와 같이 교체한다.
 * 시그니처(ChatReplyInput → Promise<ChatMessage[]>)는 유지되어야 chat-screen.tsx 등
 * 호출부를 변경하지 않고 그대로 전환할 수 있다.
 *
 *   1. 구조화 응답(REST/tRPC)인 경우
 *      - Server Action 또는 route handler에서 실제 백엔드 호출
 *      - raw 응답(DTO) → ChatMessage로 변환하는 매퍼 함수 추가 (예: toChatMessage)
 *      - `any` 금지: DTO 타입은 OpenAPI 스펙에서 openapi-typescript 등으로 생성
 *
 *   2. LLM 스트리밍 응답인 경우
 *      - Vercel AI SDK의 route handler(streamText) + useChat 커스텀 Transport로 전환
 *      - 현재 ChatMessageContent(text/drugCards/quickReplies/errorFallback) 구조를
 *        AI SDK의 UIMessage.parts에 대응하는 형태로 매핑
 *
 *   공통: 실패 시 에러 타입을 구분해 throw하고, 호출부(chat-screen.tsx)의
 *   catch 블록에서 사용자에게 보여줄 에러 폴백 메시지를 노출하도록 연결한다.
 */
export async function requestAssistantReply(input: ChatReplyInput): Promise<ChatMessage[]> {
  await delay(TYPING_DELAY_MS);

  if (input.kind === 'quickReply') {
    return QUICK_REPLY_HANDLERS[input.replyId]?.() ?? [];
  }

  const scenarioId = matchChatScenario(input.text);
  if (scenarioId) {
    return replayAssistantMessages(scenarioId);
  }
  return [
    createMessage('assistant', {
      type: 'errorFallback',
      fallback: getChatErrorFallback(input.fallbackStage),
    }),
  ];
}
