import {
  LayoutDashboard,
  Layers,
  AppWindow,
  GitBranch,
  Settings,
  GitCompare,
  Plus,
  RefreshCw,
  MoreHorizontal,
  Settings2,
  Copy,
  FileText,
  FileCode,
  Trash2,
  RotateCcw,
  Scale,
} from "lucide-react";
import {
  Badge,
  Button,
  CcpDashboardLayout,
  ContentSection,
  ContextMenu,
  DataTable,
  FilterBar,
  Overlay,
  Pagination,
  SearchInput,
  Select,
  StatusDot,
  StatusSummary,
  TextCell,
  CellGroup,
} from "./_components";
import type {
  SideMenuItem,
  DataTableColumn,
  ContextMenuEntry,
} from "./_components";
import type { SlideMeta } from "@entities/document";

export const slideMeta: SlideMeta = {
  title: "디플로이먼트 목록",
  section: "애플리케이션",
};

// ─── Side Menu Data ─────────────────────────────────────────────────────────

const sideMenuItems: SideMenuItem[] = [
  {
    id: "dashboard",
    label: "대시보드",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    id: "namespace",
    label: "네임스페이스",
    icon: <Layers className="w-5 h-5" />,
    expandIcon: "plus",
  },
  {
    id: "application",
    label: "애플리케이션",
    icon: <AppWindow className="w-5 h-5" />,
    active: true,
    expanded: true,
    expandIcon: "minus",
    sections: [
      {
        label: "",
        items: [
          { label: "Deployments", active: true, bold: true },
          { label: "StatefulSets" },
          { label: "DaemonSets" },
          { label: "ReplicaSets" },
          { label: "Jobs" },
          { label: "CronJobs" },
          { label: "Pods" },
        ],
      },
    ],
  },
  {
    id: "cicd",
    label: "CI/CD",
    icon: <GitBranch className="w-5 h-5" />,
    expandIcon: "plus",
  },
  {
    id: "settings",
    label: "설정/권한",
    icon: <Settings className="w-5 h-5" />,
    expandIcon: "plus",
  },
  {
    id: "gitops",
    label: "GitOps",
    icon: <GitCompare className="w-5 h-5" />,
    expandIcon: "plus",
  },
];

// ─── Table Data ─────────────────────────────────────────────────────────────

interface DeploymentRow {
  id: string;
  gitopsColor: string;
  name: string;
  namespace: string;
  status: "Running" | "Updating" | "Failed" | "Stopped";
  ready: string;
  upToDate: number;
  available: number;
  image: string;
  age: string;
}

const tableData: DeploymentRow[] = [
  {
    id: "1",
    gitopsColor: "#00b30e",
    name: "api-gateway",
    namespace: "app-backend",
    status: "Running",
    ready: "3/3",
    upToDate: 3,
    available: 3,
    image: "api-gateway:v2.4.1",
    age: "12d",
  },
  {
    id: "2",
    gitopsColor: "#00b30e",
    name: "auth-service",
    namespace: "app-backend",
    status: "Running",
    ready: "2/2",
    upToDate: 2,
    available: 2,
    image: "auth-service:v1.8.0",
    age: "8d",
  },
  {
    id: "3",
    gitopsColor: "#dea600",
    name: "notification-worker",
    namespace: "app-backend",
    status: "Updating",
    ready: "1/3",
    upToDate: 1,
    available: 1,
    image: "notification:v3.1.0-rc1",
    age: "2h",
  },
  {
    id: "4",
    gitopsColor: "#00b30e",
    name: "web-frontend",
    namespace: "app-frontend",
    status: "Running",
    ready: "2/2",
    upToDate: 2,
    available: 2,
    image: "web-app:v5.0.2",
    age: "5d",
  },
  {
    id: "5",
    gitopsColor: "#da1e28",
    name: "payment-service",
    namespace: "app-backend",
    status: "Failed",
    ready: "0/2",
    upToDate: 0,
    available: 0,
    image: "payment:v2.0.0",
    age: "1d",
  },
  {
    id: "6",
    gitopsColor: "#6366f1",
    name: "metrics-collector",
    namespace: "monitoring",
    status: "Stopped",
    ready: "0/1",
    upToDate: 0,
    available: 0,
    image: "metrics:v1.2.3",
    age: "30d",
  },
];

const statusVariant: Record<
  string,
  "success" | "error" | "warning" | "info" | "neutral"
> = {
  Running: "success",
  Updating: "warning",
  Failed: "error",
  Stopped: "neutral",
};

const columns: DataTableColumn<DeploymentRow>[] = [
  {
    id: "gitops",
    header: "GitOps",
    width: "80px",
    align: "center",
    render: (row) => <StatusDot color={row.gitopsColor} size="md" />,
  },
  {
    id: "name",
    header: "이름",
    width: "220px",
    render: (row) => (
      <TextCell bold color="#111111" className="px-4">
        {row.name}
      </TextCell>
    ),
  },
  {
    id: "namespace",
    header: "네임스페이스",
    width: "140px",
    align: "center",
    render: (row) => <TextCell color="#555555">{row.namespace}</TextCell>,
  },
  {
    id: "status",
    header: "상태",
    width: "100px",
    align: "center",
    render: (row) => (
      <Badge variant={statusVariant[row.status]}>{row.status}</Badge>
    ),
  },
  {
    id: "ready",
    header: "Ready",
    width: "90px",
    align: "center",
    render: (row) => (
      <TextCell bold color="#111111">
        {row.ready}
      </TextCell>
    ),
  },
  {
    id: "upToDate",
    header: "Up-to-date",
    width: "100px",
    align: "center",
    render: (row) => <TextCell>{String(row.upToDate)}</TextCell>,
  },
  {
    id: "available",
    header: "Available",
    width: "100px",
    align: "center",
    render: (row) => <TextCell>{String(row.available)}</TextCell>,
  },
  {
    id: "image",
    header: "이미지",
    width: "200px",
    render: (row) => (
      <TextCell color="#555555" className="px-4 font-mono text-[12px]">
        {row.image}
      </TextCell>
    ),
  },
  {
    id: "age",
    header: "생성일",
    width: "80px",
    align: "center",
    render: (row) => <TextCell color="#555555">{row.age}</TextCell>,
  },
  {
    id: "actions",
    header: "",
    width: "60px",
    fixed: true,
    align: "center",
    render: () => (
      <Button variant="icon" size="icon" aria-label="더보기">
        <MoreHorizontal className="w-4 h-4 text-[#333333]" />
      </Button>
    ),
  },
];

const contextMenuItems: ContextMenuEntry[] = [
  { id: "edit", label: "편집", icon: Settings2 },
  { id: "duplicate", label: "복제", icon: Copy },
  { id: "restart", label: "재시작", icon: RotateCcw },
  { id: "scale", label: "스케일", icon: Scale },
  { id: "yaml", label: "YAML", icon: FileCode },
  { id: "summary", label: "요약", icon: FileText, textColor: "text-[#0077ff]" },
  {
    id: "delete",
    label: "리소스 삭제",
    icon: Trash2,
    textColor: "text-[#da1e28]",
  },
];

// ─── Slide ──────────────────────────────────────────────────────────────────

export default function Slide08() {
  return (
    <CcpDashboardLayout
      breadcrumbs={[
        { label: "애플리케이션" },
        { label: "Deployments", isBold: true },
      ]}
      title="Deployments"
      sideMenuItems={sideMenuItems}
    >
      <ContentSection card>
        <StatusSummary
          tabs={[
            { id: "status", label: "리소스 상태 현황", count: 6 },
            { id: "gitops", label: "GitOps 현황", count: 6 },
          ]}
          activeTabId="status"
          cards={[]}
          cardsByTab={{
            status: [
              { label: "Running", count: 3, color: "#00b30e" },
              { label: "Updating", count: 1, color: "#f59e0b" },
              { label: "Failed", count: 1, color: "#da1e28" },
              { label: "Stopped", count: 1, color: "#888888" },
            ],
            gitops: [
              { label: "Stable", count: 3, color: "#00b30e" },
              { label: "Mismatch", count: 1, color: "#da1e28" },
              { label: "Updating", count: 1, color: "#dea600" },
              { label: "Orphaned", count: 1, color: "#6366f1" },
            ],
          }}
        />
      </ContentSection>

      <ContentSection relative>
        <FilterBar className="gap-2">
          <Select
            label="상태"
            options={[
              { value: "", label: "전체" },
              { value: "running", label: "Running" },
              { value: "updating", label: "Updating" },
              { value: "failed", label: "Failed" },
              { value: "stopped", label: "Stopped" },
            ]}
          />
          <Select
            label="네임스페이스"
            options={[
              { value: "", label: "전체" },
              { value: "app-backend", label: "app-backend" },
              { value: "app-frontend", label: "app-frontend" },
              { value: "monitoring", label: "monitoring" },
            ]}
          />
          <SearchInput placeholder="이름 또는 레이블 검색" className="mr-1" />
          <Button variant="primary" size="md">
            <Plus className="w-4 h-4 mr-1.5" />
            생성
          </Button>
          <Button variant="secondary" size="md">
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            동기화
          </Button>
        </FilterBar>

        <DataTable
          columns={columns}
          data={tableData}
          selectedIds={new Set()}
          onSelectionChange={() => {}}
        />

        <Overlay top={133} right={0}>
          <ContextMenu items={contextMenuItems} className="w-[170px]" />
        </Overlay>

        <Pagination
          currentPage={1}
          totalPages={2}
          visiblePages={[1, 2]}
          className="mt-5 pb-10"
        />
      </ContentSection>
    </CcpDashboardLayout>
  );
}
