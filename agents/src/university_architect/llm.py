from __future__ import annotations

import os

MODEL = "claude-sonnet-4-6"


def has_api_key() -> bool:
    return bool(os.environ.get("ANTHROPIC_API_KEY"))


def get_llm():
    """Return a ChatAnthropic instance. Import is lazy so tests can run without the key."""
    from langchain_anthropic import ChatAnthropic

    return ChatAnthropic(model=MODEL, max_tokens=1024, temperature=0)
