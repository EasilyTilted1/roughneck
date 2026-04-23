from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field, HttpUrl

SourceLinkType = Literal["doc", "paper", "video", "other"]
AtomCategory = Literal["Core", "Elective"]
FlagSeverity = Literal["low", "med", "high"]


class SourceLink(BaseModel):
    url: HttpUrl
    title: str = Field(min_length=1)
    type: SourceLinkType
    retrievedAt: datetime


class LearningAtom(BaseModel):
    id: str = Field(min_length=1)
    title: str = Field(min_length=1)
    description: str
    category: AtomCategory
    sourceLinks: list[SourceLink] = Field(default_factory=list)
    prerequisites: list[str] = Field(default_factory=list)


class BlueprintMetadata(BaseModel):
    createdAt: datetime
    version: str


class DegreeBlueprint(BaseModel):
    id: str = Field(min_length=1)
    name: str = Field(min_length=1)
    atoms: list[LearningAtom]
    metadata: BlueprintMetadata


class IntegrityFlag(BaseModel):
    atomId: str
    reason: str
    severity: FlagSeverity


class PedagogicalIntegrityScore(BaseModel):
    score: int = Field(ge=0, le=100)
    flags: list[IntegrityFlag] = Field(default_factory=list)
