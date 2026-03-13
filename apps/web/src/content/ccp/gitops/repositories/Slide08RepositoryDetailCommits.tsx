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
  Link2,
  Unlink,
  Trash2,
} from "lucide-react";
import {
  Badge,
  CcpDashboardLayout,
  ContentSection,
  ContextMenu,
  Overlay,
  Tabs,
} from "../../_components";
import type { ContextMenuEntry, SideMenuItem } from "../../_components";
import type { SlideMeta } from "@entities/document";

export const slideMeta: SlideMeta = {
  screenId: "CCP-GIT-008",
  title: "배포 저장소 상세 (커밋 이력)",
  section: "GitOps 배포 저장소",
  annotations: [
    {
      id: 1,
      label: "상세 탭 네비게이션",
      description:
        "기본정보(CCP-GIT-004), 파일(CCP-GIT-005), 브랜치/태그(CCP-GIT-007), 커밋 이력, GitOps(CCP-GIT-010) 탭을 전환합니다. 현재 '커밋 이력' 탭이 활성화되어 있습니다.",
    },
    {
      id: 2,
      label: "브랜치 선택",
      description:
        "커밋 이력을 조회할 브랜치를 선택합니다. 브랜치 변경 시 해당 브랜치의 커밋 목록이 표시됩니다.",
    },
    {
      id: 3,
      label: "커밋 그래프",
      description:
        "브랜치 간 커밋 관계를 시각적 그래프로 표시합니다. 브랜치 분기와 병합 이력을 한눈에 파악할 수 있습니다.",
    },
    {
      id: 4,
      label: "커밋 검색",
      description:
        "커밋 메시지를 기준으로 검색합니다. 'This Branch' 또는 전체 범위를 선택하여 검색 범위를 조정할 수 있습니다.",
    },
    {
      id: 5,
      label: "커밋 목록 테이블",
      description:
        "선택한 브랜치의 커밋 이력을 작성자, SHA1 해시, 메시지, 날짜 순으로 표시합니다. SHA1 클릭 시 커밋 상세(CCP-GIT-009) 화면으로 이동합니다.",
    },
    {
      id: 6,
      label: "커밋 액션",
      description:
        "각 커밋에 대해 SHA 복사 또는 상세 보기(CCP-GIT-009) 링크를 제공합니다.",
    },
    {
      id: 7,
      label: "더보기 메뉴",
      description:
        "배포 저장소에 대한 추가 작업을 수행할 수 있는 컨텍스트 메뉴를 표시합니다.",
    },
    {
      id: 8,
      label: "컨텍스트 메뉴",
      description:
        "더보기 아이콘 클릭 시 표시되는 팝업 메뉴입니다.\n• 애플리케이션 생성: 연결된 앱을 만듭니다.\n• 설정: 해당 저장소의 상세 화면 설정 탭으로 이동합니다.\n• 연결: GitOps 연결을 설정합니다.\n• 연결해제: GitOps 연결을 해제합니다.\n• 삭제: 저장소를 삭제합니다.",
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

// ─── Commit Data ────────────────────────────────────────────────────────────

interface CommitItem {
  author: string;
  sha: string;
  message: string;
  date: string;
}

const commits: CommitItem[] = [
  {
    author: "cicdbot",
    sha: "ed500b0e43",
    message:
      "202602020948-194fe31-sample-egov2vm-tomcat-dev-build-pr-4gpjb",
    date: "지난달",
  },
  {
    author: "cicdbot",
    sha: "998af1e0b6",
    message:
      "202510211122-194fe31-sample-egov2vm-tomcat-dev-build-pr-qddbd",
    date: "5개월 전",
  },
  {
    author: "cicdbot",
    sha: "57ee841ebd",
    message:
      "202510201349-194fe31-sample-egov2vm-tomcat-dev-build-pr-6vrtq",
    date: "5개월 전",
  },
  {
    author: "cicdbot",
    sha: "975d69e4fe",
    message:
      "202509302024-194fe31-sample-egov2vm-tomcat-dev-build-pr-hsr2v",
    date: "6개월 전",
  },
  {
    author: "cicdbot",
    sha: "f95829be15",
    message:
      "202509191120-194fe31-sample-egov2vm-tomcat-dev-build-pr-wnc4v",
    date: "6개월 전",
  },
  {
    author: "cicdbot",
    sha: "1972da6d70",
    message:
      "202509011047-194fe31-sample-egov2vm-tomcat-dev-build-pr-n2lpr",
    date: "7개월 전",
  },
  {
    author: "cicdbot",
    sha: "06e9d52425",
    message:
      "202508290144-194fe31-sample-egov2vm-tomcat-dev-build-pr-8p6w9",
    date: "7개월 전",
  },
  {
    author: "cicdbot",
    sha: "cb9b383c59",
    message:
      "202507251755-194fe31-sample-egov2vm-tomcat-dev-build-pr-rdjx7",
    date: "8개월 전",
  },
  {
    author: "cicdbot",
    sha: "1d077544a2",
    message:
      "202506231754-194fe31-sample-egov2vm-tomcat-dev-build-pr-rwvgr",
    date: "9개월 전",
  },
  {
    author: "cicdbot",
    sha: "70324f2855",
    message:
      "202506171613-194fe31-sample-egov2vm-tomcat-dev-build-pr-6zcm7",
    date: "9개월 전",
  },
  {
    author: "cicdbot",
    sha: "ce0d2cbfa9",
    message:
      "202506171604-194fe31-sample-egov2vm-tomcat-dev-build-pr-k678w",
    date: "9개월 전",
  },
];

// ─── Context Menu ───────────────────────────────────────────────────────────

const repoGroupContextMenu: ContextMenuEntry[] = [
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

// ─── Avatar (cicdbot) ───────────────────────────────────────────────────────

function BotAvatar() {
  return (
    <div className="w-7 h-7 rounded-full bg-[#f0e0e0] flex items-center justify-center shrink-0">
      <span className="text-[12px]">🤖</span>
    </div>
  );
}

// ─── Slide ──────────────────────────────────────────────────────────────────

export default function Slide08RepositoryDetailCommits() {
  return (
    <CcpDashboardLayout
      breadcrumbs={[
        { label: "홈" },
        { label: "GitOps" },
        { label: "배포 저장소", isBold: true },
      ]}
      title={
        <span className="group relative inline-flex items-center gap-2">
          <span className="rounded-full shrink-0 w-2.5 h-2.5 bg-[#00b30e]" />
          <span className="cursor-pointer">app1-maven-pipeline</span>
          <Badge variant="info">Pipeline</Badge>
          <span className="pointer-events-none absolute top-full left-0 mt-1 z-50 hidden group-hover:inline-flex items-center gap-2 px-3 py-1.5 bg-[#1b2c3f] rounded-[0px_12px_12px_12px] shadow-[4px_4px_8px_#1b2c3f33] whitespace-nowrap">
            <span className="inline-flex items-center gap-1.5">
              <span className="rounded-full w-2 h-2 bg-[#00b30e]" />
              <span className="text-white text-[11px]">Stable</span>
            </span>
            <span className="text-[#ffffff44] text-[11px]">|</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="text-[#00b30e] text-[11px]">♥</span>
              <span className="text-white text-[11px]">Healthy</span>
            </span>
            <span className="text-[#ffffff44] text-[11px]">|</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="text-[#00b30e] text-[11px]">✓</span>
              <span className="text-white text-[11px]">Synced</span>
            </span>
          </span>
        </span>
      }
      sideMenuItems={sideMenuItems}
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
              { id: "gitops", label: "GitOps", dividerBefore: true },
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
              23 커밋
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
                      <BotAvatar />
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
                    <div data-annotation-id={i === 0 ? "6" : undefined} className="flex items-center justify-end gap-1">
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
