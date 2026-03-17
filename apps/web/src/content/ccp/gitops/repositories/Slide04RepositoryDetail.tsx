import {
  LayoutDashboard,
  Layers,
  AppWindow,
  GitBranch,
  Settings,
  GitCompare,
  MoreHorizontal,
  Pencil,
  Trash2,
  Copy,
  Link2,
  Unlink,
} from "lucide-react";
import {
  Badge,
  CcpDashboardLayout,
  ContextMenu,
  ContentSection,
  InfoRow,
  Overlay,
  Tabs,
  SidebarTenantIcon,
  SidebarConnectionIcon,
  SidebarServiceMeshIcon,
  createSideMenuItems,
} from "../../_components";
import type { ContextMenuEntry } from "../../_components";
import type { SlideMeta } from "@entities/document";

export const slideMeta: SlideMeta = {
  screenId: "CCP-GIT-004",
  title: "배포 저장소 상세 (기본정보)",
  section: "GitOps 배포 저장소",
  annotations: [
    {
      id: 1,
      label: "저장소 상태 표시",
      description:
        "저장소 이름 옆에 GitOps 연결 상태(색상 점)와 Topic 배지를 표시합니다. 호버 시 Stable/Healthy/Synced 상세 상태 툴팁이 나타납니다.",
    },
    {
      id: 2,
      label: "더보기 메뉴",
      description:
        "저장소에 대한 추가 작업(편집, 삭제, 연결해제 등)을 수행할 수 있는 메뉴를 엽니다.",
    },
    {
      id: 3,
      label: "상세 탭 네비게이션",
      description:
        "기본정보, 파일(CCP-GIT-005), 브랜치/태그(CCP-GIT-007), 커밋 이력(CCP-GIT-008), GitOps(CCP-GIT-010) 탭을 전환합니다.",
    },
    {
      id: 4,
      label: "기본정보 카드",
      description:
        "저장소 URL, Topic, 저장소 그룹, 이름, 설명, 기본 브랜치, 생성/수정 시간, 라이선스, 템플릿 등 저장소의 메타데이터를 읽기 전용으로 표시합니다.",
    },
    {
      id: 5,
      label: "클립보드 복사",
      description:
        "저장소 URL을 클립보드에 복사합니다. Git clone 등에 활용할 수 있습니다.",
    },
    {
      id: 6,
      label: "더보기 메뉴",
      description:
        "배포 저장소에 대한 추가 작업을 수행할 수 있는 컨텍스트 메뉴를 표시합니다.",
    },
    {
      id: 7,
      label: "컨텍스트 메뉴",
      description:
        "더보기 아이콘 클릭 시 표시되는 팝업 메뉴입니다.\n• 애플리케이션 생성: 연결된 앱을 만듭니다.\n• 설정: 해당 저장소의 상세 화면 설정 탭으로 이동합니다.\n• 연결: GitOps 연결을 설정합니다.\n• 연결해제: GitOps 연결을 해제합니다.\n• 삭제: 저장소를 삭제합니다.",
    },
  ],
};

// ─── Context Menu Data ──────────────────────────────────────────────────────

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

// ─── Side Menu Data ─────────────────────────────────────────────────────────


// ─── Slide ──────────────────────────────────────────────────────────────────

export default function Slide04RepositoryDetail() {
  return (
    <CcpDashboardLayout
      breadcrumbs={[
        { label: "홈" },
        { label: "GitOps" },
        { label: "배포 저장소", isBold: true },
      ]}
      title={
        <span data-annotation-id="1" className="group relative inline-flex items-center gap-2">
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
        <>
          <button
            data-annotation-id="2"
            type="button"
            className="flex items-center justify-center w-8 h-8 rounded hover:bg-[#f0f0f0] text-[#666]"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
          <button
            data-annotation-id="6"
            type="button"
            className="flex items-center justify-center w-8 h-8 rounded hover:bg-[#f0f0f0] text-[#666]"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </>
      }
      overlay={
        <Overlay data-annotation-id="7" top={100} right={80}>
          <ContextMenu items={repoGroupContextMenu} className="w-[200px]" />
        </Overlay>
      }
    >
      <ContentSection>
        <div data-annotation-id="3">
          <Tabs
            items={[
              { id: "basic", label: "기본정보" },
              { id: "files", label: "파일" },
              { id: "branches", label: "브랜치/태그" },
              { id: "commits", label: "커밋 이력" },
              { id: "settings", label: "설정" },
              { id: "gitops", label: "GitOps", dividerBefore: true },
            ]}
            activeId="basic"
            className="mb-0"
          />
        </div>
      </ContentSection>

      <ContentSection card data-annotation-id="4">
        <div className="p-1 space-y-1">
          <InfoRow label="리포지토리" labelWidth="140px">
            <span className="text-[13px] font-medium text-[#0077ff]">
              https://gitea.cone-chain.com/app-cicd/app1-maven-pipeline.git
            </span>
            <button
              data-annotation-id="5"
              type="button"
              className="ml-2 px-2 py-1 text-[12px] text-[#555] border border-[#ddd] rounded hover:bg-[#f6f8fa] flex items-center gap-1"
            >
              <Copy className="w-3 h-3" />
              클립보드
            </button>
          </InfoRow>
          <InfoRow label="Topic" labelWidth="140px">
            <Badge variant="info">Pipeline</Badge>
          </InfoRow>
          <InfoRow label="저장소 그룹" labelWidth="140px">
            <span className="text-[13px] font-medium text-[#333]">
              app-cicd
            </span>
          </InfoRow>
          <InfoRow label="이름" labelWidth="140px">
            <span className="text-[13px] font-bold text-[#111]">
              app1-maven-pipeline
            </span>
          </InfoRow>
          <InfoRow label="설명" labelWidth="140px">
            <span className="text-[13px] font-medium text-[#555]">
              app1-maven-pipeline 리포지토리
            </span>
          </InfoRow>
          <InfoRow label="기본 브랜치" labelWidth="140px">
            <Badge variant="neutral">main</Badge>
          </InfoRow>
          <InfoRow label="생성시간" labelWidth="140px">
            <span className="text-[13px] font-medium text-[#555]">
              2024-01-15 14:30:22
            </span>
          </InfoRow>
          <InfoRow label="수정시간" labelWidth="140px">
            <span className="text-[13px] font-medium text-[#555]">
              2024-02-10 09:15:43
            </span>
          </InfoRow>
          <InfoRow label="라이선스" labelWidth="140px">
            <span className="text-[13px] font-medium text-[#555]">GPL</span>
          </InfoRow>
          <InfoRow label="템플릿" labelWidth="140px">
            <Badge variant="info">Pipeline</Badge>
          </InfoRow>
        </div>
      </ContentSection>
    </CcpDashboardLayout>
  );
}
