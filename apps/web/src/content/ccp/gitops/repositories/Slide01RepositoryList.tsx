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
  Link2,
  Unlink,
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
  Tabs,
} from "../../_components";
import type {
  SideMenuItem,
  DataTableColumn,
  ContextMenuEntry,
} from "../../_components";
import type { SlideMeta } from "@entities/document";

export const slideMeta: SlideMeta = {
  screenId: "CCP-GIT-001",
  title: "리포지토리 목록",
  section: "GitOps Repositories",
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
    expandIcon: "plus",
  },
  {
    id: "cicd",
    label: "CI/CD",
    icon: <GitBranch className="w-5 h-5" />,
    expandIcon: "plus",
  },
  {
    id: "gitops",
    label: "GitOps",
    icon: <GitCompare className="w-5 h-5" />,
    active: true,
    expanded: true,
    expandIcon: "minus",
    sections: [
      {
        label: "",
        items: [
          { label: "Applications" },
          { label: "Repositories", active: true, bold: true },
        ],
      },
    ],
  },
  {
    id: "settings",
    label: "설정/권한",
    icon: <Settings className="w-5 h-5" />,
    expandIcon: "plus",
  },
];

// ─── Table Data ─────────────────────────────────────────────────────────────

interface RepoRow {
  id: string;
  connectionColor: string;
  topic: string;
  topicVariant: "success" | "info" | "warning" | "neutral";
  name: string;
  project: string;
  namespace: string;
  createdAt: string;
}

const tableData: RepoRow[] = [
  {
    id: "1",
    connectionColor: "#00b30e",
    topic: "Pipeline",
    topicVariant: "info",
    name: "app1-maven-pipeline",
    project: "app-cicd",
    namespace: "app-cicd",
    createdAt: "2024-01-15 14:30",
  },
  {
    id: "2",
    connectionColor: "#00b30e",
    topic: "Manifest",
    topicVariant: "success",
    name: "app1-gitops",
    project: "app-cicd",
    namespace: "app-cicd",
    createdAt: "2024-01-15 14:25",
  },
  {
    id: "3",
    connectionColor: "#da1e28",
    topic: "Pipeline",
    topicVariant: "info",
    name: "app2-gradle-pipeline",
    project: "app-cicd",
    namespace: "app-cicd",
    createdAt: "2024-01-14 09:10",
  },
  {
    id: "4",
    connectionColor: "#00b30e",
    topic: "Artifact",
    topicVariant: "warning",
    name: "app2-artifact-registry",
    project: "app-cicd",
    namespace: "app-cicd",
    createdAt: "2024-01-14 09:05",
  },
  {
    id: "5",
    connectionColor: "#6d7073",
    topic: "Manifest",
    topicVariant: "success",
    name: "app3-gitops",
    project: "infra-ops",
    namespace: "infra-ops",
    createdAt: "2024-01-13 16:40",
  },
  {
    id: "6",
    connectionColor: "#7300ff",
    topic: "Pipeline",
    topicVariant: "info",
    name: "sample-reactnpm-nginx-pipeline",
    project: "sample-cicd",
    namespace: "sample-cicd",
    createdAt: "2024-01-12 11:00",
  },
];

const columns: DataTableColumn<RepoRow>[] = [
  {
    id: "connection",
    header: "연결",
    width: "70px",
    align: "center",
    render: (row) => <StatusDot color={row.connectionColor} size="md" />,
  },
  {
    id: "topic",
    header: "Topic",
    width: "110px",
    align: "center",
    render: (row) => <Badge variant={row.topicVariant}>{row.topic}</Badge>,
  },
  {
    id: "name",
    header: "이름",
    width: "280px",
    render: (row) => (
      <TextCell bold color="#111111" className="px-4">
        {row.name}
      </TextCell>
    ),
  },
  {
    id: "project",
    header: "프로젝트",
    width: "140px",
    align: "center",
    render: (row) => <TextCell color="#555555">{row.project}</TextCell>,
  },
  {
    id: "namespace",
    header: "네임스페이스",
    width: "140px",
    align: "center",
    render: (row) => <TextCell color="#555555">{row.namespace}</TextCell>,
  },
  {
    id: "createdAt",
    header: "생성시간",
    width: "160px",
    align: "center",
    render: (row) => <TextCell color="#555555">{row.createdAt}</TextCell>,
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
  { id: "create-app", label: "애플리케이션 생성", icon: <Link2 className="w-4 h-4" /> },
  {
    id: "disconnect",
    label: "연결해제",
    icon: <Unlink className="w-4 h-4" />,
    textColor: "text-[#da1e28]",
  },
];

// ─── Slide ──────────────────────────────────────────────────────────────────

export default function Slide01RepositoryList() {
  return (
    <CcpDashboardLayout
      breadcrumbs={[
        { label: "GitOps" },
        { label: "Repositories" },
        { label: "리포지토리 목록", isBold: true },
      ]}
      title="리포지토리 목록"
      sideMenuItems={sideMenuItems}
    >
      <ContentSection card>
        <StatusSummary
          tabs={[
            { id: "gitops", label: "GitOps 연결 현황", count: 60 },
          ]}
          activeTabId="gitops"
          cards={[]}
          cardsByTab={{
            gitops: [
              { label: "Connected", count: 42, color: "#00b30e" },
              { label: "Disconnected", count: 8, color: "#da1e28" },
              { label: "Unknown", count: 5, color: "#6d7073" },
              { label: "Unmanaged", count: 5, color: "#7300ff" },
            ],
          }}
        />
      </ContentSection>

      <ContentSection>
        <Tabs
          items={[
            { id: "all", label: "전체" },
            { id: "pipeline", label: "Pipeline" },
            { id: "manifest", label: "Manifest" },
            { id: "artifact", label: "Artifact" },
          ]}
          activeId="all"
          className="mb-3"
        />
      </ContentSection>

      <ContentSection relative>
        <FilterBar className="gap-2">
          <Select
            label="연결 상태"
            options={[
              { value: "", label: "전체" },
              { value: "connected", label: "Connected" },
              { value: "disconnected", label: "Disconnected" },
              { value: "unknown", label: "Unknown" },
              { value: "unmanaged", label: "Unmanaged" },
            ]}
          />
          <Select
            label="이름"
            options={[
              { value: "", label: "전체" },
              { value: "app-cicd", label: "app-cicd" },
              { value: "infra-ops", label: "infra-ops" },
              { value: "sample-cicd", label: "sample-cicd" },
            ]}
          />
          <SearchInput placeholder="키워드 검색" className="mr-1" />
          <Button variant="primary" size="md">
            <Plus className="w-4 h-4 mr-1.5" />
            연결
          </Button>
          <Button variant="secondary" size="md">
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            새로고침
          </Button>
        </FilterBar>

        <DataTable
          columns={columns}
          data={tableData}
          selectedIds={new Set()}
          onSelectionChange={() => {}}
        />

        <Overlay top={108} right={0}>
          <ContextMenu items={contextMenuItems} className="w-[180px]" />
        </Overlay>

        <Pagination
          currentPage={1}
          totalPages={32}
          visiblePages={[1, 2, 3, 4, 5]}
          className="mt-5 pb-10"
        />
      </ContentSection>
    </CcpDashboardLayout>
  );
}
