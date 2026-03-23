Stop anthropomorphizing your agents. Seriously.

There's a genre of post I keep seeing on Reddit and LinkedIn where someone breathlessly describes how their five AI agents "deliberated," "debated," and "collectively wrote a charter for how they work together." The language is reverent — like they witnessed a small civilization emerge from their terminal. And it's just plain odd.

Here's what actually happened: they told the agents to document their operating procedures, and the agents did. That's not emergence. That's a well-managed team with a documentation requirement.

I bring this up because the personification instinct actively makes you worse at this. When you treat agents as autonomous beings who "decide" things, you obscure the actual skill involved — which is management. And management is hard. It took me twenty years of failing at it to become merely okay. But the patterns that make someone effective at managing people are the same patterns that make an agentic AI system work.

I wrote about this more broadly in [AI Makes Everyone a Manager](link) — the idea that millions of knowledge workers became managers overnight and most don't realize it. This article is the specific version: how you actually set up the guardrails for an AI coding team, and why it looks exactly like goals-oriented management.


## Objectives and Guardrails, Then Get Out of the Way

The management philosophy that underpins my entire system is simple: provide clear objectives, establish guardrails, then step back. This isn't some enlightened leadership theory. It's the only approach that scales.

Micromanagement defeats the purpose of having agents. If you're reviewing every line before it's written, dictating implementation decisions, or jumping in after every commit — you've built a very expensive autocomplete. The value of agents comes from letting them exercise judgment within boundaries you've set.

This is the same realization every new manager eventually has about people. You can't scale yourself by making every decision. You scale by making the decisions about *how* decisions get made — then trusting the system.


## Three Layers, Same as Any Organization

My enforcement model has three layers. None of them are novel. They're the same three layers that every well-run organization uses.

### Layer 1: The Operating Manual

Every team needs written norms. For my agents, that's a set of versioned markdown files:

- A project-level instruction file — coding patterns, testing philosophy, naming conventions. The employee handbook.
- An agent playbook — how agents coordinate, when to file proposals instead of making changes, what's off-limits. The team charter.
- Per-agent identity files — "you own these modules, you work these issues, you follow these conventions." The job description.

These are *convention*. They work because the agents read them and mostly follow them. But like any employee handbook, they're necessary and not sufficient. People — and agents — drift. They "helpfully" ignore boundaries. They find creative interpretations of rules they don't agree with.

If your entire enforcement model is "I told the agent not to do that," you have the organizational equivalent of a "please don't steal" sign on the door.

### Layer 2: Organizational Design

The more powerful move is making violations structurally impossible rather than merely discouraged.

Each of my seven agents runs in its own git worktree — a physically separate checkout of the repository on its own branch. Agents can't see each other's in-progress work. Not because I told them not to look, but because the files don't exist in their working directory. This is the equivalent of separate offices with separate keycards. You don't need a policy against reading someone else's desk if you can't enter their office.

This solves the coordination problem architecturally. Agents don't need to negotiate who's editing which file because their worlds don't overlap. When they do overlap — two agents added terms to the same shared dictionary — the merge conflict is trivial. This is standard microservices thinking: strong ownership boundaries eliminate most coordination overhead.

### Layer 3: Structural Enforcement

Some things can't be left to convention or even organizational design. These are the firewall rules — constraints that reject violations at the system level.

Protected paths are declared read-only in instructions *and* enforced by pre-commit hooks that reject out-of-boundary writes. Shared contracts use schema validation that literally rejects unexpected fields at the type system level. Canonical test fixtures are permanent — deleting them breaks CI.

This is the same reason your company has access controls, required approvals on pull requests, and automated compliance checks. Not because people are untrustworthy — because structural enforcement is cheaper and more reliable than vigilance.


## Why All Three Layers

Each layer alone has obvious failure modes:

- Instructions alone: agents drift, hallucinate, or find creative ways around boundaries they consider unhelpful.
- Isolation alone: prevents collision but doesn't prevent bad patterns within a domain. An agent that owns its modules exclusively can still write terrible code.
- Enforcement alone: catches violations but doesn't teach agents *why* the boundaries exist. You get technically compliant work that misses the point.

Together: agents understand the rules, can't accidentally violate them, and are stopped if they try. Defense-in-depth. Same as any production system, same as any well-designed organization.


## The Meta-Move: Let the Agent Write Its Own Guardrails

Here's where the management analogy pays off in a way that has no human equivalent.

After a working session where I've been giving an agent feedback — correcting its testing philosophy, redirecting an architectural approach, pushing back on a naming convention — I can say: "Capture my preferences from this session and embed them in your operating instructions."

That's it. The agent reviews our interaction, identifies where my guidance diverged from its default behavior, and writes the diffs into its own instruction files. It can internalize how my feedback maps against its standard operating protocol and produce the precise updates.

Try doing that with a human team member. After a coaching session, tell your engineer: "Now go update the team's operating procedures to reflect everything I just told you, correctly inferring which parts were specific to this task and which parts are general principles." You'd get a blank stare, or a document that requires four rounds of revision.

This is the one place where the technology genuinely *is* better than the human analogy. The agent can do the meta-work of translating managerial feedback into operational infrastructure. It doesn't need me to deconstruct the hows and whys of what I just said — it can see the delta between "what I was doing" and "what he told me to do" more clearly than I can articulate it.


## Back to the Personification Problem

When someone posts that their agents "deliberated and wrote their own charter," I want to ask: did you set up the structure that made that output useful? Did you define what a charter should contain? Did you establish the evaluation criteria? Did you review the result and feed corrections back into the process?

If yes — you managed well. The agents did what you told them to do, informed by the context and constraints you provided. That's not emergence; it's execution within a well-designed system. Credit yourself for the management, not the agents for the "deliberation."

If no — you got a document that sounds impressive and is probably useless. An agent can produce a beautifully formatted charter that has no connection to how work actually gets done. The same way a new hire can write a great-sounding team manifesto that nobody follows.

The difference between these two outcomes is management skill. Not prompt engineering. Not agent sophistication. Management.


## The Punchline

The hard part of agentic AI isn't the technology. It's that most people have never had to set clear objectives, establish appropriate guardrails, design organizational structure, and then step back and trust the work. That's a skill set that takes years to develop — and the AI community is largely trying to skip it by treating agents as magical entities that just need better prompts.

The people who will be best at this won't be the best prompt engineers. They'll be the ones who spent years learning to manage — learning when to intervene and when to stay out of the way, how to give feedback that actually changes behavior, and how to build systems where good work happens without their constant involvement.

I've been managing people for twenty years and I'm still only okay at it. But "okay at management" turns out to be a significant competitive advantage when most of the field is trying to skip the management part entirely.
