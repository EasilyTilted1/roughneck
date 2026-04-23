"use client";

import { useState } from "react";
import DegreeBlueprintGenerator from "@/components/DegreeBlueprintGenerator";
import { seedBlueprint } from "@/fixtures/seed";
import {
  PedagogicalIntegrityScoreSchema,
  type PedagogicalIntegrityScore,
} from "@/lib/schemas";

export default function HomePage() {
  const [score, setScore] = useState<PedagogicalIntegrityScore | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runCritique() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/critique", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(seedBlueprint),
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${await res.text()}`);
      }
      const json = await res.json();
      setScore(PedagogicalIntegrityScoreSchema.parse(json));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <header
        style={{
          padding: "14px 20px",
          borderBottom: "1px solid #1e293b",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <h1 style={{ margin: 0, fontSize: 18 }}>
          University Architect <span style={{ color: "#64748b", fontWeight: 400 }}>— {seedBlueprint.name}</span>
        </h1>
        <div style={{ flex: 1 }} />
        <button
          onClick={runCritique}
          disabled={loading}
          style={{
            padding: "8px 14px",
            background: loading ? "#334155" : "#2563eb",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: loading ? "default" : "pointer",
            fontSize: 13,
          }}
        >
          {loading ? "Running critique…" : "Run Critique"}
        </button>
        {score && (
          <div
            style={{
              padding: "6px 12px",
              background: "#0f172a",
              border: "1px solid #1e293b",
              borderRadius: 6,
              fontSize: 13,
            }}
          >
            Score: <strong>{score.score}</strong> / 100 · Flags: {score.flags.length}
          </div>
        )}
        {error && (
          <div style={{ color: "#f87171", fontSize: 12, maxWidth: 320 }}>{error}</div>
        )}
      </header>
      <section style={{ flex: 1, minHeight: 0 }}>
        <DegreeBlueprintGenerator atoms={seedBlueprint.atoms} />
      </section>
    </main>
  );
}
