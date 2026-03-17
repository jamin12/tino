import {
  LayoutDashboard,
  Layers,
  AppWindow,
  GitBranch,
  Settings,
  GitCompare,
  MoreHorizontal,
} from "lucide-react";
import {
  Badge,
  CcpDashboardLayout,
  ContentSection,
  InfoRow,
  Tabs,
  SidebarTenantIcon,
  SidebarConnectionIcon,
  SidebarServiceMeshIcon,
  createSideMenuItems,
} from "../../_components";
import type { SlideMeta } from "@entities/document";

export const slideMeta: SlideMeta = {
  screenId: "CCP-GIT-018",
  title: "저장소 그룹 상세 - 기본정보",
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
        "기본정보, 저장소, 팀 탭을 전환합니다. 현재 '기본정보' 탭이 활성화되어 그룹의 메타데이터를 표시합니다.",
    },
    {
      id: 4,
      label: "기본정보 카드",
      description:
        "그룹의 이름, Full Name, 설명, Website, Location, Email 등 메타데이터를 표시합니다. 그룹 생성 시 입력한 정보가 읽기 전용으로 표시됩니다.",
    },
    {
      id: 5,
      label: "공개 범위 설정",
      description:
        "그룹의 접근 범위를 공개, 제한(인증된 사용자만), 비공개(구성원만) 중 선택합니다. 현재 '비공개'가 선택되어 있으며, 저장소 그룹 구성원만 볼 수 있습니다.",
    },
    {
      id: 6,
      label: "팀 액세스 권한",
      description:
        "저장소 관리자가 팀에 대한 액세스 권한을 추가하거나 제거할 수 있는지 여부를 설정합니다. 체크 시 저장소 관리자에게 팀 액세스 관리 권한이 부여됩니다.",
    },
  ],
};

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Slide03aRepositoryGroupDetailBasic() {
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
            activeId="basic"
            className="mb-0"
          />
        </div>
      </ContentSection>

      {/* 기본정보 */}
      <ContentSection card>
        <div className="p-1 space-y-1" data-annotation-id="4">
          <InfoRow label="이름" labelWidth="140px">
            <span className="text-[13px] font-bold text-[#111]">app-cicd</span>
          </InfoRow>
          <InfoRow label="Full Name" labelWidth="140px">
            <span className="text-[13px] font-medium text-[#333]">App CI/CD</span>
          </InfoRow>
          <InfoRow label="설명" labelWidth="140px">
            <span className="text-[13px] font-medium text-[#555]">
              CI/CD 저장소 그룹
            </span>
          </InfoRow>
          <InfoRow label="Website" labelWidth="140px">
            <span className="text-[13px] font-medium text-[#0077ff]">
              https://app-cicd.cone-chain.com
            </span>
          </InfoRow>
          <InfoRow label="Location" labelWidth="140px">
            <span className="text-[13px] font-medium text-[#555]">Seoul, KR</span>
          </InfoRow>
          <InfoRow label="Email" labelWidth="140px">
            <span className="text-[13px] font-medium text-[#555]">
              app-cicd@cone-chain.com
            </span>
          </InfoRow>
        </div>
      </ContentSection>

      {/* 공개 범위 */}
      <ContentSection card>
        <div className="p-1 space-y-4">
          <InfoRow label="공개 범위" labelWidth="140px" data-annotation-id="5">
            <span className="text-[13px] font-medium text-[#333]">비공개</span>
            <span className="text-[12px] text-[#999] ml-1">(저장소 그룹 구성원만 볼 수 있음)</span>
          </InfoRow>

          {/* Divider */}
          <div className="border-t border-[#f0f0f0]" />

          {/* 권한 */}
          <InfoRow label="권한" labelWidth="140px" data-annotation-id="6">
            <span className="text-[13px] font-medium text-[#333]">
              저장소 관리자는 팀에 대한 액세스 권한을 추가하거나 제거할 수 있습니다.
            </span>
          </InfoRow>
        </div>
      </ContentSection>
    </CcpDashboardLayout>
  );
}
