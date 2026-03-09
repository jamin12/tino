import { RefreshCw, Server, GripVertical, X, Plus, LayoutDashboard, Pencil, History, MoreVertical, Pin, GitBranch, Box } from "lucide-react";
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

export const slideMeta: SlideMeta = {
  screenId: "CCP-DSH-001",
  title: "클러스터 대시보드",
  section: "홈 대시보드",
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
// 편집 모드일 때 드래그 핸들 + 닫기(X) 버튼을 보여주는 래퍼

function WidgetCard({
  title,
  children,
  noPadding,
}: {
  title?: string;
  children: React.ReactNode;
  noPadding?: boolean;
}) {
  return (
    <div className="group bg-white rounded-lg shadow-[0px_0px_8px_#00000014] overflow-hidden">
      {/* ── Edit mode bar: drag handle + close ── */}
      <div className="h-[32px] flex items-center justify-between px-2 bg-[#EBF3FB] border-b border-[#B8D4EE]">
        {/* Drag handle */}
        <div className="flex items-center gap-1 cursor-grab active:cursor-grabbing text-[#4A90D9]">
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
      <div className={noPadding ? "" : "p-5"}>
        {children}
      </div>
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

// ─── SVG Line Chart Component ───────────────────────────────────────────────

function UsageTrendChart() {
  const W = 1340;
  const H = 320;
  const padL = 70;
  const padR = 130;
  const padT = 30;
  const padB = 44;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  const cpuMax = 8;
  const cpuSteps = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const memMax = 28;
  const memSteps = [0, 4, 8, 12, 16, 20, 24, 28];
  const podMax = 30;
  const podSteps = [0, 4, 8, 12, 16, 20, 24, 28];

  function getX(i: number) {
    return padL + (i / (timeLabels.length - 1)) * chartW;
  }
  function getY(val: number, max: number) {
    return padT + chartH - (val / max) * chartH;
  }

  function toSmoothPath(data: number[], max: number): string {
    const pts = data.map((v, i) => ({ x: getX(i), y: getY(v, max) }));
    if (pts.length < 2) return "";
    let d = `M${pts[0].x},${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1];
      const curr = pts[i];
      const cpx = (prev.x + curr.x) / 2;
      d += ` C${cpx},${prev.y} ${cpx},${curr.y} ${curr.x},${curr.y}`;
    }
    return d;
  }

  function toSmoothArea(data: number[], max: number): string {
    const pts = data.map((v, i) => ({ x: getX(i), y: getY(v, max) }));
    if (pts.length < 2) return "";
    let d = `M${pts[0].x},${padT + chartH} L${pts[0].x},${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1];
      const curr = pts[i];
      const cpx = (prev.x + curr.x) / 2;
      d += ` C${cpx},${prev.y} ${cpx},${curr.y} ${curr.x},${curr.y}`;
    }
    d += ` L${pts[pts.length - 1].x},${padT + chartH} Z`;
    return d;
  }

  const gridYs = cpuSteps.map((v) => getY(v, cpuMax));

  // NCUI Chart 색상 팔레트
  const cpuColor = "#4A90D9";
  const memColor = "#F5A623";
  const podColor = "#E16B8C";

  return (
    <div>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ fontFamily: "'Noto Sans KR', 'Segoe UI', sans-serif" }}>
        {/* 가로 그리드 */}
        {gridYs.map((y, i) => (
          <line key={i} x1={padL} y1={y} x2={W - padR} y2={y} stroke="#eeeeee" strokeWidth={1} />
        ))}
        {/* CPU 좌측 축 */}
        <text x={padL - 10} y={16} textAnchor="end" fill="#666" fontSize={11}>CPU(Core)</text>
        <line x1={padL} y1={padT} x2={padL} y2={padT + chartH} stroke="#ddd" strokeWidth={1} />
        {cpuSteps.map((v) => (
          <g key={`cl${v}`}>
            <line x1={padL - 4} y1={getY(v, cpuMax)} x2={padL} y2={getY(v, cpuMax)} stroke="#ddd" strokeWidth={1} />
            <text x={padL - 8} y={getY(v, cpuMax) + 4} textAnchor="end" fill="#999" fontSize={11}>{v}</text>
          </g>
        ))}
        {/* Memory 우측 축 */}
        <text x={W - padR + 12} y={16} textAnchor="start" fill="#666" fontSize={11}>Mem(GiB)</text>
        <line x1={W - padR} y1={padT} x2={W - padR} y2={padT + chartH} stroke="#ddd" strokeWidth={1} />
        {memSteps.map((v) => (
          <g key={`mr${v}`}>
            <line x1={W - padR} y1={getY(v, memMax)} x2={W - padR + 4} y2={getY(v, memMax)} stroke="#ddd" strokeWidth={1} />
            <text x={W - padR + 10} y={getY(v, memMax) + 4} textAnchor="start" fill="#999" fontSize={11}>{v}</text>
          </g>
        ))}
        {/* Pod 우측 축 */}
        <text x={W - padR + 88} y={16} textAnchor="start" fill="#666" fontSize={11}>Pod</text>
        <line x1={W - padR + 78} y1={padT} x2={W - padR + 78} y2={padT + chartH} stroke="#ddd" strokeWidth={1} />
        {podSteps.map((v) => (
          <g key={`pr${v}`}>
            <line x1={W - padR + 78} y1={getY(v, podMax)} x2={W - padR + 82} y2={getY(v, podMax)} stroke="#ddd" strokeWidth={1} />
            <text x={W - padR + 88} y={getY(v, podMax) + 4} textAnchor="start" fill="#999" fontSize={11}>{v}</text>
          </g>
        ))}
        {/* X축 */}
        <line x1={padL} y1={padT + chartH} x2={W - padR} y2={padT + chartH} stroke="#ddd" strokeWidth={1} />
        {timeLabels.map((label, i) => (
          <text key={i} x={getX(i)} y={H - 10} textAnchor="middle" fill="#999" fontSize={11}>{label}</text>
        ))}
        {/* 데이터 시리즈 */}
        <path d={toSmoothArea(cpuData, cpuMax)} fill={`${cpuColor}18`} />
        <path d={toSmoothPath(cpuData, cpuMax)} fill="none" stroke={cpuColor} strokeWidth={2} />
        <path d={toSmoothPath(memData, memMax)} fill="none" stroke={memColor} strokeWidth={2} />
        <path d={toSmoothPath(podData, podMax)} fill="none" stroke={podColor} strokeWidth={2} strokeDasharray="6,4" />
        {cpuData.map((v, i) => (
          <circle key={`c${i}`} cx={getX(i)} cy={getY(v, cpuMax)} r={3} fill={cpuColor} />
        ))}
        {memData.map((v, i) => (
          <circle key={`m${i}`} cx={getX(i)} cy={getY(v, memMax)} r={3} fill={memColor} />
        ))}
        {podData.map((v, i) => (
          <circle key={`p${i}`} cx={getX(i)} cy={getY(v, podMax)} r={3} fill={podColor} />
        ))}
      </svg>
      {/* NCUI 스타일 하단 범례 */}
      <div className="flex items-center justify-center gap-6 mt-2">
        {[
          { color: cpuColor, label: "CPU", style: "solid" },
          { color: memColor, label: "Mem", style: "solid" },
          { color: podColor, label: "Pod", style: "dashed" },
        ].map((item) => (
          <label key={item.label} className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-3.5 h-3.5 accent-[#4A90D9]" />
            <span className="flex items-center gap-1.5">
              <svg width="16" height="2" className="flex-shrink-0">
                <line x1="0" y1="1" x2="16" y2="1" stroke={item.color} strokeWidth={2} strokeDasharray={item.style === "dashed" ? "4,3" : "none"} />
              </svg>
              <span className="text-[12px] text-[#333]">{item.label}</span>
            </span>
          </label>
        ))}
      </div>
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

const allGitOpsStatuses: GitOpsStatus[] = ["Orphaned", "Broken", "Missing", "Suspended", "Updating", "Mismatch", "Stable"];

// ─── Slide ──────────────────────────────────────────────────────────────────

export default function Slide01ClusterDashboard() {
  return (
    <CcpDashboardLayout
      breadcrumbs={[
        { label: "홈" },
        { label: "대시보드" },
        { label: "클러스터 대시보드", isBold: true },
      ]}
      title="대시보드"
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
      {/* ── Widget 1: 클러스터 요약 ── */}
      <ContentSection spacing="sm">
        <WidgetCard title="클러스터 요약">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-[18px] font-bold text-[#1a1a2e] underline">dev-cluster</div>
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
                실행 중 <span className="text-[#333]">102</span>
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
        </WidgetCard>
      </ContentSection>

      {/* ── Widget 2: 워크로드 GitOps 상태 + 애플리케이션 GitOps 상태 (반반) ── */}
      <ContentSection spacing="sm">
        <div className="grid grid-cols-2 gap-4">
          {/* 좌: 워크로드 GitOps 상태 */}
          <WidgetCard title="워크로드 GitOps 상태">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-[#4A90D9]" />
                <span className="text-[14px] font-semibold text-[#1a1a2e]">워크로드 GitOps 상태</span>
              </div>
            </div>
            {/* 범례 */}
            <div className="flex items-center gap-2.5 mb-4 flex-wrap">
              {allGitOpsStatuses.map((s) => (
                <div key={s} className="flex items-center gap-1">
                  <div className="w-[7px] h-[7px] rounded-full" style={{ backgroundColor: gitopsStatusConfig[s].color }} />
                  <span className="text-[10px] text-[#888]">{s}</span>
                </div>
              ))}
            </div>
            {/* 카드 그룹 */}
            <div className="grid grid-cols-2 gap-3">
              {workloadGitOpsData.map((row, i) => {
                const activeStatuses = allGitOpsStatuses.filter((s) => (row.statuses[s] ?? 0) > 0);
                return (
                  <div
                    key={i}
                    className="border border-[#e8e8e8] rounded-lg p-3.5 hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:border-[#d0d0d0] transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-[12px] font-semibold text-[#1a1a2e]">{row.resource}</span>
                      <span className="text-[16px] font-bold text-[#1a1a2e]">
                        {row.total}
                        <span className="text-[10px] font-normal text-[#999] ml-0.5">개</span>
                      </span>
                    </div>
                    <div className="flex h-[5px] rounded-full overflow-hidden mb-2.5">
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
                    <div className="flex flex-wrap gap-1">
                      {activeStatuses.map((s) => {
                        const count = row.statuses[s] ?? 0;
                        const cfg = gitopsStatusConfig[s];
                        return (
                          <span
                            key={s}
                            className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium ${cfg.bg} ${cfg.text}`}
                          >
                            <span className="w-[5px] h-[5px] rounded-full" style={{ backgroundColor: cfg.color }} />
                            {s} {count}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 text-[11px] text-[#aaa]">
              * 워크로드 리소스 유형별 GitOps 동기화 상태
            </div>
          </WidgetCard>

          {/* 우: 애플리케이션 GitOps 상태 */}
          <WidgetCard title="애플리케이션 GitOps 상태">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Box className="w-4 h-4 text-[#4A90D9]" />
                <span className="text-[14px] font-semibold text-[#1a1a2e]">애플리케이션 GitOps 상태</span>
              </div>
            </div>
            {/* 범례 */}
            <div className="flex items-center gap-2.5 mb-4 flex-wrap">
              {allGitOpsStatuses.map((s) => (
                <div key={s} className="flex items-center gap-1">
                  <div className="w-[7px] h-[7px] rounded-full" style={{ backgroundColor: gitopsStatusConfig[s].color }} />
                  <span className="text-[10px] text-[#888]">{s}</span>
                </div>
              ))}
            </div>
            {/* 카드 그룹 */}
            <div className="grid grid-cols-2 gap-3">
              {appGitOpsData.map((row, i) => {
                const activeStatuses = allGitOpsStatuses.filter((s) => (row.statuses[s] ?? 0) > 0);
                return (
                  <div
                    key={i}
                    className="border border-[#e8e8e8] rounded-lg p-3.5 hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:border-[#d0d0d0] transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-[12px] font-semibold text-[#1a1a2e]">{row.resource}</span>
                      <span className="text-[16px] font-bold text-[#1a1a2e]">
                        {row.total}
                        <span className="text-[10px] font-normal text-[#999] ml-0.5">개</span>
                      </span>
                    </div>
                    <div className="flex h-[5px] rounded-full overflow-hidden mb-2.5">
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
                    <div className="flex flex-wrap gap-1">
                      {activeStatuses.map((s) => {
                        const count = row.statuses[s] ?? 0;
                        const cfg = gitopsStatusConfig[s];
                        return (
                          <span
                            key={s}
                            className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium ${cfg.bg} ${cfg.text}`}
                          >
                            <span className="w-[5px] h-[5px] rounded-full" style={{ backgroundColor: cfg.color }} />
                            {s} {count}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 text-[11px] text-[#aaa]">
              * 애플리케이션별 GitOps 동기화 상태
            </div>
          </WidgetCard>
        </div>
      </ContentSection>

      {/* ── Widget 3: 사용량 추이 차트 ── */}
      <ContentSection spacing="sm">
        <WidgetCard title="사용량 추이">
          <div className="text-[14px] font-bold text-[#333] mb-4">
            클러스터 사용량 추이
          </div>
          <UsageTrendChart />
          <div className="text-center text-[11px] text-[#999] mt-1">
            Month
          </div>
        </WidgetCard>
      </ContentSection>

      {/* ── Widget 3: 최근 중요 이벤트 ── */}
      <ContentSection spacing="sm" className="pb-6">
        <WidgetCard title="최근 이벤트" noPadding>
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
        </WidgetCard>
      </ContentSection>
    </CcpDashboardLayout>
  );
}
