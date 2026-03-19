# From Issue Creation to Integration: An End-to-End Walkthrough

**Status:** Draft v1

---

The first two articles described the architecture and the enforcement model. This one walks through a complete sprint cycle — from issue assignment through parallel execution through integration — so you can see how the pieces fit together in practice.

The whole thing runs in an afternoon. That's not a pitch — it's the timing. Parallel execution takes a few hours, integration takes one to two more, and most of the integration time is me reviewing checkpoints.


## Parallel Execution: Each Agent Works Alone

Each of the seven agents starts its cycle the same way: check open issues, run the test suite, present a prioritized list of unblocked tasks. Then it picks up the top task and starts working.

The key behaviors during execution are deliberately boring. The agent implements, writes tests, runs the full test suite, and commits. If it hits a blocker — needs something from another agent's domain, discovers a cross-cutting concern — it writes a proposal, marks the task blocked, and moves on to the next unblocked issue. Blocked doesn't mean waiting. It means "filed the request and kept working."

This is the part that surprises people: there's no coordination between agents during execution. They can't see each other's in-progress work. Each agent operates in a physically isolated copy of the codebase on its own branch. When Agent A and Agent B both need to update a shared dictionary, they do it independently. The merge handles it later.

An agent is "done" when all its unblocked tasks are complete, proposals are filed for each blocker, and it's run a structured documentation sweep. Then it stops. No busywork, no padding.


## The Documentation Sweep: A Structured Retrospective

When an agent finishes its tasks, it doesn't just commit and shut down. It runs a structured audit across six categories: system learnings that should become project rules, architectural patterns it established, cross-domain discoveries, contract gaps, terminology drift, and naming discipline.

Each finding becomes a typed proposal — categorized, with severity and a proposed change. This isn't documentation for documentation's sake. It's creating the inbox for the integration phase. The retrospective is what closes the learning loop: the agent reflects on what it encountered and surfaces anything that should change how the system operates.

A dedicated documentation agent handles this, and that matters. In every human engineering team I've managed, documentation loses the priority fight against feature work. When it's someone's entire job, there's no fight.


## Integration: Where the Manager Earns Its Keep

The manager agent waits for all seven agents to finish, then runs a five-stage integration process. This is the most interesting part of the cycle.

**Analysis.** Examine each agent's changes — diffs, commit history, file overlap. Plan a merge order based on the dependency chain. Data merges first, then the layers that depend on it. Present the merge plan for my review.

**Integration.** Merge each agent's branch to main in the planned order. Run the full test suite after *each* merge — not just at the end. This is the same principle as continuous integration: if something breaks, you want to know which merge caused it. Present any conflict resolutions for my review.

**Normalization.** Audit the merged codebase for consistency — naming conventions across domains, testing patterns, documentation accuracy. Triage findings into fix-now, create-issue-for-later, or update-the-project-rules. Present changes for my review.

**Proposal processing.** This is the payoff. Every proposal from every agent gets categorized. About a third are already resolved — parallel work addressed the need before anyone asked. Another third become additions to the project's operating rules — system learnings, pattern documentation, new conventions. The remainder becomes issues for the next cycle. A small minority needs my judgment: the cross-cutting architectural decisions where an error would propagate widely.

**Finalization.** Commit everything, run the final test suite, rebase all agent branches to the updated main. Generate a summary report.

My time during integration is almost entirely spent at checkpoints. The manager proposes; I review and approve. The cross-cutting architectural decisions — maybe two or three per cycle — are where I focus. Everything else runs without me.


## The Compounding Effect

The cycle then starts over. But each cycle starts from a better position than the last. The proposals that became operating rules mean agents make better decisions next time. The issues created from unresolved proposals mean the backlog reflects real discovered needs, not guesswork.

After several cycles, the system's operating rules are remarkably comprehensive — not because someone sat down and wrote them all, but because they accumulated from actual work. The agents that proposed them understood the context because they encountered the problems firsthand.

This is what I mean when I say the value is shifting from writing code to designing the system that writes code. The sprint cycle is the engine, and each revolution makes it run a little smoother.

---

**Editorial notes:**
- Lifted from commands/implementation to principles and behaviors
- Four-phase structure (execute → document → integrate → compound)
- Concrete enough to be credible (merge ordering, test-after-each-merge, proposal stats)
- "Deliberately boring" framing for parallel execution — the point is reliability, not excitement
- Ends on the compounding insight, connecting back to article 1's thesis
- ~850 words
