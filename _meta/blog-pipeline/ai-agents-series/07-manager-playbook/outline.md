# Article 7: What the Manager Actually Does

## Core Argument

"So what do YOU do all day?" The manager agent isn't a merge bot. It's doing three things:
organizational design (how teams are structured), quality assurance (the normalization pass),
and governance evolution (improving the system's own rules). The human's role is checkpoint
approval and architectural judgment on the small minority of decisions that would propagate
widely if wrong.

## Part 1: Organizational Design

### Domain Ownership vs Task Assignment

Why agents keep their stack across cycles:
- An agent that owns a domain builds context incrementally
- CLAUDE.md, stack instructions, and prior cycle's learnings carry forward
- Each cycle, the agent starts with more domain knowledge, not less
- Task rotation (random tickets from a backlog) means every task starts from scratch

This is the same reason human engineering teams have stable team ownership. The investment
in domain expertise compounds over time.

### When to Split or Add an Agent

The documentation stack was added in a later true-up cycle — proof that the topology evolves:
- Governance and documentation work was being spread across all agents (poorly)
- Creating a dedicated stack with its own identity focused the responsibility
- Adding an agent: create a stacks.toml entry, write a stack instruction, assign issues

Splitting an overgrown agent follows the same microservices decomposition pattern:
identify the distinct responsibilities, draw the boundary, split the module list.

### When an Agent Goes Idle

Agents that run out of relevant work just stop getting tasks. They don't get "make-work"
or get reassigned to another domain. Idle is fine — it means that domain is stable.
(In practice, the proposal pipeline usually generates new issues for every stack.)

## Part 2: The Normalization Pass

After merging all stacks, the manager audits the combined codebase for cross-stack
inconsistencies. This is Stage 3 of the true-up process.

### What gets normalized:

**Structural analysis:**
- Duplicate or ambiguous directories (e.g., seed/ vs seed_cleaned/)
- Scaffolding consistency (placeholder files preserved or accidentally deleted?)
- Reference document placement (consistently in docs/stackRefs/{stack}/)
- Fixture organization (naming conventions match across stacks?)
- Module boundaries (__init__.py, package structure parallel where appropriate)

**Convention analysis:**
- Testing patterns (mocking policy compliance, fixture organization)
- Type annotations (Optional[X] vs X | None — pick one, document it)
- Import style (relative vs absolute, grouping)
- Error handling boundaries (Result[T] at cross-module, exceptions internal)

**Documentation accuracy:**
- CLAUDE.md project structure matches actual directories
- README reflects current scope
- Design doc references point to code that exists

### Triage framework:

| Category | Criteria | Action |
|----------|----------|--------|
| Fix now | Concrete, low-risk, improves consistency | Implement in this stage |
| Create issue | Real problem, too large for true-up | Capture for next cycle |
| Note for CLAUDE.md | Convention choice to document | Draft for Stage 4 |
| Ignore | Cosmetic, no impact | Skip |

The discipline is in the triage, not the fixing. Most findings are "fix now" (rename,
doc accuracy, convention documentation) or "create issue" (refactoring tests, adding
missing dev tools). Very few are ignored — if you noticed it, it probably matters.

## Part 3: Governance Evolution

The rules themselves change through the same process as the code.

### How a rule gets added:
1. Agent discovers a pattern worth codifying → writes `system-learning` proposal
2. Multiple agents discover the same thing → multiple proposals converge
3. Manager reviews proposals during true-up Stage 4
4. Drafts CLAUDE.md addition with the specific text
5. Human approves at checkpoint
6. Next cycle: all agents inherit the new rule automatically

### Examples of rules that emerged from proposals:
- The "never mock" testing philosophy (agent stack discovered, became project-wide)
- Self-documenting naming policy (orchestration stack proposed, refined in normalization)
- Terminology discipline (documentation stack codified from glossary)
- Safe division pattern (data stack discovered, promoted to CLAUDE.md)
- Post-fork connection safety (orchestration stack learned the hard way)

### The compounding effect:
Each cycle, agents work within a slightly better-defined operating environment.
Conventions that were discovered in cycle 1 are enforced from cycle 2 onward.
The system gets more disciplined over time, not less.

## Part 4: The Human's Role

### What requires human judgment:
- Checkpoint approvals (5 gates during true-up — merge plan, conflicts, normalization,
  proposals, finalization)
- Cross-cutting architectural decisions where an error would propagate to multiple stacks
- Resolving conflicting proposals (agent A wants pattern X, agent B wants pattern Y)
- Scope decisions (is this a current-cycle fix or a future issue?)

### What doesn't require human judgment:
- Everything else. Agent execution, proposal writing, documentation sweeps, test runs,
  routine merges — all autonomous.

### Time allocation:
- ~80% of time: upfront investment (designing governance, writing CLAUDE.md, defining contracts)
- ~15% of time: checkpoint reviews during true-up
- ~5% of time: surgical interventions during execution (correcting architectural drift)

The upfront investment is front-loaded. Each cycle, the governance gets better and the
interventions get fewer. This is the servant leadership payoff.

## The "Org Chart Is the Architecture Diagram" Principle

Conway's Law in reverse: instead of the org structure driving the architecture,
design the architecture first (stacks, contracts, boundaries) and let the org structure
(agent assignments, responsibilities, communication protocols) follow from it.

The management CLI reads `stacks.toml` — the architecture definition — and generates:
- Worktree structure
- Per-agent identity files (CLAUDE.local.md)
- Module boundary enforcement

Change the architecture (add a stack, split a domain) and the organizational structure
updates automatically. The TOML file is both the architecture diagram and the org chart.

## Source Files to Reference
- `stacks.toml` — architecture as data
- `scripts/parallel/manage.py` — management CLI that reads stacks.toml
- `.claude/commands/true-up.md` — Stage 3 normalization, Stage 4 proposals
- `.claude/stack-instructions/` — per-agent identity
- `CLAUDE.md` — governance that evolves through proposals
