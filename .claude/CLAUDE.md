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
| CHAIR  | claude-haiku-4-5-20251001 | Full orchestration, judgment          |
| PM     | claude-haiku-4-5-20251001 | Requirements analysis, prioritization |
| Design | claude-haiku-4-5-20251001 | UX design, creative thinking          |
| FE-1   | claude-sonnet-4-6         | Technical review, architecture        |
| FE-2   | claude-haiku-4-5-20251001 | Edge cases, questions, test cases     |

## Token Optimization

- Internal discussion: English only (saves 40–50% vs Korean)
- CHAIR, PM, Design, FE-2 use Haiku (80% cheaper than Sonnet for most tasks)
- FE-1 uses Sonnet for architecture-level technical review
- FE-1 uses Gemini MCP for large codebase reads (saves Claude context tokens)
- CHAIR summarizes before passing context to next agent
- CLAUDE.md and agent.md files are auto-cached by Claude Code (up to 90% off on repeated reads)
- Estimated cost per meeting: ~$0.10–0.30 (with caching)

---

## Tool Installation (One-time Setup)

### 1. gstack

```bash
git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git \
  ~/.claude/skills/gstack && cd ~/.claude/skills/gstack && ./setup
```

### 2. Gemini MCP

```bash
claude mcp add gemini-cli -s user -- npx -y gemini-mcp-tool
```

### 3. Impeccable

```bash
npx skills add pbakaus/impeccable
# Run once after install:
/impeccable teach
```

### 4. Obsidian MCP

Add to `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "obsidian": {
      "command": "npx",
      "args": ["-y", "obsidian-mcp", "/path/to/your/vault"]
    }
  }
}
```

---

## Skill Assignment Per Role

| Role       | Phase        | Skill                   | When to Use                                             |
| ---------- | ------------ | ----------------------- | ------------------------------------------------------- |
| **CHAIR**  | Pre-meeting  | `/office-hours`         | Agenda is vague — reframe first                         |
|            | Pre-meeting  | `/autoplan`             | Chain CEO+Design+Eng reviews                            |
|            | Post-meeting | `/retro`                | Sprint retrospective                                    |
| **PM**     | Pre-meeting  | `/office-hours`         | Always — reframe from pain points                       |
|            | Meeting      | `/plan-ceo-review`      | Strategy and scope decisions                            |
| **Design** | Meeting      | `/plan-design-review`   | UX review (Slop detection included)                     |
|            | Meeting      | `/design-consultation`  | Design system consistency check                         |
|            | Impl review  | `/impeccable teach`     | Once per project — set brand context                    |
|            | Impl review  | `/impeccable critique`  | Design director evaluation                              |
|            | Impl review  | `/impeccable audit`     | Accessibility / responsive / perf check                 |
|            | Impl review  | `/impeccable bolder`    | Design too generic                                      |
|            | Impl review  | `/impeccable quieter`   | Design too heavy                                        |
|            | Impl review  | `/impeccable clarify`   | UX copy issues                                          |
|            | Impl review  | `/impeccable delight`   | Needs personality                                       |
|            | Impl review  | `/impeccable overdrive` | Push quality to the limit                               |
| **FE-1**   | Pre-meeting  | Serena → Gemini MCP     | Serena finds symbols → Gemini summarizes targeted files |
|            | Meeting      | `/plan-eng-review`      | Architecture review                                     |
|            | Impl         | `/impeccable shape`     | Design brief before writing any code                    |
|            | Impl         | `/impeccable craft`     | Full implementation (after shape OK)                    |
|            | Impl         | `/impeccable polish`    | Final pass (after feature works)                        |
|            | Impl         | `/impeccable typeset`   | Font / type hierarchy fix                               |
|            | Impl         | `/impeccable layout`    | Spacing / layout fix                                    |
|            | Impl         | `/impeccable animate`   | Add animation                                           |
|            | Impl         | `/impeccable adapt`     | Responsiveness fix                                      |
|            | Impl         | `/impeccable optimize`  | Performance fix                                         |
|            | Impl         | `/impeccable harden`    | Error / edge case UI                                    |
|            | Post-impl    | `/review`               | Code review [AUTO-FIXED/ASK/WARN]                       |
|            | Post-impl    | `/investigate`          | Recurring bug root cause                                |
|            | Post-impl    | `/benchmark`            | Core Web Vitals check                                   |
|            | Post-impl    | `/careful`              | Before risky refactoring                                |
| **FE-2**   | Meeting      | `/qa-only`              | Test report without code changes                        |
|            | Impl review  | `/impeccable critique`  | Run and report findings to FE-1                         |
|            | Impl review  | `/impeccable audit`     | Run and report findings to FE-1                         |
|            | Post-impl    | `/qa <URL>`             | Live browser edge case exploration                      |
|            | Post-impl    | `/cso`                  | Security edge cases (OWASP)                             |

---

## Obsidian Save Rules

### Vault Path Structure

```
vault/
├── 회의록/
│   └── {YYYY-MM-DD}-{topic}.md
├── 기획서/
│   └── {feature}-기능명세서.md
└── 태스크/
    └── {feature}-액션아이템.md
```

### Meeting Minutes Template (Korean output)

```markdown
# 회의록: {주제}

## 기본 정보

- 일시: {날짜}
- 참석: CHAIR, PM, Design, FE-1, FE-2

## 안건별 결정사항

### 1. 요구사항 분석

- 결정: ...
- 근거: ...

### 2. UX 흐름 및 컴포넌트

- 결정: ...

### 3. 기술 검토

- 결정: ...

### 4. 엣지케이스

- 결정: ...

## 전체 발언록

[PM] ...
[Design] ...
[FE-1] ...
[FE-2] ...

## 미결 사항

- ...
```

### Feature Spec Template (Korean output)

```markdown
# {기능명} 기능명세서

## 개요

- 목적: ...
- 범위: ...
- 우선순위: Must / Should / Could

## 사용자 흐름

1. ...

## 컴포넌트 목록

| 컴포넌트명 | 역할 | 담당 |
| ---------- | ---- | ---- |

## API 인터페이스

- Endpoint: ...
- Request: ...
- Response: ...

## 엣지케이스 및 예외처리

- ...

## 제외 범위 (Out of Scope)

- ...
```

### Action Items Template (Korean output)

```markdown
# {기능명} 액션아이템

| 번호 | 작업 내용 | 담당 | 우선순위 | 비고 |
| ---- | --------- | ---- | -------- | ---- |
| 1    | ...       | FE-1 | High     |      |
| 2    | ...       | FE-2 | Medium   |      |
```

## Error Recovery

If an agent behaves incorrectly, add a correction rule here:
Format: `## Rule Added - {date}` section
