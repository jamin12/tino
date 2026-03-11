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
  CodeEditor,
  ContentSection,
  ActionMenu,
  DataTable,
  FilterBar,
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
  Toggle,
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
  screenId: "CCP-STR-004-D5",
  title: "ConfigMaps 상세 - YAML",
  section: "CI/CD 저장소",
  links: [
    { targetScreenId: "CCP-STR-004-D1", type: "tab", label: "요약 탭" },
    { targetScreenId: "CCP-STR-004-D2", type: "tab", label: "기본정보 탭" },
    { targetScreenId: "CCP-STR-004-D3", type: "tab", label: "Data 탭" },
    { targetScreenId: "CCP-STR-004-D4", type: "tab", label: "설정 탭" },
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
  { key: "config", label: "구성", icon: <Settings className={iconClass} /> },
  { key: "yaml", label: "YAML", icon: <FileCode className="w-[14px] h-[14px] text-[#0077ff]" /> },
  { type: "divider" },
  { key: "delete", label: "리소스 삭제", icon: <Trash2 className="w-[14px] h-[14px] text-[#da1e28]" /> },
];

// ─── Detail Panel Data ──────────────────────────────────────────────────────

const detailIconNavItems: IconNavItem[] = [
  { id: "status", icon: <Info className="w-5 h-5" />, label: "상태" },
  { id: "config", icon: <Settings className="w-5 h-5" />, label: "구성" },
  { id: "yaml", icon: <Code2 className="w-5 h-5" />, label: "YAML" },
];

const yamlTabs = [
  { id: "live", label: "LIVE" },
  { id: "diff", label: "DIFF" },
  { id: "git", label: "GIT" },
];

const configMapYaml = `apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: app-backend
  labels:
    app: backend
    env: production
    managed-by: cone-chain
  annotations:
    argocd.argoproj.io/compare-options: IgnoreExtraneous
    argocd.argoproj.io/sync-options: Prune=false
    description: Backend application configuration
  creationTimestamp: '2025-02-28T09:15:00Z'
  resourceVersion: '284719'
  uid: a3d8b2f1-4e6c-4a8f-b9d1-2c5e7f8a0b3d
  generation: 3
data:
  DATABASE_HOST: mysql-primary.db.svc.cluster.local
  DATABASE_PORT: '3306'
  DATABASE_NAME: app_production
  REDIS_HOST: redis-master.cache.svc.cluster.local
  REDIS_PORT: '6379'
  LOG_LEVEL: info
  API_TIMEOUT: '30'
  MAX_CONNECTIONS: '100'
  CACHE_TTL: '3600'
  FEATURE_FLAG_NEW_UI: 'true'`;

// ─── Slide ──────────────────────────────────────────────────────────────────

export default function SlideConfigMapsDetailYaml() {
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
            statusBadges={
              <>
                <Badge variant="success" size="sm">Stable</Badge>
                <Badge variant="success" size="sm">Healthy</Badge>
                <Badge variant="primary" size="sm">Synced</Badge>
              </>
            }
            iconNavItems={detailIconNavItems}
            activeIconNavId="yaml"
          >
            {/* Section Label */}
            <div className="px-5 pt-4 pb-2 flex items-center gap-1.5">
              <TextCell bold color="#111" className="text-[15px]">
                YAML
              </TextCell>
              <Info className="w-3.5 h-3.5 text-[#999]" />
            </div>

            {/* Sub Tabs */}
            <div className="px-5">
              <Tabs items={yamlTabs} activeId="live" />
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-end gap-3 px-5 py-2">
              <Toggle label="시스템 필드 숨기기" checked={false} />
              <Button variant="secondary" size="sm">
                편집
              </Button>
            </div>

            {/* YAML Editor */}
            <div className="flex-1 px-3 pb-3">
              <CodeEditor
                code={configMapYaml}
                language="yaml"
                theme="light"
                fontSize={13}
                showLineNumbers
                wordWrap={false}
                className="h-full"
              />
            </div>
          </ResourceDetailPanel>
        }
        detailWidth="520px"
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
              highlightedKeys={["yaml"]}
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
