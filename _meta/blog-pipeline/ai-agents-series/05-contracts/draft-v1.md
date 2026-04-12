# Draft v1 — Contracts as the Skeleton

---
title: "Contracts Are Load-Bearing Infrastructure, Not Documentation"
date: 2026-04-14
description: "When independent agents share a codebase, the question isn't how to make them coordinate. It's what minimum shared structure makes coordination unnecessary. The answer is contracts."
source: "Personal"
tags: ["AI", "Multi-Agent Systems", "Leadership", "Software Architecture"]
image: "/img/contracts-hero.jpg"
---

The first four articles in this series described the system: [seven domain-specialist agents and a manager](https://weswest.ai/writing/multi-agent-microservice/), [an enforcement model](https://weswest.ai/writing/policy-enforcement-agentic-workflows/), [a sprint cycle](https://weswest.ai/writing/sprint-cycle-walkthrough/), and [a dedicated auditor](https://weswest.ai/writing/self-auditing-system/). What none of them explained is how seven agents working in parallel on the same codebase avoid breaking each other's work — not through enforcement or review, but structurally. The answer is contracts.

Not contracts as documentation. Not prose descriptions of an interface. Contracts as load-bearing infrastructure that agents code against, tests validate, and the system rejects if violated.


## What a Contract Actually Is

Each contract in this system has three concrete components.

**A Pydantic schema.** The schema defines the exact shape of data crossing a boundary. Critically, it's configured to reject unexpected fields — not ignore them, not log a warning, reject. If an agent adds a field the schema doesn't expect, the code fails at runtime. The schema isn't describing the API. It *is* the API.

**A canonical fixture.** A JSON file that provides a concrete, validated example of what the contract looks like with real data. These fixtures are permanent — tests depend on them. Deleting one breaks CI. Reading the fixture JSON is often clearer than reading the schema definition, because you can see the actual values and structure rather than inferring them from type annotations.

**A registry.** A mapping of which agents produce which data types and which agents consume them. This makes the dependency graph explicit and queryable. When someone asks "who depends on this contract?" the registry answers it, rather than a full codebase search.


## The Provider Defines the Structure. The Consumer Adapts.

The provider defines the canonical shape. The consumer writes its own adapter. This is standard API design — same reason you don't let downstream services dictate your schema — but it's worth stating because the instinct in a shared codebase is to negotiate a shape that works for everyone. That negotiation is exactly what you want to avoid.

When the agent stack produces findings, it maps its internal representation to the contract's schema at the boundary. When the orchestration stack consumes findings, it maps the contract's schema to its own internal processing types. Neither stack knows or cares about the other's internal types. The contract is the only thing they share.

This means agents can evolve their internal implementations freely. The data agent can refactor its entire internal model without notifying anyone, as long as the contract-boundary output still matches the schema. Consumers never break because of changes they can't see. The cascading dependency problem — where one team's internal needs ripple through every team that touches the same data — doesn't exist.


## Contracts Solve the Context Window Problem

Each agent needs deep familiarity with its own domain — fifty to a hundred files of internal logic. Without contracts, it would also need to understand every adjacent domain's implementation to make changes safely. The context window becomes a constraint because the cognitive load is monolithic.

With contracts, an agent needs to understand its own domain plus five to ten schema files at the boundaries. Not the implementation behind those schemas — just the shapes crossing them. The bounded-context pattern from domain-driven design, applied to AI agents.

This isn't a workaround for token limits. It's an architectural signal. If your agent needs to understand the whole system to make a safe change, the problem isn't the context window — it's that your system doesn't have clear enough boundaries. Contracts make the boundaries load-bearing.


## Changing a Contract Is Deliberately Expensive

Adding a required field to a contract type has cascading impact: every constructor across the codebase needs updating, every test fixture needs the new field, every canonical fixture needs regenerating, and every consuming agent needs notification via proposal.

This friction is a feature. A contract change affects everyone who touches that boundary. Making the change easy would mean making it invisible to the people it affects. The expensive process — search all constructors, update all fixtures, notify all consumers — ensures that contract changes get the deliberate attention cross-cutting changes deserve.

Compare this to the alternative: a shared data structure that anyone can edit. Fields get added, renamed, deprecated in place. Consumers discover the change when their code breaks. The cost is the same — you still have to update everything — but now you're paying it reactively, during a sprint, with broken tests, instead of proactively through a controlled process.


## Every Boundary Returns a Result

Every cross-module function returns a `Result` type: success carries a payload, failure carries a reason and details. Callers must check whether it succeeded before accessing the payload.

This eliminates the "what happens when it fails?" ambiguity at every contract boundary. No uncaught exceptions crossing stack lines. No silent fallbacks where one agent's failure propagates as corrupted data into another agent's domain. The failure case is explicit, always. When an agent hits a contract it can't fulfill, the failure is typed, structured, and visible in the logs — not buried in a traceback three agents downstream.


## The Minimum Viable Shared Structure

The question that led to this design wasn't "how do I make the agents coordinate?" It was "what's the minimum shared structure that makes coordination unnecessary?"

The answer turned out to be small: typed schemas that reject unexpected data, concrete examples that tests depend on, and a registry that maps who produces what and who consumes it. No shared internal types. No negotiated shapes. No coordination meetings.

Seven agents working in parallel rarely need to talk to each other because the contracts already said everything that needed saying. The contracts are the skeleton. Everything else is muscle that can be rearranged without affecting the frame.
