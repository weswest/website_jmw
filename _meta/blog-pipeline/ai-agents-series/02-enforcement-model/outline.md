# Article 2: Three Layers of Guardrails — Why Prompt Instructions Aren't Enough

## Core Argument

Most agentic setups rely on a single layer: "tell the AI not to do X." That's the equivalent
of security through a sign on the door. Real enforcement requires defense-in-depth — the same
layered model used for production services, applied to AI agents.

## The Three Layers

### Layer 1: Instructions (Convention)
- CLAUDE.md as the team operating manual — coding patterns, testing philosophy, naming rules
- `.claude/parallel-system.md` as the agent playbook — stay in your lane, file proposals not issues
- `.claude/stack-instructions/{stack}.md` as per-agent identity — your modules, your issues, your contracts
- These are version-controlled and evolve through the same proposal process as code
- Analogy: the employee handbook. Necessary, but not sufficient

### Layer 2: Isolation (Separation)
- Git worktrees: each agent has a physically separate checkout of the repo on its own branch
- Agents can't see each other's work — not because they're told not to, but because the files
  don't exist in their working directory
- Each agent has its own venv, its own `.venv/`, its own shell session
- Analogy: separate offices with separate keycards. You don't need a rule against reading
  someone's desk if you can't enter their office

### Layer 3: System Enforcement (Constraint)
- Protected paths (`contracts/`, `stacks.toml`, `CLAUDE.md`) are declared read-only in instructions
  AND enforced by pre-commit hooks that reject out-of-boundary writes
- `stacks.toml` declares module ownership as structured data, not prose — the management CLI
  reads it to configure worktrees, generate CLAUDE.local.md, and validate boundaries
- Pydantic schemas in `contracts/schemas/` with `extra="forbid"` — the contract types
  literally reject unexpected fields at the type system level
- Canonical fixtures in `contracts/fixtures/` are permanent — tests depend on them, deleting
  them breaks CI
- Analogy: the firewall. Not a suggestion, not a convention, a physical constraint

## The Defense-in-Depth Argument

Why all three layers matter:
- Instructions alone: agent can drift, hallucinate, or "helpfully" ignore boundaries
- Isolation alone: prevents collision but doesn't prevent bad patterns within a domain
- Enforcement alone: catches violations but doesn't teach agents why the boundaries exist

Together: agents understand the rules (instructions), can't accidentally violate them
(isolation), and are stopped if they try (enforcement).

## Concrete Examples

### Example 1: Contract Protection
- Layer 1: "contracts/ is READ-ONLY" in parallel-system.md
- Layer 2: Agent's worktree branched from main after contracts were committed — they have
  a snapshot but can't push changes to the protected directory
- Layer 3: If an agent somehow modifies a contract file, the pre-commit hook rejects the commit

### Example 2: Module Boundaries
- Layer 1: Stack instruction says "your modules are src/etl/ and src/db/"
- Layer 2: Other stacks' source files exist in the worktree but the agent has no reason
  to look at them (its issues only reference its modules)
- Layer 3: `stacks.toml` declares boundaries as data; management CLI generates per-agent
  CLAUDE.local.md from this source of truth

### Example 3: The "Helpful" Agent Problem
- Scenario: web agent notices a bug in the orchestration module while debugging an integration
- Layer 1: Instructions say "file a proposal, don't fix it yourself"
- Layer 2: The web agent's worktree has orchestration code but it's not in its module list
- Layer 3: If it tries to commit a fix to `src/orchestration/`, the hook rejects it
- Result: agent files a cross-stack proposal instead. Correct behavior, enforced structurally

## The Governance-as-Code Angle

The rules themselves are version-controlled:
- `CLAUDE.md` — project instructions, evolves through proposals
- `stacks.toml` — module boundaries, read by management CLI
- `.claude/parallel-system.md` — agent playbook
- `.claude/commands/*.md` — skills (structured multi-step processes)
- `contracts/schemas/*.py` — Pydantic models that enforce shape at runtime
- `docs/doc-standards/*.md` — documentation acceptance criteria

This is infrastructure-as-code applied to team governance. The "org chart" is a TOML file.
The "employee handbook" is a markdown file that agents propose changes to through the same
RFC process they'd use for a code change.

## Punchline

When people ask "how do you prevent AI agents from making mistakes?" the answer isn't
"better prompts." It's the same answer as "how do you prevent production services from
interfering with each other?" — ownership boundaries, isolation, and enforcement. The
technology is different but the architecture is identical.

## Source Files to Reference
- `stacks.toml` — module boundary declarations
- `.claude/parallel-system.md` — protected paths section
- `contracts/schemas/` — Pydantic models with extra="forbid"
- `.claude/stack-instructions/` — per-agent identity files
