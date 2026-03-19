# A Complete Sprint Cycle Runs in an Afternoon. I Spend Most of It on Proposals.

**Status:** Draft v4

---

My last two articles — [It's Just Microservices and Team Management](https://weswest.ai/writing/multi-agent-microservice/) and [Policy Enforcement for Agentic Workflows](https://weswest.ai/writing/policy-enforcement-agentic-workflows/) — documented how I set up an eight-agent AI coding team: seven domain specialists and a manager, each operating in isolated workspaces with layered enforcement keeping them in bounds. In this article, I share how these agents coordinate through a sprint cycle — and how I spend nearly all of my time on one tiny but sacred sliver.

A full cycle — parallel execution, documentation, integration, proposal processing — completes in an afternoon. Execution takes a few hours. Integration takes one to two more. Most of that integration time is me reviewing proposals. Everything else is autonomous.


## Three Phases Run Without Me

**Execution.** Seven agents work in parallel, each in an isolated copy of the codebase on its own branch. No coordination during execution — they can't see each other's work. Each agent works through all of its unblocked tasks: implementing, writing tests, running the suite, committing. If it hits a blocker — needs something from another agent's domain, discovers a cross-cutting concern — it files a proposal, marks the task blocked, and moves on to the next unblocked issue. Blocked means "filed the request and kept working," not "waiting." An agent is done when all its tasks are complete and its documentation is current. Then it stops.

**Documentation.** Each agent documents its own work — contracts, procedures, anything it established or changed. Findings surface as typed proposals with category, severity, and a proposed change. The documentation agent serves as editor and standards reviewer across all of them, but that's the subject of the next article.

**Integration.** This is the phase that engineers worry about most — and in my experience, it's the least interesting part of the cycle. The concern makes sense: seven agents working in parallel on a shared codebase sounds like a merge nightmare. It isn't, because the ownership boundaries from [article one](https://weswest.ai/writing/multi-agent-microservice/) mean agents rarely touch the same files. When they do, the conflicts are trivial — two agents added entries to the same shared dictionary, and the resolution is to accept both.

The manager agent analyzes each agent's changes — diffs, commit history, file overlap — and recommends a merge order. The heuristics aren't governed by me. It generally prioritizes by complexity: agents that worked entirely in isolation merge first, then agents with minor overlap, and finally agents with material overlap. Material overlap only happens when I've intervened directly — forced an agent to work outside its normal boundaries because it was faster than going through the full cycle. I've never once questioned the recommended merge order.

After each merge, it runs the full test suite — not just at the end. If something breaks, you know which merge caused it. It normalizes the merged codebase for consistency — naming conventions, testing patterns, documentation accuracy — and presents checkpoints for my review. The merging itself is mechanical. The interesting part is what comes next.


## Proposal Processing Is Where I Earn My Keep

Every other phase runs with minimal oversight. This one, I force the system to slow down.

Each cycle generates dozens of proposals across all seven agents. These aren't one-liners — each is backed by roughly 500 lines of descriptive text explaining exactly what went wrong, what the agent tried, and why it's surfacing the issue. Of the thousands of proposals the system has generated, I've read maybe fifty — the most sensitive and most impactful, where I needed to verify the actual problem or the actual resolution was captured accurately.<!--footnote: This isn't a deficiency — it's a prioritization decision. Look at the other articles I've posted: this is Management 101. Manage by objective and outcome, not by reading every internal memo. Once I trusted the system was successful enough at capturing context, I don't need to read the internal machinations.--> I blindly approved a system-generated recommendation for the proposal template, and over time I've provided feedback when aspects needed beefing up. The proposal system is entirely internal context management that the team keeps track of among themselves. The manager distills each proposal for me, describes the recommended resolution path in detail, and I engage.

On maybe 10-20% of proposals, we get into a genuinely productive back and forth. Should this become a project-wide convention? Is the agent identifying a real architectural problem or a local symptom? Does the proposed fix address the root cause or just the immediate friction? These are the cross-cutting decisions where an error would propagate widely.

But proposals aren't just bottom-up. This is also how I steer the system's development. If something goes slightly off the rails during execution, I can provide immediate course correction and tell the system to file a proposal. For example: "We need a more systematic way of tracking entity relationships — file a proposal." I don't need to interrupt an agent mid-task with a deep architectural thought. The system captures the full context of what was being worked on when I had the realization. Then, in the structured proposal session, the manager and I can have a real dialog about what it means to track entity relationships more systematically — what the implications are, what follow-on work gets generated once that principle is delivered. The proposal system is both a feedback loop and a planning tool.

The outcomes are three bins. Already resolved or no longer relevant: discarded. System learnings — conventions, patterns, standards: captured in the operating instructions. Everything else becomes a GitHub issue for the next cycle.

Those issues are atomic. Each is assigned to a single agent with all of the context to understand the problem: what the resolution looks like, the research that got us here, the full background. When the next cycle starts, an agent reads its first issue and immediately has everything it needs to go fix it. In GTD parlance: every work step broken into widgets.


## Each Cycle Needs Less of Me Than the Last

One of my core management principles is that trust in my team scales with demonstrated judgment. I give people as much autonomy as they've earned — the management job is calibrating how much independence each person can handle, and then staying out of the way.

This system is the fruit of that principle. The first several cycles were frustrating. Most things didn't work. I was involved in most of the system's operations. But I focused on process: refining friction points, hardening the places where things historically went off the rails. The proposals that became operating rules meant the same mistakes stopped recurring — mostly. Anyone who has spent time with Claude Code knows that putting "never ever do this" in the instructions practically guarantees the thing will be done. But the system will never achieve flawless execution — and that's fine. I am demonstrably and measurably less involved in operations with each sprint.<!--footnote: I find it interesting how many engineers are dismissive of automated coding tools because the risk of error is non-zero. How many human engineers produce spot-on deliverables that exactly align with the provided spec?-->

The system is now trusted to run largely autonomously. All of the rote code management — testing, merging, documentation, dependency tracking, convention enforcement — has been automated away. That frees me to contribute where I can be most valuable: setting strategic direction and providing the domain expertise that comes from twenty years of experience. My role has converged to proposal processing and the occasional architectural intervention. Everything else runs.

The sprint cycle is the engine. Each revolution makes it need less of me.

---

**Editorial notes:**
- Added series context with linked article titles
- Fixed "picks up highest-priority task" → "works through all unblocked tasks"
- Expanded integration section: addressed engineers' merge anxiety, explained why ownership boundaries make it a non-issue, kept merge order detail
- Fixed "file a proposal" framing: "for example" makes clear it's illustrative
- Replaced "curve is asymptotic" with "demonstrably and measurably less involved with each sprint"
- Tied trust/compounding section to management principle #4 (trust scales with demonstrated judgment)
- Added two footnote placeholders (<!--footnote: ...-->) for future inline footnote system
- ~1100 words
