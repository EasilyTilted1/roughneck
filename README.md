# University Architect v2.0

A multi-agent system that turns a syllabus or prompt into a **Degree Blueprint** — a graph of `LearningAtom` nodes with prerequisite edges, critiqued and scored by LangGraph agents.

This repository contains the **foundation slice**: a shared schema, a React Flow canvas for viewing/editing blueprints, and a Python LangGraph `CritiqueAgent` that scores pedagogical integrity.

## Architecture

```
web (Next.js + React Flow)  ── POST /api/critique ──▶  agents (FastAPI + LangGraph)
       │                                                     │
       └─ Zod schemas ─────── shared/schemas/fixtures ──────── Pydantic schemas
```

- **`web/`** — Next.js 14 App Router. Renders a `DegreeBlueprint` as a draggable dagre-laid-out graph via React Flow. Zod schemas are the TS source of truth.
- **`agents/`** — Python 3.11 + FastAPI. A LangGraph `StateGraph` implements the `CritiqueAgent`: parse → DAG checks → score → flags. Returns a `PedagogicalIntegrityScore` (0–100) and a list of flagged atoms.
- **`shared/schemas/fixtures/`** — canonical JSON blueprints used by both sides as the parity oracle.

## Quickstart

```bash
make install       # pnpm i at root + uv sync in agents/
make dev-agents    # FastAPI on :8000  (needs ANTHROPIC_API_KEY for LLM blend; degrades to rule-only without it)
make dev-web       # Next.js on :3000
```

Open http://localhost:3000, see the seed blueprint rendered as a DAG, and click **Run Critique** to call the agent.

Copy `.env.example` to `.env` and set `ANTHROPIC_API_KEY` to enable the LLM blend pass. Without it, the Critic still runs and returns the deterministic rule-based score.

## Testing

```bash
make test          # vitest + tsc --noEmit in web/, pytest in agents/
```

## Roadmap (deferred)

Intentionally **not** in the foundation — to keep the first slice shippable:

- **Architect Agent** — syllabus/prompt → blueprint ingestion (today we start from a fixture).
- **Source-Grounding Agent** — Tavily/Perplexity citations per atom.
- **Optimizer Agent** — refines blueprint using Critic + Grounding feedback.
- **MCP integration** — connect to NotebookLM research files as a live source.
- **Atomic Course Nodes** — per-atom refresh without rebuilding the full graph.
- **ROI scoring** and **pedagogical style transfer**.
- **Persistence** — currently stateless (fixtures in, score out). Postgres/Redis later.
- **Auth**.

## License

MIT — see [LICENSE](./LICENSE).
