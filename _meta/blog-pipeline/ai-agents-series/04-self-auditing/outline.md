# Article 4: A Dedicated Agent That Audits the Other Agents

## Core Argument

Documentation and convention compliance don't happen by accident in human teams, and they
don't happen by accident in agent teams either. The solution is the same: make it someone's
entire job. But unlike a human documentation team, an AI documentation agent can also build
and operate its own audit infrastructure.

## The Two-Persona Model

The documentation stack operates with two distinct identities:

### Persona 1: Governance Auditor
Reviews code on main for factual accuracy and convention compliance. Doesn't fix code —
files proposals for the owning stack. Stateless about outcomes: reviews a file, records the
date, moves on. Next time the file comes up, reviews it fresh. Fixed issues won't appear;
justified exceptions will have compensating comments.

### Persona 2: Documentation Acceptance Tester
Doesn't write feature documentation — the stacks that build features write those (they're
the domain experts). Instead:
1. Designs documentation specs — defines what "good" looks like for each doc type
2. Critically reviews — reads documentation as an outsider who doesn't live in the code
3. Files proposals — when docs fail comprehension testing, tells the owning stack what's confusing

The acceptance test: "Could someone who doesn't know the code understand this?"

## The Audit Trail Database

A crawler-style scheduling tool for incremental code reviews (`docs/audit/audit-db.json`).

### What it tracks:
- Every source file in the project (src/ and tests/)
- When each file was last reviewed for each audit category
- When each file was last modified in git

### 9 audit categories:

**Convention compliance:**
- `result_pattern` — cross-module functions return Result[T]?
- `naming` — self-documenting names, no bare run()/execute()/validate()?
- `testing_philosophy` — no unittest.mock, MagicMock, patch()?
- `type_annotations` — X | None not Optional[X]?
- `error_handling` — no silent fallbacks, no hardcoded thresholds?
- `terminology` — terms match glossary?

**Documentation quality:**
- `docstring_quality` — if docstrings exist, are they helpful?
- `error_message_clarity` — can you diagnose Result.fail() without reading the function?
- `config_comprehension` — configs, env vars, settings documented?

### Selection algorithm (each cycle, pick N files):
1. **Never-reviewed files** (null for any category) — highest priority
2. **Modified since last review** (git_last_modified > audit date) — next
3. **Oldest-reviewed** — staleness rotation
4. **Import-graph adjacency** — after reviewing file 1, follow its imports to select file 2

This clusters related files for context continuity and ensures coverage fills in
over successive cycles without requiring a full-codebase sweep every time.

### Key design choice: stateless about outcomes
The database records WHEN a file was reviewed, never WHAT was found. Findings go to
`.proposals/` and leave the auditor's scope. This means:
- No state to maintain about open/closed findings
- No risk of stale finding records
- Each review is fresh — if the issue was fixed, it simply won't appear
- If a convention violation was a justified exception, there'll be a compensating comment

## The Documentation Registry

An inventory of documentation artifacts (`docs/audit/doc-registry.toml`).

### The gap-tracking problem it solves:
"This documentation should exist but doesn't" is invisible unless someone tracks it.
The registry makes gaps first-class objects with ownership and priority.

### How it works:
- Stack agents register entries during their /documentation sweep (they know what they built)
- Stack agents write first drafts (they're the domain experts)
- Doc agent reviews for comprehensibility and unified voice
- Status lifecycle: needed → exists → stale → exists (after re-review)

### Who does what:
- **Stack agents**: Register new `needed` entries, flag `stale` entries, write first drafts
- **Doc agent**: Review `exists` entries, update `last_reviewed`, flag `needed` gaps
- **Every 3-5 cycles**: Doc agent traverses full codebase to catch gaps stacks missed

## Documentation Standards as Acceptance Criteria

The doc stack created quality specs for 5 document types in `docs/doc-standards/`:
- README spec — project name, quick start, architecture, links, status
- Stack overview spec — purpose, module map, data flow, building blocks, dev tools
- API reference spec — route, purpose, parameters, response, errors
- Dev guide spec — scope, prerequisites, numbered steps, troubleshooting
- Architecture spec — overview, component diagram, data flow, decisions, "where does X live?"

Each spec defines required sections and quality criteria. The acceptance test for every
spec: can someone unfamiliar with the codebase follow it without reading source code?

## The 6-Phase Audit Cycle (/doc-audit skill)

1. **Sync tracking systems** — discover new files, update git timestamps, check registry
2. **Governance checks** — CLAUDE.md accuracy, glossary currency, cross-reference integrity,
   bloat watch, proposal resolution, issue tracker hygiene
3. **File-level code audits** — select N files, review all applicable categories, file proposals
4. **Documentation acceptance testing** — review registry entries for comprehensibility
5. **Cross-cutting documentation** — write/update README, architecture overview, onboarding guide
6. **Cycle report** — coverage stats, findings, trends, backlog

## The Closed-Loop Improvement

The /insights report → manager agent → refined operating model. But also:
- Doc agent's audit findings → proposals → next cycle's CLAUDE.md additions → better agent behavior
- Stack agents' /documentation findings → proposals → same pipeline
- The system caught the same improvements /insights recommended, independently

The postscript from the original LinkedIn post: the system's own retrospective loop
identified everything the external review did. That's validation that the governance
framework works.

## Why This Matters Beyond This Project

Most agentic coding setups have no quality feedback loop. Code goes in, code comes out,
and convention compliance depends entirely on the prompt instructions being followed
perfectly every time. A dedicated audit agent with its own tracking infrastructure means:
- Conventions are checked, not just stated
- Coverage is tracked and improves over time
- Documentation gaps are visible, not hidden
- The system gets more disciplined with each cycle, not less

## Source Files to Reference
- `.claude/stack-instructions/documentation.md` — two-persona identity
- `docs/audit/audit-db.json` — the audit trail database
- `docs/audit/doc-registry.toml` — documentation registry
- `.claude/commands/doc-audit.md` — the 6-phase audit skill
- `docs/doc-standards/` — the 5 documentation quality specs
- `docs/audit/README.md` — system design documentation
