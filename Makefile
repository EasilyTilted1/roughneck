.PHONY: install dev-web dev-agents test test-web test-agents typecheck clean

install:
	pnpm install
	cd agents && uv sync

dev-web:
	pnpm --filter web dev

dev-agents:
	cd agents && uv run uvicorn main:app --reload --port 8000

test: test-web test-agents

test-web:
	pnpm --filter web test
	pnpm --filter web exec tsc --noEmit

test-agents:
	cd agents && uv run pytest -q

typecheck:
	pnpm --filter web exec tsc --noEmit

clean:
	rm -rf web/.next web/node_modules node_modules
	rm -rf agents/.venv agents/.pytest_cache
