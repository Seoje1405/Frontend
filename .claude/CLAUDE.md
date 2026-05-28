# Project Rules

## Meeting Rules

- All internal discussion must be in English
- Final output documents must be written in Korean (formal, 합쇼체)
- Keep technical terms in English (component, hook, API, PR, etc.)
- Every agent must prefix statements with their tag: [CHAIR], [PM], [Design], [FE-1], [FE-2]
- Keep responses concise — no monologues, no padding

## Agent Model Configuration

| Role   | Model                     | Reason                                |
| ------ | ------------------------- | ------------------------------------- |
| CHAIR  | claude-sonnet-4-6         | Full orchestration, judgment          |
| PM     | claude-haiku-4-5-20251001 | Requirements analysis, prioritization |
| Design | claude-haiku-4-5-20251001 | UX design, creative thinking          |
| FE-1   | claude-sonnet-4-6         | Technical review, architecture        |
| FE-2   | claude-haiku-4-5-20251001 | Edge cases, questions, test cases     |

## How to Run a Meeting

Say to the assistant in natural language:

> "회의 시작: [topic]"

**Structural constraint:** The Agent tool cannot be used inside a subagent.
The **main assistant acts directly as CHAIR** and spawns PM → Design → FE-1 → FE-2 in order via the Agent tool.

- `chair.md` — the meeting procedure the main assistant follows when acting as CHAIR
- PM, Design, FE-1, FE-2 — spawned as independent subagents that perform the actual analysis
