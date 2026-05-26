# Task Completion Checklist

## Required Steps After Completing Code Work

```powershell
pnpm type-check     # confirm no TypeScript errors
pnpm lint           # confirm no ESLint violations
pnpm format:check   # confirm Prettier format matches
```

On error:

```powershell
pnpm format         # auto-fix format
pnpm lint           # recheck ESLint
```

## Checklist When Adding New Files/Components

- [ ] Using `@/` import alias (avoid relative `../`)
- [ ] Confirmed Server Component vs `'use client'` decision
- [ ] No `any` types
- [ ] Magic numbers/strings extracted as constants
- [ ] No unnecessary `memo`/`useMemo`/`useCallback` with React Compiler active
- [ ] Mobile-first layout (touch targets `min-h-[44px]` or larger)
- [ ] Korean comments, English variable/function names

## Server/Client Component Verification

`'use client'` required:

- `useState`, `useReducer`, `useEffect`
- Event handlers (`onClick`, `onChange`, etc.)
- Browser APIs (window, localStorage, etc.)
- External client-only libraries

`'use client'` not needed (keep as Server Component):

- Data fetching (async/await)
- Direct DB/API calls
- Static UI rendering

## Build Validation (before deploy)

```powershell
pnpm build          # confirm production build succeeds
```

## Outstanding Boilerplate (priority fixes)

- [ ] `src/app/layout.tsx`: `lang="en"` → `lang="ko"`
- [ ] `src/app/layout.tsx`: update metadata title/description for Ongil app
- [ ] `src/app/page.tsx`: replace Create Next App boilerplate with actual home UI

## Before Git Commit

- Confirm Husky + lint-staged pre-commit hook runs
- Commit messages: Korean, single purpose
- Format: `feat:` `fix:` `refactor:` `style:` `chore:` `docs:` `test:`
- One commit, one purpose
