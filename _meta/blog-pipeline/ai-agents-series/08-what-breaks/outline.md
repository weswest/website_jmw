# Article 8: What Breaks and What I'd Do Differently

## Core Argument

The honest retrospective. People trust the whole series more if you show the seams.
This system works well but it's not magic — it has specific failure modes, recurring
friction, and things I'd design differently with hindsight.

## What Breaks: Agent-Level Failures

### Wrong approaches that need course correction
The /insights report tracked 16 buggy-code and 14 wrong-approach incidents across 37 sessions.

**Common patterns:**
- Agents choosing overly complex solutions when simpler ones exist
- Conflating abstraction layers (e.g., SSE streaming transport vs domain-level stage reveals)
- Jumping into implementation before confirming direction
- DI+fake testing patterns when the policy says integration-first

**The fix:** better upfront instructions reduce but don't eliminate this. The normalization
pass catches what instructions miss. Surgical intervention catches what normalization misses.
Defense in depth, applied to agent behavior.

### Premature implementation without scope alignment
In several sessions, agents started building before confirming what was actually needed.
Two sessions were abandoned entirely because the exploration went wrong.

**The fix:** the /orient skill was created specifically to prevent this — forcing agents
to present a prioritized table and WAIT before implementing. A process fix for a behavioral
problem.

### The context window wall
The longest session ran 33 hours (2,010 minutes). The agent wrote 163 tests, built dev
tools, and started implementing an architecture proposal — then the context window filled
completely. It couldn't even compact its memory to keep going.

**The lesson:** context windows are a hard physical constraint. The system's architecture
(bounded contexts, domain ownership) mitigates this, but marathon sessions still hit the
wall. The fix is cycle discipline: finish your unblocked work, run /documentation, stop.
Don't try to do everything in one session.

## What Breaks: System-Level Failures

### Recurring environment issues
The arm64/Rosetta architecture mismatch hit 4+ separate sessions:
- Pydantic import failures (x86_64 wheels in an arm64 venv)
- Dev script crashes (uvicorn not installed in the right architecture)
- `os.uname()` returning wrong values under Rosetta
- Venv rebuild cycles consuming 15-30 minutes each time

**The lesson:** environment constraints should be documented once and enforced automatically,
not rediscovered each time. This was eventually added to CLAUDE.md and the management CLI
was updated with proper Apple Silicon detection — but it took four incidents to get there.

### Governance file conflicts
Every true-up cycle, shared files conflict: CLAUDE.md, .gitignore, pyproject.toml.
Each stack branches from main, so their version of these files is a snapshot from
branch creation time. Any changes to main after branching create guaranteed conflicts.

**The mitigation:** governance files are protected (agents shouldn't modify them), but
agents sometimes need to (e.g., adding dependencies to pyproject.toml). The true-up
process has a governance file audit step that classifies each change as stale, meaningful,
or should-be-a-proposal.

**What I'd do differently:** make `pyproject.toml` truly additive — each stack gets a
stack-specific requirements section, merged automatically during true-up.

### Proposal volume
Each agent files 3-8 proposals per cycle. With 7 agents, that's 20-50 proposals to
process during true-up. Most self-resolve, but the triage still takes time.

**What I'd do differently:** auto-classify proposals by type before human review.
Proposals that reference functionality another stack built can be auto-resolved.
Proposals that request CLAUDE.md additions can be auto-drafted.

## What Breaks: Process-Level Failures

### The serialization bottleneck
The true-up process is inherently serial — stacks merge one at a time, and tests run
after each merge. This is the cycle's bottleneck. With 5 code stacks, the merge phase
alone takes 30-60 minutes even when everything goes smoothly.

**What I'd explore:** parallel merge validation (test each stack's merge independently),
with a final combined validation at the end. Not implemented yet.

### Human checkpoint latency
The 5-stage true-up has human approval gates. If the human isn't available, the cycle
stalls. This is by design (high-risk decisions need human judgment) but it means cycle
time is bounded by human availability.

**The tension:** more autonomy = faster cycles but higher risk. The current balance
(human approves merge plans and architectural changes) feels right for a system that's
still being refined. As the governance matures, some checkpoints could become automated.

### Agents can't learn from each other's current mistakes
If agent A discovers a gotcha in this cycle, agents B-G won't know about it until the
next cycle (when the proposal becomes a CLAUDE.md addition). Within a cycle, the same
mistake can be made independently by multiple agents.

**The fundamental constraint:** async communication means no real-time learning. This is
the cost of the isolation that prevents coordination problems. Worth it in my experience —
the bugs from coordination are worse than the bugs from independent discovery.

## What I'd Do Differently

### From day one:
1. **Document environment constraints first** — before any agent writes code. The arm64
   issue alone wasted hours across sessions.
2. **Start with the contract system** — not as documentation but as the first code artifact.
   We did this, but I'd invest even more time in the fixture examples.
3. **Create the documentation stack earlier** — it was added in cycle 5. Conventions drifted
   for 4 cycles without someone checking them.

### For the next project:
1. **Automated environment validation** — a pre-flight check that runs before any agent
   starts work. Verify architecture, venv, services, and dependencies.
2. **Proposal auto-classification** — reduce the triage burden during true-up.
3. **Incremental merge validation** — test each stack's merge in parallel before the
   sequential merge to main.
4. **Graduated autonomy** — start with tight human checkpoints, automate them as the
   governance proves reliable.

## The Meta-Lesson

Every failure mode maps to a known pattern in distributed systems or team management:
- Wrong approaches → insufficient upfront specification (solved by better CLAUDE.md)
- Environment issues → undocumented implicit dependencies (solved by IaC principles)
- Serialization bottleneck → sequential merge pipeline (solved by parallel validation)
- No real-time learning → CAP theorem for agent coordination (accepted trade-off)

The system doesn't avoid these problems — it provides a framework for identifying,
categorizing, and systematically resolving them. That's what governance buys you:
not perfection, but a ratchet that moves in one direction.

## Source Files to Reference
- `/insights` report data — quantified friction analysis
- `.claude/commands/orient.md` — the skill created to prevent premature implementation
- `scripts/parallel/manage.py` — Apple Silicon detection, environment validation
- `.claude/commands/true-up.md` — the serialization point and human checkpoints
