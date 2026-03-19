# A Complete Sprint Cycle Runs in an Afternoon. I Spend Most of It on Proposals.

**Status:** Draft v3 (aggressive Pyramid Principle restructure)

---

The sprint cycle has four phases. Three run without me. The fourth is where I actually earn my keep.

A full cycle — parallel execution, documentation, integration, proposal processing — completes in an afternoon. Execution takes a few hours. Integration takes one to two more. Most of that integration time is me reviewing proposals. Everything else is autonomous.


## Three Phases Run Without Me

**Execution.** Seven agents work in parallel, each in an isolated copy of the codebase on its own branch. No coordination during execution — they can't see each other's work. Each agent picks up its highest-priority unblocked task, implements it, writes tests, runs the suite, and commits. If it hits a blocker, it files a proposal and moves on. Blocked means "filed the request and kept working," not "waiting." An agent is done when its tasks are complete and its documentation is current. Then it stops.

**Documentation.** Each agent documents its own work — contracts, procedures, anything it established or changed. Findings surface as typed proposals with category, severity, and a proposed change. The documentation agent serves as editor and standards reviewer across all of them, but that's the subject of the next article.

**Integration.** The manager agent analyzes each agent's changes and recommends a merge order — generally by complexity: fully isolated work first, minor overlaps next, material overlaps last. I've never questioned the recommended order. After each merge, it runs the full test suite. If something breaks, you know which merge caused it. It normalizes for consistency — naming, testing patterns, documentation accuracy — and presents checkpoints for my review. The merging itself is mechanical.


## Proposal Processing Is Where I Earn My Keep

Every other phase runs with minimal oversight. This one, I force the system to slow down.

Each cycle generates dozens of proposals across all seven agents. These aren't one-liners — each is backed by roughly 500 lines of descriptive text explaining exactly what went wrong, what the agent tried, and why it's surfacing the issue. I have never read one of the thousands of proposals the system has generated. I blindly approved a system-generated recommendation for the proposal template, and over time I've provided feedback when aspects needed beefing up. The proposal system is entirely internal context management that the team keeps track of among themselves. The manager distills each proposal for me, describes the recommended resolution path in detail, and I engage.

On maybe 10-20% of proposals, we get into a genuinely productive back and forth. Should this become a project-wide convention? Is the agent identifying a real architectural problem or a local symptom? Does the proposed fix address the root cause or just the immediate friction? These are the cross-cutting decisions where an error would propagate widely.

But proposals aren't just bottom-up. This is also how I steer the system's development. If something goes slightly off the rails during execution, I can provide immediate course correction *and* tell the system: "File a proposal — we need a more systematic way of tracking entity relationships." I don't need to interrupt an agent mid-task with a deep architectural thought. The system captures the full context of what was being worked on when I had the realization. Then, in the structured proposal session, the manager and I can have a real dialog about what it means to track entity relationships more systematically — what the implications are, what follow-on work gets generated once that principle is delivered. The proposal system is both a feedback loop and a planning tool.

The outcomes are three bins. Already resolved or no longer relevant: discarded. System learnings — conventions, patterns, standards: captured in the operating instructions. Everything else becomes a GitHub issue for the next cycle.

Those issues are atomic. Each is assigned to a single agent with all of the context to understand the problem: what the resolution looks like, the research that got us here, the full background. When the next cycle starts, an agent reads its first issue and immediately has everything it needs to go fix it. In GTD parlance: every work step broken into widgets.


## Each Cycle Needs Less of Me Than the Last

In the beginning, I was involved in most of the system's operations. Most things didn't work. I focused on process: refining friction points, hardening the places where things historically went off the rails. The proposals that became operating rules meant the same mistakes stopped recurring — mostly. Anyone who has spent time with Claude Code knows that putting "never ever do this" in the instructions practically guarantees the thing will be done. But the trend is real, even if the curve is asymptotic.

After several cycles, I trust the system to work. That trust means I only need to pay attention to the areas where the system *doesn't* work — and those areas shrink each cycle. My role has converged almost entirely to proposal processing and the occasional architectural intervention. Everything else runs.

The sprint cycle is the engine. Each revolution makes it need less of me.

---

**Editorial notes:**
- Aggressive Pyramid Principle restructure from v2
- Governing thought moved to first paragraph: four phases, three autonomous, one matters
- Execution + documentation + integration compressed into one section ("runs without me")
- Proposal processing dominates the article (~60% of content)
- Headers are arguments, not phase labels
- Title states the thesis
- ~850 words
