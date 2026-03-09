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
  Divider,
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
  title: "PV 구성 - PVC 바인딩",
  section: "CI/CD 저장소",
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
          { label: "PV", active: true, bold: true },
          { label: "PVC" },
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

interface PvRow {
  id: string;
  gitopsColor: string;
  name: string;
  capacity: string;
  accessModes: string;
  reclaimPolicy: "Retain" | "Delete" | "Recycle";
  status: "Available" | "Bound" | "Released" | "Failed";
  persistentVolumeClaim: string | null;
  storageClass: string;
  source: string;
  reason: string | null;
  age: string;
}

const tableData: PvRow[] = [
  {
    id: "1",
    gitopsColor: "#00b30e",
    name: "pvc-1a2b3c4d",
    capacity: "20Gi",
    accessModes: "RWO",
    reclaimPolicy: "Retain",
    status: "Bound",
    persistentVolumeClaim: "app-database/data-db-mongodb-0",
    storageClass: "local-storage",
    source: "local",
    reason: null,
    age: "5d",
  },
  {
    id: "2",
    gitopsColor: "#00b30e",
    name: "pvc-5e6f7g8h",
    capacity: "5Gi",
    accessModes: "RWO",
    reclaimPolicy: "Retain",
    status: "Bound",
    persistentVolumeClaim: "app-database/data-db-redis-0",
    storageClass: "local-storage",
    source: "local",
    reason: null,
    age: "5d",
  },
  {
    id: "3",
    gitopsColor: "#00b30e",
    name: "pvc-9i0j1k2l",
    capacity: "1Gi",
    accessModes: "ROX",
    reclaimPolicy: "Delete",
    status: "Bound",
    persistentVolumeClaim: "app-frontend/nginx-assets-pvc",
    storageClass: "standard",
    source: "hostPath",
    reason: null,
    age: "12d",
  },
  {
    id: "4",
    gitopsColor: "#dea600",
    name: "pv-nfs-shared-01",
    capacity: "100Gi",
    accessModes: "RWX",
    reclaimPolicy: "Retain",
    status: "Available",
    persistentVolumeClaim: null,
    storageClass: "nfs-client",
    source: "nfs",
    reason: null,
    age: "20d",
  },
  {
    id: "5",
    gitopsColor: "#da1e28",
    name: "pvc-3m4n5o6p",
    capacity: "100Gi",
    accessModes: "RWO",
    reclaimPolicy: "Delete",
    status: "Released",
    persistentVolumeClaim: null,
    storageClass: "standard",
    source: "hostPath",
    reason: "PVC deleted",
    age: "30d",
  },
];

const statusVariant: Record<
  string,
  "success" | "error" | "warning" | "neutral"
> = {
  Available: "info" as "success",
  Bound: "success",
  Released: "warning",
  Failed: "error",
};

const policyVariant: Record<
  string,
  "success" | "error" | "warning" | "neutral"
> = {
  Retain: "success",
  Delete: "error",
  Recycle: "warning",
};

const columns: DataTableColumn<PvRow>[] = [
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
    width: "200px",
    render: (row) => (
      <TextCell bold color="#111111" className="px-4">
        {row.name}
      </TextCell>
    ),
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
    width: "120px",
    align: "center",
    render: (row) => <Badge variant="neutral">{row.accessModes}</Badge>,
  },
  {
    id: "reclaimPolicy",
    header: "Reclaim Policy",
    width: "130px",
    align: "center",
    render: (row) => (
      <Badge variant={policyVariant[row.reclaimPolicy]}>
        {row.reclaimPolicy}
      </Badge>
    ),
  },
  {
    id: "status",
    header: "상태",
    width: "110px",
    align: "center",
    render: (row) => (
      <Badge variant={statusVariant[row.status]}>{row.status}</Badge>
    ),
  },
  {
    id: "pvc",
    header: "PVC",
    width: "240px",
    render: (row) => (
      <TextCell color={row.persistentVolumeClaim ? "#0077ff" : "#999999"}>
        {row.persistentVolumeClaim ?? "-"}
      </TextCell>
    ),
  },
  {
    id: "source",
    header: "소스",
    width: "100px",
    align: "center",
    render: (row) => <Badge variant="neutral">{row.source}</Badge>,
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
    icon: <FileText className={iconClass} />,
  },
  { key: "config", label: "구성", icon: <Settings className="w-[14px] h-[14px] text-[#0077ff]" /> },
  { key: "yaml", label: "YAML", icon: <FileCode className={iconClass} /> },
  { type: "divider" },
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
  { id: "pvc", label: "PVC 바인딩" },
];

// ─── Slide ──────────────────────────────────────────────────────────────────

export default function SlidePvDetailPvc() {
  return (
    <CcpDashboardLayout
      breadcrumbs={[{ label: "저장소" }, { label: "PV", isBold: true }]}
      title="Persistent Volumes"
      sideMenuItems={sideMenuItems}
    >
      <ListDetailLayout
        detail={
          <ResourceDetailPanel
            title="pvc-1a2b3c4d"
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
              <Tabs items={configTabs} activeId="pvc" />
            </div>

            {/* Content */}
            <div className="flex-1 px-4 pt-4 pb-4">
              <div className="bg-white rounded-sm border border-[#f0f0f0] shadow-[0px_0px_8px_#00000014] px-5 py-4 flex flex-col gap-3">
                <InfoRow label="Status">
                  <Badge variant="success" size="sm">Bound</Badge>
                </InfoRow>
                <InfoRow label="PVC">
                  <TextCell linked color="#0077ff" className="text-[12px] break-all">
                    app-database/data-db-mongodb-0
                  </TextCell>
                </InfoRow>
                <InfoRow label="네임스페이스">
                  <TextCell color="#6d7073" className="text-[13px]">app-database</TextCell>
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
              { id: "status", label: "리소스 상태 현황", count: 5 },
              { id: "gitops", label: "GitOps 현황", count: 5 },
            ]}
            activeTabId="status"
            cards={[]}
            cardsByTab={{
              status: [
                { label: "Bound", count: 3, color: "#00b30e" },
                { label: "Available", count: 1, color: "#0077ff" },
                { label: "Released", count: 1, color: "#f59e0b" },
              ],
              gitops: [
                { label: "Stable", count: 3, color: "#00b30e" },
                { label: "Mismatch", count: 1, color: "#da1e28" },
                { label: "Updating", count: 0, color: "#00b30e" },
                { label: "Missing", count: 0, color: "#dea600" },
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
                { value: "available", label: "Available" },
                { value: "bound", label: "Bound" },
                { value: "released", label: "Released" },
                { value: "failed", label: "Failed" },
              ]}
            />
            <Select
              label="Reclaim Policy"
              options={[
                { value: "", label: "전체" },
                { value: "retain", label: "Retain" },
                { value: "delete", label: "Delete" },
              ]}
            />
            <SearchInput placeholder="이름 또는 PVC 검색" className="mr-1" />
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
              highlightedKeys={["config"]}
              static
              className="w-[160px]"
            />
          </Overlay>

          <Pagination
            currentPage={1}
            totalPages={2}
            visiblePages={[1, 2]}
            className="mt-5 pb-10"
          />
        </ContentSection>
      </ListDetailLayout>
    </CcpDashboardLayout>
  );
}
