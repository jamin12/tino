import { useState, useEffect, useRef } from "react";
import { Server, Braces, GitBranch, Settings as SettingsIcon, X, Maximize2 } from "lucide-react";
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
import { LineChart } from "@nhn-cloud/ncui-chart";
import "@nhn-cloud/ncui-chart/style.css";

export const slideMeta: SlideMeta = {
  screenId: "CCP-DSH-001",
  title: "대시보드",
  section: "홈 대시보드",
  links: [],
  annotations: [
    {
      id: 1,
      label: "레이아웃 편집 버튼",
      description:
        "대시보드 위젯의 배치와 구성을 변경할 수 있는 레이아웃 편집 모달을 엽니다.",
    },
    {
      id: 2,
      label: "클러스터 요약 위젯",
      description:
        "선택된 클러스터의 이름, 마지막 상태 갱신 시간, 연결된 노드 수, 네임스페이스 수, 전체 Pod/CPU/메모리 사용량을 한눈에 표시합니다.",
    },
    {
      id: 3,
      label: "클러스터 GitOps 현황 위젯",
      description:
        "클러스터 내 모든 GitOps 리소스의 동기화 상태를 스택 바와 범례로 시각화합니다. Stable, Mismatch, Updating 등 상태별 개수와 비율을 표시합니다.",
    },
    {
      id: 4,
      label: "리소스 사용량 추이 위젯",
      description:
        "최근 24시간 동안의 CPU(Core), 메모리(GiB), Pod 수의 시간대별 추이를 라인 차트로 시각화합니다. 좌측 Y축은 CPU/메모리, 우측 Y축은 Pod 수를 나타냅니다.",
    },
    {
      id: 5,
      label: "클러스터 리소스 위젯",
      description:
        "CPU, 메모리, Pod의 현재 사용량을 전체 할당량 대비 프로그레스 바로 표시합니다. 리소스 부족 여부를 빠르게 파악할 수 있습니다.",
    },
    {
      id: 6,
      label: "자주 찾는 페이지 위젯",
      description:
        "워크로드, 파이프라인, GitOps 등 자주 사용하는 페이지로의 빠른 링크 목록입니다. 클릭 시 해당 화면으로 이동합니다.",
    },
    {
      id: 7,
      label: "최근 이벤트 위젯",
      description:
        "쿠버네티스에서 발생한 최근 이벤트 10개를 유형(Warning/Normal/Error), 대상 리소스, 메시지, 발생 시간과 함께 테이블로 표시합니다.",
    },
    {
      id: 8,
      label: "레이아웃 편집 모달",
      description:
        "대시보드 위젯의 순서와 크기를 드래그 앤 드롭으로 변경하고, 선택한 위젯의 타입과 크기를 설정할 수 있습니다. 전체화면 모드도 지원합니다.",
    },
  ],
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

// ─── Widget Wrapper (정상 모드 – 편집 UI 없음) ────────────────────────────────

function WidgetCard({
  children,
  noPadding,
  className,
}: {
  children: React.ReactNode;
  noPadding?: boolean;
  className?: string;
}) {
  return (
    <div className={`bg-white rounded-lg shadow-[0px_0px_8px_#00000014] overflow-hidden h-full flex flex-col ${className ?? ""}`}>
      <div className={`flex-1 ${noPadding ? "" : "p-5"}`}>
        {children}
      </div>
    </div>
  );
}

// ─── 레이아웃 편집 모달 ─────────────────────────────────────────────────────

function LayoutEditModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-[0_8px_40px_rgba(0,0,0,0.2)] w-[640px] max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#eee]">
          <h2 className="text-[16px] font-bold text-[#333]">레이아웃 편집</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#f0f0f0] text-[#888] cursor-pointer"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="border border-[#e0e0e0] rounded-lg p-4 mb-6">
            <div className="border border-[#0077ff] ring-1 ring-[#0077ff]/30 bg-[#f8fbff] rounded-lg p-3 mb-3">
              <div className="text-[12px] font-semibold text-[#555] mb-2">클러스터 요약</div>
              <div className="text-[11px] text-[#888]">클러스터 상태, 노드, 네임스페이스 정보</div>
            </div>
            <div className="border border-[#e0e0e0] bg-white rounded-lg p-3 mb-3">
              <div className="text-[12px] font-semibold text-[#555] mb-2">클러스터 GitOps 현황</div>
              <div className="text-[11px] text-[#888]">GitOps 동기화 상태 요약</div>
            </div>
            <div className="border border-[#e0e0e0] bg-white rounded-lg p-3 mb-3">
              <div className="text-[12px] font-semibold text-[#555] mb-2">리소스 사용량 추이</div>
              <div className="text-[11px] text-[#888]">최근 24시간 CPU/메모리/Pod 추이</div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="border border-[#e0e0e0] bg-white rounded-lg p-3">
                <div className="text-[12px] font-semibold text-[#555] mb-2">클러스터 리소스</div>
                <div className="text-[11px] text-[#888]">CPU, 메모리, Pod 사용량</div>
              </div>
              <div className="border border-[#e0e0e0] bg-white rounded-lg p-3">
                <div className="text-[12px] font-semibold text-[#555] mb-2">자주 찾는 페이지</div>
                <div className="text-[11px] text-[#888]">빠른 링크 목록</div>
              </div>
            </div>
            <div className="border border-[#e0e0e0] bg-white rounded-lg p-3">
              <div className="text-[12px] font-semibold text-[#555] mb-2">최근 이벤트</div>
              <div className="text-[11px] text-[#888]">쿠버네티스 최근 이벤트 10개</div>
            </div>
          </div>
          <div className="border border-[#e0e0e0] rounded-lg p-4">
            <h3 className="text-[14px] font-bold text-[#333] mb-4">선택된 아이템 설정</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <label className="text-[13px] text-[#555] w-[72px] flex-shrink-0">위젯 타입:</label>
                <select className="h-[32px] px-3 pr-7 text-[13px] text-[#333] bg-white rounded border border-[#ddd] outline-none appearance-none cursor-pointer focus:border-[#0077ff]">
                  <option>클러스터 요약</option>
                  <option>클러스터 GitOps 현황</option>
                  <option>리소스 사용량 추이</option>
                  <option>클러스터 리소스</option>
                  <option>자주 찾는 페이지</option>
                  <option>최근 이벤트</option>
                </select>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-[13px] text-[#555] w-[72px] flex-shrink-0">크기:</label>
                <span className="text-[13px] font-medium text-[#333]">1x2</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#eee]">
          <button
            type="button"
            className="h-[36px] px-4 text-[13px] font-medium text-[#333] bg-white border border-[#ddd] rounded hover:bg-[#f5f5f5] cursor-pointer flex items-center gap-1.5"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            전체화면
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-[36px] px-5 text-[13px] font-medium text-[#333] bg-white border border-[#ddd] rounded hover:bg-[#f5f5f5] cursor-pointer"
            >
              취소
            </button>
            <button
              type="button"
              onClick={onClose}
              className="h-[36px] px-5 text-[13px] font-medium text-white bg-[#0077ff] rounded hover:bg-[#0066dd] cursor-pointer"
            >
              확인
            </button>
          </div>
        </div>
      </div>
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

const allGitOpsStatuses: GitOpsStatus[] = ["Stable", "Mismatch", "Updating", "Suspended", "Missing", "Broken", "Orphaned"];

// 클러스터 전체 GitOps 상태 합산
const clusterGitOpsTotals: Record<GitOpsStatus, number> = {
  Stable: 56, Mismatch: 5, Updating: 3, Suspended: 3, Missing: 4, Broken: 5, Orphaned: 4,
};
const clusterGitOpsTotal = Object.values(clusterGitOpsTotals).reduce((a, b) => a + b, 0);

// ─── 클러스터 리소스 데이터 ─────────────────────────────────────────────────

const resourceBars = [
  { label: "CPU", used: 2.4, total: 8, unit: "Core", color: "#4A90D9" },
  { label: "메모리", used: 6.2, total: 16, unit: "GB", color: "#8b5cf6" },
  { label: "Pods", used: 24, total: 110, unit: "", color: "#22c55e" },
];

// ─── 자주 찾는 페이지 데이터 ────────────────────────────────────────────────

const quickLinks = [
  { label: "워크로드", color: "#4A90D9" },
  { label: "파이프라인 구성", color: "#4A90D9" },
  { label: "GitOps Applications", color: "#22c55e" },
  { label: "네임스페이스", color: "#f97316" },
  { label: "프로젝트 관리", color: "#6b7280" },
];

// ─── Slide ──────────────────────────────────────────────────────────────────

export default function Slide02ClusterDashboardView() {
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <CcpDashboardLayout
      breadcrumbs={[
        { label: "홈" },
        { label: "대시보드", isBold: true },
      ]}
      title="대시보드"
      sideMenuItems={sideMenuItems}
      navSelectors={[
        {
          label: "클러스터",
          value: "dev-cluster",
          icon: <Server className="w-4 h-4" />,
        },
        {
          label: "네임스페이스",
          value: "전체 네임스페이스",
          icon: <Braces className="w-4 h-4" />,
        },
      ]}
      headerActions={
        <button
          type="button"
          data-annotation-id="1"
          onClick={() => setShowEditModal(true)}
          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#f0f0f0] transition-colors cursor-pointer"
          aria-label="레이아웃 편집"
          title="레이아웃 편집"
        >
          <SettingsIcon className="w-5 h-5 text-[#555]" />
        </button>
      }
    >
      {/* ── 클러스터 요약 ── */}
      <div data-annotation-id="2">
      <ContentSection spacing="sm">
        <WidgetCard>
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
        </WidgetCard>
      </ContentSection>
      </div>

      {/* ── 클러스터 GitOps 현황 ── */}
      <div data-annotation-id="3">
      <ContentSection spacing="sm">
        <WidgetCard>
          <div className="flex items-center gap-2 mb-4">
            <GitBranch className="w-4 h-4 text-[#4A90D9]" />
            <span className="text-[14px] font-bold text-[#333]">클러스터 GitOps 현황</span>
            <span className="text-[12px] text-[#888] ml-1">총 {clusterGitOpsTotal}개 리소스</span>
          </div>
          {/* 스택 바 */}
          <div className="flex h-[8px] rounded-full overflow-hidden mb-4">
            {allGitOpsStatuses.map((s) => {
              const count = clusterGitOpsTotals[s];
              if (count === 0) return null;
              return (
                <div
                  key={s}
                  className="h-full"
                  style={{
                    width: `${(count / clusterGitOpsTotal) * 100}%`,
                    backgroundColor: gitopsStatusConfig[s].color,
                  }}
                />
              );
            })}
          </div>
          {/* 범례 + 수치 */}
          <div className="flex items-center justify-center gap-5 flex-wrap">
            {allGitOpsStatuses.map((s) => {
              const count = clusterGitOpsTotals[s];
              if (count === 0) return null;
              const pct = Math.round((count / clusterGitOpsTotal) * 100);
              return (
                <div key={s} className="flex items-center gap-1.5">
                  <span className="w-[8px] h-[8px] rounded-full flex-shrink-0" style={{ backgroundColor: gitopsStatusConfig[s].color }} />
                  <span className="text-[12px] text-[#555]">{s}</span>
                  <span className="text-[12px] font-bold text-[#1a1a2e]">{count}</span>
                  <span className="text-[11px] text-[#aaa]">({pct}%)</span>
                </div>
              );
            })}
          </div>
        </WidgetCard>
      </ContentSection>
      </div>

      {/* ── 리소스 사용량 추이 ── */}
      <div data-annotation-id="4">
      <ContentSection spacing="sm">
        <WidgetCard>
          <div className="mb-4">
            <div className="text-[14px] font-bold text-[#333]">리소스 사용량 추이</div>
            <div className="text-[11px] text-[#aaa] mt-1">최근 24시간 시간대별 추이</div>
          </div>
          <UsageTrendChart />
        </WidgetCard>
      </ContentSection>
      </div>

      {/* ── 클러스터 리소스 + 자주 찾는 페이지 (2열) ── */}
      <ContentSection spacing="sm">
        <div className="grid grid-cols-2 gap-4">
          <div data-annotation-id="5">
          <WidgetCard>
            <h3 className="text-[14px] font-bold text-[#333] mb-4">클러스터 리소스</h3>
            <div className="space-y-4">
              {resourceBars.map((res) => {
                const pct = Math.round((res.used / res.total) * 100);
                return (
                  <div key={res.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[13px] font-medium text-[#333]">{res.label}</span>
                      <span className="text-[12px] text-[#888]">
                        {res.used}/{res.total} {res.unit} ({pct}%)
                      </span>
                    </div>
                    <div className="h-[6px] bg-[#e5e7eb] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: res.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </WidgetCard>
          </div>
          <div data-annotation-id="6">
          <WidgetCard>
            <h3 className="text-[14px] font-bold text-[#333] mb-3">자주 찾는 페이지</h3>
            <div className="space-y-2.5">
              {quickLinks.map((link) => (
                <div key={link.label} className="flex items-center gap-2.5">
                  <span className="w-[7px] h-[7px] rounded-full flex-shrink-0" style={{ backgroundColor: link.color }} />
                  <a
                    href="#"
                    className="text-[13px] text-[#0077ff] hover:underline"
                    onClick={(e) => e.preventDefault()}
                  >
                    {link.label}
                  </a>
                </div>
              ))}
            </div>
          </WidgetCard>
          </div>
        </div>
      </ContentSection>

      {/* ── 최근 이벤트 ── */}
      <div data-annotation-id="7">
      <ContentSection spacing="sm" className="pb-6">
        <WidgetCard noPadding>
          <div className="px-6 py-4 border-b border-[#eee]">
            <span className="text-[14px] font-bold text-[#333]">최근 이벤트</span>
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
            * 쿠버네티스 내 발생한 최근 이벤트 10개 조회
          </div>
        </WidgetCard>
      </ContentSection>
      </div>

      {showEditModal && <div data-annotation-id="8"><LayoutEditModal onClose={() => setShowEditModal(false)} /></div>}
    </CcpDashboardLayout>
  );
}
