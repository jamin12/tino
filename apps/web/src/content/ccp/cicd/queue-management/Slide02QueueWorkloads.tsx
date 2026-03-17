import {
  Clock,
  AlertCircle,
  CheckCircle2,
  Loader2,
  XCircle,
  PauseCircle,
  MoreHorizontal,
  RefreshCw,
} from "lucide-react";
import {
  Badge,
  Button,
  CcpDashboardLayout,
  ContentSection,
  DataTable,
  Pagination,
  Select,
  StatusDot,
  TextCell,
  createSideMenuItems,
} from "../../_components";
import type { DataTableColumn } from "../../_components";
import type { SlideMeta } from "@entities/document";

export const slideMeta: SlideMeta = {
  screenId: "CCP-QUE-002",
  title: "큐 워크로드",
  section: "CI/CD",
  links: [
    {
      targetScreenId: "CCP-QUE-001",
      type: "navigate",
      label: "파이프라인 큐 관리 화면",
    },
  ],
  annotations: [
    {
      id: 1,
      label: "워크로드 상태 요약",
      description:
        "현재 큐에 등록된 워크로드의 상태별 개수를 요약합니다.\n• Admitted: 리소스가 할당되어 실행 중인 워크로드\n• Pending: 리소스 대기 중인 워크로드\n• Succeeded: 성공 완료된 워크로드\n• Failed: 실패한 워크로드\n• Evicted: 리소스 부족 등으로 퇴거된 워크로드",
    },
    {
      id: 2,
      label: "필터 영역",
      description:
        "워크로드 목록의 검색 조건을 설정합니다.\n• ClusterQueue: 특정 ClusterQueue로 필터링\n• LocalQueue: 특정 LocalQueue로 필터링\n• 상태: 워크로드 상태로 필터링",
    },
    {
      id: 3,
      label: "워크로드 목록 테이블",
      description:
        "큐에 등록된 워크로드 목록을 표시합니다.\n• 워크로드 이름, 소속 LocalQueue, ClusterQueue, 네임스페이스, 상태, 생성 시각, 대기 시간을 표시합니다.\n• 상태별 색상으로 구분됩니다.\n```\nGET /apis/kueue.x-k8s.io/v1beta1/workloads\n  ?labelSelector=kueue.x-k8s.io/queue-name={queueName}\n```",
    },
  ],
};

// ─── Data ────────────────────────────────────────────────────────────────────

interface WorkloadRow {
  id: string;
  name: string;
  localQueue: string;
  clusterQueue: string;
  namespace: string;
  status: "Admitted" | "Pending" | "Succeeded" | "Failed" | "Evicted";
  createdAt: string;
  waitTime: string;
}

const workloads: WorkloadRow[] = [
  {
    id: "1",
    name: "auth-service-dev-build-pr-zhmqf",
    localQueue: "tekton-worker-lq",
    clusterQueue: "tekton-worker-cq",
    namespace: "sample-cicd",
    status: "Admitted",
    createdAt: "2025-07-18 20:20",
    waitTime: "0s",
  },
  {
    id: "2",
    name: "auth-service-dev-build-pr-q9a5u",
    localQueue: "tekton-worker-lq",
    clusterQueue: "tekton-worker-cq",
    namespace: "sample-cicd",
    status: "Pending",
    createdAt: "2025-07-18 20:22",
    waitTime: "2m 15s",
  },
  {
    id: "3",
    name: "gateway-service-dev-build-pr-k8d2f",
    localQueue: "tekton-worker-lq",
    clusterQueue: "tekton-worker-cq",
    namespace: "sample-cicd",
    status: "Admitted",
    createdAt: "2025-07-18 20:18",
    waitTime: "0s",
  },
  {
    id: "4",
    name: "batch-etl-job-20250718-001",
    localQueue: "batch-lq",
    clusterQueue: "batch-processing-cq",
    namespace: "data-team",
    status: "Admitted",
    createdAt: "2025-07-18 19:00",
    waitTime: "0s",
  },
  {
    id: "5",
    name: "batch-etl-job-20250718-002",
    localQueue: "batch-lq",
    clusterQueue: "batch-processing-cq",
    namespace: "data-team",
    status: "Admitted",
    createdAt: "2025-07-18 19:30",
    waitTime: "0s",
  },
  {
    id: "6",
    name: "batch-etl-job-20250718-003",
    localQueue: "batch-lq",
    clusterQueue: "batch-processing-cq",
    namespace: "data-team",
    status: "Admitted",
    createdAt: "2025-07-18 20:00",
    waitTime: "0s",
  },
  {
    id: "7",
    name: "payment-deploy-pr-x9r3a",
    localQueue: "tekton-worker-lq",
    clusterQueue: "tekton-worker-cq",
    namespace: "production",
    status: "Pending",
    createdAt: "2025-07-18 20:23",
    waitTime: "1m 42s",
  },
  {
    id: "8",
    name: "auth-service-dev-build-pr-m7k2q",
    localQueue: "tekton-worker-lq",
    clusterQueue: "tekton-worker-cq",
    namespace: "sample-cicd",
    status: "Succeeded",
    createdAt: "2025-07-18 19:50",
    waitTime: "0s",
  },
  {
    id: "9",
    name: "gateway-service-stg-build-pr-w3n1p",
    localQueue: "default-lq",
    clusterQueue: "default-cq",
    namespace: "staging",
    status: "Failed",
    createdAt: "2025-07-18 18:30",
    waitTime: "0s",
  },
  {
    id: "10",
    name: "auth-service-dev-build-pr-r4t8v",
    localQueue: "tekton-worker-lq",
    clusterQueue: "tekton-worker-cq",
    namespace: "sample-cicd",
    status: "Evicted",
    createdAt: "2025-07-18 17:00",
    waitTime: "5m 30s",
  },
];

const statusConfig: Record<WorkloadRow["status"], { variant: string; dotColor: string; icon: React.ReactNode }> = {
  Admitted: { variant: "blue-label", dotColor: "primary", icon: <Loader2 className="w-3 h-3" /> },
  Pending: { variant: "orange-label", dotColor: "warning", icon: <Clock className="w-3 h-3" /> },
  Succeeded: { variant: "green-label", dotColor: "success", icon: <CheckCircle2 className="w-3 h-3" /> },
  Failed: { variant: "red-label", dotColor: "error", icon: <XCircle className="w-3 h-3" /> },
  Evicted: { variant: "gray-label", dotColor: "info", icon: <PauseCircle className="w-3 h-3" /> },
};

const statusSummary = {
  Admitted: workloads.filter((w) => w.status === "Admitted").length,
  Pending: workloads.filter((w) => w.status === "Pending").length,
  Succeeded: workloads.filter((w) => w.status === "Succeeded").length,
  Failed: workloads.filter((w) => w.status === "Failed").length,
  Evicted: workloads.filter((w) => w.status === "Evicted").length,
};

const summaryCards: { label: string; count: number; color: string; bgColor: string }[] = [
  { label: "Admitted", count: statusSummary.Admitted, color: "#0077ff", bgColor: "#eef4ff" },
  { label: "Pending", count: statusSummary.Pending, color: "#ff6b00", bgColor: "#fff4ec" },
  { label: "Succeeded", count: statusSummary.Succeeded, color: "#00b30e", bgColor: "#eef9ee" },
  { label: "Failed", count: statusSummary.Failed, color: "#da1e28", bgColor: "#fef2f2" },
  { label: "Evicted", count: statusSummary.Evicted, color: "#8b8b8b", bgColor: "#f5f5f5" },
];

// ─── Table Columns ──────────────────────────────────────────────────────────

const columns: DataTableColumn<WorkloadRow>[] = [
  {
    id: "name",
    header: "워크로드",
    width: "320px",
    render: (row) => (
      <TextCell bold color="#111" className="px-2 truncate font-mono text-[12px]" linked>
        {row.name}
      </TextCell>
    ),
  },
  {
    id: "localQueue",
    header: "LocalQueue",
    width: "150px",
    render: (row) => <TextCell color="#555" className="font-mono text-[12px]">{row.localQueue}</TextCell>,
  },
  {
    id: "clusterQueue",
    header: "ClusterQueue",
    width: "150px",
    render: (row) => <TextCell color="#555" className="font-mono text-[12px]">{row.clusterQueue}</TextCell>,
  },
  {
    id: "namespace",
    header: "네임스페이스",
    width: "130px",
    render: (row) => <Badge variant="info" size="sm">{row.namespace}</Badge>,
  },
  {
    id: "status",
    header: "상태",
    width: "110px",
    align: "center",
    render: (row) => {
      const cfg = statusConfig[row.status];
      return (
        <Badge variant={cfg.variant as any} size="sm">
          <StatusDot color={cfg.dotColor} size="sm" className="mr-1" />
          {row.status}
        </Badge>
      );
    },
  },
  {
    id: "createdAt",
    header: "생성 시각",
    width: "150px",
    render: (row) => <TextCell color="#555">{row.createdAt}</TextCell>,
  },
  {
    id: "waitTime",
    header: "대기 시간",
    width: "90px",
    align: "center",
    render: (row) => (
      <span className={`text-[12px] font-mono ${row.waitTime !== "0s" ? "text-[#ff6b00] font-semibold" : "text-[#bbb]"}`}>
        {row.waitTime}
      </span>
    ),
  },
];

// ─── Slide ──────────────────────────────────────────────────────────────────

export default function Slide02QueueWorkloads() {
  return (
    <CcpDashboardLayout
      breadcrumbs={[
        { label: "CI/CD" },
        { label: "파이프라인" },
        { label: "큐 워크로드", isBold: true },
      ]}
      title="큐 워크로드"
      sideMenuItems={createSideMenuItems({ activeId: "cicd", activeLabel: "파이프라인 큐" })}
    >
      {/* ── 상태 요약 카드 ── */}
      <ContentSection>
        <div data-annotation-id="1" className="grid grid-cols-5 gap-3">
          {summaryCards.map((card) => (
            <div
              key={card.label}
              className="flex items-center gap-3 px-4 py-4 border border-[#e8e8e8] rounded-lg bg-white"
            >
              <div
                className="w-9 h-9 flex items-center justify-center rounded-lg"
                style={{ backgroundColor: card.bgColor }}
              >
                <span className="text-[18px] font-bold" style={{ color: card.color }}>
                  {card.count}
                </span>
              </div>
              <span className="text-[13px] text-[#555] font-medium">{card.label}</span>
            </div>
          ))}
        </div>
      </ContentSection>

      {/* ── 필터 ── */}
      <ContentSection>
        <div data-annotation-id="2" className="flex items-center gap-3 mb-4">
          <Select
            label="ClusterQueue"
            value="all"
            options={[
              { value: "all", label: "전체" },
              { value: "tekton-worker-cq", label: "tekton-worker-cq" },
              { value: "batch-processing-cq", label: "batch-processing-cq" },
              { value: "default-cq", label: "default-cq" },
            ]}
            minWidth="200px"
          />
          <Select
            label="LocalQueue"
            value="all"
            options={[
              { value: "all", label: "전체" },
              { value: "tekton-worker-lq", label: "tekton-worker-lq" },
              { value: "batch-lq", label: "batch-lq" },
              { value: "default-lq", label: "default-lq" },
            ]}
            minWidth="200px"
          />
          <Select
            label="상태"
            value="all"
            options={[
              { value: "all", label: "전체" },
              { value: "Admitted", label: "Admitted" },
              { value: "Pending", label: "Pending" },
              { value: "Succeeded", label: "Succeeded" },
              { value: "Failed", label: "Failed" },
              { value: "Evicted", label: "Evicted" },
            ]}
            minWidth="140px"
          />
          <div className="ml-auto">
            <Button variant="ghost" size="sm">
              <RefreshCw className="w-3.5 h-3.5 mr-1" />
              새로고침
            </Button>
          </div>
        </div>
      </ContentSection>

      {/* ── 워크로드 테이블 ── */}
      <ContentSection>
        <div data-annotation-id="3">
          <DataTable columns={columns} data={workloads} />
        </div>
        <Pagination
          currentPage={1}
          totalPages={3}
          visiblePages={[1, 2, 3]}
          itemsPerPage={10}
          itemsPerPageOptions={[10, 20, 50]}
          onItemsPerPageChange={() => {}}
          className="mt-3 pb-4"
        />
      </ContentSection>
    </CcpDashboardLayout>
  );
}
