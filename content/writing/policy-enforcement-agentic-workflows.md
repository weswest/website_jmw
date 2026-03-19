---
title: "Policy Enforcement for Agentic Workflows"
date: 2026-03-24
description: "Most people are trying to skip the management skill. Here's the three-layer enforcement model I use for my AI coding team — and why it looks exactly like goals-oriented management."
source: "Personal"
tags: ["AI", "Multi-Agent Systems", "Leadership", "Management"]
image: "/img/policy-enforcement-hero.jpg"
---

Agentic AI is a management problem. Most people have never managed others' work — never had to set someone else's objectives, define best practices, verbalize exactly what "success" and "failure" look like, implement an organizational structure, and then quality-control the output. That's the new skill, and most of the field is trying to skip it.

I wrote about this more broadly in [AI Makes Everyone a Manager](https://weswest.ai/writing/ai-makes-everyone-a-manager/). This article is the specific version: how I set up guardrails for my AI coding team, and why it looks exactly like goals-oriented management. None of this is canonical — I'm sharing what works for me.


## We're All Executing Via an Actor Now

Solo contributors have never needed to think much about the "why." You have a task, you control the entire domain, you execute. We are increasingly executing *via* an actor — and that's a brand new skill for solo contributors. Small-team managers now find themselves managing employees who are — theoretically — managing their own armies of AI, which exponentiates the problem. You can't just do; you have to explain what to do, why to do it, and what good looks like. That requires humility and self-reflection that most technical work has never demanded.

There's a genre of post I keep seeing where someone breathlessly describes how their AI agents "deliberated," "debated," and "collectively wrote a charter for how they work together." What actually happened is they told the agents to document their operating procedures and the agents did. That's not emergence — that's a well-managed team with a documentation requirement. The personification instinct obscures the actual skill involved, which is management. Provide clear objectives, establish guardrails, step back. If you're reviewing every line before it's written or jumping in after every commit, you've built a very expensive autocomplete. The value of agents comes from letting them exercise judgment within boundaries you've set — which is the same realization every new manager eventually has about people.


## Three Layers, Same as Any Organization

My enforcement model has three layers. None are novel. They're the same three layers every well-run organization uses. And I had Claude Code write every line of the instruction manual — it's better, faster, and more patient than me at getting it right. I trust the system 90%, and focus my energy on smoothing out the friction from the remaining 10%.

**The operating manual.** Versioned markdown files: project-level coding standards, an agent playbook for coordination, per-agent identity files defining module ownership. These are convention — necessary and not sufficient. Agents drift. They "helpfully" ignore boundaries. If your entire enforcement model is "I told the agent not to do that," you have a "please don't steal" sign on the door.

**Organizational design.** Each of my seven agents runs in its own git worktree — a physically separate copy of the repository on its own branch. Agents can't see each other's in-progress work. Not because I told them not to look, but because the files don't exist in their working directory. You don't need a policy against reading someone's desk if you can't enter their office. Strong ownership boundaries eliminate most coordination overhead.

**Structural enforcement.** Protected paths are declared read-only in instructions *and* enforced by pre-commit hooks that reject out-of-boundary writes. Shared contracts use schema validation that rejects unexpected fields at the type system level. Same reason your company has access controls and required approvals — structural enforcement is cheaper and more reliable than vigilance.

Each layer alone fails. Instructions: agents drift. Isolation: prevents collision but not bad code. Enforcement: catches violations but doesn't teach agents *why* the boundaries exist. Together: agents understand the rules, can't accidentally violate them, and are stopped if they try.


## Self-Knowledge Through Fast Feedback

After a working session where I've been giving an agent feedback — correcting its testing philosophy, redirecting an architectural approach, pushing back on a naming convention — I can say: "Capture my preferences from this session and embed them in your operating instructions."

The agent reviews our interaction, identifies where my guidance diverged from its default behavior, and writes the diffs into its own instruction files. It doesn't need me to deconstruct the hows and whys — it can see the delta between "what I was doing" and "what he told me to do" more clearly than I can articulate it.

What this process actually teaches me is how my own preferences differ from the defaults. I don't have to articulate why — the system does. It observes the delta between its standard behavior and my corrections, and writes the diffs. What I get back is a primarily objective — if somewhat obsequious — mirror of my management style, my preferences, and my dislikes. Agents have no ego about this. You can tell one "this was an awful session, here are the four reasons why, go update your instructions" and the next session will very likely run better. Two paragraphs to an instructions file, git commit, done. That's not a knock on human teammates — people bring judgment, context, and pushback that makes work better in ways agents can't. But the speed of the feedback loop means I get to observe my own management instincts in fast-forward, and that self-knowledge is the real payoff.

I've been managing people for twenty years and I'm still only okay at it. But that's twenty years of practice at a skill that is now even more valuable as we have all moved anywhere from one to three levels up the management stack.
