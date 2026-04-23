from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from university_architect.critique_agent import run_critique
from university_architect.schemas import DegreeBlueprint, PedagogicalIntegrityScore

app = FastAPI(title="University Architect — Agents")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, bool]:
    return {"ok": True}


@app.post("/critique", response_model=PedagogicalIntegrityScore)
def critique(blueprint: DegreeBlueprint) -> PedagogicalIntegrityScore:
    return run_critique(blueprint)
