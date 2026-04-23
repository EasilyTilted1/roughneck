"use client";

import { useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  Handle,
  Position,
  type NodeProps,
} from "reactflow";
import "reactflow/dist/style.css";

import { atomsToNodesEdges, type AtomNodeData } from "@/lib/layout";
import type { LearningAtom } from "@/lib/schemas";

function AtomNode({ data }: NodeProps<AtomNodeData>) {
  const { atom } = data;
  const badgeColor = atom.category === "Core" ? "#2563eb" : "#7c3aed";
  return (
    <div
      style={{
        width: 220,
        padding: "10px 12px",
        borderRadius: 10,
        border: "1px solid #334155",
        background: "#0f172a",
        color: "#e2e8f0",
        fontFamily: "system-ui, sans-serif",
        fontSize: 13,
        boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
      }}
    >
      <Handle type="target" position={Position.Left} style={{ background: "#64748b" }} />
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
        <strong style={{ fontSize: 13 }}>{atom.title}</strong>
        <span
          style={{
            fontSize: 10,
            padding: "2px 6px",
            borderRadius: 999,
            background: badgeColor,
            color: "white",
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          {atom.category}
        </span>
      </div>
      <div style={{ marginTop: 6, fontSize: 11, color: "#94a3b8", lineHeight: 1.3 }}>
        {atom.description.length > 90 ? atom.description.slice(0, 90) + "…" : atom.description}
      </div>
      <Handle type="source" position={Position.Right} style={{ background: "#64748b" }} />
    </div>
  );
}

const nodeTypes = { atom: AtomNode };

export type DegreeBlueprintGeneratorProps = {
  atoms: LearningAtom[];
};

export default function DegreeBlueprintGenerator({ atoms }: DegreeBlueprintGeneratorProps) {
  const { nodes, edges } = useMemo(() => atomsToNodesEdges(atoms), [atoms]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        nodesDraggable
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#1e293b" gap={24} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
