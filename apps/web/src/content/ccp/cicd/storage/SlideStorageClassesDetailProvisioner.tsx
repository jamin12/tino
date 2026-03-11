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
  screenId: "CCP-STR-001-D1",
  title: "StorageClasses 구성 - 프로비저너",
  section: "CI/CD 저장소",
  links: [
    { targetScreenId: "CCP-STR-001-D2", type: "tab", label: "Parameters 탭" },
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
          { label: "StorageClasses", active: true, bold: true },
          { label: "PV" },
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

interface StorageClassRow {
  id: string;
  gitopsColor: string;
  name: string;
  provisioner: string;
  isDefault: boolean;
  age: string;
}

const tableData: StorageClassRow[] = [
  {
    id: "1",
    gitopsColor: "#00b30e",
    name: "standard",
    provisioner: "kubernetes.io/no-provisioner",
    isDefault: true,
    age: "90d",
  },
  {
    id: "2",
    gitopsColor: "#00b30e",
    name: "local-storage",
    provisioner: "kubernetes.io/no-provisioner",
    isDefault: false,
    age: "90d",
  },
  {
    id: "3",
    gitopsColor: "#00b30e",
    name: "nfs-client",
    provisioner: "nfs-subdir-external-provisioner",
    isDefault: false,
    age: "45d",
  },
  {
    id: "4",
    gitopsColor: "#6366f1",
    name: "ceph-block",
    provisioner: "rook-ceph.rbd.csi.ceph.com",
    isDefault: false,
    age: "30d",
  },
  {
    id: "5",
    gitopsColor: "#00b30e",
    name: "ceph-filesystem",
    provisioner: "rook-ceph.cephfs.csi.ceph.com",
    isDefault: false,
    age: "30d",
  },
];

const columns: DataTableColumn<StorageClassRow>[] = [
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
        {row.isDefault ? `${row.name} (default)` : row.name}
      </TextCell>
    ),
  },
  {
    id: "provisioner",
    header: "프로비저너",
    width: "300px",
    render: (row) => <Badge variant="neutral">{row.provisioner}</Badge>,
  },
  {
    id: "default",
    header: "기본 여부",
    width: "120px",
    align: "center",
    render: (row) => (
      <Badge variant={row.isDefault ? "success" : "neutral"}>
        {row.isDefault ? "Default" : "-"}
      </Badge>
    ),
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
  { id: "provisioner", label: "프로비저너" },
  { id: "params", label: "Parameters" },
];

// ─── Slide ──────────────────────────────────────────────────────────────────

export default function SlideStorageClassesDetailProvisioner() {
  return (
    <CcpDashboardLayout
      breadcrumbs={[
        { label: "저장소" },
        { label: "StorageClasses", isBold: true },
      ]}
      title="Storage Classes"
      sideMenuItems={sideMenuItems}
    >
      <ListDetailLayout
        detail={
          <ResourceDetailPanel
            title="standard"
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
              <Tabs items={configTabs} activeId="provisioner" />
            </div>

            {/* Content */}
            <div className="flex-1 px-4 pt-4 pb-4">
              <div className="bg-white rounded-sm border border-[#f0f0f0] shadow-[0px_0px_8px_#00000014] px-5 py-4 flex flex-col gap-3">
                <InfoRow label="Provisioner">
                  <TextCell color="#6d7073" className="text-[13px]">
                    kubernetes.io/no-provisioner
                  </TextCell>
                </InfoRow>
                <InfoRow label="Reclaim Policy">
                  <Badge variant="success" size="sm">Retain</Badge>
                </InfoRow>
                <InfoRow label="Volume Binding">
                  <TextCell color="#6d7073" className="text-[13px]">WaitForFirstConsumer</TextCell>
                </InfoRow>
                <InfoRow label="Allow Expansion">
                  <Badge variant="neutral" size="sm">false</Badge>
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
            tabs={[{ id: "gitops", label: "GitOps 현황", count: 5 }]}
            activeTabId="gitops"
            cards={[
              { label: "Stable", count: 4, color: "#00b30e" },
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
              label="프로비저너"
              options={[
                { value: "", label: "전체" },
                { value: "no-provisioner", label: "no-provisioner" },
                { value: "nfs", label: "nfs-subdir" },
                { value: "ceph-rbd", label: "rook-ceph (RBD)" },
                { value: "ceph-fs", label: "rook-ceph (CephFS)" },
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
            <ActionMenu
              items={actionMenuItems}
              highlightedKeys={["config"]}
              static
              className="w-[160px]"
            />
          </Overlay>

          <Pagination
            currentPage={1}
            totalPages={1}
            visiblePages={[1]}
            className="mt-5 pb-10"
          />
        </ContentSection>
      </ListDetailLayout>
    </CcpDashboardLayout>
  );
}
