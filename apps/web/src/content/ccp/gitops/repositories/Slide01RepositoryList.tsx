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
  Trash2,
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
  title: "배포 저장소 목록",
  section: "GitOps 배포 저장소",
  annotations: [
    {
      id: 1,
      label: "GitOps 연결 현황",
      description:
        "배포 저장소의 GitOps 연결 상태를 Successful, Failed, Unknown, Unmanaged 4가지로 집계하여 요약 카드로 표시합니다.",
    },
    {
      id: 2,
      label: "Topic 필터 탭",
      description:
        "저장소 목록을 Topic(Pipeline, Manifest, Artifact) 유형별로 필터링합니다. '전체' 선택 시 모든 유형이 표시됩니다.",
    },
    {
      id: 3,
      label: "연결 상태 필터",
      description:
        "연결 상태(Successful, Failed, Unknown, Unmanaged)별로 목록을 필터링합니다.",
    },
    {
      id: 4,
      label: "검색 기준 선택",
      description:
        "키워드 검색의 대상 필드를 선택합니다.\n• 이름 (기본)\n• Topic\n• 저장소 그룹",
    },
    {
      id: 5,
      label: "키워드 검색",
      description:
        "4번에서 선택한 검색 기준(이름, Topic, 저장소 그룹)을 대상으로 키워드를 입력하여 저장소 목록을 필터링합니다. 입력 즉시 검색이 수행됩니다.",
    },
    {
      id: 6,
      label: "저장소 생성",
      description:
        "새로운 배포 저장소를 생성합니다. 클릭 시 저장소 생성(CCP-GIT-002) 화면으로 이동합니다.",
    },
    {
      id: 7,
      label: "새로고침",
      description:
        "저장소 목록 데이터를 서버에서 다시 조회하여 최신 상태로 갱신합니다.",
    },
    {
      id: 8,
      label: "저장소 목록 테이블",
      description:
        "등록된 배포 저장소를 연결 상태, Topic, 이름, 저장소 그룹, 마지막 수정 시간 순으로 표시합니다. 행 클릭 시 해당 저장소의 상세(CCP-GIT-004) 화면으로 이동합니다.",
    },
    {
      id: 9,
      label: "더보기 메뉴",
      description:
        "각 저장소에 대한 추가 작업(애플리케이션 생성, 연결해제)을 수행할 수 있는 컨텍스트 메뉴를 표시합니다.",
    },
    {
      id: 10,
      label: "컨텍스트 메뉴",
      description:
        "더보기 아이콘 클릭 시 표시되는 팝업 메뉴입니다.\n• 애플리케이션 생성: 해당 저장소에 연결된 애플리케이션을 생성합니다.\n• 설정: 해당 저장소의 상세 화면 설정 탭으로 이동합니다.\n• 연결: GitOps(ArgoCD)에 저장소를 연결합니다. (Unmanaged 상태에서만 활성화)\n• 연결해제: GitOps(ArgoCD) 연결을 해제합니다. (연결된 상태에서만 활성화)\n• 삭제: GitOps(ArgoCD) 저장소 연결해제 및 Gitea 저장소가 삭제됩니다.",
    },
    {
      id: 11,
      label: "페이지네이션",
      description:
        "저장소 목록이 한 페이지에 표시할 수 있는 수를 초과할 경우 페이지 단위로 탐색합니다.",
    },
  ],
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
          { label: "배포 애플리케이션" },
          { label: "배포 저장소", active: true, bold: true },
          { label: "소스 저장소" },
          { label: "저장소 그룹" },
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
  isTemplate?: boolean;
  project: string;
  updatedAt: string;
}

const tableData: RepoRow[] = [
  {
    id: "1",
    connectionColor: "#00b30e",
    topic: "Pipeline",
    topicVariant: "info",
    name: "app1-maven-pipeline",
    project: "app-cicd",

    updatedAt: "3h",
  },
  {
    id: "2",
    connectionColor: "#00b30e",
    topic: "Manifest",
    topicVariant: "success",
    name: "app1-gitops",
    isTemplate: true,
    project: "app-cicd",

    updatedAt: "1d",
  },
  {
    id: "3",
    connectionColor: "#da1e28",
    topic: "Pipeline",
    topicVariant: "info",
    name: "app2-gradle-pipeline",
    project: "app-cicd",

    updatedAt: "2d",
  },
  {
    id: "4",
    connectionColor: "#00b30e",
    topic: "Artifact",
    topicVariant: "warning",
    name: "app2-artifact-registry",
    project: "app-cicd",

    updatedAt: "3d",
  },
  {
    id: "5",
    connectionColor: "#6d7073",
    topic: "Manifest",
    topicVariant: "success",
    name: "app3-gitops",
    isTemplate: true,
    project: "infra-ops",

    updatedAt: "5d",
  },
  {
    id: "6",
    connectionColor: "#7300ff",
    topic: "Pipeline",
    topicVariant: "info",
    name: "sample-reactnpm-nginx-pipeline",
    project: "sample-cicd",

    updatedAt: "7d",
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
        <span className="flex items-center gap-1.5">
          {row.name}
          {row.isTemplate && (
            <Badge variant="gray-label" size="sm">템플릿</Badge>
          )}
        </span>
      </TextCell>
    ),
  },
  {
    id: "project",
    header: "저장소 그룹",
    width: "140px",
    align: "center",
    render: (row) => <TextCell color="#555555">{row.project}</TextCell>,
  },
{
    id: "updatedAt",
    header: "마지막 수정",
    width: "160px",
    align: "center",
    render: (row) => <TextCell color="#555555">{row.updatedAt}</TextCell>,
  },
  {
    id: "actions",
    header: "",
    width: "60px",
    fixed: true,
    align: "center",
    render: (row) => (
      <Button data-annotation-id={row.id === "1" ? "9" : undefined} variant="icon" size="icon" aria-label="더보기">
        <MoreHorizontal className="w-4 h-4 text-[#333333]" />
      </Button>
    ),
  },
];

const contextMenuItems: ContextMenuEntry[] = [
  { id: "create-app", label: "애플리케이션 생성", icon: <Link2 className="w-4 h-4" /> },
  { id: "settings", label: "설정", icon: <Settings className="w-4 h-4" /> },
  { id: "connect", label: "연결", icon: <Link2 className="w-4 h-4" /> },
  {
    id: "disconnect",
    label: "연결해제",
    icon: <Unlink className="w-4 h-4" />,
    textColor: "text-[#da1e28]",
  },
  { id: "divider", type: "divider" },
  {
    id: "delete",
    label: "삭제",
    icon: <Trash2 className="w-4 h-4" />,
    textColor: "text-[#da1e28]",
  },
];

// ─── Slide ──────────────────────────────────────────────────────────────────

export default function Slide01RepositoryList() {
  return (
    <CcpDashboardLayout
      breadcrumbs={[
        { label: "홈" },
        { label: "GitOps" },
        { label: "배포 저장소", isBold: true },
      ]}
      title="배포 저장소 목록"
      sideMenuItems={sideMenuItems}
    >
      <ContentSection card data-annotation-id="1">
        <StatusSummary
          tabs={[
            { id: "gitops", label: "GitOps 연결 현황", count: 60 },
          ]}
          activeTabId="gitops"
          cards={[]}
          cardsByTab={{
            gitops: [
              { label: "Successful", count: 42, color: "#00b30e" },
              { label: "Failed", count: 8, color: "#da1e28" },
              { label: "Unknown", count: 5, color: "#6d7073" },
              { label: "Unmanaged", count: 5, color: "#7300ff" },
            ],
          }}
        />
      </ContentSection>

      <ContentSection relative>
        <FilterBar className="gap-2">
          <div data-annotation-id="2" className="mr-auto">
            <Tabs
              variant="pill"
              items={[
                { id: "all", label: "전체" },
                { id: "pipeline", label: "Pipeline" },
                { id: "manifest", label: "Manifest" },
                { id: "artifact", label: "Artifact" },
              ]}
              activeId="all"
            />
          </div>
          <div data-annotation-id="3">
            <Select
              label="연결 상태"
              options={[
                { value: "", label: "전체" },
                { value: "connected", label: "Successful" },
                { value: "disconnected", label: "Failed" },
                { value: "unknown", label: "Unknown" },
                { value: "unmanaged", label: "Unmanaged" },
              ]}
            />
          </div>
          <div data-annotation-id="4">
            <Select
              label="이름"
              options={[
                { value: "name", label: "이름" },
                { value: "topic", label: "Topic" },
                { value: "group", label: "저장소 그룹" },
              ]}
            />
          </div>
          <div data-annotation-id="5">
            <SearchInput placeholder="키워드 검색" className="mr-1" />
          </div>
          <Button data-annotation-id="6" variant="primary" size="md">
            <Plus className="w-4 h-4 mr-1.5" />
            생성
          </Button>
          <Button data-annotation-id="7" variant="primary" size="md">
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            새로고침
          </Button>
        </FilterBar>

        <DataTable
          data-annotation-id="8"
          columns={columns}
          data={tableData}
          selectedIds={new Set()}
          onSelectionChange={() => {}}
        />

        <Overlay top={108} right={0} data-annotation-id="10">
          <ContextMenu items={contextMenuItems} className="w-[180px]" />
        </Overlay>

        <div data-annotation-id="11">
          <Pagination
            currentPage={1}
            totalPages={32}
            visiblePages={[1, 2, 3, 4, 5]}
            itemsPerPage={10}
            onItemsPerPageChange={() => {}}
            className="mt-5 pb-10"
          />
        </div>
      </ContentSection>
    </CcpDashboardLayout>
  );
}
