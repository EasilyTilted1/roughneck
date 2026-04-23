from __future__ import annotations

import re
from collections import deque
from typing import TypedDict

from langgraph.graph import END, START, StateGraph

from .llm import get_llm, has_api_key
from .schemas import DegreeBlueprint, IntegrityFlag, PedagogicalIntegrityScore


class CritiqueState(TypedDict, total=False):
    blueprint: DegreeBlueprint
    adjacency: dict[str, list[str]]
    atom_ids: set[str]
    cycles: list[list[str]]
    orphans: list[tuple[str, str]]
    rule_score: int
    llm_score: int | None
    flags: list[IntegrityFlag]
    result: PedagogicalIntegrityScore


# ---------- graph nodes ----------


def _parse_blueprint(state: CritiqueState) -> CritiqueState:
    bp = state["blueprint"]
    atom_ids = {a.id for a in bp.atoms}
    adjacency: dict[str, list[str]] = {a.id: list(a.prerequisites) for a in bp.atoms}
    return {"adjacency": adjacency, "atom_ids": atom_ids}


def _check_prereq_dag(state: CritiqueState) -> CritiqueState:
    adjacency = state["adjacency"]
    atom_ids = state["atom_ids"]

    orphans: list[tuple[str, str]] = []
    for atom_id, prereqs in adjacency.items():
        for p in prereqs:
            if p not in atom_ids:
                orphans.append((atom_id, p))

    # Kahn's algorithm on the edge direction prereq -> atom.
    # In-degree = number of prerequisites an atom has (ignoring orphan refs).
    indeg: dict[str, int] = {a: 0 for a in atom_ids}
    for atom_id, prereqs in adjacency.items():
        indeg[atom_id] = sum(1 for p in prereqs if p in atom_ids)

    queue = deque([a for a, d in indeg.items() if d == 0])
    visited = 0
    # Build reverse edges: from prereq to dependents for traversal.
    dependents: dict[str, list[str]] = {a: [] for a in atom_ids}
    for atom_id, prereqs in adjacency.items():
        for p in prereqs:
            if p in atom_ids:
                dependents[p].append(atom_id)

    while queue:
        n = queue.popleft()
        visited += 1
        for d in dependents[n]:
            indeg[d] -= 1
            if indeg[d] == 0:
                queue.append(d)

    cycles: list[list[str]] = []
    if visited < len(atom_ids):
        stuck = [a for a, d in indeg.items() if d > 0]
        cycles = [stuck]

    return {"orphans": orphans, "cycles": cycles}


def _score_integrity(state: CritiqueState) -> CritiqueState:
    cycles = state.get("cycles", [])
    orphans = state.get("orphans", [])

    base = 100
    if cycles:
        base -= 40
    base -= 20 * len(orphans)
    rule_score = max(0, base)

    llm_score: int | None = None
    if has_api_key():
        try:
            llm_score = _llm_coherence_score(state["blueprint"])
        except Exception:
            llm_score = None

    return {"rule_score": rule_score, "llm_score": llm_score}


def _emit_flags(state: CritiqueState) -> CritiqueState:
    flags: list[IntegrityFlag] = []

    for atom_id, missing in state.get("orphans", []):
        flags.append(
            IntegrityFlag(
                atomId=atom_id,
                reason=f"Prerequisite '{missing}' is not defined in this blueprint.",
                severity="high",
            )
        )

    for cycle in state.get("cycles", []):
        for atom_id in cycle:
            flags.append(
                IntegrityFlag(
                    atomId=atom_id,
                    reason="Atom participates in a prerequisite cycle — graph is not a DAG.",
                    severity="high",
                )
            )

    rule_score = state["rule_score"]
    llm_score = state.get("llm_score")
    if llm_score is None:
        final_score = rule_score
    else:
        final_score = round(0.6 * rule_score + 0.4 * llm_score)

    result = PedagogicalIntegrityScore(score=final_score, flags=flags)
    return {"flags": flags, "result": result}


# ---------- optional LLM pass ----------


def _llm_coherence_score(blueprint: DegreeBlueprint) -> int:
    llm = get_llm()
    atom_summary = "\n".join(
        f"- {a.id} ({a.category}): {a.title} — prereqs: {a.prerequisites or 'none'}"
        for a in blueprint.atoms
    )
    prompt = (
        "Rate the pedagogical coherence of the following degree blueprint on a scale of 0-100. "
        "Consider whether the prerequisite chain logically builds toward the exit atoms and "
        "whether any Core atoms are missing foundational dependencies. "
        "Respond with ONLY an integer between 0 and 100.\n\n"
        f"Blueprint: {blueprint.name}\n{atom_summary}"
    )
    msg = llm.invoke(prompt)
    text = msg.content if isinstance(msg.content, str) else str(msg.content)
    match = re.search(r"\d{1,3}", text)
    if not match:
        raise ValueError(f"Could not parse integer from LLM response: {text!r}")
    return max(0, min(100, int(match.group(0))))


# ---------- graph wiring ----------


def build_graph():
    graph = StateGraph(CritiqueState)
    graph.add_node("parse_blueprint", _parse_blueprint)
    graph.add_node("check_prereq_dag", _check_prereq_dag)
    graph.add_node("score_integrity", _score_integrity)
    graph.add_node("emit_flags", _emit_flags)
    graph.add_edge(START, "parse_blueprint")
    graph.add_edge("parse_blueprint", "check_prereq_dag")
    graph.add_edge("check_prereq_dag", "score_integrity")
    graph.add_edge("score_integrity", "emit_flags")
    graph.add_edge("emit_flags", END)
    return graph.compile()


_compiled = build_graph()


def run_critique(blueprint: DegreeBlueprint) -> PedagogicalIntegrityScore:
    final = _compiled.invoke({"blueprint": blueprint})
    return final["result"]
