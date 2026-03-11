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
  screenId: "CCP-STR-004-D3",
  title: "ConfigMaps 구성 - Data",
  section: "CI/CD 저장소",
  links: [
    { targetScreenId: "CCP-STR-004-D1", type: "tab", label: "요약 탭" },
    { targetScreenId: "CCP-STR-004-D2", type: "tab", label: "기본정보 탭" },
    { targetScreenId: "CCP-STR-004-D4", type: "tab", label: "설정 탭" },
    { targetScreenId: "CCP-STR-004-D5", type: "tab", label: "YAML 탭" },
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
          { label: "파이프라인 구성" },
          { label: "파이프라인 실행" },
          { label: "트리거 구성" },
          { label: "트리거 실행" },
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

interface ConfigMapRow {
  id: string;
  gitopsColor: string;
  name: string;
  namespace: string;
  data: number;
  age: string;
}

const tableData: ConfigMapRow[] = [
  { id: "1", gitopsColor: "#00b30e", name: "app-config", namespace: "app-backend", data: 5, age: "10d" },
  { id: "2", gitopsColor: "#00b30e", name: "nginx-config", namespace: "app-frontend", data: 2, age: "12d" },
  { id: "3", gitopsColor: "#00b30e", name: "redis-config", namespace: "app-database", data: 3, age: "5d" },
  { id: "4", gitopsColor: "#6366f1", name: "fluentd-config", namespace: "monitoring", data: 8, age: "20d" },
  { id: "5", gitopsColor: "#00b30e", name: "prometheus-rules", namespace: "monitoring", data: 12, age: "15d" },
];

const columns: DataTableColumn<ConfigMapRow>[] = [
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
    width: "200px",
    render: (row) => (
      <TextCell bold color="#111111" className="px-4">
        {row.name}
      </TextCell>
    ),
  },
  {
    id: "namespace",
    header: "네임스페이스",
    width: "130px",
    align: "center",
    render: (row) => <TextCell color="#555555">{row.namespace}</TextCell>,
  },
  {
    id: "data",
    header: "Data",
    width: "70px",
    align: "center",
    render: (row) => <Badge variant="neutral">{row.data}</Badge>,
  },
  {
    id: "age",
    header: "생성일",
    width: "70px",
    align: "center",
    render: (row) => <TextCell color="#555555">{row.age}</TextCell>,
  },
  {
    id: "actions",
    header: "",
    width: "50px",
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
  { key: "summary", label: "요약", icon: <FileText className={iconClass} /> },
  { key: "config", label: "구성", icon: <Settings className="w-[14px] h-[14px] text-[#0077ff]" /> },
  { key: "yaml", label: "YAML", icon: <FileCode className={iconClass} /> },
  { type: "divider" },
  { key: "delete", label: "리소스 삭제", icon: <Trash2 className="w-[14px] h-[14px] text-[#da1e28]" /> },
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
  { id: "settings", label: "설정" },
  { id: "data", label: "Data" },
];

// ─── Slide ──────────────────────────────────────────────────────────────────

export default function SlideConfigMapsDetailConfigData() {
  return (
    <CcpDashboardLayout
      breadcrumbs={[{ label: "저장소" }, { label: "ConfigMaps", isBold: true }]}
      title="ConfigMaps"
      sideMenuItems={sideMenuItems}
    >
      <ListDetailLayout
        detail={
          <ResourceDetailPanel
            title="app-config"
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
              <Tabs items={configTabs} activeId="data" />
            </div>

            {/* Content */}
            <div className="flex-1 px-4 pt-4 pb-4">
              <div className="bg-white rounded-sm border border-[#f0f0f0] shadow-[0px_0px_8px_#00000014] px-5 py-4 flex flex-col gap-3">
                {/* Item 1 */}
                <InfoRow label="이름">
                  <TextCell bold color="#111" className="text-[13px]">DATABASE_HOST</TextCell>
                </InfoRow>
                <InfoRow label="타입">
                  <TextCell color="#6d7073" className="text-[13px]">string</TextCell>
                </InfoRow>
                <InfoRow label="값">
                  <TextCell color="#6d7073" className="text-[13px]">mysql-primary.db.svc.cluster.local</TextCell>
                </InfoRow>
                <Divider />
                {/* Item 2 */}
                <InfoRow label="이름">
                  <TextCell bold color="#111" className="text-[13px]">DATABASE_PORT</TextCell>
                </InfoRow>
                <InfoRow label="타입">
                  <TextCell color="#6d7073" className="text-[13px]">string</TextCell>
                </InfoRow>
                <InfoRow label="값">
                  <TextCell color="#6d7073" className="text-[13px]">3306</TextCell>
                </InfoRow>
                <Divider />
                {/* Item 3 */}
                <InfoRow label="이름">
                  <TextCell bold color="#111" className="text-[13px]">DATABASE_NAME</TextCell>
                </InfoRow>
                <InfoRow label="타입">
                  <TextCell color="#6d7073" className="text-[13px]">string</TextCell>
                </InfoRow>
                <InfoRow label="값">
                  <TextCell color="#6d7073" className="text-[13px]">app_production</TextCell>
                </InfoRow>
                <Divider />
                {/* Item 4 */}
                <InfoRow label="이름">
                  <TextCell bold color="#111" className="text-[13px]">REDIS_HOST</TextCell>
                </InfoRow>
                <InfoRow label="타입">
                  <TextCell color="#6d7073" className="text-[13px]">string</TextCell>
                </InfoRow>
                <InfoRow label="값">
                  <TextCell color="#6d7073" className="text-[13px]">redis-master.cache.svc.cluster.local</TextCell>
                </InfoRow>
                <Divider />
                {/* Item 5 */}
                <InfoRow label="이름">
                  <TextCell bold color="#111" className="text-[13px]">REDIS_PORT</TextCell>
                </InfoRow>
                <InfoRow label="타입">
                  <TextCell color="#6d7073" className="text-[13px]">string</TextCell>
                </InfoRow>
                <InfoRow label="값">
                  <TextCell color="#6d7073" className="text-[13px]">6379</TextCell>
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
              { label: "Updating", count: 1, color: "#6366f1" },
              { label: "Missing", count: 0, color: "#dea600" },
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

          <Overlay top={90} right={0}>
            <ActionMenu
              items={actionMenuItems}
              highlightedKeys={["config"]}
              static
              className="w-[160px]"
            />
          </Overlay>

          <Pagination
            currentPage={1}
            totalPages={3}
            visiblePages={[1, 2, 3]}
            className="mt-3 pb-6"
          />
        </ContentSection>
      </ListDetailLayout>
    </CcpDashboardLayout>
  );
}
