import { useMemo } from "react";
import {
  ReactFlow,
  type Node,
  type Edge,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "dagre";
import type { MindmapElement } from "@entities/document";

type MindmapNode = MindmapElement["root"];

type Props = Pick<MindmapElement, "root">;

function flattenMindmap(
  node: MindmapNode,
  parentId: string | null,
  nodes: Node[],
  edges: Edge[],
  depth: number = 0
) {
  const colors = ["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];
  const color = colors[depth % colors.length];

  nodes.push({
    id: node.id,
    data: { label: node.label },
    position: { x: 0, y: 0 },
    style: {
      background: depth === 0 ? color : "#fff",
      color: depth === 0 ? "#fff" : "#1e293b",
      border: `2px solid ${color}`,
      borderRadius: "9999px",
      padding: "8px 16px",
      fontSize: depth === 0 ? "16px" : "13px",
      fontWeight: depth === 0 ? "bold" : "normal",
    },
  });

  if (parentId) {
    edges.push({
      id: `${parentId}-${node.id}`,
      source: parentId,
      target: node.id,
      type: "smoothstep",
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: color, strokeWidth: 1.5 },
    });
  }

  if (node.children) {
    for (const child of node.children) {
      flattenMindmap(child, node.id, nodes, edges, depth + 1);
    }
  }
}

function layoutWithDagre(nodes: Node[], edges: Edge[]): Node[] {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "LR", nodesep: 50, ranksep: 100 });

  for (const node of nodes) {
    g.setNode(node.id, { width: 150, height: 40 });
  }
  for (const edge of edges) {
    g.setEdge(edge.source, edge.target);
  }

  dagre.layout(g);

  return nodes.map((node) => {
    const pos = g.node(node.id);
    return { ...node, position: { x: pos.x - 75, y: pos.y - 20 } };
  });
}

export function MindMap({ root }: Props) {
  const { nodes, edges } = useMemo(() => {
    const rawNodes: Node[] = [];
    const rawEdges: Edge[] = [];
    flattenMindmap(root, null, rawNodes, rawEdges);
    const layoutNodes = layoutWithDagre(rawNodes, rawEdges);
    return { nodes: layoutNodes, edges: rawEdges };
  }, [root]);

  return (
    <div className="h-80 w-full overflow-hidden rounded-lg border border-gray-200 bg-white">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        preventScrolling={false}
        proOptions={{ hideAttribution: true }}
      >
      </ReactFlow>
    </div>
  );
}
