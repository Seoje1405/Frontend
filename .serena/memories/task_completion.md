# 작업 완료 체크리스트

## 코딩 작업 완료 시 필수 실행 순서

```powershell
pnpm type-check    # TypeScript 오류 없음 확인
pnpm lint          # ESLint 규칙 위반 없음 확인
pnpm format:check  # Prettier 포맷 일치 확인
```

## 오류 시 자동 수정

```powershell
pnpm format        # Prettier 포맷 자동 수정
pnpm lint          # ESLint 자동 수정 (lint-staged에서 --fix 적용)
```

## Git 커밋 전

- pre-commit 훅(Husky + lint-staged)이 자동으로 ESLint fix + Prettier 실행
- 커밋 메시지: 한국어, 단일 목적
- 형식: `feat:`, `fix:`, `refactor:`, `style:`, `chore:`, `docs:`, `test:`

## 빌드 검증 (배포 전)

```powershell
pnpm build         # 프로덕션 빌드 성공 확인
```
