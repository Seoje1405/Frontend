## 🏗 프로젝트 구조

- `src/app`: Next.js App Router 페이지 및 레이아웃
- `public`: 정적 에셋 (이미지, 아이콘 등)
- `.husky`: Git 훅 설정

---

### Git 커밋 메시지

```
feat:     새 기능
fix:      버그 수정
refactor: 동작 변경 없는 코드 개선
style:    포맷, 세미콜론 등
chore:    빌드/의존성 설정 변경
docs:     문서 수정
test:     테스트 추가/수정
```

- 커밋 메시지는 **한국어**로 작성
- 하나의 커밋에 하나의 목적만
- pre-commit 훅이 ESLint + Prettier를 자동 실행 (husky + lint-staged)

### 코드 품질 확인

```bash
pnpm lint          # ESLint 검사
pnpm type-check    # TypeScript 타입 검사
pnpm format:check  # Prettier 포맷 검사
pnpm format        # Prettier 포맷 자동 수정
```
