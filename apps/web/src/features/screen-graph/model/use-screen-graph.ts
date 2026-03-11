import { useMemo } from "react";
import type { Node, Edge } from "@xyflow/react";
import { MarkerType, Position } from "@xyflow/react";
import dagre from "dagre";
import type { ScreenLinkMap, ScreenLink } from "@entities/document";

/** 링크 타입별 엣지 스타일 */
const EDGE_STYLES: Record<
  ScreenLink["type"],
  { stroke: string; strokeDasharray?: string }
> = {
  navigate: { stroke: "#93c5fd" },
  modal: { stroke: "#fcd34d", strokeDasharray: "6 4" },
  tab: { stroke: "#c4b5fd" },
  action: { stroke: "#6ee7b7", strokeDasharray: "4 4" },
};

/** 섹션별 노드 색상 */
const SECTION_COLORS: Record<string, string> = {
  "홈 대시보드": "#3b82f6",
  "CI/CD 저장소": "#06b6d4",
  "GitOps Repositories": "#8b5cf6",
  "설정/권한": "#64748b",
};

const DEFAULT_COLOR = "#6b7280";

const NODE_W = 160;
const NODE_H = 44;

function layoutWithDagre(
  nodes: Node[],
  edges: Edge[],
  direction: "TB" | "LR" = "TB",
): Node[] {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: direction, nodesep: 40, ranksep: 80, marginx: 20, marginy: 20 });

  for (const node of nodes) {
    g.setNode(node.id, { width: NODE_W, height: NODE_H });
  }
  for (const edge of edges) {
    g.setEdge(edge.source, edge.target);
  }

  dagre.layout(g);

  return nodes.map((node) => {
    const pos = g.node(node.id);
    return { ...node, position: { x: pos.x - NODE_W / 2, y: pos.y - NODE_H / 2 } };
  });
}

/** Focus 모드: 중심 노드 + incoming(왼쪽) / outgoing(오른쪽) 허브-스포크 레이아웃 */
function layoutHubSpoke(
  nodes: Node[],
  focusId: string,
  linkMap: ScreenLinkMap,
): Node[] {
  const focusNode = linkMap[focusId];
  if (!focusNode) return layoutWithDagre(nodes, []);

  const incomingIds = new Set(focusNode.incoming.map((l) => l.fromScreenId));
  const outgoingIds = new Set(focusNode.outgoing.map((l) => l.targetScreenId));

  // 양방향(incoming이면서 outgoing)은 오른쪽(outgoing)으로 분류
  const pureIncoming = nodes.filter(
    (n) => n.id !== focusId && incomingIds.has(n.id) && !outgoingIds.has(n.id),
  );
  const pureOutgoing = nodes.filter(
    (n) => n.id !== focusId && outgoingIds.has(n.id) && !incomingIds.has(n.id),
  );
  const bothWay = nodes.filter(
    (n) => n.id !== focusId && incomingIds.has(n.id) && outgoingIds.has(n.id),
  );

  const GAP_X = 280;
  const GAP_Y = 64;

  const positioned: Node[] = [];

  const focus = nodes.find((n) => n.id === focusId)!;
  const leftCol = pureIncoming;
  const rightCol = [...pureOutgoing, ...bothWay];
  const maxRows = Math.max(leftCol.length, rightCol.length, 1);
  const centerY = ((maxRows - 1) * GAP_Y) / 2;

  // 중심 노드: 왼쪽에서 받고 오른쪽으로 보냄
  positioned.push({
    ...focus,
    position: { x: GAP_X, y: centerY },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  });

  // Incoming 왼쪽 배치: 오른쪽으로 엣지 보냄
  const leftStartY = centerY - ((leftCol.length - 1) * GAP_Y) / 2;
  leftCol.forEach((node, i) => {
    positioned.push({
      ...node,
      position: { x: 0, y: leftStartY + i * GAP_Y },
      sourcePosition: Position.Right,
      targetPosition: Position.Right,
    });
  });

  // Outgoing 오른쪽 배치: 왼쪽에서 엣지 받음
  const rightStartY = centerY - ((rightCol.length - 1) * GAP_Y) / 2;
  rightCol.forEach((node, i) => {
    positioned.push({
      ...node,
      position: { x: GAP_X * 2, y: rightStartY + i * GAP_Y },
      sourcePosition: Position.Left,
      targetPosition: Position.Left,
    });
  });

  return positioned;
}

/** focusScreenId 기준 1-depth 연결 노드 ID 집합 */
function getVisibleIds(
  linkMap: ScreenLinkMap,
  focusId: string,
): Set<string> {
  const ids = new Set<string>();
  const focusNode = linkMap[focusId];
  if (!focusNode) return ids;

  ids.add(focusId);

  // outgoing
  for (const link of focusNode.outgoing) {
    if (linkMap[link.targetScreenId]) ids.add(link.targetScreenId);
  }

  // incoming
  for (const link of focusNode.incoming) {
    if (linkMap[link.fromScreenId]) ids.add(link.fromScreenId);
  }

  return ids;
}

function buildNode(
  screenId: string,
  linkMap: ScreenLinkMap,
  focusScreenId: string | undefined,
): Node {
  const node = linkMap[screenId];
  const isFocus = screenId === focusScreenId;
  const sectionColor = SECTION_COLORS[node.section ?? ""] ?? DEFAULT_COLOR;

  return {
    id: screenId,
    data: {
      label: node.title ?? screenId,
      screenId,
      section: node.section,
    },
    position: { x: 0, y: 0 },
    style: {
      background: isFocus ? sectionColor : "#fff",
      color: isFocus ? "#fff" : "#374151",
      border: isFocus ? `2px solid ${sectionColor}` : "1px solid #e5e7eb",
      borderRadius: "10px",
      padding: "6px 14px",
      fontSize: "11px",
      fontWeight: isFocus ? 600 : 400,
      boxShadow: isFocus
        ? `0 0 0 3px ${sectionColor}30, 0 2px 8px ${sectionColor}20`
        : "0 1px 3px rgba(0,0,0,0.06)",
      cursor: "pointer",
      width: `${NODE_W}px`,
      textAlign: "center" as const,
      transition: "all 0.15s ease",
    },
  };
}

function buildEdges(
  visibleIds: Set<string>,
  linkMap: ScreenLinkMap,
  /** Focus 모드에서는 focusId 관련 엣지만 표시 */
  focusId?: string,
  /** 표시할 엣지 타입 (undefined면 전체) */
  activeTypes?: Set<ScreenLink["type"]>,
): Edge[] {
  const edges: Edge[] = [];
  const edgeSet = new Set<string>();

  for (const screenId of visibleIds) {
    const node = linkMap[screenId];
    for (const link of node.outgoing) {
      if (!visibleIds.has(link.targetScreenId)) continue;

      // Focus 모드: 포커스 노드와 직접 연결된 엣지만 표시
      if (focusId && screenId !== focusId && link.targetScreenId !== focusId) {
        continue;
      }

      // Focus 모드: 양방향 노드는 outgoing만 표시 (bothWay→focus 스킵)
      // bothWay 노드가 오른쪽에 배치되므로 bothWay→focus 엣지는 제거
      if (focusId && screenId !== focusId && link.targetScreenId === focusId) {
        const isBothWay = linkMap[focusId]?.outgoing.some(
          (l) => l.targetScreenId === screenId,
        );
        if (isBothWay) continue;
      }

      // 엣지 타입 필터
      if (activeTypes && !activeTypes.has(link.type)) continue;

      const edgeKey = `${screenId}-${link.targetScreenId}`;
      if (edgeSet.has(edgeKey)) continue;
      edgeSet.add(edgeKey);

      const style = EDGE_STYLES[link.type];
      edges.push({
        id: edgeKey,
        source: screenId,
        target: link.targetScreenId,
        type: "smoothstep",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 10,
          height: 10,
          color: style.stroke,
        },
        style: {
          stroke: style.stroke,
          strokeWidth: 1.2,
          strokeDasharray: style.strokeDasharray,
        },
      });
    }
  }

  return edges;
}

export interface UseScreenGraphOptions {
  linkMap: ScreenLinkMap | undefined;
  focusScreenId?: string;
  /** true면 focusScreenId 기준 1-depth만 표시 */
  focusOnly?: boolean;
  /** 표시할 엣지 타입 (undefined면 전체) */
  activeEdgeTypes?: Set<ScreenLink["type"]>;
}

export interface ScreenGraphResult {
  nodes: Node[];
  edges: Edge[];
}

/** ScreenLinkMap → React Flow nodes/edges 변환 */
export function useScreenGraph({
  linkMap,
  focusScreenId,
  focusOnly = false,
  activeEdgeTypes,
}: UseScreenGraphOptions): ScreenGraphResult {
  return useMemo(() => {
    if (!linkMap) return { nodes: [], edges: [] };

    // 표시할 노드 ID 결정
    const visibleIds =
      focusOnly && focusScreenId
        ? getVisibleIds(linkMap, focusScreenId)
        : new Set(Object.keys(linkMap));

    const rawNodes = Array.from(visibleIds).map((id) =>
      buildNode(id, linkMap, focusScreenId),
    );
    const rawEdges = buildEdges(
      visibleIds,
      linkMap,
      focusOnly ? focusScreenId : undefined,
      activeEdgeTypes,
    );

    const layoutNodes =
      focusOnly && focusScreenId
        ? layoutHubSpoke(rawNodes, focusScreenId, linkMap)
        : layoutWithDagre(rawNodes, rawEdges, "TB");
    return { nodes: layoutNodes, edges: rawEdges };
  }, [linkMap, focusScreenId, focusOnly, activeEdgeTypes]);
}
