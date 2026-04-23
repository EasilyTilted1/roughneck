import dagre from "dagre";
import type { Edge, Node } from "reactflow";
import { MarkerType } from "reactflow";
import type { LearningAtom } from "./schemas";

const NODE_WIDTH = 220;
const NODE_HEIGHT = 80;

export type AtomNodeData = {
  atom: LearningAtom;
};

export function atomsToNodesEdges(atoms: LearningAtom[]): {
  nodes: Node<AtomNodeData>[];
  edges: Edge[];
} {
  const graph = new dagre.graphlib.Graph();
  graph.setDefaultEdgeLabel(() => ({}));
  graph.setGraph({ rankdir: "LR", nodesep: 40, ranksep: 80 });

  for (const atom of atoms) {
    graph.setNode(atom.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  }

  const edges: Edge[] = [];
  for (const atom of atoms) {
    for (const prereqId of atom.prerequisites) {
      graph.setEdge(prereqId, atom.id);
      edges.push({
        id: `${prereqId}->${atom.id}`,
        source: prereqId,
        target: atom.id,
        label: "prereq",
        markerEnd: { type: MarkerType.ArrowClosed },
      });
    }
  }

  dagre.layout(graph);

  const nodes: Node<AtomNodeData>[] = atoms.map((atom) => {
    const { x, y } = graph.node(atom.id);
    return {
      id: atom.id,
      type: "atom",
      position: { x: x - NODE_WIDTH / 2, y: y - NODE_HEIGHT / 2 },
      data: { atom },
    };
  });

  return { nodes, edges };
}
