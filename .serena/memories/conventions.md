# 코드 컨벤션

## 언어 규칙

- **주석**: 한국어
- **변수명/함수명**: 영어 (camelCase)
- **컴포넌트명**: PascalCase
- `any` 타입 금지 — 정확한 타입 명시
- 매직 넘버/문자열 금지 → 상수 추출

## 포맷 규칙 (.prettierrc)

- `singleQuote: true`, `semi: true`, `tabWidth: 2`, `printWidth: 100`
- `trailingComma: "all"`, `arrowParens: "always"`, `endOfLine: "lf"`
- Import 자동 정렬: `prettier-plugin-organize-imports`
- Tailwind 클래스 자동 정렬: `prettier-plugin-tailwindcss`

## React/Next.js 패턴

- React Compiler 활성화 → `memo`, `useMemo`, `useCallback` 수동 최적화 불필요
- App Router 사용 — `src/app/` 디렉토리 기준
- 경로 import: `@/` prefix 사용 (예: `@/components/Button`)
- Server Component 기본, 클라이언트 상태 필요 시만 `'use client'` 추가

## 보안

- 시크릿/API 키 하드코딩 금지 → 환경 변수
- `localStorage`에 인증 토큰 저장 금지 → HttpOnly 쿠키
- 입력값 서버에서 검증

## 도메인 용어

- 약물(drug/medication), 복약(take/dose), 처방전(prescription), 알림(notification)
- 한국 의약품 API 연동 예정
