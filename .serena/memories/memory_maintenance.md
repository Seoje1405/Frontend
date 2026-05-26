# Memory Maintenance

## Discovery Model

- Agent receives only a **name list** at startup — must read content explicitly
- Use `mem:core` as the graph root — starting point for all exploration
- `core` references major domain memories → each references more specific ones (hierarchical graph)
- Memories must NOT state when they should be read — that is the responsibility of the referring memory
- References must use `` `mem:NAME` `` format (backtick + `mem:` prefix)

## Reference Rules

- Use `` `mem:NAME` `` format — auto-updated on rename
- Reference text should specifically describe the target memory's content
  - ❌ See `mem:conventions`
  - ✅ Language rules · domain terms · Server/Client decision criteria → `mem:conventions`
- References to not-yet-existing memories are allowed (marks planned future content)

## Memory Scopes

| Scope   | Path                         | Shared With                         |
| ------- | ---------------------------- | ----------------------------------- |
| Project | `.serena/memories/`          | This project only (git-committable) |
| Global  | `~/.serena/memories/global/` | All projects                        |

- Global memory names: `global/` prefix (e.g. `global/coding-style`)
- Project and global memories can be combined

## Topic (Folder) Structure

- Use `/` in memory name → maps to subdirectory (e.g. `modules/api`, `debug/auth`)
- Group related memories by topic for structured exploration

## Style

Dense agent notes — no prose. Prefer invariants and terse bullets.
Omit obvious context, rationale, and examples. Keep guidance durable and generalizable.

## Add/Update Threshold

Add or update only **stable, non-obvious project conventions** that prevent complex rediscovery.

Do NOT add:

- Quick-read facts
- Generic language/framework knowledge
- One-off task notes
- Volatile implementation details likely to change soon
- Line-level code details

## Maintenance Actions

```shell
# Check referential integrity (detect broken mem: references)
serena memories check

# Auto-add missing mem: prefixes (run --dry-run first)
serena memories auto-prefix-references --dry-run
serena memories auto-prefix-references

# Reinitialize memory_maintenance from template
serena memories initialize
```

- Rename via Serena's `rename_memory` tool → `` `mem:OLD` `` references auto-updated
- After deletion, check stale references: `serena memories check`
