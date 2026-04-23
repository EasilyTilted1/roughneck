from __future__ import annotations

import os

from university_architect.critique_agent import run_critique
from university_architect.schemas import DegreeBlueprint


def _ensure_no_api_key(monkeypatch):
    # Ensure tests run deterministically (rule-only) regardless of environment.
    monkeypatch.delenv("ANTHROPIC_API_KEY", raising=False)


def test_valid_blueprint_scores_perfect(valid_blueprint_json, monkeypatch):
    _ensure_no_api_key(monkeypatch)
    bp = DegreeBlueprint.model_validate(valid_blueprint_json)
    result = run_critique(bp)
    assert result.score == 100
    assert result.flags == []


def test_broken_blueprint_scores_below_100_with_flag(broken_blueprint_json, monkeypatch):
    _ensure_no_api_key(monkeypatch)
    bp = DegreeBlueprint.model_validate(broken_blueprint_json)
    result = run_critique(bp)
    assert result.score < 100
    assert len(result.flags) >= 1
    assert any("does-not-exist" in f.reason for f in result.flags)
    assert any(f.severity == "high" for f in result.flags)


def test_broken_blueprint_flags_reference_dependent_atom(broken_blueprint_json, monkeypatch):
    _ensure_no_api_key(monkeypatch)
    bp = DegreeBlueprint.model_validate(broken_blueprint_json)
    result = run_critique(bp)
    flagged_ids = {f.atomId for f in result.flags}
    assert "atom-b" in flagged_ids
