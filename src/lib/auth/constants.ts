// 세션 쿠키 이름 — proxy.ts(Edge)와 session.ts(Node) 양쪽에서 공유
export const ACCESS_TOKEN_COOKIE = 'ongil_access_token';
export const SENIOR_ID_COOKIE = 'ongil_senior_id';
// GET /api/seniors(조회)가 없어 등록/설정 시점의 값을 세션에 함께 보관해 재사용
export const SENIOR_NAME_COOKIE = 'ongil_senior_name';
export const SENIOR_BIRTHDATE_COOKIE = 'ongil_senior_birthdate';
export const MEAL_TIMES_COOKIE = 'ongil_meal_times';

// OAuth CSRF state 임시 쿠키 — /auth/[provider](발급)와 /auth/callback/[provider](검증)에서 공유
export const OAUTH_STATE_COOKIE = 'ongil_oauth_state';

// 온보딩 도중(등록 완료 전) send-card 화면에 표시할 부모님 휴대폰 번호를 임시로 보관하는 쿠키
export const REGISTERING_PARENT_PHONE_COOKIE = 'ongil_registering_parent';
