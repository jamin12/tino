import {
  LayoutDashboard,
  Layers,
  AppWindow,
  GitBranch,
  Settings,
  GitCompare,
  Search,
  Copy,
  ExternalLink,
  ChevronDown,
  GitCommitHorizontal,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  Badge,
  CcpDashboardLayout,
  ContentSection,
  Tabs,
  ContextMenu,
  Overlay,
  SidebarTenantIcon,
  SidebarConnectionIcon,
  SidebarServiceMeshIcon,
  createSideMenuItems,
} from "../../_components";
import type { ContextMenuEntry } from "../../_components";
import type { SlideMeta } from "@entities/document";

export const slideMeta: SlideMeta = {
  screenId: "CCP-GIT-026",
  title: "소스 저장소 상세 (커밋 이력)",
  section: "GitOps 소스 저장소",
  annotations: [
    {
      id: 1,
      label: "커밋 이력 탭",
      description:
        "저장소 상세의 커밋 이력 탭이 활성화된 상태입니다. 선택한 브랜치의 커밋 히스토리를 시간순으로 조회합니다.",
    },
    {
      id: 2,
      label: "브랜치 선택",
      description:
        "커밋 이력을 조회할 브랜치를 변경합니다. 클릭 시 브랜치 목록 드롭다운이 표시됩니다.",
    },
    {
      id: 3,
      label: "커밋 그래프",
      description:
        "커밋 간의 분기와 병합 관계를 시각적 그래프로 표시하는 뷰로 전환합니다.",
    },
    {
      id: 4,
      label: "커밋 검색",
      description:
        "커밋 메시지, SHA, 작성자 등을 기준으로 커밋을 검색합니다. 검색 범위를 현재 브랜치 또는 전체로 지정할 수 있습니다.",
    },
    {
      id: 5,
      label: "커밋 목록 테이블",
      description:
        "각 커밋의 작성자, SHA1 해시, 메시지, 날짜를 테이블 형태로 표시합니다. SHA 뱃지 클릭 시 해당 커밋의 상세(CCP-GIT-027) 화면으로 이동합니다.",
    },
    {
      id: 6,
      label: "커밋 액션",
      description:
        "각 커밋 행의 복사(SHA 복사) 및 상세보기(커밋 diff 화면 이동) 버튼입니다.",
    },
    {
      id: 7,
      label: "더보기 메뉴",
      description:
        "저장소 그룹에 대한 추가 작업을 수행할 수 있는 컨텍스트 메뉴를 표시합니다.",
    },
    {
      id: 8,
      label: "컨텍스트 메뉴",
      description:
        "더보기 아이콘 클릭 시 표시되는 팝업 메뉴입니다.\n• 저장소 그룹 편집: 저장소 그룹의 이름, 설명 등을 수정합니다.\n• 저장소 그룹 삭제: 저장소 그룹을 삭제합니다. 그룹 내 저장소가 존재하면 삭제할 수 없습니다.",
    },
  ],
};

// ─── Context Menu ───────────────────────────────────────────────────────────

const repoGroupContextMenu: ContextMenuEntry[] = [
  { id: "settings", label: "설정", icon: <Settings className="w-4 h-4" /> },
  { id: "divider", type: "divider" },
  {
    id: "delete",
    label: "삭제",
    icon: <Trash2 className="w-4 h-4" />,
    textColor: "text-[#da1e28]",
  },
];

// ─── Commit Data ────────────────────────────────────────────────────────────

interface CommitItem {
  author: string;
  sha: string;
  message: string;
  date: string;
}

const commits: CommitItem[] = [
  {
    author: "dev.jpark",
    sha: "ed500b0e43",
    message: "refactor: UserController API v2 마이그레이션 및 페이징 처리",
    date: "2일 전",
  },
  {
    author: "s.kim",
    sha: "998af1e0b6",
    message: "feat: UserService에 캐시 레이어 추가",
    date: "3일 전",
  },
  {
    author: "dev.jpark",
    sha: "57ee841ebd",
    message: "fix: 사용자 조회 시 N+1 쿼리 문제 해결",
    date: "5일 전",
  },
  {
    author: "h.lee",
    sha: "975d69e4fe",
    message: "feat: Spring Security OAuth2 인증 필터 구현",
    date: "1주 전",
  },
  {
    author: "s.kim",
    sha: "f95829be15",
    message: "chore: application.yml 프로필별 DB 설정 분리",
    date: "1주 전",
  },
  {
    author: "dev.jpark",
    sha: "1972da6d70",
    message: "feat: 사용자 검증 로직 UserValidator 분리",
    date: "2주 전",
  },
  {
    author: "h.lee",
    sha: "06e9d52425",
    message: "test: UserController 통합 테스트 추가",
    date: "2주 전",
  },
  {
    author: "m.choi",
    sha: "cb9b383c59",
    message: "docs: API 문서 Swagger 어노테이션 추가",
    date: "3주 전",
  },
  {
    author: "s.kim",
    sha: "1d077544a2",
    message: "refactor: DTO 패키지 구조 재정리",
    date: "1개월 전",
  },
  {
    author: "dev.jpark",
    sha: "70324f2855",
    message: "feat: 글로벌 예외 핸들러 구현",
    date: "1개월 전",
  },
  {
    author: "m.choi",
    sha: "ce0d2cbfa9",
    message: "init: Spring Boot 프로젝트 초기 설정",
    date: "2개월 전",
  },
];

// ─── Avatar ─────────────────────────────────────────────────────────────────

const avatarColors: Record<string, { bg: string; fg: string }> = {
  "dev.jpark": { bg: "#d4e8d4", fg: "#2d6a2d" },
  "s.kim": { bg: "#d4dce8", fg: "#2d4a6a" },
  "h.lee": { bg: "#e8d4e8", fg: "#6a2d6a" },
  "m.choi": { bg: "#e8e4d4", fg: "#6a5a2d" },
};

function DevAvatar({ author }: { author: string }) {
  const initials = author.split(".").pop()?.slice(0, 2).toUpperCase() ?? "??";
  const color = avatarColors[author] ?? { bg: "#e0e0e0", fg: "#555" };
  return (
    <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: color.bg }}>
      <span className="text-[11px] font-bold" style={{ color: color.fg }}>{initials}</span>
    </div>
  );
}

// ─── Slide ──────────────────────────────────────────────────────────────────

export default function Slide08SourceRepositoryDetailCommits() {
  return (
    <CcpDashboardLayout
      breadcrumbs={[
        { label: "홈" },
        { label: "GitOps" },
        { label: "소스 저장소", isBold: true },
      ]}
      title="app1-backend"
      sideMenuItems={createSideMenuItems({ activeId: "gitops", activeLabel: "소스 저장소" })}
      headerActions={
        <button
          data-annotation-id="7"
          type="button"
          className="flex items-center justify-center w-8 h-8 rounded hover:bg-[#f0f0f0] text-[#666]"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      }
      overlay={
        <Overlay data-annotation-id="8" top={100} right={80}>
          <ContextMenu items={repoGroupContextMenu} className="w-[200px]" />
        </Overlay>
      }
    >
      <ContentSection>
        <div data-annotation-id="1">
        <Tabs
          items={[
            { id: "basic", label: "기본정보" },
            { id: "files", label: "파일" },
            { id: "branches", label: "브랜치/태그" },
            { id: "commits", label: "커밋 이력" },
            { id: "settings", label: "설정" },
          ]}
          activeId="commits"
          className="mb-0"
        />
        </div>
      </ContentSection>

      <ContentSection>
        {/* Branch selector + 커밋 그래프 tab */}
        <div className="flex items-center gap-2 mb-4">
          <button
            data-annotation-id="2"
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#ddd] rounded bg-white text-[13px] text-[#333] hover:bg-[#f6f8fa]"
          >
            <GitBranch className="w-3.5 h-3.5 text-[#555]" />
            main
            <ChevronDown className="w-3.5 h-3.5 text-[#999]" />
          </button>
          <button
            data-annotation-id="3"
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#ddd] rounded bg-white text-[13px] text-[#555] hover:bg-[#f6f8fa]"
          >
            <GitCommitHorizontal className="w-3.5 h-3.5" />
            커밋 그래프
          </button>
        </div>

        {/* Commit list card */}
        <div className="bg-white border border-[#e0e0e0] rounded">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#e0e0e0] bg-[#f6f8fa]">
            <span className="text-[13px] font-semibold text-[#333]">
              11 커밋
            </span>
          </div>

          {/* Search */}
          <div data-annotation-id="4" className="flex items-center gap-2 px-4 py-3 border-b border-[#f0f0f0]">
            <div className="flex items-center gap-2 flex-1 h-[34px] border border-[#ddd] rounded px-3 bg-white">
              <Search className="w-3.5 h-3.5 text-[#999]" />
              <span className="text-[13px] text-[#999]">
                Search commits...
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 h-[34px] border border-[#ddd] rounded bg-white text-[13px] text-[#555]">
              This Branch
              <ChevronDown className="w-3.5 h-3.5 text-[#999]" />
            </div>
            <button
              type="button"
              className="flex items-center justify-center w-[34px] h-[34px] border border-[#ddd] rounded bg-white hover:bg-[#f6f8fa]"
            >
              <Search className="w-3.5 h-3.5 text-[#555]" />
            </button>
          </div>

          {/* Commit table */}
          <table data-annotation-id="5" className="w-full text-left">
            <thead>
              <tr className="border-b border-[#e0e0e0] bg-[#fafafa] text-[12px] font-semibold text-[#555]">
                <th className="px-4 py-2 font-semibold" style={{ width: "130px" }}>작성자</th>
                <th className="px-4 py-2 font-semibold" style={{ width: "120px" }}>SHA1</th>
                <th className="px-4 py-2 font-semibold">메시지</th>
                <th className="px-4 py-2 font-semibold text-right" style={{ width: "90px" }}>날짜</th>
                <th className="px-4 py-2" style={{ width: "60px" }} />
              </tr>
            </thead>
            <tbody>
              {commits.map((commit, i) => (
                <tr
                  key={commit.sha}
                  className={`${
                    i < commits.length - 1
                      ? "border-b border-[#f0f0f0]"
                      : ""
                  } hover:bg-[#f9fafb]`}
                >
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <DevAvatar author={commit.author} />
                      <span className="text-[13px] text-[#333]">
                        {commit.author}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <Badge
                      variant="neutral"
                      className="!text-[11px] !px-2 !py-0.5 font-mono cursor-pointer"
                    >
                      {commit.sha}
                    </Badge>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="text-[13px] text-[#333] truncate block max-w-[600px]">
                      {commit.message}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <span className="text-[12px] text-[#999] whitespace-nowrap">
                      {commit.date}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <div data-annotation-id="6" className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        className="p-1 text-[#555] hover:bg-[#e8e8e8] rounded"
                        title="복사"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        className="p-1 text-[#555] hover:bg-[#e8e8e8] rounded"
                        title="상세보기"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ContentSection>
    </CcpDashboardLayout>
  );
}
