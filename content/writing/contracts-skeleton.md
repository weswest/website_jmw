---
title: "Contracts Are Load-Bearing Infrastructure, Not Documentation"
date: 2026-04-14
description: "When independent agents share a codebase, the question isn't how to make them coordinate. It's what minimum shared structure makes coordination unnecessary. The answer is contracts."
source: "Personal"
tags: ["AI", "Multi-Agent Systems", "Leadership", "Software Architecture"]
image: "/img/contracts-hero.jpg"
---

This is the fifth article in a series on running an [eight-agent AI coding team](https://weswest.ai/writing/multi-agent-microservice/). Across the first four articles, a single design philosophy keeps surfacing: define one structural path for the system to succeed, then make it difficult to deviate from that path. Everything else is fault tolerance.

Three principles have emerged so far:

- **Make wrong behavior structurally impossible, not just discouraged.** Agents run in [physically isolated worktrees](https://weswest.ai/writing/policy-enforcement-agentic-workflows/) so they can't see each other's in-progress work. Protected paths are enforced by pre-commit hooks, not just instructions. You don't need a policy against reading someone's desk if you can't enter their office.
- **Surface failures systematically, not reactively.** Agents file [proposals when they hit blockers](https://weswest.ai/writing/sprint-cycle-walkthrough/) — they don't wait, and they don't stop working. A [dedicated auditor](https://weswest.ai/writing/self-auditing-system/) crawls the codebase on a schedule to find drift that no event would have triggered. Problems are discovered by design, not by accident.
- **Automate rote judgment; reserve human judgment for cross-cutting decisions.** Testing, merging, documentation, convention enforcement — all automated. The human focuses on proposals: the genuinely ambiguous architectural decisions where an error would propagate widely.

This article adds two ideas that deepen those principles:

- **Contracts make coordination unnecessary by making boundaries self-enforcing.** Previous articles described mechanisms for coordinating agents — proposals, sprint cycles, audit. Contracts eliminate the *need* for most of that coordination: if the schema rejects unexpected data at runtime, agents can't accidentally break each other regardless of what they do internally.
- **The context window constraint is an architectural signal, not a limitation to fight.** If an agent needs the whole system in context to make a safe change, the system doesn't have clear enough boundaries. Contracts make those boundaries concrete and load-bearing — each agent needs its own domain plus a handful of schema files, not the full codebase.


## What a Contract Actually Is

Each contract in this system has three concrete components.

**A Pydantic schema.** The schema defines the exact shape of data crossing a boundary. Critically, it's configured to reject unexpected fields — not ignore them, not log a warning, reject. If an agent adds a field the schema doesn't expect, the code fails at runtime. The schema isn't describing the API. It *is* the API.

**A canonical fixture.** A JSON file that provides a concrete, validated example of what the contract looks like with real data. These fixtures are permanent — tests depend on them. Deleting one breaks CI. Reading the fixture JSON is often clearer than reading the schema definition, because you can see the actual values and structure rather than inferring them from type annotations.

**A registry.** A mapping of which agents produce which data types and which agents consume them. This makes the dependency graph explicit and queryable. When someone asks "who depends on this contract?" the registry answers it, rather than a full codebase search.


## The Provider Defines the Structure. The Consumer Adapts.

The provider defines the canonical shape. The consumer writes its own adapter. This is standard API design — same reason you don't let downstream services dictate your schema — but it's worth stating because the instinct in a shared codebase is to negotiate a shape that works for everyone. That negotiation is exactly what you want to avoid.

When the agent stack produces findings, it maps its internal representation to the contract's schema at the boundary. When the orchestration stack consumes findings, it maps the contract's schema to its own internal processing types. Neither stack knows or cares about the other's internal types. The contract is the only thing they share.

This means agents can evolve their internal implementations freely. The data agent can refactor its entire internal model without notifying anyone, as long as the output at the contract boundary still matches the schema. Consumers never break because of changes they can't see. The cascading dependency problem — where one team's internal needs ripple through every team that touches the same data — doesn't exist.


## Changing a Contract Is Deliberately Expensive

Adding a required field to a contract type has cascading impact: every constructor across the codebase needs updating, every test fixture needs the new field, every canonical fixture needs regenerating, and every consuming agent needs notification via proposal.

This friction is a feature. A contract change affects everyone who touches that boundary. Making the change easy would mean making it invisible to the people it affects. The expensive process — search all constructors, update all fixtures, notify all consumers — ensures that contract changes get the deliberate attention cross-cutting changes deserve.

Compare this to the alternative: a shared data structure that anyone can edit. Fields get added, renamed, deprecated in place. Consumers discover the change when their code breaks. The cost is the same — you still have to update everything — but now you're paying it reactively, during a sprint, with broken tests, instead of proactively through a controlled process.


## Every Boundary Returns a Result

Every cross-module function returns a `Result` type: success carries a payload, failure carries a reason and details. Callers must check whether it succeeded before accessing the payload.

This eliminates the "what happens when it fails?" ambiguity at every contract boundary. No uncaught exceptions crossing stack lines. No silent fallbacks where one agent's failure propagates as corrupted data into another agent's domain. The failure case is explicit, always. When an agent hits a contract it can't fulfill, the failure is typed, structured, and visible in the logs — not buried in a traceback three agents downstream.

This is the contracts version of the same principle that runs through the whole system: make the failure path explicit and structural, not implicit and hopeful. Enforcement hooks reject out-of-boundary writes. The audit crawler finds convention drift. `extra="forbid"` rejects unexpected fields. `Result` types force callers to handle failure. Each mechanism is different; the philosophy is the same.


## The Minimum Viable Shared Structure

The question that led to this design wasn't "how do I make the agents coordinate?" It was "what's the minimum shared structure that makes coordination unnecessary?"

The answer turned out to be small: typed schemas that reject unexpected data, concrete examples that tests depend on, and a registry that maps who produces what and who consumes it. No shared internal types. No negotiated shapes. No coordination meetings.

Seven agents working in parallel rarely need to talk to each other because the contracts already said everything that needed saying. The contracts are the skeleton. Everything else is muscle that can be rearranged without affecting the frame.
