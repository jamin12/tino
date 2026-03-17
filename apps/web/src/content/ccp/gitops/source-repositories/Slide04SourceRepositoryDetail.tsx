import {
  LayoutDashboard,
  Layers,
  AppWindow,
  GitBranch,
  Settings,
  GitCompare,
  MoreHorizontal,
  Copy,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  Badge,
  CcpDashboardLayout,
  ContentSection,
  InfoRow,
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
  screenId: "CCP-GIT-022",
  title: "소스 저장소 상세 (기본정보)",
  section: "GitOps 소스 저장소",
  annotations: [
    {
      id: 1,
      label: "탭 내비게이션",
      description:
        "기본정보, 파일, 브랜치/태그, 커밋 이력, 설정 탭으로 구성됩니다. 기본정보 탭이 기본 선택되어 소스 저장소의 메타데이터를 표시합니다.",
    },
    {
      id: 2,
      label: "저장소 URL 복사",
      description:
        "저장소의 Git URL을 표시하며, '클립보드' 버튼을 클릭하면 URL이 클립보드에 복사됩니다. Git clone 시 해당 URL을 사용합니다.",
    },
    {
      id: 3,
      label: "기본 브랜치",
      description:
        "저장소의 기본(default) 브랜치를 Badge로 표시합니다. 배포 및 병합의 기준이 되는 브랜치입니다.",
    },
    {
      id: 4,
      label: "더보기 메뉴",
      description:
        "저장소에 대한 추가 액션(편집, 삭제 등)을 제공하는 컨텍스트 메뉴를 엽니다.",
    },
    {
      id: 5,
      label: "더보기 메뉴",
      description:
        "저장소 그룹에 대한 추가 작업을 수행할 수 있는 컨텍스트 메뉴를 표시합니다.",
    },
    {
      id: 6,
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

// ─── Slide ──────────────────────────────────────────────────────────────────

export default function Slide04SourceRepositoryDetail() {
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
          type="button"
          data-annotation-id="5"
          className="flex items-center justify-center w-8 h-8 rounded hover:bg-[#f0f0f0] text-[#666]"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      }
      overlay={
        <Overlay data-annotation-id="6" top={100} right={80}>
          <ContextMenu items={repoGroupContextMenu} className="w-[200px]" />
        </Overlay>
      }
    >
      <ContentSection>
        <Tabs
          data-annotation-id="1"
          items={[
            { id: "basic", label: "기본정보" },
            { id: "files", label: "파일" },
            { id: "branches", label: "브랜치/태그" },
            { id: "commits", label: "커밋 이력" },
            { id: "settings", label: "설정" },
          ]}
          activeId="basic"
          className="mb-0"
        />
      </ContentSection>

      <ContentSection card>
        <div className="p-1 space-y-1">
          <InfoRow label="리포지토리" labelWidth="140px">
            <span className="text-[13px] font-medium text-[#0077ff]">
              https://gitea.cone-chain.com/app-cicd/app1-backend.git
            </span>
            <button
              type="button"
              data-annotation-id="2"
              className="ml-2 px-2 py-1 text-[12px] text-[#555] border border-[#ddd] rounded hover:bg-[#f6f8fa] flex items-center gap-1"
            >
              <Copy className="w-3 h-3" />
              클립보드
            </button>
          </InfoRow>
          <InfoRow label="저장소 그룹" labelWidth="140px">
            <span className="text-[13px] font-medium text-[#333]">
              app-cicd
            </span>
          </InfoRow>
          <InfoRow label="이름" labelWidth="140px">
            <span className="text-[13px] font-bold text-[#111]">
              app1-backend
            </span>
          </InfoRow>
          <InfoRow label="설명" labelWidth="140px">
            <span className="text-[13px] font-medium text-[#555]">
              app1-backend 리포지토리
            </span>
          </InfoRow>
          <InfoRow label="기본 브랜치" labelWidth="140px">
            <Badge data-annotation-id="3" variant="neutral">main</Badge>
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
        </div>
      </ContentSection>
    </CcpDashboardLayout>
  );
}
