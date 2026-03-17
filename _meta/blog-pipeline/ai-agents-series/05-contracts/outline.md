# Article 5: Contracts as the Skeleton

## Core Argument

When independent agents share a codebase, the question isn't "how do I make them
coordinate?" — it's "what's the minimum shared structure that makes coordination
unnecessary?" The answer is contracts. Not contracts as documentation, but contracts
as load-bearing infrastructure that agents code against, tests validate, and the
system enforces.

## What a Contract Actually Is Here

Not a prose description of an interface. A concrete artifact with three components:

### 1. Pydantic Schema (`contracts/schemas/`)
```python
class Finding(BaseModel):
    model_config = ConfigDict(extra="forbid")  # rejects unexpected fields
    finding_type: FindingType
    agent_id: str
    ...
```
- `extra="forbid"` means the schema isn't just documentation — it actively rejects
  data that doesn't conform
- The schema IS the API. If your output doesn't match, it fails at runtime

### 2. Canonical Fixture (`contracts/fixtures/`)
- JSON files: `{producer}-produces-{TypeName}.json`
- Wrapped in a Result envelope (meta, data, errors, warnings, partial)
- These are PERMANENT — tests depend on them, deleting one breaks CI
- Provide a concrete, validated example of what the contract actually looks like

### 3. Registry (`contracts/registry.json`)
- Maps which stacks produce which types and which stacks consume them
- Makes the dependency graph explicit and queryable

## Callee-Defined Contracts

The provider defines the canonical structure. The consumer writes its own adapter.

### Why this matters:
- Provider can evolve internal implementation without notifying consumers
- Consumer owns the translation layer — it decides how to interpret the contract
- No cascading dependency problem where one consumer's needs ripple to all consumers
- Same principle as API versioning: the server owns the schema

### Example from this system:
- Agent stack produces `Finding` objects with a specific structure
- Orchestration stack consumes `Finding` objects
- The agent executor maps its internal `InterpretedFinding` → contract `Finding` at the boundary
- The orchestration aggregator maps contract `Finding` → its internal processing types
- Neither stack knows or cares about the other's internal types

### Internal Types vs Contract Types
- Contract types (`contracts/schemas/`): Pydantic, `extra="forbid"`, shared across stacks
- Internal processing types (within a stack): `@dataclass`, carry stack-private fields
- Never add stack-internal fields to a contract type. Map at the boundary.

## The Contract Change Process

Adding a required field to a contract type (e.g., `Finding.finding_type`) has cascading impact:

1. Search for ALL constructors of the type across the codebase
2. Update ALL test fixtures (JSON and inline)
3. Update ALL canonical fixtures in `contracts/fixtures/`
4. Notify ALL consuming stacks via proposal

This is deliberately expensive. It should be — a contract change affects everyone.
The friction is a feature, not a bug.

## How Contracts Solve the Context Window Problem

This is the DDD bounded-context argument applied to AI agents:

- Each agent needs deep understanding of its own domain (50-100 files)
- Plus the contract interfaces with adjacent domains (5-10 schema files)
- NOT the internal implementation of those adjacent domains

Without contracts: agent needs to understand the whole system to make changes safely.
Token limits become a real constraint.

With contracts: agent needs to understand its domain + the shapes crossing its boundaries.
You've decomposed the cognitive load the same way you'd decompose a monolith.

The context window problem isn't a technical limitation to fight — it's an architectural
signal that your system needs better boundaries.

## The Universal Wrapper: Result[T]

Every cross-module function returns `Result[T]`:
- Success: `Result.ok(payload)`
- Failure: `Result.fail(reason, details)`
- Callers must check `result.success` before accessing `result.payload`
- `Result` is truthy when successful

This eliminates the "what happens when it fails?" ambiguity at every boundary.
Every contract explicitly handles the failure case. No uncaught exceptions crossing
stack boundaries.

## Fixtures as Shared Truth

Canonical fixtures serve multiple roles simultaneously:
- **Test data** — pytest uses them for deterministic, repeatable tests
- **Contract examples** — they're the concrete demonstration of what the schema means
- **Integration verification** — if your output matches the fixture, you conform to the contract
- **Documentation** — reading the fixture JSON is often clearer than reading the Pydantic schema

The fixture tier hierarchy:
1. **Web-fakey** (`src/web/ui/fixtures/`) — ephemeral, disposable, no authority
2. **Canonical** (`contracts/fixtures/`) — permanent, authoritative shape
3. **Live** (backend services) — production, ultimate source of truth

Rule: backend/canonical always wins. Web adapts. Never the reverse.

## Why "Just Use Types" Isn't Enough

Types tell you the shape. Contracts tell you:
- The shape (Pydantic schema)
- What it looks like in practice (canonical fixture)
- Who produces it and who consumes it (registry)
- That unexpected fields are rejected, not silently accepted (`extra="forbid"`)
- That the contract is permanent and protected (can't be modified by agents)

Types are necessary but not sufficient. Contracts are the complete package.

## Source Files to Reference
- `contracts/schemas/` — Pydantic models
- `contracts/fixtures/` — canonical JSON fixtures
- `contracts/registry.json` — producer/consumer mapping
- `src/core/result.py` — Result[T] implementation
- `docs/stacks/web-fixtures.md` — fixture tier policy
