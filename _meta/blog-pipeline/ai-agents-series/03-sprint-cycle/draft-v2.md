# From Issue Creation to Integration: An End-to-End Walkthrough

**Status:** Draft v2

---

The first two articles described the architecture and the enforcement model. This one walks through a complete sprint cycle — from issue assignment through parallel execution through integration — so you can see how the pieces fit together in practice.

The whole thing runs in an afternoon. That's not a pitch — it's the timing. Parallel execution takes a few hours, integration takes one to two more, and most of the integration time is me reviewing proposals.


## Parallel Execution: Each Agent Works Alone

Each of the seven agents starts its cycle the same way: check open issues, run the test suite, present a prioritized list of unblocked tasks. Then it picks up the top task and starts working.

The key behaviors during execution are deliberately boring. The agent implements, writes tests, runs the full test suite, and commits. If it hits a blocker — needs something from another agent's domain, discovers a cross-cutting concern — it writes a proposal, marks the task blocked, and moves on to the next unblocked issue. Blocked doesn't mean waiting. It means "filed the request and kept working."

This is the part that surprises people: there's no coordination between agents during execution. They can't see each other's in-progress work. Each agent operates in a physically isolated copy of the codebase on its own branch. When Agent A and Agent B both need to update a shared dictionary, they do it independently. The merge handles it later.

Each agent is also responsible for documenting its own work — contracts, procedures, anything it established or changed during the cycle. This surfaces findings as typed proposals: categorized, with severity and a proposed change. The documentation agent serves as editor and standards reviewer across all of them, but that's the subject of the next article.

An agent is "done" when all its unblocked tasks are complete, proposals are filed for each blocker, and documentation is current. Then it stops.


## Integration: Merging the Work

The manager agent waits for all seven agents to finish, then runs a multi-stage integration process.

First, it analyzes each agent's changes — diffs, commit history, file overlap — and recommends a merge order. The heuristics here aren't governed by me. It generally prioritizes by complexity: agents that worked entirely in isolation merge first, then agents with minor overlap, and finally agents with material overlap. Material overlap only happens when I've intervened directly — forced an agent to work outside its normal boundaries because it was faster than going through the full cycle. I've never once questioned the recommended merge order.

After each merge, it runs the full test suite — not just at the end. If something breaks, you know which merge caused it. It normalizes the merged codebase for consistency: naming conventions, testing patterns, documentation accuracy. Each stage has a checkpoint where the manager presents what it did and I review.

The merging itself is mechanical. The interesting part is what comes next.


## Proposal Processing: The Sacred Ritual

Proposal processing is the only time I get substantively involved in what the system will do next. Every other phase runs with minimal oversight. This one, I force the system to slow down.

Each cycle generates dozens of proposals across all seven agents. These aren't one-liners — each is backed by roughly 500 lines of descriptive text explaining exactly what went wrong, what the agent tried, and why it's surfacing the issue. For the record: I have never read one of the thousands of proposals the system has generated. I blindly approved a system-generated recommendation for the proposal template, and over time I've provided feedback when aspects needed beefing up. But the proposal system is entirely internal context management that the team keeps track of among themselves. The manager distills each proposal for me, describes the recommended resolution path in detail, and I engage.

On maybe 10-20% of proposals, we get into a genuinely productive back and forth. Should this become a project-wide convention? Is the agent identifying a real architectural problem or a local symptom? Does the proposed fix address the root cause or just the immediate friction? These are the conversations that matter — the cross-cutting decisions where an error would propagate widely.

But proposals aren't just bottom-up. This is also the mechanism by which I steer the system's development. If something goes slightly off the rails during execution, I can provide immediate course correction *and* tell the system: "File a proposal — we need a more systematic way of tracking entity relationships." I don't need to interrupt an agent in the middle of its work with some deep architectural thought. But the system captures the full context of what was being worked on when I had the realization. Then, in the structured proposal session, the manager and I can have a real dialog about what it means to track entity relationships more systematically — what the implications are, what follow-on work gets generated once that principle is delivered. The proposal system is both a feedback loop and a planning tool.

The outcomes are three bins. Proposals that were already resolved by parallel work or are no longer relevant get discarded. System learnings — conventions, patterns, standards — get captured directly in the operating instructions. Everything else becomes a GitHub issue for the next cycle.

The issues are atomic. Each is assigned to a single agent, and includes all of the context to understand the problem: what the resolution looks like, the research that got us here, the full background. The theory is that when the next cycle starts, an agent reads its first issue and immediately has everything it needs to go fix it. In GTD parlance: every work step is broken into widgets. No further decomposition needed.


## Trust Compounds, Attention Narrows

The cycle then starts over. But each cycle, my attention narrows.

In the beginning, I was involved in most of the system's operations. Most things didn't work. But I focused on process: refining friction points, hardening the places where things historically went off the rails. The proposals that became operating rules meant the same mistakes stopped recurring — mostly. Anyone who has spent time with Claude Code knows that putting "never ever do this" in the instructions practically guarantees the thing will be done. But the trend is real, even if the curve is asymptotic. The issues created from proposal processing meant the backlog reflected real discovered needs, not guesswork.

After several cycles, I trust the system to work. That trust means I only need to pay attention to the areas where the system *doesn't* work — and those areas shrink each cycle. My role has converged almost entirely to proposal processing and the occasional architectural intervention. Everything else runs.

This is what I mean when I say the value is shifting from writing code to designing the system that writes code. The sprint cycle is the engine, and each revolution makes it need less of me.

---

**Editorial notes:**
- Fixed documentation sweep: each stack documents its own work, doc agent is editor (article 4 territory)
- Fixed merge order: heuristic-driven by complexity, not dependency chain
- Expanded proposal processing significantly — "sacred ritual," 500 lines of context, 10-20% deep engagement, three bins, atomic issues
- Reframed compounding: trust in the system grows, attention narrows to where it doesn't work
- ~900 words
