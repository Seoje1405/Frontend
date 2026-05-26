# Tech Stack

## Core Runtime

| Package                     | Version              | Notes                                                                          |
| --------------------------- | -------------------- | ------------------------------------------------------------------------------ |
| next                        | 16.2.6               | ⚠️ Breaking changes — check `node_modules/next/dist/docs/` before writing code |
| react / react-dom           | 19.2.4               | Server Components, `use()` hook, Actions API                                   |
| typescript                  | ^5 (5.9.3 installed) | strict, moduleResolution: bundler                                              |
| babel-plugin-react-compiler | 1.0.0                | `reactCompiler: true` in `next.config.ts`                                      |

## Tailwind CSS v4 — Fundamentally Different from v3

- **No `tailwind.config.js`** (v3 approach forbidden)
- Single `@import "tailwindcss"` line in `globals.css`
- PostCSS plugin: `@tailwindcss/postcss` (v4-specific)
- Theme customization: `@theme inline { --color-xxx: ...; }` block
- Defined CSS variables: `--background`, `--foreground`, `--font-sans`, `--font-mono`

## React Compiler Constraints (Important)

- Manual `memo`, `useMemo`, `useCallback` **forbidden** — compiler handles automatically
- Adding manual memoization causes double-memoization side effects

## TypeScript Key Config (tsconfig.json)

```json
{
  "strict": true,
  "moduleResolution": "bundler",
  "target": "ES2017",
  "jsx": "react-jsx",
  "isolatedModules": true,
  "incremental": true,
  "paths": { "@/*": ["./src/*"] }
}
```

- `isolatedModules: true` → per-file compilation, `const enum` not allowed

## React 19 Notable APIs

- `use()` hook: reads Promise / Context, can be called conditionally
- Server Actions: `"use server"` directive for direct server function calls
- Built-in resource hints: `ReactDOM.preload()`, `ReactDOM.preconnect()`
- `useOptimistic()`: built-in optimistic UI updates

## Build / Package

- **pnpm only** (no npm/yarn, lockfile: `pnpm-lock.yaml`)
- `pnpm add <pkg>` / `pnpm add -D <pkg>`

## Code Quality Tools

| Tool                             | Version | Config File                                |
| -------------------------------- | ------- | ------------------------------------------ |
| ESLint                           | ^9      | `eslint.config.mjs` (flat config)          |
| Prettier                         | ^3.8.3  | `.prettierrc`                              |
| prettier-plugin-organize-imports | ^4.3.0  | auto-sorts imports                         |
| prettier-plugin-tailwindcss      | ^0.8.0  | auto-sorts Tailwind classes                |
| Husky                            | ^9.1.7  | pre-commit hook                            |
| lint-staged                      | ^17.0.5 | `.{ts,tsx,js,jsx}` → ESLint fix → Prettier |

Code rules · file structure · domain terms → `mem:conventions`
