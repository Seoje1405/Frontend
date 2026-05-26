# Key Commands (Windows PowerShell)

## Development

```powershell
pnpm dev            # start dev server (default port 3000)
pnpm build          # production build
pnpm start          # start production server (after build)
```

## Code Quality (run in order after completing work)

```powershell
pnpm type-check     # check TypeScript errors (tsc --noEmit)
pnpm lint           # check ESLint violations
pnpm format:check   # check Prettier format mismatches
pnpm format         # auto-fix Prettier format (--write)
```

## Package Management (pnpm only — no npm/yarn)

```powershell
pnpm install                # install dependencies
pnpm add <pkg>              # add runtime package
pnpm add -D <pkg>           # add devDependency
pnpm remove <pkg>           # remove package
pnpm why <pkg>              # show dependency path
```

## Git (pre-commit hook runs automatically)

```powershell
git add <files>
git commit -m "feat: add medication alert component"
```

- `git commit` triggers lint-staged:
  - `*.{ts,tsx,js,jsx}` → `eslint --fix` → `prettier --write`
  - `*.{css,json,md}` → `prettier --write`
- Commit messages: Korean, single purpose
- Format: `feat:` `fix:` `refactor:` `style:` `chore:` `docs:` `test:`

## Debugging TypeScript Errors

```powershell
pnpm type-check 2>&1 | Select-String "error"   # filter errors only
```

## Windows Specifics

- Path separator: `\` (PowerShell), Next.js internals use `/`
- Line endings: LF enforced (`.prettierrc` `endOfLine: "lf"`)
- Env vars: `$env:NEXT_PUBLIC_API_URL` format
- Stop dev server: `Ctrl+C`
- `.env.local` is git-ignored — must be created manually
