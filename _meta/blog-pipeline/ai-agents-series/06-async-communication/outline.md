# Article 6: Asynchronous Communication in a Zero-Meeting Team

## Core Argument

These agents never talk to each other. There's no negotiation, no real-time coordination,
no shared chat channel. All communication is through structured artifacts processed at
defined checkpoints. This is counterintuitive — shouldn't agents coordinate? — but removing
real-time coordination makes the system more reliable, not less.

## Why No Real-Time Coordination

### The failure mode it prevents:
Real-time agent negotiation creates:
- Race conditions (two agents deciding simultaneously about the same dependency)
- Cascading delays (agent A waits for agent B's response, B is busy)
- Ambiguous state (did the negotiation succeed? who's responsible now?)
- Untraceable decisions (conversation happened but no artifact records it)

### The async alternative:
Every communication is a committed artifact (proposal, completion summary, registry entry).
Artifacts are:
- Auditable (in git history)
- Persistent (survive context window resets)
- Processable in batch (manager handles all proposals at once)
- Self-documenting (the artifact IS the documentation of the decision)

## The Three Communication Channels

### Channel 1: Proposals (Agent → Manager → System)

The RFC mechanism. 7 categories, two severities:

**Categories:**
- `contracts/` — interface changes between stacks
- `dependencies/` — need a package not in requirements
- `architecture/` — design doesn't work, or patterns worth documenting
- `clarification/` — issue is ambiguous
- `cross-stack/` — work that belongs to another stack
- `blocked/` — other blockers
- `system-learning/` — discoveries that belong in CLAUDE.md

**Severities:**
- `blocking` — can't proceed on this task, move to next unblocked task
- `workaround-possible` — can continue with temp solution, note in code with TODO

**Lifecycle:**
1. Agent discovers need → writes proposal with template
2. Commits proposal to branch
3. Manager collects all proposals during true-up
4. Triage: ~1/3 already resolved, ~1/3 → CLAUDE.md, rest → GitHub issues
5. Processed proposals deleted, issues assigned for next cycle

**The key insight:** most cross-stack problems solve themselves when everyone's working
in parallel. The proposal system is optimized for this — it assumes most proposals will
be resolved by the time the manager reviews them.

### Channel 2: /documentation Sweep (Agent → Proposals → Manager)

A structured retrospective, not freeform notes. Runs at the end of each agent's work
before declaring "done."

**6 categories swept:**
1. System learnings — should be in CLAUDE.md
2. Architectural patterns — error handling, naming, organization
3. Cross-stack discoveries — API assumptions, data format decisions
4. Contract gaps — fields needed, ambiguities found
5. Terminology drift — terms diverging from glossary
6. Naming discipline — generic function names

**Each finding becomes a typed proposal.** The sweep is structured because unstructured
retrospectives produce vague observations. "I learned some stuff about testing" becomes
"testing_philosophy: agents/test_executor.py uses MagicMock on line 42, violating the
integration-first testing policy per CLAUDE.md."

### Channel 3: Documentation Registry (All Agents → Doc Agent)

Stack agents register documentation needs during their /documentation sweep:
- "I built a new API endpoint, it needs reference docs" → `status = "needed"` entry
- "My code changes made this doc stale" → update `status = "stale"`
- "I wrote a first draft of the docs" → `status = "exists"`, set `last_updated`

Doc agent reviews registered entries for comprehensibility and unified voice.

This creates a pull-based documentation flow: stacks signal what needs docs, the doc
agent pulls those needs and either reviews or escalates.

## The /orient Skill: Structured Inbound Communication

Before execution, each agent runs `/orient`:
1. Check open GitHub issues for this stack
2. Run the test suite
3. Present a prioritized table: issue, title, effort, blocked by, recommendation
4. **STOP AND WAIT for human confirmation**

This prevents the most common failure mode: diving into implementation before understanding
the landscape. The skill forces agents to receive information (issue state, test state,
proposal state) before generating output (code).

## What "Blocked" Actually Means

In human teams, "blocked" often means "waiting." In this system:
1. Agent discovers it needs something from another domain
2. Writes a cross-stack proposal (structured: what, why, severity, workaround)
3. Marks the current task as blocked in `.tasks/`
4. Immediately picks up the next unblocked task
5. Continues working — no waiting, no standup, no escalation

The proposal sits in the queue. The manager processes it during true-up. By then,
one of three things has happened:
- Another agent built what was needed (most common)
- The original agent found a workaround and the proposal is informational
- Genuine cross-cutting work remains and becomes a next-cycle issue

## The Asymmetry That Makes This Work

Communication is **write-heavy, read-light**:
- Agents write many proposals (cheap — just a markdown file committed to git)
- Manager reads all proposals once per cycle (batch processing)
- Most proposals self-resolve (the read cost is even lower than expected)

This is the opposite of real-time coordination, which is read-heavy, write-light
(many messages, each requiring immediate processing by the receiver).

## Why Async > Real-Time for AI Agents

1. **No context window waste** — proposals don't consume tokens in other agents' conversations
2. **No timing dependencies** — fast agents don't wait for slow agents
3. **Batch processing is cheaper** — manager processes 20 proposals at once, not 20 interrupts
4. **Natural deduplication** — multiple agents discovering the same need produces multiple
   proposals, manager deduplicates during triage
5. **Git-tracked audit trail** — every communication is a committed file with author and timestamp

## Source Files to Reference
- `.proposals/TEMPLATE.md` — proposal structure
- `.claude/commands/documentation.md` — the 6-category sweep
- `.claude/commands/orient.md` — structured inbound communication
- `.claude/parallel-system.md` — proposal categories and severity definitions
- `docs/audit/doc-registry.toml` — documentation registry
