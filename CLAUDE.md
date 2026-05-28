## Project

**Ongil (온길)** — A medication management service for adult-child caregivers. Korean-only, mobile-first (390px max-width).

- Product spec: @PRODUCT.md
- Design system: @DESIGN.md
- Next.js agent rules: @AGENTS.md

## Commands

```bash
pnpm dev           # dev server
pnpm build         # production build
pnpm lint          # ESLint
pnpm type-check    # tsc --noEmit
pnpm format        # Prettier (auto-fix)
pnpm format:check  # Prettier (check only)
```

Pre-commit hook runs ESLint + Prettier automatically via husky + lint-staged.

## Stack

- **Next.js 16** App Router · **React 19** · **TypeScript 5**
- **Tailwind CSS v4** — configured via `@theme` in `globals.css`, no `tailwind.config.js`
- **React Compiler** enabled (`reactCompiler: true` in `next.config.ts`) — do not add manual `useMemo`/`useCallback` unless profiling proves it necessary
- Package manager: **pnpm**

> Next.js 16 has breaking changes from prior versions. Check `node_modules/next/dist/docs/` before writing routing or data-fetching code. See @AGENTS.md.

## Architecture

```
src/app/
  layout.tsx    # Root layout: Geist font, lang="ko"
  page.tsx      # Home screen
  globals.css   # Tailwind @theme tokens + @layer base/components
```

All pages are React Server Components by default. Add `'use client'` only when the component requires browser APIs or event handlers.

Design tokens (colors, typography, spacing, radius, shadows) are defined in `globals.css` under `@theme` and available as Tailwind utilities. Reusable component classes (`.btn-primary`, `.input-standard`) are in `@layer components`.

## Commit Convention

Messages in Korean, one purpose per commit:

```
feat / fix / refactor / style / chore / docs / test
```
