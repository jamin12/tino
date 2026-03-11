import {
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
  ContentSection,
  ActionMenu,
  DataTable,
  FilterBar,
  Overlay,
  Pagination,
  SearchInput,
  Select,
  StatusDot,
  StatusSummary,
  TextCell,
  SidebarDashboardIcon,
  SidebarNamespaceIcon,
  SidebarApplicationIcon,
  SidebarCicdIcon,
  SidebarSettingsIcon,
  SidebarGitopsIcon,
} from "../../_components";
import type {
  SideMenuItem,
  DataTableColumn,
  ActionMenuEntry,
} from "../../_components";
import type { SlideMeta } from "@entities/document";

export const slideMeta: SlideMeta = {
  screenId: "CCP-STR-004",
  title: "ConfigMaps 목록",
  section: "CI/CD 저장소",
  links: [
    { targetScreenId: "CCP-STR-004-D1", type: "navigate", label: "행 클릭 → 상세(요약)" },
    { targetScreenId: "CCP-STR-C00", type: "modal", label: "생성 버튼 → 생성 다이얼로그" },
  ],
};

// ─── Side Menu Data ─────────────────────────────────────────────────────────

const sideMenuItems: SideMenuItem[] = [
  {
    id: "dashboard",
    label: "대시보드",
    icon: <SidebarDashboardIcon className="w-5 h-5" />,
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
    active: true,
    expanded: true,
    expandIcon: "minus",
    sections: [
      { label: "", items: [{ label: "네임스페이스" }] },
      {
        label: "저장소",
        items: [
          { label: "StorageClasses" },
          { label: "PV" },
          { label: "PVC" },
          { label: "ConfigMaps", active: true, bold: true },
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

// ─── Table Data ─────────────────────────────────────────────────────────────

interface ConfigMapRow {
  id: string;
  gitopsColor: string;
  name: string;
  namespace: string;
  data: number;
  age: string;
}

const tableData: ConfigMapRow[] = [
  {
    id: "1",
    gitopsColor: "#00b30e",
    name: "app-config",
    namespace: "app-backend",
    data: 5,
    age: "10d",
  },
  {
    id: "2",
    gitopsColor: "#00b30e",
    name: "nginx-config",
    namespace: "app-frontend",
    data: 2,
    age: "12d",
  },
  {
    id: "3",
    gitopsColor: "#00b30e",
    name: "redis-config",
    namespace: "app-database",
    data: 3,
    age: "5d",
  },
  {
    id: "4",
    gitopsColor: "#6366f1",
    name: "fluentd-config",
    namespace: "monitoring",
    data: 8,
    age: "20d",
  },
  {
    id: "5",
    gitopsColor: "#00b30e",
    name: "prometheus-rules",
    namespace: "monitoring",
    data: 12,
    age: "15d",
  },
  {
    id: "6",
    gitopsColor: "#00b30e",
    name: "grafana-dashboards",
    namespace: "monitoring",
    data: 6,
    age: "15d",
  },
];

const columns: DataTableColumn<ConfigMapRow>[] = [
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
    width: "260px",
    render: (row) => (
      <TextCell bold color="#111111" className="px-4">
        {row.name}
      </TextCell>
    ),
  },
  {
    id: "namespace",
    header: "네임스페이스",
    width: "160px",
    align: "center",
    render: (row) => <TextCell color="#555555">{row.namespace}</TextCell>,
  },
  {
    id: "data",
    header: "Data",
    width: "100px",
    align: "center",
    render: (row) => <Badge variant="neutral">{row.data}</Badge>,
  },
  {
    id: "age",
    header: "생성일",
    width: "100px",
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

const iconClass = "w-[14px] h-[14px] text-[#555759]";
const actionMenuItems: ActionMenuEntry[] = [
  { key: "edit", label: "편집", icon: <Settings2 className={iconClass} /> },
  { key: "duplicate", label: "복제", icon: <Copy className={iconClass} /> },
  { type: "divider" },
  {
    key: "summary",
    label: "요약",
    icon: <FileText className="w-[14px] h-[14px] text-[#0077ff]" />,
  },
  { type: "divider" },
  { key: "yaml", label: "YAML", icon: <FileCode className={iconClass} /> },
  {
    key: "delete",
    label: "리소스 삭제",
    icon: <Trash2 className="w-[14px] h-[14px] text-[#da1e28]" />,
  },
];

// ─── Slide ──────────────────────────────────────────────────────────────────

export default function Slide04ConfigMapsList() {
  return (
    <CcpDashboardLayout
      breadcrumbs={[{ label: "저장소" }, { label: "ConfigMaps", isBold: true }]}
      title="ConfigMaps"
      sideMenuItems={sideMenuItems}
    >
      <ContentSection card>
        <StatusSummary
          tabs={[{ id: "gitops", label: "GitOps 현황", count: 6 }]}
          activeTabId="gitops"
          cards={[
            { label: "Stable", count: 5, color: "#00b30e" },
            { label: "Mismatch", count: 0, color: "#da1e28" },
            { label: "Updating", count: 1, color: "#00b30e" },
            { label: "Missing", count: 0, color: "#dea600" },
            { label: "Broken", count: 0, color: "#da1e28" },
            { label: "Orphaned", count: 0, color: "#6366f1" },
          ]}
        />
      </ContentSection>

      <ContentSection relative>
        <FilterBar className="gap-2">
          <Select
            label="네임스페이스"
            options={[
              { value: "", label: "전체" },
              { value: "app-backend", label: "app-backend" },
              { value: "app-frontend", label: "app-frontend" },
              { value: "app-database", label: "app-database" },
              { value: "monitoring", label: "monitoring" },
            ]}
          />
          <SearchInput placeholder="이름 검색" className="mr-1" />
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
          <ActionMenu items={actionMenuItems} highlightedKeys={["summary"]} static className="w-[160px]" />
        </Overlay>

        <Pagination
          currentPage={1}
          totalPages={3}
          visiblePages={[1, 2, 3]}
          className="mt-5 pb-10"
        />
      </ContentSection>
    </CcpDashboardLayout>
  );
}
