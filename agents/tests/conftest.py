from __future__ import annotations

import json
from pathlib import Path

import pytest

FIXTURES = Path(__file__).resolve().parents[2] / "shared" / "schemas" / "fixtures"


@pytest.fixture
def valid_blueprint_json() -> dict:
    return json.loads((FIXTURES / "blueprint.valid.json").read_text())


@pytest.fixture
def broken_blueprint_json() -> dict:
    return json.loads((FIXTURES / "blueprint.broken.json").read_text())
