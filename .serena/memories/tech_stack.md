# 기술 스택

## 핵심 런타임

- **Next.js 16.2.6** (App Router) — AGENTS.md 경고: 파괴적 변경 있음, node_modules/next/dist/docs/ 먼저 확인
- **React 19.2.4** + react-dom 19.2.4
- **TypeScript 5.9.3** (strict mode)
- **Node.js** (버전 미고정; pnpm 관리)

## 스타일링

- **Tailwind CSS v4** — `@import "tailwindcss"` 방식 (PostCSS 플러그인: `@tailwindcss/postcss`)
- CSS 변수로 테마 정의, `@theme inline` 블록 사용

## 빌드 / 컴파일러

- **babel-plugin-react-compiler 1.0.0** — next.config.ts에서 `reactCompiler: true`
- **pnpm** 패키지 매니저 (npm/yarn 사용 금지)

## 코드 품질

- **ESLint 9** — `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript` + `eslint-config-prettier`
- **Prettier 3.8.3** — `prettier-plugin-organize-imports` + `prettier-plugin-tailwindcss`
- **Husky 9** + **lint-staged 17** — pre-commit 훅

## TypeScript 설정 주요 옵션

- `strict: true`, `moduleResolution: bundler`, `paths: { "@/*": ["./src/*"] }`
- `target: ES2017`, `jsx: react-jsx`
