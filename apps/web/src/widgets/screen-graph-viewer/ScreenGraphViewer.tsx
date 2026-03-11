import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type NodeMouseHandler,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useScreenGraph } from "@features/screen-graph";
import type { ScreenLinkMap, ScreenLink } from "@entities/document";

interface Props {
  linkMap: ScreenLinkMap | undefined;
  focusScreenId?: string;
  onNodeClick?: (screenId: string) => void;
  onFocusChange?: (screenId: string) => void;
}

type EdgeType = ScreenLink["type"];

const LEGEND_ITEMS: {
  type: EdgeType;
  color: string;
  label: string;
  dash: boolean;
}[] = [
  { type: "navigate", color: "#3b82f6", label: "이동", dash: false },
  { type: "modal", color: "#f59e0b", label: "모달", dash: true },
  { type: "tab", color: "#8b5cf6", label: "탭", dash: false },
  { type: "action", color: "#10b981", label: "액션", dash: true },
];

const ALL_EDGE_TYPES = new Set<EdgeType>(["navigate", "modal", "tab", "action"]);

export function ScreenGraphViewer({
  linkMap,
  focusScreenId,
  onNodeClick,
  onFocusChange,
}: Props) {
  const [focusOnly, setFocusOnly] = useState(true);
  const [localFocusId, setLocalFocusId] = useState(focusScreenId);
  const [history, setHistory] = useState<string[]>([]);
  const isInternalNav = useRef(false);
  const [disabledTypes, setDisabledTypes] = useState<Set<EdgeType>>(new Set());

  const activeEdgeTypes = useMemo(() => {
    if (disabledTypes.size === 0) return undefined; // 전체 표시
    const active = new Set(ALL_EDGE_TYPES);
    for (const t of disabledTypes) active.delete(t);
    return active;
  }, [disabledTypes]);

  const toggleEdgeType = useCallback((type: EdgeType) => {
    setDisabledTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  }, []);

  // 외부 focusScreenId가 바뀌면 동기화 (히스토리 리셋)
  // 내부 그래프 탐색(navigateTo/goBack)에 의한 변경은 건너뜀
  useEffect(() => {
    if (isInternalNav.current) {
      isInternalNav.current = false;
      return;
    }
    setLocalFocusId(focusScreenId);
    setHistory([]);
  }, [focusScreenId]);

  const { nodes, edges } = useScreenGraph({
    linkMap,
    focusScreenId: localFocusId,
    focusOnly,
    activeEdgeTypes,
  });

  const canGoBack = focusOnly && history.length > 0;

  const navigateTo = useCallback(
    (screenId: string) => {
      isInternalNav.current = true;
      setLocalFocusId((prev) => {
        if (prev) setHistory((h) => [...h, prev]);
        return screenId;
      });
      onFocusChange?.(screenId);
    },
    [onFocusChange],
  );

  const goBack = useCallback(() => {
    isInternalNav.current = true;
    setHistory((prev) => {
      if (prev.length === 0) return prev;
      const next = [...prev];
      const prevId = next.pop()!;
      setLocalFocusId(prevId);
      onFocusChange?.(prevId);
      return next;
    });
  }, [onFocusChange]);

  // 브라우저 뒤로가기(마우스/키보드) 인터셉트
  // 1) pushState 가드 → 같은 문서 내 traverse 대상 확보
  // 2) Navigation API → preventDefault()로 네비게이션 자체를 차단 (URL 변경 없음)
  const canGoBackRef = useRef(canGoBack);
  canGoBackRef.current = canGoBack;
  const goBackRef = useRef(goBack);
  goBackRef.current = goBack;

  // 가드 히스토리 엔트리 관리
  const guardPushed = useRef(false);
  useEffect(() => {
    if (canGoBack && !guardPushed.current) {
      window.history.pushState({ __graphGuard: true }, "");
      guardPushed.current = true;
    }
    if (!canGoBack && guardPushed.current) {
      guardPushed.current = false;
      // 가드 제거: 뒤로가기로 가드 팝 (Navigation API 핸들러가 없으므로 통과)
      window.history.back();
    }
  }, [canGoBack]);

  // Navigation API: traverse 이벤트를 차단하여 URL 변경 없이 그래프 goBack 실행
  useEffect(() => {
    const nav = (window as unknown as { navigation?: EventTarget }).navigation;
    if (!nav) return;

    const handler = (e: Event) => {
      if (!canGoBackRef.current) return;
      const navEvent = e as Event & {
        navigationType: string;
        canIntercept: boolean;
        preventDefault: () => void;
      };
      if (navEvent.navigationType === "traverse" && navEvent.canIntercept) {
        navEvent.preventDefault();
        goBackRef.current();
        // preventDefault()로 가드가 소비되지 않으므로 재추가 불필요
      }
    };

    nav.addEventListener("navigate", handler);
    return () => nav.removeEventListener("navigate", handler);
  }, []);

  const handleNodeClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      const screenId = node.data.screenId as string;

      if (focusOnly) {
        navigateTo(screenId);
      } else {
        onNodeClick?.(screenId);
      }
    },
    [focusOnly, onNodeClick, navigateTo],
  );

  if (!linkMap || nodes.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-gray-400">
        화면 연결 정보가 없습니다.
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <ReactFlow
        key={focusOnly ? `focus-${localFocusId}` : "full"}
        nodes={nodes}
        edges={edges}
        onNodeClick={handleNodeClick}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        nodesDraggable={false}
        nodesConnectable={false}
        proOptions={{ hideAttribution: true }}
        minZoom={0.3}
        maxZoom={1.5}
      >
        <Background color="#e5e7eb" gap={24} size={1} />
        <Controls showInteractive={false} />
        {!focusOnly && (
          <MiniMap
            nodeColor={(node) => {
              const style = node.style as Record<string, string> | undefined;
              return style?.borderColor ?? "#6b7280";
            }}
            maskColor="rgba(0,0,0,0.08)"
            className="!bottom-12 !right-2"
          />
        )}
      </ReactFlow>

      {/* Top-left: Back button */}
      {canGoBack && (
        <button
          onClick={goBack}
          className="absolute left-2 top-2 flex items-center gap-1 rounded-lg border border-gray-200 bg-white/90 px-2.5 py-1.5 text-xs font-medium text-gray-600 shadow-sm backdrop-blur transition-colors hover:bg-gray-50 hover:text-gray-900"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          뒤로
        </button>
      )}

      {/* Top-right controls */}
      <div className="absolute right-2 top-2 flex items-center gap-2">
        {focusOnly && localFocusId && linkMap[localFocusId] && (
          <div className="rounded-lg bg-white/90 px-3 py-1.5 text-xs text-gray-600 shadow-sm backdrop-blur">
            <span className="font-medium text-gray-900">
              {linkMap[localFocusId].title}
            </span>
            <span className="ml-1.5 text-gray-400">
              {linkMap[localFocusId].screenId}
            </span>
          </div>
        )}

        <div className="flex rounded-lg border border-gray-200 bg-white/90 p-0.5 shadow-sm backdrop-blur">
          <button
            onClick={() => setFocusOnly(true)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              focusOnly
                ? "bg-gray-900 text-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Focus
          </button>
          <button
            onClick={() => setFocusOnly(false)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              !focusOnly
                ? "bg-gray-900 text-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            전체
          </button>
        </div>
      </div>

      {/* Legend — 클릭으로 엣지 타입 토글 */}
      <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-lg bg-white/90 px-2 py-1.5 text-xs shadow-sm backdrop-blur">
        {LEGEND_ITEMS.map((item) => {
          const isActive = !disabledTypes.has(item.type);
          return (
            <button
              key={item.type}
              onClick={() => toggleEdgeType(item.type)}
              className={`flex items-center gap-1.5 rounded-md px-2 py-1 transition-colors ${
                isActive
                  ? "bg-gray-100 text-gray-700"
                  : "text-gray-300 hover:text-gray-400"
              }`}
            >
              <svg width="20" height="8">
                <line
                  x1="0"
                  y1="4"
                  x2="20"
                  y2="4"
                  stroke={isActive ? item.color : "#d1d5db"}
                  strokeWidth="2"
                  strokeDasharray={item.dash ? "4 2" : undefined}
                />
              </svg>
              <span>{item.label}</span>
            </button>
          );
        })}
        {focusOnly && (
          <>
            <span className="mx-1 text-gray-300">|</span>
            <span className="text-gray-400">노드 클릭 = 중심 이동</span>
          </>
        )}
      </div>
    </div>
  );
}
