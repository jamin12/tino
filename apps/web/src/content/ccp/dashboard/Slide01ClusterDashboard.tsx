import { useState, useEffect, useRef, useCallback } from "react";
import { RefreshCw, Server, GripVertical, X, Plus, LayoutDashboard, Pencil, History, MoreVertical, Pin, GitBranch, Box, ArrowLeft } from "lucide-react";
import {
  CcpDashboardLayout,
  ContentSection,
  Card,
  Button,
  SidebarDashboardIcon,
  SidebarNamespaceIcon,
  SidebarApplicationIcon,
  SidebarCicdIcon,
  SidebarSettingsIcon,
  SidebarGitopsIcon,
} from "../_components";
import type { SideMenuItem } from "../_components";
import type { SlideMeta } from "@entities/document";
import { LineChart, PieChart } from "@nhn-cloud/ncui-chart";
import "@nhn-cloud/ncui-chart/style.css";
import { draggable, dropTargetForElements, monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder";
import { attachClosestEdge, extractClosestEdge, type Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";

export const slideMeta: SlideMeta = {
  screenId: "CCP-DSH-002",
  title: "클러스터 대시보드 (위젯 편집)",
  section: "홈 대시보드",
  links: [],
};

// ─── Side Menu (대시보드 active) ──────────────────────────────────────────────

const sideMenuItems: SideMenuItem[] = [
  {
    id: "dashboard",
    label: "대시보드",
    icon: <SidebarDashboardIcon className="w-5 h-5" />,
    active: true,
    expandIcon: "minus",
  },
  {
    id: "namespace",
    label: "네임스페이스",
    icon: <SidebarNamespaceIcon className="w-5 h-5" />,
    expandIcon: "plus",
  },
  {
    id: "application",
    label: "애플리케이션",
    icon: <SidebarApplicationIcon className="w-5 h-5" />,
    expandIcon: "plus",
  },
  {
    id: "cicd",
    label: "CI/CD",
    icon: <SidebarCicdIcon className="w-5 h-5" />,
    expandIcon: "plus",
  },
  {
    id: "gitops",
    label: "GitOps",
    icon: <SidebarGitopsIcon className="w-5 h-5" />,
    expandIcon: "plus",
  },
  {
    id: "settings",
    label: "설정/권한",
    icon: <SidebarSettingsIcon className="w-5 h-5" />,
    expandIcon: "plus",
  },
];

// ─── Widget Wrapper ─────────────────────────────────────────────────────────
// @atlaskit/pragmatic-drag-and-drop 기반 드래그앤드롭 지원

type DragState = "idle" | "dragging" | "over";

function WidgetCard({
  widgetId,
  title,
  children,
  noPadding,
  closestEdge,
}: {
  widgetId: string;
  title?: string;
  children: React.ReactNode;
  noPadding?: boolean;
  closestEdge?: Edge | null;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<DragState>("idle");

  useEffect(() => {
    const el = containerRef.current;
    const handle = handleRef.current;
    if (!el || !handle) return;

    return combine(
      draggable({
        element: el,
        dragHandle: handle,
        getInitialData: () => ({ widgetId }),
        onDragStart: () => setDragState("dragging"),
        onDrop: () => setDragState("idle"),
      }),
      dropTargetForElements({
        element: el,
        getData: ({ input, element }) => {
          return attachClosestEdge(
            { widgetId },
            { element, input, allowedEdges: ["top", "bottom"] },
          );
        },
        onDragEnter: () => setDragState("over"),
        onDragLeave: () => setDragState("idle"),
        onDrop: () => setDragState("idle"),
        canDrop: ({ source }) => source.data.widgetId !== widgetId,
      }),
    );
  }, [widgetId]);

  return (
    <div ref={containerRef} className="relative h-full" data-widget-id={widgetId}>
      {/* ── 드롭 인디케이터 (상단) ── */}
      {closestEdge === "top" && (
        <div className="absolute -top-[3px] left-0 right-0 h-[3px] bg-[#4A90D9] rounded-full z-10" />
      )}

      <div
        className={[
          "bg-white rounded-lg shadow-[0px_0px_8px_#00000014] overflow-hidden transition-all duration-200 h-full flex flex-col",
          dragState === "dragging" ? "opacity-40 scale-[0.98]" : "",
          dragState === "over" ? "ring-2 ring-[#4A90D9]/30" : "",
        ].join(" ")}
      >
        {/* ── Edit mode bar: drag handle + close ── */}
        <div className="h-[32px] flex items-center justify-between px-2 bg-[#EBF3FB] border-b border-[#B8D4EE]">
          {/* Drag handle */}
          <div
            ref={handleRef}
            className="flex items-center gap-1 cursor-grab active:cursor-grabbing text-[#4A90D9]"
          >
            <GripVertical className="w-4 h-4" />
            <span className="text-[11px] font-medium text-[#4A90D9] select-none">
              {title ?? "위젯"}
            </span>
          </div>
          {/* Close button */}
          <button
            type="button"
            className="w-5 h-5 flex items-center justify-center rounded hover:bg-[#D6E8F7] text-[#4A90D9] transition-colors"
            aria-label="위젯 제거"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content */}
        <div className={`flex-1 ${noPadding ? "" : "p-5"}`}>
          {children}
        </div>
      </div>

      {/* ── 드롭 인디케이터 (하단) ── */}
      {closestEdge === "bottom" && (
        <div className="absolute -bottom-[3px] left-0 right-0 h-[3px] bg-[#4A90D9] rounded-full z-10" />
      )}
    </div>
  );
}

// ─── Context Menu Dropdown ──────────────────────────────────────────────────

function ContextMenuDropdown() {
  const menuItems = [
    { id: "add-widget", label: "위젯 추가", icon: <Plus className="w-3.5 h-3.5" /> },
    { id: "edit-widget", label: "위젯 편집", icon: <Pencil className="w-3.5 h-3.5" /> },
    { id: "divider-1", divider: true },
    { id: "save-layout", label: "레이아웃 저장", icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
    { id: "reset-layout", label: "레이아웃 초기화", icon: <History className="w-3.5 h-3.5" /> },
    { id: "divider-2", divider: true },
    { id: "refresh", label: "새로고침", icon: <RefreshCw className="w-3.5 h-3.5" /> },
  ] as const;

  return (
    <div className="absolute top-[36px] right-0 w-[180px] bg-white rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-[#e0e0e0] z-50 py-1 overflow-hidden">
      {/* Pin button at top-right corner */}
      <div className="flex justify-end px-2 pt-1 pb-0.5">
        <button
          type="button"
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#EBF3FB] text-[#4A90D9] transition-colors cursor-pointer"
          aria-label="메뉴 고정"
          title="메뉴 고정"
        >
          <Pin className="w-4 h-4" />
        </button>
      </div>
      {menuItems.map((item) =>
        "divider" in item && item.divider ? (
          <div key={item.id} className="my-1 border-t border-[#eee]" />
        ) : (
          <button
            key={item.id}
            type="button"
            className="flex items-center gap-2.5 w-full px-4 py-[7px] text-left hover:bg-[#f5f5f5] transition-colors cursor-pointer"
          >
            <span className="text-[#555]">{"icon" in item ? item.icon : null}</span>
            <span className="text-[13px] text-[#333]">{"label" in item ? item.label : ""}</span>
          </button>
        )
      )}
    </div>
  );
}

// ─── Time Series Data (24h) ─────────────────────────────────────────────────

const timeLabels = Array.from({ length: 24 }, (_, i) => {
  const h = (14 + i) % 24;
  return `${String(h).padStart(2, "0")}:00`;
});

const cpuData = [6.8, 6.4, 6.5, 6.4, 6.8, 7.2, 7.0, 7.4, 7.1, 6.9, 7.0, 7.2, 7.5, 7.8, 7.0, 7.2, 7.5, 7.4, 7.6, 7.2, 7.0, 7.3, 7.0, 6.9];
const memData = [13.0, 13.2, 13.4, 13.3, 13.5, 13.6, 13.4, 13.5, 13.3, 13.6, 13.8, 13.5, 13.7, 13.9, 13.6, 13.8, 14.0, 13.8, 13.9, 13.7, 13.5, 13.8, 13.6, 13.7];
const podData = [24, 24, 23, 24, 25, 24, 22, 21, 22, 22, 23, 23, 22, 23, 24, 23, 24, 24, 23, 24, 24, 23, 24, 24];

// ─── NCUI LineChart Component ────────────────────────────────────────────────

const lineChartData = {
  categories: timeLabels,
  series: [
    { id: "cpu", name: "CPU (Core)", data: cpuData, yAxisIndex: 0 },
    { id: "mem", name: "Mem (GiB)", data: memData, yAxisIndex: 0 },
    { id: "pod", name: "Pod", data: podData, yAxisIndex: 1 },
  ],
};

function UsageTrendChart() {
  const chartWrapperRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(0);

  useEffect(() => {
    const el = chartWrapperRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setChartWidth(entry.contentRect.width);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={chartWrapperRef} className="w-full">
      {chartWidth > 0 && (
        <LineChart
          key={chartWidth}
          data={lineChartData}
          width={chartWidth}
          height={320}
          chartOptions={{
            eventDetectType: "grouped",
          }}
          xAxisOptions={{
            title: { text: "시간" },
          }}
          yAxisOptions={[
            {
              title: { text: "CPU (Core) / Mem (GiB)" },
              scale: { min: 0, max: 16 },
              position: "left",
            },
            {
              title: { text: "Pod" },
              scale: { min: 0, max: 30 },
              position: "right",
            },
          ]}
          seriesOptions={{
            colors: ["#4A90D9", "#F5A623", "#E16B8C"],
          }}
          legendOptions={{
            enable: true,
            align: "bottom",
          }}
        />
      )}
    </div>
  );
}

// ─── Event Table ─────────────────────────────────────────────────────────────

interface K8sEvent {
  type: "Warning" | "Normal" | "Error";
  kind: string;
  name: string;
  msg: string;
  minutesAgo: number;
}

const events: K8sEvent[] = [
  { type: "Warning", kind: "Pod", name: "api-server-7b9f4c6d8-x2k9p", msg: "Back-off restarting failed container api-server", minutesAgo: 3 },
  { type: "Warning", kind: "Pod", name: "worker-5d8c7f9a2-m4n7q", msg: "Liveness probe failed: HTTP probe failed with statuscode: 503", minutesAgo: 8 },
  { type: "Error", kind: "Node", name: "node-pool-02-abc12", msg: "NodeNotReady: Kubelet stopped posting node status", minutesAgo: 15 },
  { type: "Warning", kind: "Pod", name: "redis-cache-0", msg: "FailedScheduling: 0/3 nodes are available: insufficient memory", minutesAgo: 22 },
  { type: "Normal", kind: "Deployment", name: "frontend-app", msg: "Scaled up replica set frontend-app-6f8d9c to 3", minutesAgo: 35 },
  { type: "Warning", kind: "PVC", name: "data-postgres-0", msg: "ProvisioningFailed: Failed to provision volume with StorageClass \"gp3\"", minutesAgo: 42 },
  { type: "Normal", kind: "Pod", name: "nginx-ingress-controller-8k2l5", msg: "Pulled: Successfully pulled image \"nginx/nginx-ingress:3.4.0\"", minutesAgo: 55 },
  { type: "Error", kind: "Pod", name: "batch-processor-job-28491", msg: "CrashLoopBackOff: back-off 5m0s restarting failed container", minutesAgo: 67 },
  { type: "Warning", kind: "HPA", name: "api-server-hpa", msg: "FailedGetResourceMetric: unable to get metrics for CPU resource", minutesAgo: 80 },
  { type: "Normal", kind: "Service", name: "backend-svc", msg: "UpdatedLoadBalancer: Updated load balancer with new hosts", minutesAgo: 95 },
];

function formatTimeAgo(minutes: number) {
  if (minutes < 60) return `${minutes}분 전`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}시간 ${m}분 전` : `${h}시간 전`;
}

const typeStyles: Record<string, string> = {
  Warning: "bg-[#fff3cd] text-[#856404]",
  Normal: "bg-[#d4edda] text-[#155724]",
  Error: "bg-[#f8d7da] text-[#721c24]",
};

// ─── GitOps Status Model ─────────────────────────────────────────────────────

type GitOpsStatus = "Orphaned" | "Broken" | "Missing" | "Suspended" | "Updating" | "Mismatch" | "Stable";

const gitopsStatusConfig: Record<GitOpsStatus, { color: string; bg: string; text: string; label: string }> = {
  Orphaned:  { color: "#8b5cf6", bg: "bg-[#ede9fe]", text: "text-[#5b21b6]", label: "Orphaned" },
  Broken:    { color: "#ef4444", bg: "bg-[#fee2e2]", text: "text-[#991b1b]", label: "Broken" },
  Missing:   { color: "#f97316", bg: "bg-[#ffedd5]", text: "text-[#9a3412]", label: "Missing" },
  Suspended: { color: "#6b7280", bg: "bg-[#f3f4f6]", text: "text-[#374151]", label: "Suspended" },
  Updating:  { color: "#3b82f6", bg: "bg-[#dbeafe]", text: "text-[#1e40af]", label: "Updating" },
  Mismatch:  { color: "#eab308", bg: "bg-[#fef9c3]", text: "text-[#854d0e]", label: "Mismatch" },
  Stable:    { color: "#22c55e", bg: "bg-[#dcfce7]", text: "text-[#166534]", label: "Stable" },
};

interface WorkloadGitOpsRow {
  resource: string;
  total: number;
  statuses: Partial<Record<GitOpsStatus, number>>;
}

const workloadGitOpsData: WorkloadGitOpsRow[] = [
  { resource: "Deployment",  total: 24, statuses: { Stable: 18, Mismatch: 3, Updating: 1, Broken: 1, Missing: 1 } },
  { resource: "StatefulSet",  total: 8,  statuses: { Stable: 5, Suspended: 1, Broken: 1, Orphaned: 1 } },
  { resource: "DaemonSet",    total: 6,  statuses: { Stable: 5, Updating: 1 } },
  { resource: "Job",          total: 12, statuses: { Stable: 9, Missing: 2, Broken: 1 } },
  { resource: "CronJob",      total: 5,  statuses: { Stable: 4, Mismatch: 1 } },
  { resource: "ReplicaSet",   total: 18, statuses: { Stable: 15, Orphaned: 2, Suspended: 1 } },
];

const appGitOpsData: WorkloadGitOpsRow[] = [
  { resource: "frontend-app",      total: 3, statuses: { Stable: 2, Updating: 1 } },
  { resource: "api-server",        total: 5, statuses: { Stable: 3, Mismatch: 1, Broken: 1 } },
  { resource: "worker-service",    total: 4, statuses: { Stable: 4 } },
  { resource: "batch-processor",   total: 2, statuses: { Missing: 1, Broken: 1 } },
  { resource: "monitoring-stack",  total: 6, statuses: { Stable: 5, Orphaned: 1 } },
  { resource: "redis-cache",       total: 3, statuses: { Stable: 2, Suspended: 1 } },
];

const allGitOpsStatuses: GitOpsStatus[] = ["Stable", "Mismatch", "Updating", "Suspended", "Missing", "Broken", "Orphaned"];

// ─── GitOps Donut Detail (인라인 확장) ──────────────────────────────────────

function GitOpsDonutDetail({ row, onBack }: { row: WorkloadGitOpsRow; onBack: () => void }) {
  const activeStatuses = allGitOpsStatuses.filter((s) => (row.statuses[s] ?? 0) > 0);
  const [hiddenStatuses, setHiddenStatuses] = useState<Set<string>>(new Set());

  const toggleStatus = useCallback((s: string) => {
    setHiddenStatuses((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  }, []);

  const visibleStatuses = activeStatuses.filter((s) => !hiddenStatuses.has(s));
  const pieData = {
    series: visibleStatuses.map((s) => ({
      id: s,
      name: `${s} (${row.statuses[s]})`,
      data: row.statuses[s] ?? 0,
    })),
  };
  // 시리즈 순서에 맞춰 색상 배열 생성
  const pieColors = visibleStatuses.map((s) => gitopsStatusConfig[s].color);

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <button
          type="button"
          onClick={onBack}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#f0f0f0] transition-colors cursor-pointer"
          aria-label="뒤로"
        >
          <ArrowLeft className="w-4 h-4 text-[#4A90D9]" />
        </button>
        <span className="text-[14px] font-bold text-[#1a1a2e]">{row.resource}</span>
        <span className="text-[12px] text-[#888]">총 {row.total}개</span>
      </div>
      <div className="flex items-center gap-0">
        {/* 왼쪽: 도넛 차트 */}
        <div className="flex items-center justify-center flex-shrink-0 pr-4" style={{ width: 200, height: 200, overflow: "hidden" }}>
          {visibleStatuses.length > 0 ? (
            <div style={{ marginTop: -10 }}>
              <PieChart
                key={visibleStatuses.map((s) => s).join(",")}
                data={pieData}
                width={200}
                height={200}
                seriesOptions={{
                  colors: pieColors,
                  pie: {
                    radiusRange: { inner: "50%", outer: "95%" },
                    dataLabels: { enable: false },
                  },
                }}
                legendOptions={{ enable: false }}
              />
            </div>
          ) : (
            <div className="text-[12px] text-[#aaa]">데이터 없음</div>
          )}
        </div>
        {/* 구분선 */}
        <div className="w-px bg-[#e8e8e8] flex-shrink-0" style={{ alignSelf: "stretch" }} />
        {/* 오른쪽: 리소스 표 */}
        <div className="flex-1 pl-4">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#eee]">
                <th className="text-left text-[11px] font-semibold text-[#888] pb-2">상태</th>
                <th className="text-right text-[11px] font-semibold text-[#888] pb-2">수량</th>
                <th className="text-right text-[11px] font-semibold text-[#888] pb-2">비율</th>
              </tr>
            </thead>
            <tbody>
              {activeStatuses.map((s) => {
                const count = row.statuses[s] ?? 0;
                const cfg = gitopsStatusConfig[s];
                const pct = Math.round((count / row.total) * 100);
                const isHidden = hiddenStatuses.has(s);
                return (
                  <tr
                    key={s}
                    className="border-b border-[#f5f5f5] cursor-pointer hover:bg-[#f8f8f8] transition-colors"
                    onClick={() => toggleStatus(s)}
                    style={{ opacity: isHidden ? 0.35 : 1 }}
                  >
                    <td className="py-1.5">
                      <span className="flex items-center gap-1.5">
                        <span
                          className="w-[7px] h-[7px] rounded-full flex-shrink-0"
                          style={{ backgroundColor: isHidden ? "#ccc" : cfg.color }}
                        />
                        <span className={`text-[12px] ${isHidden ? "text-[#aaa] line-through" : "text-[#333]"}`}>{s}</span>
                      </span>
                    </td>
                    <td className={`text-right text-[12px] font-semibold py-1.5 ${isHidden ? "text-[#aaa]" : "text-[#1a1a2e]"}`}>{count}</td>
                    <td className={`text-right text-[11px] py-1.5 ${isHidden ? "text-[#ccc]" : "text-[#888]"}`}>{pct}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── GitOps Card Group ───────────────────────────────────────────────────────

function GitOpsCardGroup({ data, showLegend = true, footerText }: { data: WorkloadGitOpsRow[]; showLegend?: boolean; footerText?: string }) {
  const [selectedRow, setSelectedRow] = useState<WorkloadGitOpsRow | null>(null);

  if (selectedRow) {
    return <GitOpsDonutDetail row={selectedRow} onBack={() => setSelectedRow(null)} />;
  }

  return (
    <div>
      {showLegend && <GitOpsStatusLegend />}
      <div className="grid grid-cols-2 gap-3">
      {data.map((row, i) => {
        const activeStatuses = allGitOpsStatuses.filter((s) => (row.statuses[s] ?? 0) > 0);
        return (
          <div
            key={i}
            className="group relative border border-[#e8e8e8] rounded-lg p-3.5 hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:border-[#d0d0d0] transition-all cursor-pointer"
            onClick={() => setSelectedRow(row)}
          >
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[12px] font-semibold text-[#1a1a2e]">{row.resource}</span>
              <span className="text-[16px] font-bold text-[#1a1a2e]">
                {row.total}
                <span className="text-[10px] font-normal text-[#999] ml-0.5">개</span>
              </span>
            </div>
            <div className="flex h-[5px] rounded-full overflow-hidden">
              {allGitOpsStatuses.map((s) => {
                const count = row.statuses[s] ?? 0;
                if (count === 0) return null;
                return (
                  <div
                    key={s}
                    className="h-full"
                    style={{
                      width: `${(count / row.total) * 100}%`,
                      backgroundColor: gitopsStatusConfig[s].color,
                    }}
                  />
                );
              })}
            </div>
            {/* Tooltip on hover */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:flex flex-col gap-1 bg-[#1a1a2e] text-white rounded-lg px-3 py-2.5 shadow-lg z-50 min-w-[140px]">
              <div className="text-[11px] font-semibold mb-1 border-b border-white/20 pb-1">{row.resource}</div>
              {activeStatuses.map((s) => {
                const count = row.statuses[s] ?? 0;
                const cfg = gitopsStatusConfig[s];
                return (
                  <div key={s} className="flex items-center justify-between gap-3 text-[11px]">
                    <span className="flex items-center gap-1.5">
                      <span className="w-[6px] h-[6px] rounded-full" style={{ backgroundColor: cfg.color }} />
                      {s}
                    </span>
                    <span className="font-medium">{count}</span>
                  </div>
                );
              })}
              {/* Arrow */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#1a1a2e]" />
            </div>
          </div>
        );
      })}
      </div>
      {footerText && (
        <div className="mt-3 text-[11px] text-[#aaa] text-center">{footerText}</div>
      )}
    </div>
  );
}

function GitOpsStatusLegend() {
  return (
    <div className="flex items-center justify-center gap-2.5 mb-4 flex-wrap">
      {allGitOpsStatuses.map((s) => (
        <div key={s} className="flex items-center gap-1">
          <div className="w-[7px] h-[7px] rounded-full" style={{ backgroundColor: gitopsStatusConfig[s].color }} />
          <span className="text-[10px] text-[#888]">{s}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Widget Definitions ─────────────────────────────────────────────────────

interface WidgetDef {
  id: string;
  title: string;
  noPadding?: boolean;
  /** 같은 행에 여러 위젯을 나란히 배치할 때 사용. 같은 groupId를 가진 위젯끼리 grid-cols-2로 묶임 */
  groupId?: string;
  render: () => React.ReactNode;
}

const WIDGET_DEFS: WidgetDef[] = [
  {
    id: "cluster-summary",
    title: "클러스터 요약",
    render: () => (
      <>
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-[18px] font-bold text-[#1a1a2e]">dev-cluster</div>
            <div className="text-[12px] text-[#888] mt-1">
              마지막 상태 갱신 2026. 3. 9. 오후 1:24:00
            </div>
          </div>
          <div className="flex gap-6 text-center">
            <div className="text-[12px] text-[#666]">
              <div>연결된 노드</div>
              <div>
                <span className="text-[22px] font-bold text-[#1a1a2e]">4</span>{" "}
                <span className="text-[13px] text-[#888]">개</span>
              </div>
            </div>
            <div className="text-[12px] text-[#666]">
              <div>연결된 네임스페이스</div>
              <div>
                <span className="text-[22px] font-bold text-[#1a1a2e]">12</span>{" "}
                <span className="text-[13px] text-[#888]">개</span>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 border-t border-[#eee] pt-4">
          <div className="px-6 border-r border-[#eee] first:pl-0">
            <div className="text-[12px] text-[#888] mb-1">전체 Pod</div>
            <div className="text-[28px] font-bold text-[#1a1a2e]">
              102 <span className="text-[14px] font-normal text-[#888]">/ 912 개</span>
            </div>
            <div className="text-[13px] text-[#f0ad4e] flex justify-between">
              실행 중 <span className="text-[#333]">72</span>
            </div>
          </div>
          <div className="px-6 border-r border-[#eee]">
            <div className="text-[12px] text-[#888] mb-1">전체 CPU 사용량</div>
            <div className="text-[28px] font-bold text-[#1a1a2e]">
              6.85 <span className="text-[13px] font-normal text-[#888]">Core</span>
            </div>
          </div>
          <div className="px-6">
            <div className="text-[12px] text-[#888] mb-1">전체 메모리 사용량</div>
            <div className="text-[28px] font-bold text-[#1a1a2e]">
              12.47 <span className="text-[13px] font-normal text-[#888]">GiB</span>
            </div>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "workload-gitops",
    title: "워크로드 GitOps 상태",
    groupId: "gitops-row",
    render: () => (
      <>
        <div className="flex items-center gap-2 mb-3">
          <GitBranch className="w-4 h-4 text-[#4A90D9]" />
          <span className="text-[14px] font-semibold text-[#1a1a2e]">워크로드 GitOps 상태</span>
        </div>
        <GitOpsCardGroup data={workloadGitOpsData} showLegend footerText="* 워크로드 리소스 유형별 GitOps 동기화 상태" />
      </>
    ),
  },
  {
    id: "app-gitops",
    title: "애플리케이션 GitOps 상태",
    groupId: "gitops-row",
    render: () => (
      <>
        <div className="flex items-center gap-2 mb-3">
          <Box className="w-4 h-4 text-[#4A90D9]" />
          <span className="text-[14px] font-semibold text-[#1a1a2e]">애플리케이션 GitOps 상태</span>
        </div>
        <GitOpsCardGroup data={appGitOpsData} showLegend footerText="* 애플리케이션별 GitOps 동기화 상태" />
      </>
    ),
  },
  {
    id: "usage-trend",
    title: "리소스 사용량 추이",
    render: () => (
      <>
        <div className="mb-4">
          <div className="text-[14px] font-bold text-[#333]">리소스 사용량 추이</div>
          <div className="text-[11px] text-[#aaa] mt-1">최근 24시간 시간대별 추이</div>
        </div>
        <UsageTrendChart />
      </>
    ),
  },
  {
    id: "recent-events",
    title: "최근 이벤트",
    noPadding: true,
    render: () => (
      <>
        <div className="px-6 py-4 border-b border-[#eee]">
          <span className="text-[14px] font-bold text-[#333]">최근 중요 이벤트</span>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#f5f6f8] border-b border-[#ddd]">
              <th className="text-left text-[#555] text-[12px] font-semibold px-4 py-2.5 pl-6">유형</th>
              <th className="text-left text-[#555] text-[12px] font-semibold px-4 py-2.5">대상</th>
              <th className="text-left text-[#555] text-[12px] font-semibold px-4 py-2.5">메시지</th>
              <th className="text-right text-[#555] text-[12px] font-semibold px-4 py-2.5 pr-6">시간</th>
            </tr>
          </thead>
          <tbody>
            {events.map((ev, i) => (
              <tr key={i} className="border-b border-[#f0f0f0] hover:bg-[#f8f9ff] transition-colors">
                <td className="px-4 py-2.5 pl-6">
                  <span className={`inline-block px-2.5 py-0.5 rounded-xl text-[11px] font-semibold ${typeStyles[ev.type]}`}>
                    {ev.type}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <div className="text-[13px] font-medium text-[#2c3e50]">{ev.name}</div>
                  <div className="text-[11px] text-[#999]">{ev.kind}</div>
                </td>
                <td className="px-4 py-2.5 text-[13px] text-[#444]">{ev.msg}</td>
                <td className="px-4 py-2.5 pr-6 text-right text-[12px] text-[#888] whitespace-nowrap">
                  {formatTimeAgo(ev.minutesAgo)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-6 py-3 text-[11px] text-[#aaa] border-t border-[#f0f0f0]">
          * 쿠버네티스 내 발생한 최근 중요 이벤트 10개 조회
        </div>
      </>
    ),
  },
];

const DEFAULT_WIDGET_ORDER = WIDGET_DEFS.map((w) => w.id);

// ─── Slide ──────────────────────────────────────────────────────────────────

export default function Slide01ClusterDashboard() {
  const [widgetOrder, setWidgetOrder] = useState<string[]>(DEFAULT_WIDGET_ORDER);
  const [dropTarget, setDropTarget] = useState<{ widgetId: string; edge: Edge } | null>(null);

  // 드래그 모니터: 드롭 시 위젯 순서 변경
  useEffect(() => {
    return monitorForElements({
      onDrag: ({ location }) => {
        const target = location.current.dropTargets[0];
        if (!target) {
          setDropTarget(null);
          return;
        }
        const edge = extractClosestEdge(target.data);
        if (edge) {
          setDropTarget({ widgetId: target.data.widgetId as string, edge });
        }
      },
      onDragStart: () => setDropTarget(null),
      onDrop: ({ source, location }) => {
        setDropTarget(null);
        const target = location.current.dropTargets[0];
        if (!target) return;

        const sourceId = source.data.widgetId as string;
        const targetId = target.data.widgetId as string;
        if (sourceId === targetId) return;

        const edge = extractClosestEdge(target.data);
        if (!edge) return;

        setWidgetOrder((prev) => {
          const startIndex = prev.indexOf(sourceId);
          let finishIndex = prev.indexOf(targetId);
          if (startIndex === -1 || finishIndex === -1) return prev;

          // edge가 bottom이면 target 아래로, top이면 target 위로
          if (edge === "bottom") {
            finishIndex = startIndex < finishIndex ? finishIndex : finishIndex + 1;
          } else {
            finishIndex = startIndex > finishIndex ? finishIndex : finishIndex - 1;
          }

          return reorder({ list: prev, startIndex, finishIndex });
        });
      },
    });
  }, []);

  const widgetMap = new Map(WIDGET_DEFS.map((w) => [w.id, w]));

  // 위젯 순서를 그룹별로 묶어서 렌더링 단위 생성
  // groupId가 같은 위젯끼리 연속으로 배치되면 하나의 행(grid-cols-2)으로 묶임
  const renderUnits: Array<{ type: "single"; widget: WidgetDef } | { type: "group"; groupId: string; widgets: WidgetDef[] }> = [];
  const processedIds = new Set<string>();

  for (const id of widgetOrder) {
    if (processedIds.has(id)) continue;
    const widget = widgetMap.get(id);
    if (!widget) continue;

    if (widget.groupId) {
      // 같은 groupId를 가진 모든 위젯을 widgetOrder 순서대로 모음
      const groupWidgets = widgetOrder
        .filter((wid) => !processedIds.has(wid) && widgetMap.get(wid)?.groupId === widget.groupId)
        .map((wid) => widgetMap.get(wid)!)
        .filter(Boolean);
      groupWidgets.forEach((w) => processedIds.add(w.id));
      renderUnits.push({ type: "group", groupId: widget.groupId, widgets: groupWidgets });
    } else {
      processedIds.add(id);
      renderUnits.push({ type: "single", widget });
    }
  }

  return (
    <CcpDashboardLayout
      breadcrumbs={[
        { label: "홈" },
        { label: "대시보드" },
        { label: "클러스터 대시보드", isBold: true },
      ]}
      title="클러스터 대시보드"
      sideMenuItems={sideMenuItems}
      navSelectors={[
        {
          label: "클러스터",
          value: "dev-cluster",
          icon: <Server className="w-4 h-4" />,
        },
      ]}
      headerActions={
        <div className="relative">
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#f0f0f0] transition-colors cursor-pointer"
            aria-label="메뉴"
          >
            <MoreVertical className="w-5 h-5 text-[#555]" />
          </button>
          <ContextMenuDropdown />
        </div>
      }
    >
      {renderUnits.map((unit, idx) => {
        const isLast = idx === renderUnits.length - 1;

        if (unit.type === "single") {
          const { widget } = unit;
          const edge = dropTarget?.widgetId === widget.id ? dropTarget.edge : null;
          return (
            <ContentSection key={widget.id} spacing="sm" className={isLast ? "pb-6" : ""}>
              <WidgetCard
                widgetId={widget.id}
                title={widget.title}
                noPadding={widget.noPadding}
                closestEdge={edge}
              >
                {widget.render()}
              </WidgetCard>
            </ContentSection>
          );
        }

        // 그룹 위젯: grid-cols-2로 나란히 배치
        return (
          <ContentSection key={unit.groupId} spacing="sm" className={isLast ? "pb-6" : ""}>
            <div className="grid grid-cols-2 gap-4">
              {unit.widgets.map((widget) => {
                const edge = dropTarget?.widgetId === widget.id ? dropTarget.edge : null;
                return (
                  <WidgetCard
                    key={widget.id}
                    widgetId={widget.id}
                    title={widget.title}
                    noPadding={widget.noPadding}
                    closestEdge={edge}
                  >
                    {widget.render()}
                  </WidgetCard>
                );
              })}
            </div>
          </ContentSection>
        );
      })}
    </CcpDashboardLayout>
  );
}
