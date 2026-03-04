import {
  Plus,
  Search,
  Play,
  Pencil,
  History,
  Copy,
  FileText,
  Settings2,
  FileCode,
  ScrollText,
  RefreshCw,
  MoreHorizontal,
  Heart,
  CheckCircle2,
} from "lucide-react";
import {
  Badge,
  Button,
  CcpDashboardLayout,
  ContextMenu,
  DataTable,
  Pagination,
  SearchInput,
  Select,
  StatusCard,
  StatusDot,
  Tabs,
  Tooltip,
} from "./_components";
import type {
  ContextMenuEntry,
  DataTableColumn,
} from "./_components";

// ─── Data ───────────────────────────────────────────────────────────────────

interface PipelineRow {
  id: string;
  gitopsColor: string;
  pipeline: string;
  name: string;
  hasPreset: boolean;
  namespace: string;
  lastRunTime: string;
  lastRunResult: "Succeeded" | "Failed" | "Running" | "Cancelled";
}

const pipelineData: PipelineRow[] = [
  {
    id: "1",
    gitopsColor: "#00b30e",
    pipeline: "build-maven-spring-boot-pipeline",
    name: "app1-maven-build-pr",
    hasPreset: true,
    namespace: "app-cicd",
    lastRunTime: "30분 전",
    lastRunResult: "Succeeded",
  },
  {
    id: "2",
    gitopsColor: "#00b30e",
    pipeline: "deploy-argocd-app-setup-sync...",
    name: "app1-maven-deploy-pr",
    hasPreset: true,
    namespace: "app-cicd",
    lastRunTime: "30분 전",
    lastRunResult: "Succeeded",
  },
  {
    id: "3",
    gitopsColor: "#00b30e",
    pipeline: "build-gradle-spring-boot-pipeline",
    name: "app2-gradle-build-pr",
    hasPreset: false,
    namespace: "app-cicd",
    lastRunTime: "30분 전",
    lastRunResult: "Succeeded",
  },
  {
    id: "4",
    gitopsColor: "#6366f1",
    pipeline: "deploy-argocd-app-setup-sync...",
    name: "app2-gradle-deploy-pr",
    hasPreset: false,
    namespace: "app-cicd",
    lastRunTime: "30분 전",
    lastRunResult: "Failed",
  },
  {
    id: "5",
    gitopsColor: "#dea600",
    pipeline: "build-docker-artifact-pipeline",
    name: "app3-docker-build-pr",
    hasPreset: true,
    namespace: "app-cicd",
    lastRunTime: "30분 전",
    lastRunResult: "Succeeded",
  },
];

const resultVariant: Record<string, "success" | "error" | "warning" | "info"> = {
  Succeeded: "success",
  Failed: "error",
  Running: "primary" as "success",
  Cancelled: "neutral" as "success",
};

const columns: DataTableColumn<PipelineRow>[] = [
  {
    id: "gitops",
    header: "GitOps",
    width: "120px",
    align: "center",
    render: (row) => (
      <StatusDot color={row.gitopsColor} size="md" />
    ),
  },
  {
    id: "pipeline",
    header: "파이프라인",
    width: "240px",
    align: "center",
    render: (row) => (
      <Badge variant="neutral">{row.pipeline}</Badge>
    ),
  },
  {
    id: "name",
    header: "이름",
    render: (row) => (
      <div className="flex items-center gap-1.5 px-4">
        <span
          className={`text-sm font-medium tracking-[-0.14px] leading-5 whitespace-nowrap ${
            row.hasPreset ? "text-[#0077ff]" : "text-[#333333]"
          }`}
        >
          {row.name}
        </span>
        {row.hasPreset && <Badge variant="primary">Preset</Badge>}
      </div>
    ),
  },
  {
    id: "namespace",
    header: "네임스페이스",
    width: "140px",
    align: "center",
    render: (row) => (
      <span className="text-sm font-medium text-[#333333] tracking-[-0.14px] leading-5">
        {row.namespace}
      </span>
    ),
  },
  {
    id: "lastRunTime",
    header: "마지막 실행시간",
    width: "180px",
    align: "center",
    render: (row) => (
      <span className="text-sm font-medium text-[#333333] tracking-[-0.14px] leading-5">
        {row.lastRunTime}
      </span>
    ),
  },
  {
    id: "lastRunResult",
    header: "마지막 실행결과",
    width: "160px",
    align: "center",
    render: (row) => (
      <Badge variant={resultVariant[row.lastRunResult] ?? "neutral"}>
        {row.lastRunResult}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "",
    width: "60px",
    align: "center",
    render: () => (
      <button
        type="button"
        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
        aria-label="더보기"
      >
        <MoreHorizontal className="w-4 h-4 text-[#333333]" />
      </button>
    ),
  },
];

const contextMenuItems: ContextMenuEntry[] = [
  { id: "execute", label: "실행", icon: Play },
  { id: "edit-execute", label: "편집 & 실행", icon: Play },
  { id: "history", label: "실행이력", icon: History },
  { id: "edit", label: "편집", icon: Settings2 },
  { id: "duplicate", label: "복제", icon: Copy },
  { id: "d1", type: "divider" },
  { id: "summary", label: "요약", icon: FileText, textColor: "text-[#0077ff]" },
  { id: "config", label: "구성", icon: Settings2 },
  { id: "yaml", label: "YAML", icon: FileCode },
  { id: "logs", label: "로그", icon: ScrollText },
];

// ─── Slide ──────────────────────────────────────────────────────────────────

export default function Slide01() {
  return (
    <CcpDashboardLayout
      breadcrumbs={[
        { label: "CI/CD" },
        { label: "파이프라인" },
        { label: "파이프라인 실행" },
        { label: "파이프라인 실행 목록", isBold: true },
      ]}
      title="파이프라인 실행 목록"
    >
      {/* Status Summary Card */}
      <div className="mx-8 mt-5">
        <div className="bg-white rounded-lg shadow-[0px_0px_8px_#00000014] p-5">
          {/* Tabs */}
          <Tabs
            items={[
              { id: "execution", label: "실행결과 상태 현황", count: 40 },
              { id: "gitops", label: "GitOps 상태 현황", count: 60 },
            ]}
            activeId="execution"
          />

          {/* Status Cards */}
          <div className="flex items-start gap-5 mt-6 justify-center">
            <StatusCard label="Succeeded" count={10} color="#00b30e" />
            <StatusCard label="Running" count={10} color="#0077ff" />
            <StatusCard label="Cancelled" count={10} color="#555555" />
            <StatusCard label="Failed" count={10} color="#da1e28" />
          </div>
        </div>
      </div>

      {/* Filter Bar + Table */}
      <div className="mx-8 mt-5 relative">
        {/* Filters */}
        <div className="flex items-center justify-end gap-1 mb-3">
          <Select
            label="GitOps 상태"
            options={[
              { value: "", label: "전체" },
              { value: "active", label: "활성" },
              { value: "inactive", label: "비활성" },
            ]}
          />
          <Select
            label="이름"
            options={[{ value: "", label: "전체" }]}
          />
          <SearchInput placeholder="키워드 검색" />
          <Button variant="primary" size="md">
            <Plus className="w-4 h-4" />
            생성
          </Button>
          <Button variant="primary" size="md">
            <RefreshCw className="w-3.5 h-3.5" />
            동기화
          </Button>
          <Button variant="primary-semi" size="lg">
            <Play className="w-3 h-3 fill-white" />
            실행
          </Button>
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={pipelineData}
          selectedIds={new Set()}
          onSelectionChange={() => {}}
        />

        {/* Tooltips on first row */}
        <div className="absolute top-[148px] left-[130px]">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#1b2c3f] rounded-[0px_12px_12px_12px] shadow-[4px_4px_8px_#1b2c3f33]">
            <StatusDot color="success" size="sm" />
            <span className="text-white text-[11px] font-normal leading-[14.3px] tracking-[-0.11px]">
              Stable
            </span>
            <span className="text-white/30 text-[11px] mx-1">|</span>
            <span className="text-[#18be94] text-[11px]">♥</span>
            <span className="text-white text-[11px] font-normal">
              Healthy
            </span>
            <span className="text-[#18be94] text-[11px]">✓</span>
            <span className="text-white text-[11px] font-normal">
              Synced
            </span>
          </div>
        </div>

        <div className="absolute top-[132px] left-[560px]">
          <Tooltip>app-build-preset</Tooltip>
        </div>

        {/* Context Menu */}
        <div className="absolute top-[130px] right-[20px]">
          <ContextMenu items={contextMenuItems} className="w-[150px]" />
        </div>

        {/* Pagination */}
        <div className="mt-5">
          <Pagination
            currentPage={1}
            totalPages={32}
            visiblePages={[1, 2, 3, 4, 5]}
          />
        </div>
      </div>
    </CcpDashboardLayout>
  );
}
