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
  Trash2,
  RefreshCw,
  Pencil,
  MoreHorizontal,
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
  screenId: "CCP-GIT-007",
  title: "배포 저장소 상세 (브랜치/태그)",
  section: "GitOps 배포 저장소",
  annotations: [
    {
      id: 1,
      label: "상세 탭 네비게이션",
      description:
        "기본정보(CCP-GIT-004), 파일(CCP-GIT-005), 브랜치/태그, 커밋 이력(CCP-GIT-008), GitOps(CCP-GIT-010) 탭을 전환합니다. 현재 '브랜치/태그' 탭이 활성화되어 있습니다.",
    },
    {
      id: 2,
      label: "기본 브랜치",
      description:
        "저장소의 기본(default) 브랜치를 표시합니다. 커밋 해시, 메시지, 업데이트 시간을 확인할 수 있으며, Download, Edit 작업을 수행할 수 있습니다. 기본 브랜치는 삭제할 수 없습니다.",
    },
    {
      id: 3,
      label: "기본 브랜치 변경",
      description:
        "저장소의 기본 브랜치를 다른 브랜치로 변경합니다. 클릭 시 브랜치 선택 드롭다운이 표시됩니다.",
    },
    {
      id: 4,
      label: "브랜치 목록",
      description:
        "저장소에 존재하는 모든 브랜치를 목록으로 표시합니다. 검색으로 필터링할 수 있으며, 각 브랜치의 최신 커밋 정보를 확인할 수 있습니다.",
    },
    {
      id: 5,
      label: "브랜치 검색",
      description:
        "브랜치 이름을 키워드로 검색하여 목록을 필터링합니다.",
    },
    {
      id: 6,
      label: "브랜치 이름 편집",
      description:
        "브랜치 이름을 변경합니다. 모든 브랜치(기본 브랜치 포함)에서 사용할 수 있습니다.",
    },
    {
      id: 7,
      label: "브랜치 삭제",
      description:
        "기본 브랜치를 제외한 브랜치를 삭제합니다. 삭제 전 확인 다이얼로그가 표시됩니다.",
    },
    {
      id: 8,
      label: "태그 목록",
      description:
        "저장소에 생성된 릴리스 태그를 목록으로 표시합니다. 각 태그의 커밋 해시, 메시지, 생성 시간을 확인할 수 있습니다.",
    },
    {
      id: 9,
      label: "태그 검색",
      description:
        "태그 이름을 키워드로 검색하여 목록을 필터링합니다.",
    },
    {
      id: 10,
      label: "태그 삭제",
      description:
        "해당 태그를 삭제합니다. 삭제 전 확인 다이얼로그가 표시됩니다.",
    },
  ],
};

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

export default function Slide07RepositoryDetailBranches() {
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
          {/* 호버 툴팁 */}
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
      sideMenuItems={createSideMenuItems({ activeId: "gitops", activeLabel: "배포 저장소" })}
      headerActions={
        <button
          type="button"
          className="flex items-center justify-center w-8 h-8 rounded hover:bg-[#f0f0f0] text-[#666]"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
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
            activeId="branches"
            className="mb-0"
          />
        </div>
      </ContentSection>

      <ContentSection>
        <div className="space-y-6">
          {/* ── 기본 브랜치 ── */}
          <div data-annotation-id="2" className="bg-[#f6f8fa] border border-[#e0e0e0] rounded">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#e0e0e0] bg-[#eef2f6]">
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-[#555]" />
                <span className="text-[13px] font-semibold text-[#333]">기본 브랜치</span>
                <RefreshCw className="w-3.5 h-3.5 text-[#999] ml-1" />
              </div>
              <Button data-annotation-id="3" variant="ghost" size="sm" className="!h-7 !text-[12px]">
                <RefreshCw className="w-3 h-3 mr-1" />
                기본 브랜치 변경
              </Button>
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
                <div className="flex items-center gap-2">
                  <button type="button" className="p-1.5 text-[#555] hover:bg-[#e0e0e0] rounded" title="Download">
                    <Download className="w-4 h-4" />
                  </button>
                  <button type="button" className="p-1.5 text-[#555] hover:bg-[#e0e0e0] rounded" title="Edit">
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── 브랜치 ── */}
          <div data-annotation-id="4" className="bg-white border border-[#e0e0e0] rounded">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#e0e0e0] bg-[#f6f8fa]">
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-[#555]" />
                <span className="text-[13px] font-semibold text-[#333]">브랜치</span>
                <Badge variant="neutral" className="!text-[11px] !px-1.5">{branches.length}</Badge>
              </div>
            </div>

            {/* Search */}
            <div data-annotation-id="5" className="px-4 py-3 border-b border-[#f0f0f0]">
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
                <div className="flex items-center gap-1.5">
                  <button data-annotation-id={branch.name === "main" ? "6" : undefined} type="button" className="p-1.5 text-[#555] hover:bg-[#e8e8e8] rounded" title="브랜치 이름 편집">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" className="p-1.5 text-[#555] hover:bg-[#e8e8e8] rounded">
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  {!branch.isDefault && (
                    <button data-annotation-id={branch.name === "develop" ? "7" : undefined} type="button" className="p-1.5 text-[#dc2626] hover:bg-[#fee2e2] rounded" title="브랜치 삭제">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* ── 태그 ── */}
          <div data-annotation-id="8" className="bg-white border border-[#e0e0e0] rounded">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#e0e0e0] bg-[#f6f8fa]">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#555]" />
                <span className="text-[13px] font-semibold text-[#333]">태그</span>
                <Badge variant="neutral" className="!text-[11px] !px-1.5">{tags.length}</Badge>
              </div>
            </div>

            {/* Search */}
            <div data-annotation-id="9" className="px-4 py-3 border-b border-[#f0f0f0]">
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
                <div className="flex items-center gap-1.5">
                  <button type="button" className="p-1.5 text-[#555] hover:bg-[#e8e8e8] rounded">
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button data-annotation-id={i === 0 ? "10" : undefined} type="button" className="p-1.5 text-[#dc2626] hover:bg-[#fee2e2] rounded" title="태그 삭제">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ContentSection>
    </CcpDashboardLayout>
  );
}
