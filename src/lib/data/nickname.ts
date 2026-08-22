// 약 등록 API(MedicationCreateRequest)에 별명 전용 필드가 없어, 등록 시 drugName에
// '[별명] 약이름' 형태로 합쳐 보낸다(medication.ts registerMedications 참고).
// drugType이 없는 응답에서 별명을 대신 보여줘야 할 때 이 패턴을 다시 걷어내 분리한다.
const NICKNAME_PREFIX_RE = /^\[([^\]]+)\]\s*(.*)$/;

export function parseNicknamePrefix(drugName: string): { nickname: string | null; name: string } {
  const match = drugName.match(NICKNAME_PREFIX_RE);
  if (!match || !match[2]) return { nickname: null, name: drugName };
  return { nickname: match[1], name: match[2] };
}
