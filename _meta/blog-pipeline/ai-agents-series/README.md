# Blog Series: Multi-Agent Claude Code Workflow

An 8-article series on running AI coding agents as a microservices team.

## Origin

LinkedIn post (2026-02-09) describing the parallel agent workflow got inquiries for details.
Phone conversation with Claude produced draft-v1 of the thesis article.
Manager agent proposed restructuring into a series: 4 "here's the system" articles + 4 "here's how it works under the hood" articles.

## Series Overview

| # | Slug | Title | Status |
|---|------|-------|--------|
| 1 | `01-thesis` | It's Just Microservices and Team Management | draft-v1 complete |
| 2 | `02-enforcement-model` | Three Layers of Guardrails: Why Prompt Instructions Aren't Enough | outline |
| 3 | `03-sprint-cycle` | From Issue Creation to Integration: An End-to-End Walkthrough | outline |
| 4 | `04-self-auditing` | A Dedicated Agent That Audits the Other Agents | outline |
| 5 | `05-contracts` | Contracts as the Skeleton | outline |
| 6 | `06-async-communication` | Asynchronous Communication in a Zero-Meeting Team | outline |
| 7 | `07-manager-playbook` | What the Manager Actually Does | outline |
| 8 | `08-what-breaks` | What Breaks and What I'd Do Differently | outline |

## Reader Journey

- **After article 1**: The concept — why agentic coding is microservices + team management
- **After article 4**: A complete picture of the system and its self-improvement loop
- **After article 8**: The full playbook, including honest failure modes

## Source Material

The system described in these articles is the actual development infrastructure for this repo:
- `stacks.toml` — stack definitions and module boundaries
- `.claude/parallel-system.md` — agent operating manual
- `.claude/commands/` — skills (true-up, documentation, orient, doc-audit)
- `.claude/stack-instructions/` — per-stack identity and responsibilities
- `docs/audit/` — audit trail database and documentation registry
- `scripts/parallel/manage.py` — worktree management CLI
