import {
  LayoutDashboard,
  Layers,
  AppWindow,
  GitBranch,
  Settings,
  GitCompare,
  Copy,
  Search,
  Tag,
  Download,
  RefreshCw,
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
} from "../../_components";
import type { SideMenuItem, ContextMenuEntry } from "../../_components";
import type { SlideMeta } from "@entities/document";

export const slideMeta: SlideMeta = {
  screenId: "CCP-GIT-025",
  title: "소스 저장소 상세 (브랜치/태그)",
  section: "GitOps 소스 저장소",
  annotations: [
    {
      id: 1,
      label: "브랜치/태그 탭",
      description:
        "저장소 상세의 브랜치/태그 탭이 활성화된 상태입니다. 다른 탭 클릭 시 해당 정보 화면으로 전환됩니다.",
    },
    {
      id: 2,
      label: "기본 브랜치",
      description:
        "저장소의 기본(default) 브랜치를 별도 영역으로 강조 표시합니다. 브랜치명 클릭 시 해당 브랜치의 파일 목록으로 이동합니다.",
    },
    {
      id: 3,
      label: "브랜치 목록",
      description:
        "저장소에 존재하는 모든 브랜치를 나열합니다. 각 브랜치의 최신 커밋 해시, 메시지, 업데이트 시점을 확인할 수 있습니다.",
    },
    {
      id: 4,
      label: "브랜치 검색",
      description:
        "브랜치 이름을 기준으로 키워드 검색하여 원하는 브랜치를 빠르게 찾을 수 있습니다.",
    },
    {
      id: 5,
      label: "태그 목록",
      description:
        "저장소에 생성된 태그를 나열합니다. 각 태그의 커밋 해시, 메시지, 생성 시점을 확인할 수 있습니다.",
    },
    {
      id: 6,
      label: "태그 검색",
      description:
        "태그 이름을 기준으로 키워드 검색하여 원하는 태그를 빠르게 찾을 수 있습니다.",
    },
    {
      id: 7,
      label: "다운로드",
      description:
        "해당 브랜치 또는 태그의 소스 코드를 보관 파일로 다운로드합니다.",
    },
    {
      id: 8,
      label: "더보기 메뉴",
      description:
        "저장소 그룹에 대한 추가 작업을 수행할 수 있는 컨텍스트 메뉴를 표시합니다.",
    },
    {
      id: 9,
      label: "컨텍스트 메뉴",
      description:
        "더보기 아이콘 클릭 시 표시되는 팝업 메뉴입니다.\n• 저장소 그룹 편집: 저장소 그룹의 이름, 설명 등을 수정합니다.\n• 저장소 그룹 삭제: 저장소 그룹을 삭제합니다. 그룹 내 저장소가 존재하면 삭제할 수 없습니다.",
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

// ─── Branch & Tag Data ──────────────────────────────────────────────────────

interface BranchItem {
  name: string;
  isDefault?: boolean;
  commitHash: string;
  commitMessage: string;
  updatedAt: string;
}

const branches: BranchItem[] = [
  {
    name: "main",
    isDefault: true,
    commitHash: "c36b1d6662",
    commitMessage: "sts 레플리카수 변경",
    updatedAt: "3개월 전",
  },
  {
    name: "develop",
    commitHash: "a8f2e31b04",
    commitMessage: "feature: 신규 배포 스크립트 추가",
    updatedAt: "2주 전",
  },
  {
    name: "feature/auth-module",
    commitHash: "7bc4d910ef",
    commitMessage: "OAuth2 인증 모듈 구현",
    updatedAt: "5일 전",
  },
  {
    name: "hotfix/memory-leak",
    commitHash: "1e9a3f7c22",
    commitMessage: "메모리 누수 패치 적용",
    updatedAt: "1일 전",
  },
];

interface TagItem {
  name: string;
  commitHash: string;
  message: string;
  createdAt: string;
}

const tags: TagItem[] = [
  {
    name: "v1.2.0",
    commitHash: "c36b1d6662",
    message: "Release v1.2.0 - 안정화 버전",
    createdAt: "3개월 전",
  },
  {
    name: "v1.1.0",
    commitHash: "f0d8a2b391",
    message: "Release v1.1.0 - 기능 개선",
    createdAt: "6개월 전",
  },
  {
    name: "v1.0.0",
    commitHash: "8e12c4d5a7",
    message: "Release v1.0.0 - 초기 릴리스",
    createdAt: "1년 전",
  },
];

// ─── Slide ──────────────────────────────────────────────────────────────────

export default function Slide07SourceRepositoryDetailBranches() {
  return (
    <CcpDashboardLayout
      breadcrumbs={[
        { label: "홈" },
        { label: "GitOps" },
        { label: "소스 저장소", isBold: true },
      ]}
      title="app1-backend"
      sideMenuItems={sideMenuItems}
      headerActions={
        <button
          data-annotation-id="8"
          type="button"
          className="flex items-center justify-center w-8 h-8 rounded hover:bg-[#f0f0f0] text-[#666]"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      }
      overlay={
        <Overlay data-annotation-id="9" top={100} right={80}>
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
          activeId="branches"
          className="mb-0"
        />
        </div>
      </ContentSection>

      <ContentSection>
        <div className="space-y-6">
          {/* ── 기본 브랜치 ── */}
          <div data-annotation-id="2" className="bg-[#f6f8fa] border border-[#e0e0e0] rounded">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#e0e0e0] bg-[#eef2f6]">
              <GitBranch className="w-4 h-4 text-[#555]" />
              <span className="text-[13px] font-semibold text-[#333]">기본 브랜치</span>
              <RefreshCw className="w-3.5 h-3.5 text-[#999] ml-1" />
            </div>
            <div className="px-4 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[14px] font-semibold text-[#0077ff] cursor-pointer hover:underline">
                      main
                    </span>
                    <Copy className="w-3.5 h-3.5 text-[#999] cursor-pointer hover:text-[#555]" />
                  </div>
                  <div className="flex items-center gap-2 text-[12px] text-[#555]">
                    <span className="font-mono text-[#0077ff]">
                      {branches[0].commitHash}
                    </span>
                    <span>· {branches[0].commitMessage}</span>
                    <span className="text-[#999]">· 업데이트됨 {branches[0].updatedAt}</span>
                  </div>
                </div>
                <button data-annotation-id="7" type="button" className="p-1.5 text-[#555] hover:bg-[#e0e0e0] rounded">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* ── 브랜치 ── */}
          <div data-annotation-id="3" className="bg-white border border-[#e0e0e0] rounded">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#e0e0e0] bg-[#f6f8fa]">
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-[#555]" />
                <span className="text-[13px] font-semibold text-[#333]">브랜치</span>
                <Badge variant="neutral" className="!text-[11px] !px-1.5">{branches.length}</Badge>
              </div>
            </div>

            {/* Search */}
            <div data-annotation-id="4" className="px-4 py-3 border-b border-[#f0f0f0]">
              <div className="flex items-center gap-2 h-[34px] border border-[#ddd] rounded px-3 bg-white">
                <Search className="w-3.5 h-3.5 text-[#999]" />
                <span className="text-[13px] text-[#999]">Search branches...</span>
              </div>
            </div>

            {/* Branch list */}
            {branches.map((branch, i) => (
              <div
                key={branch.name}
                className={`flex items-center justify-between px-4 py-3 ${
                  i < branches.length - 1 ? "border-b border-[#f0f0f0]" : ""
                } hover:bg-[#f9fafb]`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[13px] font-semibold text-[#0077ff] cursor-pointer hover:underline">
                      {branch.name}
                    </span>
                    {branch.isDefault && (
                      <Badge variant="green-solid" className="!text-[10px] !px-1.5 !py-0">
                        default
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[12px] text-[#555]">
                    <span className="font-mono text-[#0077ff]">{branch.commitHash}</span>
                    <span>· {branch.commitMessage}</span>
                    <span className="text-[#999]">· 업데이트됨 {branch.updatedAt}</span>
                  </div>
                </div>
                <button type="button" className="p-1.5 text-[#555] hover:bg-[#e8e8e8] rounded">
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* ── 태그 ── */}
          <div data-annotation-id="5" className="bg-white border border-[#e0e0e0] rounded">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#e0e0e0] bg-[#f6f8fa]">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#555]" />
                <span className="text-[13px] font-semibold text-[#333]">태그</span>
                <Badge variant="neutral" className="!text-[11px] !px-1.5">{tags.length}</Badge>
              </div>
            </div>

            {/* Search */}
            <div data-annotation-id="6" className="px-4 py-3 border-b border-[#f0f0f0]">
              <div className="flex items-center gap-2 h-[34px] border border-[#ddd] rounded px-3 bg-white">
                <Search className="w-3.5 h-3.5 text-[#999]" />
                <span className="text-[13px] text-[#999]">Search tags...</span>
              </div>
            </div>

            {/* Tag list */}
            {tags.map((tag, i) => (
              <div
                key={tag.name}
                className={`flex items-center justify-between px-4 py-3 ${
                  i < tags.length - 1 ? "border-b border-[#f0f0f0]" : ""
                } hover:bg-[#f9fafb]`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <Tag className="w-3.5 h-3.5 text-[#555]" />
                    <span className="text-[13px] font-semibold text-[#333]">
                      {tag.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[12px] text-[#555]">
                    <span className="font-mono text-[#0077ff]">{tag.commitHash}</span>
                    <span>· {tag.message}</span>
                    <span className="text-[#999]">· {tag.createdAt}</span>
                  </div>
                </div>
                <button type="button" className="p-1.5 text-[#555] hover:bg-[#e8e8e8] rounded">
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </ContentSection>
    </CcpDashboardLayout>
  );
}
