# Piuda

Next.js 16, React 19, Tailwind CSS v4 기반의 프로젝트입니다.

## 시작하기

```bash
pnpm install
pnpm dev    # http://localhost:3000
```

## 🏗 프로젝트 구조

- `src/app`: Next.js App Router 페이지 및 레이아웃
- `public`: 정적 에셋 (이미지, 아이콘 등)
- `.husky`: Git 훅 설정

---

## 코드 컨벤션

### 언어 / 타입

- `any` 타입 사용 금지 — 정확한 타입 명시
- `unknown` + 타입 가드로 외부 데이터 처리
- 매직 넘버·문자열 금지 → 상수(`UPPER_SNAKE_CASE`)로 추출
- `as` 강제 캐스팅 최소화 — 불가피할 때만 사용하고 주석 필수

```ts
// ❌
const data: any = fetchData();

// ✅
const data: UserProfile = fetchData();
```

### 컴포넌트

- 파일명 및 컴포넌트명: `PascalCase` (예: `UserCard.tsx`)
- 컴포넌트는 다른 컴포넌트의 `render` 안에 정의하지 않는다 (매 렌더마다 remount 발생)
- 훅은 `use` 접두사 필수 (`useUserProfile`, `useModalState`)
- 함수형 컴포넌트만 사용, 클래스 컴포넌트 금지

```tsx
// ❌ render 안에 컴포넌트 정의
function List({ items }) {
  const Item = ({ item }) => <li>{item.name}</li>;
  return (
    <ul>
      {items.map((i) => (
        <Item key={i.id} item={i} />
      ))}
    </ul>
  );
}

// ✅ 모듈 스코프에 정의
const Item = ({ item }: { item: ListItem }) => <li>{item.name}</li>;
function List({ items }: { items: ListItem[] }) {
  return (
    <ul>
      {items.map((i) => (
        <Item key={i.id} item={i} />
      ))}
    </ul>
  );
}
```

### 임포트

- barrel 파일(`index.ts`) 직접 임포트 금지 — 번들 크기 폭증 유발
- `next.config.ts`의 `optimizePackageImports`에 아이콘·UI 라이브러리 등록
- 임포트 순서: 외부 패키지 → 내부 절대경로(`@/`) → 상대경로 (Prettier가 자동 정렬)

```ts
// ❌
import { Check, X, Menu } from 'lucide-react';

// ✅ next.config.ts에 optimizePackageImports 설정 후 그대로 사용
// 또는 직접 서브패스 임포트
import Check from 'lucide-react/dist/esm/icons/check';
```

### 비동기 / 데이터 패칭

- 독립적인 `await`는 `Promise.all`로 병렬 처리
- 조건부 패칭은 값이 싼 조건 먼저 확인 후 비싼 `await` 실행
- Server Component에서 데이터 패칭, Client Component는 최소화

```ts
// ❌ 순차 (600ms)
const user = await fetchUser(id);
const posts = await fetchPosts(id);

// ✅ 병렬 (300ms)
const [user, posts] = await Promise.all([fetchUser(id), fetchPosts(id)]);
```

### 상태 관리

- 렌더링에 불필요한 고빈도 값은 `useRef` 사용 (스크롤 위치 등)
- 파생 상태는 `useMemo`로 계산, `useEffect` + `setState` 패턴 금지
- `setState` 콜백에서 현재 상태 참조 시 함수형 업데이트 사용

```ts
// ❌ 불필요한 렌더 사이클
const [filtered, setFiltered] = useState(items);
useEffect(() => {
  setFiltered(items.filter(isActive));
}, [items]);

// ✅
const filtered = useMemo(() => items.filter(isActive), [items]);
```

### 조건부 렌더링

- `&&` 좌항에 숫자형 사용 금지 — `0`이 렌더됨
- 삼항 연산자(`? :`) 또는 `!!` 변환 사용

```tsx
// ❌ count가 0일 때 "0" 렌더됨
{
  count && <Badge count={count} />;
}

// ✅
{
  count > 0 ? <Badge count={count} /> : null;
}
```

### 접근성

- 인터랙티브 요소는 반드시 키보드 접근 가능 (`<button>`, `<a>` 사용)
- 아이콘 전용 버튼에 `aria-label` 필수
- 장식 요소에 `aria-hidden="true"` 명시
- `outline: none` 단독 사용 금지 — `:focus-visible` 대체 스타일 필요

### 스타일링 (Tailwind CSS v4)

- 유틸리티 클래스 직접 작성 — `@apply` 최소화
- 조건부 클래스는 `clsx` 또는 `cn` 유틸리티 사용
- 애니메이션은 `transform`, `opacity` 속성만 — 레이아웃 재계산 없음
- `prefers-reduced-motion` 미디어쿼리 반드시 존중

### 보안

- 환경 변수로 시크릿 관리 — `.env.local` 사용, 절대 커밋 금지
- 클라이언트 노출 변수만 `NEXT_PUBLIC_` 접두사 사용
- 민감 데이터 `console.log` 출력 금지
- `localStorage`에 인증 토큰 저장 금지 → HttpOnly 쿠키 사용

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
