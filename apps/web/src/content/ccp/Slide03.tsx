import React from "react";
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
} from "lucide-react";
import {
  Badge,
  Button,
  CcpDashboardLayout,
  DataTable,
  SearchInput,
  Select,
  StatusCard,
  StatusDot,
  Tabs,
  Pagination,
  ContextMenu,
} from "./_components";
import type {
  SideMenuItem,
  DataTableColumn,
  ContextMenuEntry,
} from "./_components";

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
    expandIcon: "plus",
  },
  {
    id: "cicd",
    label: "CI/CD",
    icon: <GitBranch className="w-5 h-5" />,
    active: true,
    expanded: true,
    expandIcon: "minus",
    sections: [
      { label: "네임스페이스", items: [] },
      {
        label: "저장소",
        items: [
          { label: "StorageClasses" },
          { label: "PV" },
          { label: "PVC", active: true, bold: true },
          { label: "ConfigMaps" },
          { label: "Secrets" },
        ],
      },
      {
        label: "파이프라인",
        items: [
          { label: "파이프라인 정의" },
          { label: "파이프라인 실행" },
          { label: "파이프라인 트리거" },
          { label: "파이프라인 통계" },
        ],
      },
      {
        label: "카탈로그",
        items: [{ label: "Service Presets" }],
      },
    ],
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

interface PvcRow {
  id: string;
  gitopsColor: string;
  name: string;
  namespace: string;
  status: "Bound" | "Pending" | "Lost";
  volume: string;
  capacity: string;
  accessModes: string;
  storageClass: string;
  age: string;
}

const tableData: PvcRow[] = [
  {
    id: "1",
    gitopsColor: "#00b30e",
    name: "data-db-mongodb-0",
    namespace: "app-database",
    status: "Bound",
    volume: "pvc-1a2b3c4d",
    capacity: "20Gi",
    accessModes: "RWO",
    storageClass: "local-storage",
    age: "5d",
  },
  {
    id: "2",
    gitopsColor: "#00b30e",
    name: "data-db-redis-0",
    namespace: "app-database",
    status: "Bound",
    volume: "pvc-5e6f7g8h",
    capacity: "5Gi",
    accessModes: "RWO",
    storageClass: "local-storage",
    age: "5d",
  },
  {
    id: "3",
    gitopsColor: "#6366f1",
    name: "app-logs-volume",
    namespace: "app-backend",
    status: "Pending",
    volume: "-",
    capacity: "50Gi",
    accessModes: "RWX",
    storageClass: "nfs-client",
    age: "1h",
  },
  {
    id: "4",
    gitopsColor: "#dea600",
    name: "nginx-assets-pvc",
    namespace: "app-frontend",
    status: "Bound",
    volume: "pvc-9i0j1k2l",
    capacity: "1Gi",
    accessModes: "ROX",
    storageClass: "standard",
    age: "12d",
  },
  {
    id: "5",
    gitopsColor: "#da1e28",
    name: "corrupted-data-pvc",
    namespace: "app-legacy",
    status: "Lost",
    volume: "pvc-3m4n5o6p",
    capacity: "100Gi",
    accessModes: "RWO",
    storageClass: "standard",
    age: "30d",
  },
];

const resultVariant: Record<
  string,
  "success" | "error" | "warning" | "info" | "neutral"
> = {
  Bound: "success",
  Pending: "warning",
  Lost: "error",
};

const columns: DataTableColumn<PvcRow>[] = [
  {
    id: "gitops",
    header: "GitOps",
    width: "120px",
    align: "center",
    render: (row) => <StatusDot color={row.gitopsColor} size="md" />,
  },
  {
    id: "name",
    header: "이름",
    width: "240px",
    render: (row) => (
      <span className="text-sm font-semibold text-[#111111] px-4">
        {row.name}
      </span>
    ),
  },
  {
    id: "namespace",
    header: "네임스페이스",
    width: "140px",
    align: "center",
    render: (row) => (
      <span className="text-sm font-medium text-[#555555]">
        {row.namespace}
      </span>
    ),
  },
  {
    id: "status",
    header: "상태",
    width: "100px",
    align: "center",
    render: (row) => (
      <Badge variant={resultVariant[row.status] as any}>{row.status}</Badge>
    ),
  },
  {
    id: "volume",
    header: "볼륨",
    width: "160px",
    align: "center",
    render: (row) => (
      <span className="text-sm text-[#333333]">{row.volume}</span>
    ),
  },
  {
    id: "capacity",
    header: "용량",
    width: "100px",
    align: "center",
    render: (row) => (
      <span className="text-sm font-medium text-[#111111]">{row.capacity}</span>
    ),
  },
  {
    id: "accessModes",
    header: "Access Modes",
    width: "140px",
    align: "center",
    render: (row) => <Badge variant="neutral">{row.accessModes}</Badge>,
  },
  {
    id: "storageClass",
    header: "Storage Class",
    width: "160px",
    align: "center",
    render: (row) => (
      <span className="text-sm text-[#333333]">{row.storageClass}</span>
    ),
  },
  {
    id: "age",
    header: "생성일",
    width: "100px",
    align: "center",
    render: (row) => <span className="text-sm text-[#555555]">{row.age}</span>,
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
  { id: "edit", label: "편집", icon: Settings2 },
  { id: "duplicate", label: "복제", icon: Copy },
  { id: "d1", type: "divider" },
  { id: "summary", label: "요약", icon: FileText, textColor: "text-[#0077ff]" },
  { id: "yaml", label: "YAML", icon: FileCode },
  { id: "d2", type: "divider" },
  {
    id: "delete",
    label: "리소스 삭제",
    icon: Trash2,
    textColor: "text-[#da1e28]",
  },
];

export default function Slide03() {
  return (
    <CcpDashboardLayout
      breadcrumbs={[{ label: "저장소" }, { label: "PVC", isBold: true }]}
      title="Persistent Volume Claims"
      sideMenuItems={sideMenuItems}
    >
      {/* Status Summary Card */}
      <div className="mx-8 mt-5">
        <div className="bg-white rounded-lg shadow-[0px_0px_8px_#00000014] p-5">
          <Tabs
            items={[
              { id: "status", label: "리소스 상태 현황", count: 25 },
              { id: "gitops", label: "GitOps 상태 현황", count: 25 },
            ]}
            activeId="status"
          />

          <div className="flex items-start gap-5 mt-6 justify-center">
            <StatusCard label="Bound" count={22} color="#00b30e" />
            <StatusCard label="Pending" count={2} color="#f59e0b" />
            <StatusCard label="Lost" count={1} color="#da1e28" />
          </div>
        </div>
      </div>

      {/* Filter Bar + Table */}
      <div className="mx-8 mt-5 relative">
        <div className="flex items-center justify-end gap-2 mb-3">
          <Select
            label="상태"
            options={[
              { value: "", label: "전체" },
              { value: "bound", label: "Bound" },
              { value: "pending", label: "Pending" },
              { value: "lost", label: "Lost" },
            ]}
          />
          <Select
            label="네임스페이스"
            options={[{ value: "", label: "전체" }]}
          />
          <div className="mr-1">
            <SearchInput placeholder="이름 또는 레이블 검색" />
          </div>
          <Button variant="primary" size="md">
            <Plus className="w-4 h-4 mr-1.5" />
            생성
          </Button>
          <Button variant="secondary" size="md">
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            동기화
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={tableData}
          selectedIds={new Set()}
          onSelectionChange={() => {}}
        />

        {/* Context Menu Mockup on first row */}
        <div className="absolute top-[80px] right-[20px]">
          <ContextMenu items={contextMenuItems} className="w-[160px]" />
        </div>

        <div className="mt-5 pb-10">
          <Pagination currentPage={1} totalPages={3} visiblePages={[1, 2, 3]} />
        </div>
      </div>
    </CcpDashboardLayout>
  );
}
