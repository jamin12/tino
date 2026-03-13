import { useState } from "react";
import {
  LayoutDashboard,
  Layers,
  AppWindow,
  GitBranch,
  Settings,
  GitCompare,
  MoreHorizontal,
  Users,
  BookCopy,
  Search,
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
} from "lucide-react";
import {
  Badge,
  Button,
  CcpDashboardLayout,
  ContentSection,
  Tabs,
} from "../../_components";
import type { SideMenuItem } from "../../_components";
import type { SlideMeta } from "@entities/document";

export const slideMeta: SlideMeta = {
  screenId: "CCP-GIT-016",
  title: "팀 상세",
  section: "GitOps 저장소 그룹",
  annotations: [
    {
      id: 1,
      label: "그룹 타이틀 / 뱃지",
      description:
        "저장소 그룹의 이름과 공개 범위(Private/Public)를 헤더에 표시합니다.",
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
        "기본정보, 저장소, 팀 탭을 전환합니다. 현재 '팀' 탭이 활성화되어 팀 관리 뷰를 표시합니다.",
    },
    {
      id: 4,
      label: "팀 검색 / 팀 추가",
      description:
        "좌측 팀 목록을 검색하거나 새 팀을 추가합니다. 팀 추가 버튼 클릭 시 팀 생성 폼으로 이동합니다.",
    },
    {
      id: 5,
      label: "팀 목록",
      description:
        "그룹에 속한 팀을 리스트로 표시합니다. 팀을 클릭하면 우측에 해당 팀의 상세 정보가 표시되며, 다시 클릭하면 상세 패널이 닫힙니다.",
    },
    {
      id: 6,
      label: "팀 상세 헤더",
      description:
        "선택된 팀의 이름, 설명을 표시하며, 뒤로 가기, 편집, 삭제 버튼을 제공합니다. 편집 클릭 시 팀 편집 폼으로, 삭제 클릭 시 팀 제거 확인으로 이동합니다.",
    },
    {
      id: 7,
      label: "상세 탭 (구성원/저장소)",
      description:
        "팀의 구성원 목록과 접근 가능한 저장소 목록을 전환합니다. 각 탭에는 해당 항목의 개수가 표시됩니다.",
    },
    {
      id: 8,
      label: "구성원/저장소 패널",
      description:
        "구성원 탭에서는 팀 멤버 목록과 검색, 추가, 제거 기능을 제공합니다. 저장소 탭에서는 팀이 접근 가능한 저장소 목록을 표시하며, 클릭 시 해당 저장소로 이동합니다.",
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

// ─── 팀 데이터 ──────────────────────────────────────────────────────────────

interface TeamRow {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  addedAt: string;
  addedBy: string;
}

const teamData: TeamRow[] = [
  { id: "t-001", name: "platform-admins", description: "플랫폼 관리자 팀", memberCount: 3, addedAt: "2024-01-10 09:00", addedBy: "admin" },
  { id: "t-002", name: "devops-team", description: "DevOps 엔지니어링 팀", memberCount: 5, addedAt: "2024-01-12 10:30", addedBy: "admin" },
  { id: "t-003", name: "backend-developers", description: "백엔드 개발 팀", memberCount: 12, addedAt: "2024-01-15 14:00", addedBy: "홍길동" },
  { id: "t-004", name: "frontend-developers", description: "프론트엔드 개발 팀", memberCount: 8, addedAt: "2024-01-15 14:05", addedBy: "홍길동" },
  { id: "t-005", name: "qa-team", description: "QA 및 테스트 팀", memberCount: 4, addedAt: "2024-01-20 11:00", addedBy: "김영희" },
  { id: "t-006", name: "security-auditors", description: "보안 감사 팀", memberCount: 2, addedAt: "2024-02-01 09:30", addedBy: "admin" },
];

// ─── 팀 상세 데이터 ─────────────────────────────────────────────────────────

interface Member {
  id: string;
  username: string;
  avatarColor: string;
  avatarIcon: string;
}

const members: Member[] = [
  { id: "m-01", username: "cicdmanager", avatarColor: "#6366f1", avatarIcon: "⚙️" },
  { id: "m-02", username: "devopsadmin", avatarColor: "#ec4899", avatarIcon: "🛠" },
  { id: "m-03", username: "gitea_admin", avatarColor: "#14b8a6", avatarIcon: "🔧" },
  { id: "m-04", username: "jwlee", avatarColor: "#22c55e", avatarIcon: "◆" },
  { id: "m-05", username: "sdjo", avatarColor: "#8b5cf6", avatarIcon: "⚡" },
];

interface Repo {
  id: string;
  org: string;
  name: string;
}

const repos: Repo[] = [
  { id: "r-01", org: "cone-chain", name: "cone-chain" },
  { id: "r-02", org: "cone-chain", name: "devops-bootstrap" },
  { id: "r-03", org: "cone-chain", name: "gy-cone-chain" },
];

// ─── 아바타 ─────────────────────────────────────────────────────────────────

function Avatar({ color, icon, size = 32 }: { color: string; icon: string; size?: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
      style={{ width: size, height: size, backgroundColor: color, fontSize: size * 0.45 }}
    >
      {icon}
    </div>
  );
}

// ─── 팀 카드 ────────────────────────────────────────────────────────────────

function TeamListItem({ team, active, onClick }: { team: TeamRow; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-lg text-left transition-all cursor-pointer ${
        active
          ? "bg-[#0077ff0a] border border-[#0077ff] shadow-[0_0_0_1px_rgba(0,119,255,0.1)]"
          : "border border-[#eee] bg-white hover:bg-[#f8f9fb] hover:border-[#d8dde3]"
      }`}
    >
      <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-[#f0f4f8] flex items-center justify-center">
        <Users className="w-4.5 h-4.5 text-[#5a6a7e]" />
      </div>
      <div className="flex-1 min-w-0">
        <span className={`text-[13px] font-bold truncate block ${active ? "text-[#0077ff]" : "text-[#222]"}`}>
          {team.name}
        </span>
        <span className="text-[12px] text-[#888] truncate block">{team.description}</span>
      </div>
      <span className="text-[12px] text-[#999] flex-shrink-0">{team.memberCount}명</span>
    </button>
  );
}

// ─── 상세 탭 ────────────────────────────────────────────────────────────────

function DetailTab({
  active,
  icon,
  label,
  count,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium border-b-2 transition-colors cursor-pointer ${
        active
          ? "border-[#0077ff] text-[#0077ff]"
          : "border-transparent text-[#888] hover:text-[#555]"
      }`}
    >
      {icon}
      {label}
      <span className={`ml-0.5 text-[12px] ${active ? "text-[#0077ff]" : "text-[#bbb]"}`}>
        {count}
      </span>
    </button>
  );
}

// ─── 구성원 패널 ────────────────────────────────────────────────────────────

function MembersPanel() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1 max-w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999]" />
          <input
            type="text"
            placeholder="구성원 검색..."
            className="w-full h-[32px] pl-9 pr-3 text-[13px] text-[#333] bg-white rounded border border-[#ddd] outline-none placeholder:text-[#999] focus:border-[#0077ff]"
          />
        </div>
        <Button size="sm" variant="primary">
          구성원 추가
        </Button>
      </div>
      <div className="border border-[#e5e7eb] rounded-lg overflow-hidden">
        {members.map((member, idx) => (
          <div
            key={member.id}
            className={`flex items-center justify-between px-4 py-3 ${
              idx !== members.length - 1 ? "border-b border-[#f0f0f0]" : ""
            } hover:bg-[#fafbfc] transition-colors`}
          >
            <div className="flex items-center gap-3">
              <Avatar color={member.avatarColor} icon={member.avatarIcon} />
              <span className="text-[13px] font-medium text-[#333]">{member.username}</span>
            </div>
            <Button size="sm" variant="red-solid">제거</Button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 저장소 패널 ────────────────────────────────────────────────────────────

function ReposPanel() {
  return (
    <div className="border border-[#e5e7eb] rounded-lg overflow-hidden">
      {repos.map((repo, idx) => (
        <div
          key={repo.id}
          className={`flex items-center gap-3 px-4 py-3 ${
            idx !== repos.length - 1 ? "border-b border-[#f0f0f0]" : ""
          } hover:bg-[#fafbfc] transition-colors`}
        >
          <BookCopy className="w-4 h-4 text-[#888] flex-shrink-0" />
          <a
            href="#"
            className="text-[13px] font-medium text-[#0077ff] hover:underline"
            onClick={(e) => e.preventDefault()}
          >
            {repo.org}/{repo.name}
          </a>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Slide06RepositoryGroupTeamDetail() {
  const [selectedTeam, setSelectedTeam] = useState<string | null>("t-001");
  const [detailTab, setDetailTab] = useState<"members" | "repos">("members");

  const currentTeam = selectedTeam
    ? teamData.find((t) => t.id === selectedTeam) ?? null
    : null;

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
      sideMenuItems={sideMenuItems}
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

      {/* 팀 목록 (+상세) */}
      <ContentSection spacing="md">
        <div className="flex gap-5 items-start">

          {/* ── 좌측: 팀 목록 ──────────────────────────── */}
          <div className={`flex-shrink-0 space-y-2 transition-all ${currentTeam ? "w-[280px]" : "w-full"}`} data-annotation-id="5">
            <div className="flex items-center justify-between mb-2" data-annotation-id="4">
              <div className={`relative flex-1 ${currentTeam ? "" : "max-w-[300px]"}`}>
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#999]" />
                <input
                  type="text"
                  placeholder="팀 검색"
                  className="w-full h-[32px] pl-8 pr-3 text-[13px] text-[#333] bg-white rounded border border-[#ddd] outline-none placeholder:text-[#999] focus:border-[#0077ff]"
                />
              </div>
              <Button size="sm" variant="primary" className="ml-2">
                <Plus className="w-3.5 h-3.5 mr-1" />
                팀 추가
              </Button>
            </div>
            {teamData.map((team) => (
              <TeamListItem
                key={team.id}
                team={team}
                active={team.id === selectedTeam}
                onClick={() =>
                  setSelectedTeam((prev) => (prev === team.id ? null : team.id))
                }
              />
            ))}
          </div>

          {/* ── 우측: 팀 상세 ──────────────────────────── */}
          {currentTeam && (
            <div className="flex-1 min-w-0">
              {/* 팀 헤더 */}
              <div className="flex items-center justify-between mb-4" data-annotation-id="6">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedTeam(null)}
                    className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#f0f0f0] text-[#555] cursor-pointer"
                    title="뒤로"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="w-10 h-10 rounded-lg bg-[#f0f4f8] flex items-center justify-center">
                    <Users className="w-5 h-5 text-[#5a6a7e]" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-[#111]">{currentTeam.name}</h3>
                    <p className="text-[12px] text-[#888]">{currentTeam.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#f0f0f0] text-[#888] cursor-pointer"
                    title="편집"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#fde8e8] text-[#888] hover:text-[#da1e28] cursor-pointer"
                    title="삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 상세 탭 */}
              <div className="flex items-center border-b border-[#e5e7eb] mb-5" data-annotation-id="7">
                <DetailTab
                  active={detailTab === "members"}
                  icon={<Users className="w-4 h-4" />}
                  label="구성원"
                  count={members.length}
                  onClick={() => setDetailTab("members")}
                />
                <DetailTab
                  active={detailTab === "repos"}
                  icon={<BookCopy className="w-4 h-4" />}
                  label="저장소"
                  count={repos.length}
                  onClick={() => setDetailTab("repos")}
                />
              </div>

              {/* 탭 콘텐츠 */}
              <div data-annotation-id="8">
              {detailTab === "members" && <MembersPanel />}
              {detailTab === "repos" && <ReposPanel />}
              </div>
            </div>
          )}
        </div>
      </ContentSection>
    </CcpDashboardLayout>
  );
}
