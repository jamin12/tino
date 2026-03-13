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
  TextCell,
} from "../../_components";
import type {
  SideMenuItem,
  DataTableColumn,
  ContextMenuEntry,
} from "../../_components";
import type { SlideMeta } from "@entities/document";

export const slideMeta: SlideMeta = {
  screenId: "CCP-GIT-011",
  title: "저장소 그룹 목록",
  section: "GitOps 저장소 그룹",
  annotations: [
    {
      id: 1,
      label: "그룹 검색",
      description:
        "그룹 이름 기준으로 목록을 필터링합니다. 입력 즉시 테이블이 갱신되어 일치하는 그룹만 표시됩니다.",
    },
    {
      id: 2,
      label: "그룹 생성",
      description:
        "새로운 저장소 그룹을 생성합니다. 그룹 이름, 설명, 공개 범위, 팀 액세스 관리 허용 여부를 설정할 수 있습니다.",
    },
    {
      id: 3,
      label: "새로고침",
      description:
        "저장소 그룹 목록을 서버에서 다시 조회하여 최신 상태로 갱신합니다.",
    },
    {
      id: 4,
      label: "저장소 그룹 테이블",
      description:
        "등록된 저장소 그룹을 목록으로 표시합니다. 그룹 이름, 설명, 공개 범위, 팀 액세스 관리 허용 여부를 확인할 수 있으며, 행 클릭 시 그룹 상세 페이지로 이동합니다.",
    },
    {
      id: 5,
      label: "공개 범위",
      description:
        "그룹의 접근 범위를 나타냅니다. '공개'는 모든 사용자가 접근 가능하고, '비공개'는 권한이 부여된 사용자만 접근 가능합니다.",
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
          { label: "소스 저장소" },
          { label: "저장소 그룹", active: true, bold: true },
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

interface GroupRow {
  id: string;
  name: string;
  description: string;
  repoCount: number;
  visibility: "private" | "public";
  repoAdminChangeTeamAccess: boolean;
}

const tableData: GroupRow[] = [
  {
    id: "1",
    name: "app-cicd",
    description: "애플리케이션 CI/CD 저장소 그룹",
    repoCount: 4,
    visibility: "private",
    repoAdminChangeTeamAccess: true,
  },
  {
    id: "2",
    name: "infra-ops",
    description: "인프라 운영 저장소 그룹",
    repoCount: 1,
    visibility: "private",
    repoAdminChangeTeamAccess: false,
  },
  {
    id: "3",
    name: "sample-cicd",
    description: "샘플 CI/CD 파이프라인 저장소 그룹",
    repoCount: 1,
    visibility: "public",
    repoAdminChangeTeamAccess: true,
  },
];

const columns: DataTableColumn<GroupRow>[] = [
  {
    id: "name",
    header: "그룹 이름",
    width: "200px",
    render: (row) => (
      <TextCell bold color="#111111" className="px-4">
        {row.name}
      </TextCell>
    ),
  },
  {
    id: "description",
    header: "설명",
    width: "300px",
    render: (row) => <TextCell color="#555555" className="px-2">{row.description}</TextCell>,
  },
  {
    id: "visibility",
    header: "공개 범위",
    width: "110px",
    align: "center",
    render: (row) => (
      <Badge
        variant={row.visibility === "private" ? "neutral" : "success"}
        size="sm"
        {...(row.id === "1" ? { "data-annotation-id": "5" } : {})}
      >
        {row.visibility === "private" ? "비공개" : "공개"}
      </Badge>
    ),
  },
  {
    id: "repoAdminChangeTeamAccess",
    header: "팀 액세스 관리",
    width: "130px",
    align: "center",
    render: (row) => (
      <Badge
        variant={row.repoAdminChangeTeamAccess ? "success" : "neutral"}
        size="sm"
      >
        {row.repoAdminChangeTeamAccess ? "허용" : "비허용"}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "",
    width: "60px",
    fixed: true,
    align: "center",
    render: (row) => (
      <Button data-annotation-id={row.id === "1" ? "6" : undefined} variant="icon" size="icon" aria-label="더보기">
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

export default function Slide11RepositoryGroupList() {
  return (
    <CcpDashboardLayout
      breadcrumbs={[
        { label: "홈" },
        { label: "GitOps" },
        { label: "저장소 그룹", isBold: true },
      ]}
      title="저장소 그룹 목록"
      sideMenuItems={sideMenuItems}
    >
      <ContentSection relative>
        <FilterBar className="gap-2">
          <SearchInput placeholder="그룹 검색" className="mr-auto" data-annotation-id="1" />
          <Button variant="primary" size="md" data-annotation-id="2">
            <Plus className="w-4 h-4 mr-1.5" />
            그룹 생성
          </Button>
          <Button variant="primary" size="md" data-annotation-id="3">
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            새로고침
          </Button>
        </FilterBar>

        <DataTable
          columns={columns}
          data={tableData}
          selectedIds={new Set()}
          onSelectionChange={() => {}}
          data-annotation-id="4"
        />

        <Overlay top={108} right={0} data-annotation-id="7">
          <ContextMenu items={contextMenuItems} className="w-[180px]" />
        </Overlay>

        <Pagination
          currentPage={1}
          totalPages={1}
          visiblePages={[1]}
          className="mt-5 pb-10"
        />
      </ContentSection>
    </CcpDashboardLayout>
  );
}
