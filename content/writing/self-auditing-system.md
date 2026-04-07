---
title: "One Agent's Entire Job Is Auditing the Other Seven"
date: 2026-04-07
description: "Convention compliance and documentation don't happen by accident — on human teams or agent teams. The solution is the same: make it someone's entire job."
source: "Personal"
tags: ["AI", "Multi-Agent Systems", "Leadership", "Software Architecture"]
image: "/img/self-auditing-hero.jpg"
---

The first three articles in this series described a system: [seven domain-specialist agents and a manager](https://weswest.ai/writing/multi-agent-microservice/), [a three-layer enforcement model](https://weswest.ai/writing/policy-enforcement-agentic-workflows/) keeping them in bounds, and [a sprint cycle](https://weswest.ai/writing/sprint-cycle-walkthrough/) that coordinates their work. What none of them addressed is what happens when an agent follows all the rules and still writes bad code. Not broken code — code that passes tests and respects every boundary. Just code that's inconsistent, poorly documented, or quietly drifting from conventions nobody explicitly checks.

Every engineering team has this problem. Enforcement catches violations. Tests catch bugs. Neither catches the slow accumulation of mediocrity. On my team, one of the eight agents does nothing but look for it.


## Make It Someone's Entire Job

The documentation agent has two personas, and neither writes feature code.

**Governance auditor.** Reviews code on main for convention compliance and factual accuracy. Doesn't fix anything — files proposals for the owning agent. The auditor identifies; the domain expert resolves. Same reason your compliance team flags issues but doesn't rewrite your trading logic.

**Documentation acceptance tester.** Doesn't write feature docs either — the agents that built the features write those, because they're the domain experts. The documentation agent designs specs for what "good" looks like, then reads documentation as someone who doesn't live in the code. The acceptance test: could a newcomer follow this without reading the source? When docs fail, it tells the owning agent what's confusing — not how to fix it.

The split matters. An agent that both writes and reviews its own documentation has the same blind spot as a developer reviewing their own pull request.


## A Crawler, Not a Checklist

Most quality systems are event-driven: something changes, a review happens. That catches regressions. It doesn't catch stale documentation, accumulated naming drift, or conventions adopted after a file was last touched.

The audit trail is a crawler-style scheduler. It tracks every source and test file, when each was last reviewed per audit category, and when each was last modified in git. Nine categories spanning convention compliance and documentation quality — everything from naming consistency and type annotation style to error message clarity and config documentation.

Each cycle, the auditor selects files by priority: never-reviewed first, then modified-since-last-review, then oldest-reviewed for staleness rotation. After reviewing a file, it follows the import graph to select the next one — a trick borrowed from web crawlers that clusters related files for context continuity.

The key design choice: the database records *when* a file was reviewed, never *what* was found. Findings go to the proposal queue and leave the auditor's scope. Each review is fresh. If the issue was fixed, it won't appear. If a convention violation was a justified exception, there'll be a compensating comment. No state to maintain, no stale finding records.


## Making Gaps Visible

"This documentation should exist but doesn't" has no natural home in most codebases. Tests fail. Linters flag. Missing documentation is invisible.

The documentation registry makes gaps first-class objects — an inventory of what exists, what's missing, who owns it, and what state it's in. Stack agents register entries during their documentation sweeps because they know what they built. They write first drafts because they're the domain experts. The documentation agent reviews for comprehensibility. Every few cycles, it traverses the full codebase to catch gaps the stack agents missed.

The documentation agent also created acceptance criteria — not style guides — for five document types. A README spec requires a quick start that gets someone running in five minutes. An API reference spec requires error documentation detailed enough to diagnose failures without reading the implementation. The bar for every spec: can someone unfamiliar with the codebase follow this without reading source code?


## The Loop Closes Itself

Audit findings flow through the same proposal system from [the sprint cycle article](https://weswest.ai/writing/sprint-cycle-walkthrough/). Findings become operating instructions or GitHub issues. The next cycle's agents work from better instructions, produce cleaner code, and the auditor finds fewer issues. But it runs the other direction too — stack agents discover gaps during their own work and file proposals through the same pipeline. The auditor and the domain agents independently surface the same improvements through different mechanisms.

This was the validation that mattered most. Early in the project, I ran an external review of the system's health — conventions, documentation quality, architectural consistency. The system's own retrospective loop had already identified everything the review found. That's the point of making quality someone's entire job: given enough cycles, the system converges on the same conclusions an outside reviewer would reach.

Most agentic coding setups have no quality feedback loop. Code goes in, code comes out, and compliance depends on prompt instructions being followed perfectly every time. Anyone who has spent serious time with Claude Code knows that "never do X" is practically a dare. A dedicated audit agent changes the dynamics: conventions are checked, not just stated. Coverage improves over time. The system gets more disciplined with each cycle, not less.
