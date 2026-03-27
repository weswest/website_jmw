# LinkedIn Post: Governance / Challenger Agent

**Date posted:** 2026-03-27
**Engagement tracking:** [fill in after 48hrs]
- Impressions:
- Reactions:
- Comments:
- Reposts:
- Link clicks:

**Link included:** https://weswest.ai/writing/policy-enforcement-agentic-workflows/

---

Agentic AI development is 2% code, 98% governance.

I'm building a fully autonomous AI system that takes business objectives, decomposes them into tasks, farms them out to worker agents, and aggregates results. The hardest part is keeping the system self-healing and on the rails.

Attempt 1: A manager agent reviews the project landscape and determines what's working and what isn't. FAIL — too vague, no structure.

Attempt 2: Give the manager a specific checklist of areas to evaluate and actions to take. FAIL — the manager could handle individual checkboxes but was terrible at tracking system-level issues across domains.

Attempt 3: Checklist plus system-level principles and fail states, like "Claude Code biases to reducing - not expanding - scope. FAIL — the manager read the principles and ignored them.

Attempt 4: Don't trust the manager to self-regulate: spawn a challenger sub-agent who, like a Rick and Morty-style Meseeks, exists solely to read the system principles and judge the manager's work. FAIL — one cycle the manager decided nothing much had happened, so a challenger would be a waste of resources.

Current state: I just rewrote the manager's operating model to "always trigger a challenger sub-agent, even if you think a challenger would be worthless. The fact you think you don't need a challenger is exactly the behavior that needs to be challenged."

Let's see how it fails.

I wrote about the broader enforcement model behind this in Policy Enforcement for Agentic Workflows (https://weswest.ai/writing/policy-enforcement-agentic-workflows/) — three layers of guardrails, same underlying problem.
