# Article 3: From Issue Creation to Integration — An End-to-End Walkthrough

## Core Argument

The sprint cycle isn't a metaphor — it's a literal implementation of agile ceremonies
(planning, execution, retro, integration) running in minutes/hours instead of weeks.
Walking through one complete cycle makes the system concrete.

## Before the Cycle: Setup

- `manage.py setup` creates worktrees from main, one per stack
- Each worktree gets its own branch (`stack/{name}`), its own venv, its own `.env`
- `manage.py launch` opens a tmux session with a Claude Code instance per stack
- Each agent reads its `.claude/CLAUDE.local.md` to know its identity, modules, and issues

## Phase 1: Parallel Execution

### Each agent independently:
1. Runs `/orient` — checks open issues, runs tests, presents prioritized table
2. Picks up highest-priority unblocked task
3. Implements: writes code, writes tests, runs test suite
4. Commits frequently (after each sub-task, each commit should pass tests)
5. When blocked: writes a proposal, marks task blocked, picks up next unblocked task
6. When an issue is done: commits completion summary, moves to next issue

### Key behaviors during execution:
- **No coordination between agents** — they can't see each other's work
- **Blocked ≠ waiting** — agent files proposal and moves on immediately
- **Tests gate everything** — full suite must pass before moving to next issue
- **Proposals accumulate** — each agent may file 3-8 proposals per cycle

### What "done" means for a stack agent:
- All unblocked tasks complete
- Proposals filed for each blocker
- `/documentation` run (structured 6-category retrospective)
- All proposals committed to branch

## Phase 2: The /documentation Sweep

Not "write down what you did" — a structured audit across 6 categories:

1. **System learnings** — conventions that should be in CLAUDE.md
2. **Architectural patterns** — error handling, naming, organization patterns established
3. **Cross-stack discoveries** — API assumptions, data format decisions, integration needs
4. **Contract gaps** — fields needed but missing, ambiguities in semantics
5. **Terminology drift** — terms diverging from glossary definitions
6. **Naming discipline** — generic function names that don't self-document

Each finding becomes a typed proposal with category, severity, and proposed change.
This creates the inbox for the true-up phase.

## Phase 3: True-Up (Manager Agent on Main)

### Stage 1: Analysis
- Collect status from all stacks (`manage.py status`)
- Examine each stack's changes (diff, commit history, file overlap)
- Audit governance files — classify changes as stale, meaningful, or should-be-a-proposal
- Plan merge order based on dependency chain: Data → KG → Agent → Orchestration → Web
- **Checkpoint: present merge plan to human for approval**

### Stage 2: Integration
- Merge each stack to main in planned order (`git merge stack/{name} --no-ff`)
- Resolve conflicts (code, fixtures, config — see conflict resolution strategy)
- Run full test suite after EACH merge — not just at the end
- Install deps after each merge (stacks may add dependencies)
- **Checkpoint: present conflict resolutions to human for approval**

### Stage 3: Normalization
- Audit naming conventions across merged stacks
- Check testing patterns (mocking policy, fixture organization)
- Verify documentation accuracy (CLAUDE.md structure matches actual codebase)
- Triage findings: fix-now vs create-issue vs note-for-CLAUDE.md vs ignore
- **Checkpoint: present normalization changes to human for approval**

### Stage 4: Proposal Processing
- Categorize all proposals from all stacks
- ~1/3 already resolved (parallel work addressed the need)
- ~1/3 become CLAUDE.md additions (system learnings, pattern documentation)
- Remainder becomes GitHub issues for next cycle
- Small minority needs human judgment (cross-cutting architectural decisions)
- **Checkpoint: present CLAUDE.md edits and issue list to human for approval**

### Stage 5: Finalization
- Commit all changes, run final test suite
- `manage.py rebase-all` — fast-forward all stack branches to updated main
- Generate summary report (stacks merged, conflicts resolved, issues created, proposals processed)

## Phase 4: Next Cycle

- Stack branches now include all true-up changes
- New issues assigned from proposal processing
- `manage.py launch` restarts agents
- Cycle begins again

## Timing

- Parallel execution: 30 min to several hours per agent (depends on issue complexity)
- /documentation sweep: 10-15 min per agent
- True-up: 1-2 hours (most time spent on human checkpoint reviews)
- Full cycle: can complete in a single afternoon

## What Makes This Different From "Just Running Claude Code"

- Work persists across cycles (committed to git, not lost with context window)
- Agents build domain expertise (same stack assignment, cumulative context in CLAUDE.md)
- Process improves each cycle (proposals → CLAUDE.md additions → better agent behavior)
- Human attention focused on highest-leverage decisions (checkpoint approvals, architectural calls)

## Source Files to Reference
- `scripts/parallel/manage.py` — setup, launch, status, integrate, rebase-all
- `.claude/commands/orient.md` — the /orient skill
- `.claude/commands/documentation.md` — the /documentation skill
- `.claude/commands/true-up.md` — the 5-stage true-up process
