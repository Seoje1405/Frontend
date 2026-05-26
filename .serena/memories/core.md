# Ongil(piuda) Frontend — Project Core

## Project Identity

- Next.js frontend for Korean medication management app "Ongil(piuda)"
- Primary user: caregiver managing elderly parents' medication
- Core features: Korean drug API lookup, medication schedule, OCR prescription recognition, phone alerts
- Platform: mobile-first web app

## Current Source Map (as of 2026-05)

```
src/
└── app/
    ├── layout.tsx   ← RootLayout, Geist fonts, lang="en" (⚠️ not yet changed to "ko")
    ├── page.tsx     ← Home page (⚠️ Create Next App boilerplate not yet cleaned up)
    ├── globals.css  ← Tailwind v4 @import + @theme inline CSS variables
    └── favicon.ico
```

## Planned Directories (not yet created — create when implementing features)

| Path              | Role                                                  |
| ----------------- | ----------------------------------------------------- |
| `src/components/` | Shared UI components (feature-based or Atomic Design) |
| `src/lib/`        | Utility / helper functions                            |
| `src/hooks/`      | Custom React hooks                                    |
| `src/types/`      | Shared TypeScript types                               |
| `src/api/`        | API client layer (Korean drug API)                    |

## Project Invariants

- `@/` path alias → `./src/*` (tsconfig paths)
- Font variables: `--font-geist-sans`, `--font-geist-mono`
- CSS variables: `--background`, `--foreground` (automatic dark mode)
- React Compiler enabled → no manual `memo`/`useMemo`/`useCallback`
- HTML lang must be `"ko"` (not yet fixed in layout.tsx)

## Outstanding Issues (initial boilerplate)

- [ ] `src/app/layout.tsx` `lang="en"` → `lang="ko"`
- [ ] `src/app/layout.tsx` metadata.title / description → update for Ongil app
- [ ] `src/app/page.tsx` Replace Create Next App boilerplate with actual home UI

## Memory Reference Structure

- Version · stack · Tailwind v4 · React Compiler caveats → `mem:tech_stack`
- Language rules · format · file structure · Server/Client criteria · domain terms → `mem:conventions`
- Compound component · no boolean props · Context interface · React 19 API → `mem:react_patterns`
- pnpm / ESLint / Prettier / git commands → `mem:suggested_commands`
- Task completion checklist · new file validation → `mem:task_completion`
