# 주요 명령어 (Windows PowerShell 환경)

## 개발

```powershell
pnpm dev          # 개발 서버 시작 (Next.js)
pnpm build        # 프로덕션 빌드
pnpm start        # 프로덕션 서버 시작 (build 후)
```

## 코드 품질

```powershell
pnpm lint              # ESLint 검사
pnpm type-check        # TypeScript 타입 검사 (tsc --noEmit)
pnpm format            # Prettier로 전체 포맷 (--write)
pnpm format:check      # Prettier 포맷 확인만 (--check)
```

## 패키지 관리 (pnpm 전용)

```powershell
pnpm install           # 의존성 설치
pnpm add <pkg>         # 패키지 추가
pnpm add -D <pkg>      # devDependency 추가
```

## Git (pre-commit 훅 자동 실행)

- `git commit` 시 lint-staged 자동 실행: ESLint fix → Prettier write
- 대상: `*.{ts,tsx,js,jsx}` (ESLint+Prettier), `*.{css,json,md}` (Prettier)

## Windows 특이사항

- 경로 구분자: `\` (PowerShell 기본)
- 줄 끝: LF 강제 (`.prettierrc` endOfLine: "lf")
- 환경 변수: `$env:VAR_NAME` 형식 사용
