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
} from "lucide-react";
import {
  Badge,
  Button,
  CcpDashboardLayout,
  ContentSection,
  DataTable,
  FilterBar,
  Pagination,
  SearchInput,
  Select,
  TextCell,
  SidebarTenantIcon,
  SidebarConnectionIcon,
  SidebarServiceMeshIcon,
  createSideMenuItems,
} from "../../_components";
import type {
  SideMenuItem,
  DataTableColumn,
} from "../../_components";
import type { SlideMeta } from "@entities/document";

export const slideMeta: SlideMeta = {
  screenId: "CCP-GIT-033",
  title: "소스 저장소 목록 (보관 표시)",
  section: "GitOps 소스 저장소",
  annotations: [
    {
      id: 1,
      label: "그룹 필터",
      description:
        "저장소 그룹별로 목록을 필터링합니다. '전체'를 선택하면 모든 그룹의 저장소가 표시됩니다.",
    },
    {
      id: 2,
      label: "키워드 검색",
      description:
        "저장소 이름을 기준으로 키워드 검색을 수행합니다.",
    },
    {
      id: 3,
      label: "저장소 생성",
      description:
        "새로운 소스 저장소를 생성합니다. 클릭 시 저장소 연결 화면으로 이동합니다.",
    },
    {
      id: 4,
      label: "보관 뱃지",
      description:
        "보관된 저장소는 이름 옆에 '보관' 뱃지가 표시됩니다. 해당 저장소는 읽기 전용 상태이며 커밋/푸시가 차단됩니다.",
    },
    {
      id: 5,
      label: "저장소 목록 테이블",
      description:
        "등록된 소스 저장소를 이름, 그룹, 네임스페이스, 마지막 수정 시간 순으로 표시합니다. 보관된 저장소도 함께 표시됩니다.",
    },
    {
      id: 6,
      label: "더보기 메뉴",
      description:
        "각 저장소에 대한 추가 작업(편집, 보관 해제, 삭제 등)을 수행할 수 있는 컨텍스트 메뉴를 표시합니다.",
    },
    {
      id: 7,
      label: "페이지네이션",
      description:
        "저장소 목록이 한 페이지에 표시할 수 있는 수를 초과할 경우 페이지 단위로 탐색합니다.",
    },
  ],
};

// ─── Table Data ─────────────────────────────────────────────────────────────

interface RepoRow {
  id: string;
  name: string;
  project: string;
  namespace: string;
  updatedAt: string;
  archived?: boolean;
}

const tableData: RepoRow[] = [
  {
    id: "1",
    name: "app1-backend",
    project: "app",
    namespace: "app",
    updatedAt: "2h",
    archived: true,
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
        <span className="flex items-center gap-2">
          {row.name}
          {row.archived && (
            <span data-annotation-id="4">
            <Badge variant="gray-solid" size="sm">
              보관
            </Badge>
            </span>
          )}
        </span>
      </TextCell>
    ),
  },
  {
    id: "project",
    header: "그룹",
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
    render: () => (
      <Button data-annotation-id="6" variant="icon" size="icon" aria-label="더보기">
        <MoreHorizontal className="w-4 h-4 text-[#333333]" />
      </Button>
    ),
  },
];

// ─── Slide ──────────────────────────────────────────────────────────────────

export default function Slide14SourceRepositoryListArchived() {
  return (
    <CcpDashboardLayout
      breadcrumbs={[
        { label: "홈" },
        { label: "GitOps" },
        { label: "소스 저장소", isBold: true },
      ]}
      title="소스 저장소 목록"
      sideMenuItems={createSideMenuItems({ activeId: "gitops", activeLabel: "소스 저장소" })}
    >
      <ContentSection relative>
        <FilterBar className="gap-2">
          <div data-annotation-id="1">
          <Select
            label="그룹"
            options={[
              { value: "", label: "전체" },
              { value: "app", label: "app" },
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
          data-annotation-id="5"
          columns={columns}
          data={tableData}
          selectedIds={new Set()}
          onSelectionChange={() => {}}
        />

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
