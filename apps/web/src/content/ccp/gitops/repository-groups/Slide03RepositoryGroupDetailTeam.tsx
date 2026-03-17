import {
  LayoutDashboard,
  Layers,
  AppWindow,
  GitBranch,
  Settings,
  GitCompare,
  MoreHorizontal,
  Plus,
  Pencil,
  Shield,
  Trash2,
  Users,
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
  screenId: "CCP-GIT-013",
  title: "저장소 그룹 상세 - 팀 관리",
  section: "GitOps 저장소 그룹",
  annotations: [
    {
      id: 1,
      label: "그룹 타이틀 / 뱃지",
      description:
        "저장소 그룹의 이름과 공개 범위(Private/Public)를 헤더에 표시합니다. 뱃지는 그룹의 공개 범위 설정에 따라 자동으로 변경됩니다.",
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
        "기본정보, 저장소, 팀 탭을 전환합니다. 현재 '팀' 탭이 활성화되어 그룹에 속한 팀 목록을 표시합니다.",
    },
    {
      id: 4,
      label: "팀 검색",
      description:
        "그룹 내 팀을 이름이나 설명으로 필터링합니다. 입력 시 실시간으로 목록이 필터링됩니다.",
    },
    {
      id: 5,
      label: "새 팀 버튼",
      description:
        "그룹에 새로운 팀을 추가합니다. 클릭 시 팀 생성 폼으로 이동합니다.",
    },
    {
      id: 6,
      label: "팀 카드 리스트",
      description:
        "그룹에 속한 팀을 카드 형태로 표시합니다. 각 카드에는 팀명, 설명, 구성원 수, 추가 일시가 표시되며, 호버 시 편집 및 삭제 버튼이 나타납니다.",
    },
  ],
};

// ─── 권한 뱃지 ──────────────────────────────────────────────────────────────

type Permission = "owner" | "admin" | "write" | "read";

const permissionMeta: Record<Permission, { label: string; variant: string; desc: string }> = {
  owner: { label: "Owner", variant: "blue-solid", desc: "모든 권한 + 그룹 삭제" },
  admin: { label: "Admin", variant: "green-solid", desc: "설정 변경 + 팀/저장소 관리" },
  write: { label: "Write", variant: "yellow-label", desc: "저장소 읽기/쓰기" },
  read: { label: "Read", variant: "neutral", desc: "저장소 읽기 전용" },
};

function PermissionBadge({ permission }: { permission: Permission }) {
  const meta = permissionMeta[permission];
  return (
    <Badge variant={meta.variant as any} size="sm">
      {meta.label}
    </Badge>
  );
}

// ─── 팀 데이터 ──────────────────────────────────────────────────────────────

interface TeamRow {
  id: string;
  name: string;
  description: string;
  permission: Permission;
  memberCount: number;
  addedAt: string;
  addedBy: string;
}

const teamData: TeamRow[] = [
  {
    id: "t-001",
    name: "platform-admins",
    description: "플랫폼 관리자 팀",
    permission: "owner",
    memberCount: 3,
    addedAt: "2024-01-10 09:00",
    addedBy: "admin",
  },
  {
    id: "t-002",
    name: "devops-team",
    description: "DevOps 엔지니어링 팀",
    permission: "admin",
    memberCount: 5,
    addedAt: "2024-01-12 10:30",
    addedBy: "admin",
  },
  {
    id: "t-003",
    name: "backend-developers",
    description: "백엔드 개발 팀",
    permission: "write",
    memberCount: 12,
    addedAt: "2024-01-15 14:00",
    addedBy: "홍길동",
  },
  {
    id: "t-004",
    name: "frontend-developers",
    description: "프론트엔드 개발 팀",
    permission: "write",
    memberCount: 8,
    addedAt: "2024-01-15 14:05",
    addedBy: "홍길동",
  },
  {
    id: "t-005",
    name: "qa-team",
    description: "QA 및 테스트 팀",
    permission: "read",
    memberCount: 4,
    addedAt: "2024-01-20 11:00",
    addedBy: "김영희",
  },
  {
    id: "t-006",
    name: "security-auditors",
    description: "보안 감사 팀",
    permission: "read",
    memberCount: 2,
    addedAt: "2024-02-01 09:30",
    addedBy: "admin",
  },
];

// ─── 팀 카드 ────────────────────────────────────────────────────────────────

function TeamCard({ team }: { team: TeamRow }) {
  return (
    <div className="flex items-center gap-4 px-4 py-3.5 rounded-lg border border-[#eee] bg-white hover:bg-[#f8f9fb] hover:border-[#d8dde3] transition-all group">
      {/* 아이콘 */}
      <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-[#f0f4f8] flex items-center justify-center">
        <Users className="w-4.5 h-4.5 text-[#5a6a7e]" />
      </div>

      {/* 팀 정보 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-[#222] truncate">{team.name}</span>
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="text-[12px] text-[#888]">{team.description}</span>
          <span className="text-[11px] text-[#bbb]">·</span>
          <span className="text-[12px] text-[#888]">{team.memberCount}명</span>
        </div>
      </div>

      {/* 추가 정보 */}
      <div className="flex-shrink-0 text-right hidden md:block">
        <span className="text-[12px] text-[#999]">{team.addedAt}</span>
        <div className="text-[11px] text-[#bbb] mt-0.5">by {team.addedBy}</div>
      </div>

      {/* 액션 */}
      <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#e8ebef] text-[#888] cursor-pointer"
          title="편집"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#fde8e8] text-[#888] hover:text-[#da1e28] cursor-pointer"
          title="팀 제거"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ─── 권한 요약 카드 ─────────────────────────────────────────────────────────

function PermissionSummary() {
  const counts = {
    owner: teamData.filter((t) => t.permission === "owner").length,
    admin: teamData.filter((t) => t.permission === "admin").length,
    write: teamData.filter((t) => t.permission === "write").length,
    read: teamData.filter((t) => t.permission === "read").length,
  };

  return (
    <div className="flex items-center gap-4">
      {(Object.entries(counts) as [Permission, number][]).map(([perm, count]) => (
        <div key={perm} className="flex items-center gap-1.5">
          <PermissionBadge permission={perm} />
          <span className="text-[13px] font-bold text-[#333]">{count}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Slide03RepositoryGroupDetailTeam() {
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
          activeId="teams"
          className="mb-0"
        />
        </div>
      </ContentSection>

      {/* 팀 관리 콘텐츠 */}
      <ContentSection spacing="md">
        {/* 상단 액션 바 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="relative" data-annotation-id="4">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#999]" />
              <input
                type="text"
                placeholder="팀 검색"
                className="h-[32px] w-[200px] pl-8 pr-3 text-[13px] text-[#333] bg-white rounded border border-[#ddd] outline-none placeholder:text-[#999] focus:border-[#0077ff]"
              />
            </div>
            <Button size="sm" variant="primary" data-annotation-id="5">
              <Plus className="w-3.5 h-3.5 mr-1" />
              새 팀
            </Button>
          </div>
        </div>

        {/* 팀 카드 리스트 */}
        <div className="space-y-2" data-annotation-id="6">
          {teamData.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      </ContentSection>

    </CcpDashboardLayout>
  );
}
