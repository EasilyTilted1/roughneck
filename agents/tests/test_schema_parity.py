from __future__ import annotations

from university_architect.schemas import DegreeBlueprint


def test_valid_fixture_parses(valid_blueprint_json):
    bp = DegreeBlueprint.model_validate(valid_blueprint_json)
    assert len(bp.atoms) == 4
    assert bp.atoms[0].id == "atom-intro"
    assert bp.atoms[-1].id == "atom-ml-foundations"


def test_broken_fixture_structure_is_still_valid(broken_blueprint_json):
    bp = DegreeBlueprint.model_validate(broken_blueprint_json)
    atom_b = next(a for a in bp.atoms if a.id == "atom-b")
    assert "atom-does-not-exist" in atom_b.prerequisites
