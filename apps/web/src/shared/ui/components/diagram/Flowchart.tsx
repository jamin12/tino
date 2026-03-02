import {
  ReactFlow,
  type Node,
  type Edge,
  Background,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { FlowchartElement } from "@entities/document";

type Props = Pick<FlowchartElement, "nodes" | "edges">;

export function Flowchart({ nodes, edges }: Props) {
  const rfNodes: Node[] = nodes.map((n) => ({
    id: n.id,
    position: n.position,
    data: { label: n.label },
    style: {
      background: n.color ?? "#fff",
      border: "1px solid #e2e8f0",
      borderRadius: n.shape === "diamond" ? "0" : n.shape === "circle" ? "50%" : "8px",
      padding: "10px 16px",
      fontSize: "14px",
      transform: n.shape === "diamond" ? "rotate(45deg)" : undefined,
    },
  }));

  const rfEdges: Edge[] = edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    label: e.label,
    type: e.type ?? "default",
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: "#94a3b8" },
    labelStyle: { fontSize: "12px", fill: "#64748b" },
  }));

  return (
    <div className="h-80 w-full overflow-hidden rounded-lg border border-gray-200 bg-white">
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
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
        <Background color="#f1f5f9" gap={16} />
      </ReactFlow>
    </div>
  );
}
