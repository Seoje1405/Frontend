# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
- **Tailwind CSS v4** — configured via `@theme inline` in `globals.css`, no `tailwind.config.js`
- **React Compiler** enabled (`reactCompiler: true` in `next.config.ts`) — do not add manual `useMemo`/`useCallback` unless profiling proves it necessary
- **shadcn/ui** primitives in `src/components/ui/` (Button, Card, Dialog, Drawer, Sheet, Sonner)
- **CVA** (`class-variance-authority`) for component variant definitions
- **dayjs** for date math; **vaul** for drawer primitives; **sonner** for toasts
- Package manager: **pnpm**

> Next.js 16 has breaking changes from prior versions. Check `node_modules/next/dist/docs/` before writing routing or data-fetching code. See @AGENTS.md.

## Architecture

```
src/
  app/
    layout.tsx          # Root layout: Pretendard Variable font, lang="ko", PWA meta
    page.tsx            # Home screen
    globals.css         # Design token definitions (see below)
    [route]/
      page.tsx          # Route entry (Server Component)
      components/       # Route-local components
  components/
    ui/                 # shadcn/ui primitives (restyled via CSS tokens)
    layout/             # App-shell components (AppHeader, etc.)
  lib/
    utils.ts            # cn() helper (clsx + tailwind-merge)
```

All pages are React Server Components by default. Add `'use client'` only when the component requires browser APIs or event handlers.

### CSS Token Architecture (`globals.css`)

Three-layer structure:

1. **`:root`** — primitive + semantic tokens as CSS custom properties (`--blue-600`, `--surface`, `--status-done`, etc.)
2. **`@theme inline`** — re-exports `:root` values as Tailwind utilities (`bg-primary`, `text-status-done`, `rounded-md`, etc.)
3. **`@utility`** — custom utilities that can't be expressed as tokens (`shadow-card`, `shadow-raised`, `shadow-fab`, `kr-wrap`)

Tailwind classes map directly to these tokens. There are no arbitrary values or hardcoded colors in component files — use token-mapped utilities only.

### Key Conventions

- Use `cn()` from `@/lib/utils` for all `className` merges
- shadcn components accept a `className` prop for one-off overrides; prefer token-mapped utilities over inline styles
- Korean body/list text must use the `kr-wrap` utility (`word-break: keep-all`)
- Bottom nav and app header carry `view-transition-name`; assign unique names to any new cross-page transition elements
- Tap targets must be ≥ 44px; use negative margin + padding expansion (e.g., `-m-2.5 p-2.5`) rather than increasing visual size

## Commit Convention

Messages in Korean, one purpose per commit:

```
feat / fix / refactor / style / chore / docs / test
```
