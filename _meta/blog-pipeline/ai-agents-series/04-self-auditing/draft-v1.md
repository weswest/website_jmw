# Draft v1 — A Dedicated Agent That Audits the Other Agents

---
title: "One Agent's Entire Job Is Auditing the Other Seven"
date: 2026-04-07
description: "Convention compliance and documentation don't happen by accident — on human teams or agent teams. The solution is the same: make it someone's entire job. But unlike a human documentation team, an AI auditor can build and operate its own audit infrastructure."
source: "Personal"
tags: ["AI", "Multi-Agent Systems", "Leadership", "Software Architecture"]
image: "/img/self-auditing-hero.jpg"
---

The first three articles in this series described a system: [seven domain-specialist agents and a manager](https://weswest.ai/writing/multi-agent-microservice/), [a three-layer enforcement model](https://weswest.ai/writing/policy-enforcement-agentic-workflows/) keeping them in bounds, and [a sprint cycle](https://weswest.ai/writing/sprint-cycle-walkthrough/) that coordinates their work. What none of those articles addressed is what happens when an agent follows all the rules and still writes bad code. Not broken code — code that passes tests, respects ownership boundaries, and doesn't violate any enforcement layer. Just code that's inconsistent, poorly documented, or quietly drifting from conventions nobody explicitly checks.

Every engineering team has this problem. The enforcement model catches violations. Tests catch bugs. Neither catches the slow accumulation of mediocrity — naming inconsistencies, undocumented configuration, error messages that make sense to the author and nobody else. On human teams, the standard fix is code review. On my team, one of the eight agents does nothing else.


## Make It Someone's Entire Job

The documentation agent has two personas, and neither writes feature code.

**Governance auditor.** Reviews code on main for convention compliance and factual accuracy. Doesn't fix anything — files proposals for the owning agent. This is a deliberate constraint. The auditor identifies; the domain expert resolves. Same reason your compliance team flags issues but doesn't rewrite your trading logic.

**Documentation acceptance tester.** Doesn't write feature documentation either — the agents that built the features write those, because they're the domain experts. The documentation agent designs specs for what "good" looks like, then reads every piece of documentation as someone who doesn't live in the code. The acceptance test: could a newcomer follow this without reading the source? When docs fail, it files proposals telling the owning agent what's confusing — not how to fix it.

The split matters. An agent that both writes and reviews its own documentation has the same blind spot as a developer reviewing their own pull request. The domain agents write docs because they know the details. The documentation agent reviews because it doesn't.


## The Audit Trail Is a Crawler, Not a Checklist

Most quality systems are event-driven: something changes, a review happens. That works for catching regressions. It doesn't work for catching stale documentation, accumulated naming drift, or conventions that were adopted after a file was last touched.

The audit trail is a database — a crawler-style scheduler for incremental code reviews. It tracks every source and test file in the project, when each was last reviewed for each audit category, and when each was last modified in git.

Nine audit categories, split into two groups. Convention compliance: Are cross-module functions returning the standard Result type? Are names self-documenting? Is the testing philosophy followed? Are type annotations using the current style? Are error messages diagnostic? Does terminology match the glossary? Documentation quality: Are docstrings helpful or just present? Can you diagnose a failure from the error message alone? Are configuration values documented?

Each cycle, the auditor selects files using a priority algorithm. Never-reviewed files first. Then files modified since their last review. Then the oldest-reviewed files — staleness rotation. Then a trick borrowed from web crawlers: after reviewing a file, follow its import graph to select the next one. This clusters related files for context continuity and ensures coverage fills in over successive cycles without requiring a full-codebase sweep.

The key design choice: the database records *when* a file was reviewed, never *what* was found. Findings go to the proposal queue and leave the auditor's scope. No state to maintain about open versus closed findings. No risk of stale finding records. Each review is fresh — if the issue was fixed, it simply won't appear. If a convention violation was a justified exception, there'll be a compensating comment explaining why. The auditor doesn't need to track that.


## Documentation Gaps Are Invisible Unless You Track Them

"This documentation should exist but doesn't" is a statement that has no natural home in most codebases. Tests fail. Linters flag. But missing documentation is invisible — there's nothing to check against because the artifact doesn't exist yet.

The documentation registry solves this by making gaps first-class objects. It's an inventory of documentation artifacts — what exists, what's missing, who owns it, and what state it's in.

The lifecycle: stack agents register entries during their documentation sweeps — they know what they built, so they know what needs documenting. They write first drafts because they're the domain experts. The documentation agent reviews for comprehensibility and unified voice. Status cycles from `needed` to `exists` to `stale` and back. Every three to five cycles, the documentation agent traverses the full codebase to catch gaps the stack agents missed.

This is the documentation equivalent of the audit database's crawler pattern — systematic, incremental, and designed to surface absences rather than just review what's present.


## Acceptance Criteria, Not Style Guides

The documentation agent created quality specs for five document types: READMEs, stack overviews, API references, developer guides, and architecture docs. Each spec defines required sections and quality criteria.

These aren't style guides. Style guides say "use active voice" and "keep paragraphs short." These are acceptance criteria — the same thing you'd write for a feature ticket. A README spec requires a quick start section that gets someone running in under five minutes. An API reference spec requires error response documentation with enough detail to diagnose failures without reading the implementation. An architecture doc spec requires a "where does X live?" section that answers the question every new team member asks first.

The acceptance test for every spec: can someone unfamiliar with the codebase follow this without reading source code? It's a high bar, and it means documentation gets filed back to the owning agent regularly. But it also means the documentation that does pass review is actually useful — not just present.


## The Six-Phase Audit Cycle

Each audit cycle runs six phases in sequence.

**Sync tracking systems.** Discover new files, update git timestamps, check the documentation registry for entries that need attention. Housekeeping that ensures the auditor is working from current state.

**Governance checks.** CLAUDE.md accuracy — are the operating instructions still true? Glossary currency — do terms match actual usage? Cross-reference integrity — do internal links resolve? Bloat watch — are instruction files growing without bound? Proposal resolution — did the last cycle's proposals actually get addressed? Issue tracker hygiene — are GitHub issues still well-formed?

**File-level code audits.** Select N files using the priority algorithm, review all applicable categories, file proposals. This is the bulk of the cycle.

**Documentation acceptance testing.** Pull entries from the registry, review for comprehensibility against the quality specs, file proposals for anything that fails.

**Cross-cutting documentation.** Write or update the artifacts that span the whole project — the README, architecture overview, onboarding guide. These are the documentation agent's own deliverables, not reviews of others' work.

**Cycle report.** Coverage statistics, findings by category, trend lines, backlog. This is how I see whether the system is getting more disciplined or less.


## The Loop Closes Itself

Audit findings flow through the same proposal system described in [the sprint cycle article](https://weswest.ai/writing/sprint-cycle-walkthrough/). The documentation agent files proposals. The manager processes them. Resolved findings become operating instructions or GitHub issues. The next cycle's agents work from better instructions, produce cleaner code, and the documentation agent finds fewer issues.

But the loop runs in the other direction too. Stack agents discover documentation gaps during their own work and file proposals. Those proposals feed the same pipeline — manager processes them, findings become registry entries or instruction updates. The governance auditor and the domain agents are independently surfacing the same kinds of improvements through different mechanisms.

This was the validation that mattered most to me. Early in the project, I ran an external review of the system's health — conventions followed, documentation quality, architectural consistency. The system's own retrospective loop had already identified everything the external review found. Not because I'd tuned it to look for those things, but because a systematic audit with good coverage eventually finds the same problems that a fresh pair of eyes would. That's the point of making quality someone's entire job: given enough cycles, the system converges on the same conclusions an outside reviewer would reach.


## Why This Matters Beyond My Setup

Most agentic coding setups have no quality feedback loop. Code goes in, code comes out, and convention compliance depends entirely on prompt instructions being followed perfectly every time. Anyone who has spent serious time with Claude Code knows that instructions are necessary and not sufficient — "never do X" is practically a dare.

A dedicated audit agent with its own tracking infrastructure changes the dynamics. Conventions are checked, not just stated. Coverage is tracked and improves over time. Documentation gaps are visible, not hidden. The system gets more disciplined with each cycle, not less.

This is the same principle behind dedicated QA teams, internal audit functions, and compliance departments. The insight isn't that AI agents need oversight — it's that the oversight can be another agent, running the same playbook that works for human organizations, at a speed and consistency that no human documentation team could sustain.
