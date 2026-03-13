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
  Trash2,
} from "lucide-react";
import {
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
  TextCell,
} from "../../_components";
import type {
  SideMenuItem,
  DataTableColumn,
  ContextMenuEntry,
} from "../../_components";
import type { SlideMeta } from "@entities/document";

export const slideMeta: SlideMeta = {
  screenId: "CCP-GIT-019",
  title: "소스 저장소 목록 (모달 없음)",
  section: "GitOps 소스 저장소",
  annotations: [
    {
      id: 1,
      label: "검색 기준 선택",
      description:
        "키워드 검색의 대상 필드를 선택합니다.\n• 이름 (기본)\n• 저장소 그룹",
    },
    {
      id: 2,
      label: "키워드 검색",
      description:
        "저장소 이름을 기준으로 키워드 검색을 수행합니다. 입력 즉시 결과가 필터링됩니다.",
    },
    {
      id: 3,
      label: "저장소 생성",
      description:
        "새로운 소스 저장소를 생성합니다. 클릭 시 저장소 연결(CCP-GIT-020) 화면으로 이동합니다.",
    },
    {
      id: 4,
      label: "저장소 목록 테이블",
      description:
        "등록된 소스 저장소를 이름, 저장소 그룹, 마지막 수정 시간 순으로 표시합니다. 행 클릭 시 해당 저장소의 상세(CCP-GIT-022) 화면으로 이동합니다.",
    },
    {
      id: 5,
      label: "더보기 메뉴",
      description:
        "각 저장소에 대한 추가 작업을 수행할 수 있는 컨텍스트 메뉴를 표시합니다.",
    },
    {
      id: 6,
      label: "컨텍스트 메뉴",
      description:
        "더보기 아이콘 클릭 시 표시되는 팝업 메뉴입니다.\n• 설정: 해당 저장소의 상세 화면 설정 탭으로 이동합니다.\n• 삭제: 저장소 삭제 확인 모달을 표시합니다.",
    },
    {
      id: 7,
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
          { label: "배포 저장소" },
          { label: "소스 저장소", active: true, bold: true },
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
  name: string;
  project: string;
  namespace: string;
  updatedAt: string;
}

const tableData: RepoRow[] = [
  {
    id: "1",
    name: "app1-backend",
    project: "app",
    namespace: "app",
    updatedAt: "2h",
  },
  {
    id: "2",
    name: "app1-frontend",
    project: "app",
    namespace: "app",
    updatedAt: "5h",
  },
  {
    id: "3",
    name: "app2-api-server",
    project: "app",
    namespace: "app",
    updatedAt: "1d",
  },
  {
    id: "4",
    name: "app3-batch-worker",
    project: "app",
    namespace: "app",
    updatedAt: "3d",
  },
  {
    id: "5",
    name: "sample-reactnpm-nginx",
    project: "app",
    namespace: "app",
    updatedAt: "5d",
  },
];

const columns: DataTableColumn<RepoRow>[] = [
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
      <Button data-annotation-id={row.id === "1" ? "5" : undefined} variant="icon" size="icon" aria-label="더보기">
        <MoreHorizontal className="w-4 h-4 text-[#333333]" />
      </Button>
    ),
  },
];

const contextMenuItems: ContextMenuEntry[] = [
  { id: "settings", label: "설정", icon: <Settings className="w-4 h-4" /> },
  { id: "divider", type: "divider" },
  {
    id: "delete",
    label: "삭제",
    icon: <Trash2 className="w-4 h-4" />,
    textColor: "text-[#da1e28]",
  },
];

// ─── Slide ──────────────────────────────────────────────────────────────────

export default function Slide01bSourceRepositoryList() {
  return (
    <CcpDashboardLayout
      breadcrumbs={[
        { label: "홈" },
        { label: "GitOps" },
        { label: "소스 저장소", isBold: true },
      ]}
      title="소스 저장소 목록"
      sideMenuItems={sideMenuItems}
    >
      <ContentSection relative>
        <FilterBar className="gap-2">
          <div data-annotation-id="1">
            <Select
              label="이름"
              options={[
                { value: "name", label: "이름" },
                { value: "group", label: "저장소 그룹" },
              ]}
            />
          </div>
          <div data-annotation-id="2">
            <SearchInput placeholder="키워드 검색" className="mr-1" />
          </div>
          <Button data-annotation-id="3" variant="primary" size="md">
            <Plus className="w-4 h-4 mr-1.5" />
            생성
          </Button>
          <Button variant="primary" size="md">
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            새로고침
          </Button>
        </FilterBar>

        <DataTable
          data-annotation-id="4"
          columns={columns}
          data={tableData}
          selectedIds={new Set()}
          onSelectionChange={() => {}}
        />

        <Overlay top={108} right={0} data-annotation-id="6">
          <ContextMenu items={contextMenuItems} className="w-[180px]" />
        </Overlay>

        <div data-annotation-id="7">
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
