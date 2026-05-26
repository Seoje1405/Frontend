# Code Conventions

## Language Rules

- **Comments**: Korean
- **Variable/function names**: English (camelCase)
- **Component names**: PascalCase
- **File names**: kebab-case (`medication-card.tsx`) or PascalCase (standalone component files)
- No `any` types — specify exact types
- No magic numbers/strings → extract as constants (`const` at top of file)
- Single responsibility principle per function

## Format Rules (.prettierrc)

- `singleQuote: true`, `semi: true`, `tabWidth: 2`, `printWidth: 100`
- `trailingComma: "all"`, `arrowParens: "always"`, `endOfLine: "lf"`
- Auto-sort imports: `prettier-plugin-organize-imports`
- Auto-sort Tailwind classes: `prettier-plugin-tailwindcss`

## React Composition Patterns

Compound components · no boolean props · Context interface · Provider state lifting · React 19 API →
full rules and code examples: `mem:react_patterns`

## Server vs Client Component Decision Criteria

```
Server Component (default) ← start here unless there's a reason not to
  ├── data fetching (direct async/await)
  ├── direct DB/API access
  └── sensitive data handling

'use client' only when needed
  ├── useState / useReducer
  ├── useEffect / browser APIs
  ├── onClick / onChange event handlers
  └── third-party client-only libraries
```

- Place `'use client'` boundary as far down the tree as possible (leaf nodes) — avoid hoisting to top

## Component File Order

```tsx
'use client'          // only when needed

import ...            // auto-sorted by Prettier

// types/interfaces
interface Props { ... }

// constants
const MAX_ITEMS = 10;

// component body
export default function ComponentName({ ... }: Props) { ... }
```

## CSS / Tailwind v4

- `@import "tailwindcss"` in `globals.css`
- CSS variable naming: `--{category}-{variant}` (e.g. `--color-primary`, `--font-geist-sans`)
- Theme customization in `@theme inline { ... }` block
- Do NOT create `tailwind.config.js` (conflicts with v4)

## Mobile-First UI Patterns (Ongil app)

- Base layout: `max-w-[390px]` (iPhone 14 baseline) centered
- Minimum touch target: `min-h-[44px]` (iOS HIG standard)
- Bottom sheet: `fixed bottom-0` + `translate-y` animation pattern
- Safe area: `pb-[env(safe-area-inset-bottom)]` (notch support)

## Path Imports

- Use `@/` prefix (e.g. `@/components/MedicationCard`)
- Avoid relative paths (`../`) — except within the same directory

## Security

- No hardcoded secrets/API keys → `.env.local`
- No auth tokens in `localStorage` → HttpOnly cookies
- Validate inputs server-side

## Domain Terms (English consistency)

| Korean      | English                  |
| ----------- | ------------------------ |
| 약물        | `drug` / `medication`    |
| 복약        | `take` / `dose`          |
| 처방전      | `prescription`           |
| 알림        | `notification`           |
| 보호자      | `guardian` / `caregiver` |
| 복용 시간대 | `scheduleTime`           |
| 약물 이력   | `medicationHistory`      |
