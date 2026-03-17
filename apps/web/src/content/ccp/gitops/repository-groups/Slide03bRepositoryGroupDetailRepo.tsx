import {
  LayoutDashboard,
  Layers,
  AppWindow,
  GitBranch,
  Settings,
  GitCompare,
  MoreHorizontal,
  Plus,
  BookCopy,
  Search,
} from "lucide-react";
import {
  Badge,
  Button,
  CcpDashboardLayout,
  ContentSection,
  Tabs,
  SidebarTenantIcon,
  SidebarConnectionIcon,
  SidebarServiceMeshIcon,
  createSideMenuItems,
} from "../../_components";
import type { SlideMeta } from "@entities/document";

export const slideMeta: SlideMeta = {
  screenId: "CCP-GIT-017",
  title: "저장소 그룹 상세 - 저장소",
  section: "GitOps 저장소 그룹",
  links: [
    { targetScreenId: "CCP-GIT-004", type: "navigate", label: "저장소 상세" },
    { targetScreenId: "CCP-GIT-002", type: "navigate", label: "저장소 추가" },
  ],
  annotations: [
    {
      id: 1,
      label: "그룹 타이틀 / 뱃지",
      description:
        "저장소 그룹의 이름(Gitea 조직명)과 공개 범위(Private/Public) 뱃지를 표시합니다. 공개 범위는 그룹 설정에 따라 자동 반영됩니다.",
    },
    {
      id: 2,
      label: "더보기 메뉴",
      description:
        "그룹에 대한 추가 작업(편집, 삭제 등)을 수행할 수 있는 컨텍스트 메뉴를 표시합니다.",
    },
    {
      id: 3,
      label: "탭 네비게이션",
      description:
        "기본정보(CCP-GIT-016), 저장소, 팀(CCP-GIT-018) 탭을 전환합니다. 현재 '저장소' 탭이 활성화되어 그룹에 속한 저장소 목록을 표시합니다.",
    },
    {
      id: 4,
      label: "저장소 검색",
      description:
        "그룹 내 저장소를 이름 또는 설명으로 실시간 필터링합니다. 입력 즉시 검색이 수행됩니다.",
    },
    {
      id: 5,
      label: "저장소 추가",
      description:
        "이 그룹에 새로운 저장소를 추가합니다. 클릭 시 저장소 생성(CCP-GIT-002) 화면으로 이동하며, 저장소 그룹이 현재 그룹으로 자동 설정됩니다.",
    },
    {
      id: 6,
      label: "저장소 카드 리스트",
      description:
        "그룹에 속한 저장소를 카드 형태로 표시합니다. 각 카드에는 조직/저장소명, 설명, 공개 범위(Private/Public) 뱃지가 표시됩니다. 카드 클릭 시 해당 저장소 상세(CCP-GIT-004) 화면으로 이동합니다.",
    },
  ],
};

// ─── 저장소 데이터 ──────────────────────────────────────────────────────────

interface RepoRow {
  id: string;
  org: string;
  name: string;
  description: string;
  updatedAt: string;
  visibility: "private" | "public";
}

const repoData: RepoRow[] = [
  {
    id: "r-001",
    org: "cone-chain",
    name: "cone-chain",
    description: "CONE-Chain 메인 저장소",
    updatedAt: "2024-02-10",
    visibility: "private",
  },
  {
    id: "r-002",
    org: "cone-chain",
    name: "devops-bootstrap",
    description: "DevOps 부트스트랩 및 초기화 스크립트",
    updatedAt: "2024-02-08",
    visibility: "private",
  },
  {
    id: "r-003",
    org: "cone-chain",
    name: "gy-cone-chain",
    description: "GY CONE-Chain 배포 구성",
    updatedAt: "2024-02-05",
    visibility: "private",
  },
  {
    id: "r-004",
    org: "cone-chain",
    name: "ccp-frontend",
    description: "CCP 프론트엔드 애플리케이션",
    updatedAt: "2024-02-12",
    visibility: "private",
  },
];

// ─── 저장소 카드 ────────────────────────────────────────────────────────────

function RepoCard({ repo }: { repo: RepoRow }) {
  return (
    <div className="flex items-center gap-4 px-4 py-3.5 rounded-lg border border-[#eee] bg-white hover:bg-[#f8f9fb] hover:border-[#d8dde3] transition-all group">
      {/* 아이콘 */}
      <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-[#f0f4f8] flex items-center justify-center">
        <BookCopy className="w-4.5 h-4.5 text-[#5a6a7e]" />
      </div>

      {/* 저장소 정보 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <a
            href="#"
            className="text-[13px] font-bold text-[#0077ff] hover:underline truncate"
            onClick={(e) => e.preventDefault()}
          >
            {repo.org}/{repo.name}
          </a>
          <Badge variant="neutral" size="sm">
            {repo.visibility === "private" ? "Private" : "Public"}
          </Badge>
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="text-[12px] text-[#888]">{repo.description}</span>
        </div>
      </div>

    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Slide03bRepositoryGroupDetailRepo() {
  return (
    <CcpDashboardLayout
      breadcrumbs={[
        { label: "홈" },
        { label: "GitOps" },
        { label: "저장소 그룹", isBold: true },
      ]}
      title={
        <span className="inline-flex items-center gap-2" data-annotation-id="1">
          <span>app-cicd</span>
          <Badge variant="neutral">Private</Badge>
        </span>
      }
      sideMenuItems={createSideMenuItems({ activeId: "gitops", activeLabel: "저장소 그룹" })}
      headerActions={
        <button
          type="button"
          className="flex items-center justify-center w-8 h-8 rounded hover:bg-[#f0f0f0] text-[#666]"
          data-annotation-id="2"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      }
    >
      {/* 탭 */}
      <ContentSection>
        <div data-annotation-id="3">
        <Tabs
          items={[
            { id: "basic", label: "기본정보" },
            { id: "repos", label: "저장소" },
            { id: "teams", label: "팀" },
          ]}
          activeId="repos"
          className="mb-0"
        />
        </div>
      </ContentSection>

      {/* 저장소 관리 콘텐츠 */}
      <ContentSection spacing="md">
        {/* 상단 액션 바 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="relative" data-annotation-id="4">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#999]" />
              <input
                type="text"
                placeholder="저장소 검색"
                className="h-[32px] w-[200px] pl-8 pr-3 text-[13px] text-[#333] bg-white rounded border border-[#ddd] outline-none placeholder:text-[#999] focus:border-[#0077ff]"
              />
            </div>
            <Button size="sm" variant="primary" data-annotation-id="5">
              <Plus className="w-3.5 h-3.5 mr-1" />
              저장소 추가
            </Button>
          </div>
        </div>

        {/* 저장소 카드 리스트 */}
        <div className="space-y-2" data-annotation-id="6">
          {repoData.map((repo) => (
            <RepoCard key={repo.id} repo={repo} />
          ))}
        </div>
      </ContentSection>
    </CcpDashboardLayout>
  );
}
