# shared/schemas

Source of truth for cross-language blueprint fixtures.

- **Zod** (TypeScript) — `web/src/lib/schemas.ts`
- **Pydantic** (Python) — `agents/src/university_architect/schemas.py`

Both sides are hand-maintained. Parity is enforced by two tests that both parse the fixtures in this directory:

- `web/tests/schema.parity.test.ts`
- `agents/tests/test_schema_parity.py`

When you change a field, update both schemas and ensure both parity tests still pass.

## Fixtures

- `fixtures/blueprint.valid.json` — a 4-atom DAG (Intro → Calc I → Linear Algebra → ML Foundations). Used by the web seed page and by both parity tests.
- `fixtures/blueprint.broken.json` — a blueprint with a dangling prerequisite reference. Used by the CritiqueAgent test to assert that broken graphs produce a score below 100 and at least one flag.
