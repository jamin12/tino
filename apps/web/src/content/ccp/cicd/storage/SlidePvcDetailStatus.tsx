import {
  Plus,
  RefreshCw,
  MoreHorizontal,
  Settings2,
  Copy,
  FileText,
  FileCode,
  Trash2,
  Info,
  Settings,
  Code2,
} from "lucide-react";
import {
  Badge,
  Button,
  CcpDashboardLayout,
  ContentSection,
  ActionMenu,
  DataTable,
  FilterBar,
  InfoRow,
  ListDetailLayout,
  Overlay,
  Pagination,
  ResourceDetailPanel,
  SearchInput,
  Select,
  StatusDot,
  StatusSummary,
  Tabs,
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
  IconNavItem,
} from "../../_components";
import type { SlideMeta } from "@entities/document";

export const slideMeta: SlideMeta = {
  screenId: "CCP-STR-003-D2",
  title: "PVC 구성 - Status",
  section: "CI/CD 저장소",
  links: [
    { targetScreenId: "CCP-STR-003-D1", type: "tab", label: "Spec 탭" },
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
    icon: <SidebarSettingsIcon className="w-5 h-5" />,
    expandIcon: "plus",
  },
  {
    id: "gitops",
    label: "GitOps",
    icon: <SidebarGitopsIcon className="w-5 h-5" />,
    expandIcon: "plus",
  },
];

// ─── Table Data ─────────────────────────────────────────────────────────────

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
      <Badge variant={resultVariant[row.status]}>{row.status}</Badge>
    ),
  },
  {
    id: "volume",
    header: "볼륨",
    width: "160px",
    align: "center",
    render: (row) => <TextCell>{row.volume}</TextCell>,
  },
  {
    id: "capacity",
    header: "용량",
    width: "100px",
    align: "center",
    render: (row) => (
      <TextCell bold color="#111111">
        {row.capacity}
      </TextCell>
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
    render: (row) => <TextCell>{row.storageClass}</TextCell>,
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
  { key: "yaml", label: "YAML", icon: <FileCode className={iconClass} /> },
  {
    key: "delete",
    label: "리소스 삭제",
    icon: <Trash2 className="w-[14px] h-[14px] text-[#da1e28]" />,
  },
];

// ─── Detail Panel Data ──────────────────────────────────────────────────────

const detailIconNavItems: IconNavItem[] = [
  { id: "status", icon: <Info className="w-5 h-5" />, label: "상태" },
  { id: "config", icon: <Settings className="w-5 h-5" />, label: "구성" },
  { id: "yaml", icon: <Code2 className="w-5 h-5" />, label: "YAML" },
];

// ─── Config Tabs ─────────────────────────────────────────────────────────────

const configTabs = [
  { id: "basic", label: "기본정보" },
  { id: "spec", label: "Spec" },
  { id: "status", label: "Status" },
];

// ─── Slide ──────────────────────────────────────────────────────────────────

export default function SlidePvcDetailStatus() {
  return (
    <CcpDashboardLayout
      breadcrumbs={[{ label: "저장소" }, { label: "PVC", isBold: true }]}
      title="Persistent Volume Claims"
      sideMenuItems={sideMenuItems}
    >
      <ListDetailLayout
        detail={
          <ResourceDetailPanel
            title="data-db-mongodb-0"
            statusColor="#00b30e"
            iconNavItems={detailIconNavItems}
            activeIconNavId="config"
          >
            {/* Section Label */}
            <div className="px-5 pt-4 pb-2 flex items-center gap-1.5">
              <TextCell bold color="#111" className="text-[15px]">
                구성
              </TextCell>
              <Info className="w-3.5 h-3.5 text-[#999]" />
            </div>

            {/* Sub Tabs */}
            <div className="px-5">
              <Tabs items={configTabs} activeId="status" />
            </div>

            {/* Content */}
            <div className="flex-1 px-4 pt-4 pb-4">
              <div className="bg-white rounded-sm border border-[#f0f0f0] shadow-[0px_0px_8px_#00000014] px-5 py-4 flex flex-col gap-3">
                <InfoRow label="Phase">
                  <Badge variant="success" size="sm">Bound</Badge>
                </InfoRow>
                <InfoRow label="볼륨">
                  <TextCell linked color="#0077ff" className="text-[12px]">pvc-1a2b3c4d</TextCell>
                </InfoRow>
                <InfoRow label="실제 용량">
                  <TextCell color="#6d7073" className="text-[13px]">20Gi</TextCell>
                </InfoRow>
                <InfoRow label="Access Modes">
                  <TextCell color="#6d7073" className="text-[13px]">ReadWriteOnce (RWO)</TextCell>
                </InfoRow>
              </div>
            </div>
          </ResourceDetailPanel>
        }
        detailWidth="480px"
      >
        {/* Main List Content */}
        <ContentSection card>
          <StatusSummary
            tabs={[
              { id: "status", label: "리소스 상태 현황", count: 25 },
              { id: "gitops", label: "GitOps 현황", count: 25 },
            ]}
            activeTabId="status"
            cards={[]}
            cardsByTab={{
              status: [
                { label: "Bound", count: 22, color: "#00b30e" },
                { label: "Pending", count: 2, color: "#f59e0b" },
                { label: "Lost", count: 1, color: "#da1e28" },
              ],
              gitops: [
                { label: "Stable", count: 20, color: "#00b30e" },
                { label: "Mismatch", count: 2, color: "#da1e28" },
                { label: "Updating", count: 1, color: "#00b30e" },
                { label: "Missing", count: 1, color: "#dea600" },
                { label: "Broken", count: 1, color: "#da1e28" },
                { label: "Orphaned", count: 0, color: "#6366f1" },
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
                { value: "bound", label: "Bound" },
                { value: "pending", label: "Pending" },
                { value: "lost", label: "Lost" },
              ]}
            />
            <Select
              label="네임스페이스"
              options={[{ value: "", label: "전체" }]}
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
            <ActionMenu
              items={actionMenuItems}
              highlightedKeys={["summary"]}
              static
              className="w-[160px]"
            />
          </Overlay>

          <Pagination
            currentPage={1}
            totalPages={3}
            visiblePages={[1, 2, 3]}
            className="mt-5 pb-10"
          />
        </ContentSection>
      </ListDetailLayout>
    </CcpDashboardLayout>
  );
}
