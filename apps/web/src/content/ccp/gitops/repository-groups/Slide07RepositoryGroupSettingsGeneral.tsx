import {
  LayoutDashboard,
  Layers,
  AppWindow,
  GitBranch,
  Settings,
  GitCompare,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import {
  Badge,
  Button,
  Checkbox,
  CcpDashboardLayout,
  ContentSection,
  InfoRow,
  Tabs,
  TextInput,
  SidebarTenantIcon,
  SidebarConnectionIcon,
  SidebarServiceMeshIcon,
  createSideMenuItems,
} from "../../_components";
import type { SlideMeta } from "@entities/document";

export const slideMeta: SlideMeta = {
  screenId: "CCP-GIT-019",
  title: "저장소 그룹 설정 - 일반",
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
      label: "설정 탭",
      description:
        "설정 탭이 활성화된 상태입니다. 저장소 그룹 관리를 위한 설정 항목들이 표시됩니다.",
    },
    {
      id: 4,
      label: "설정 하위 메뉴",
      description:
        "'일반' 하위 메뉴가 활성 상태입니다. 저장소 그룹의 이름, 공개범위, 권한을 설정할 수 있습니다.",
    },
    {
      id: 5,
      label: "그룹 이름 변경",
      description:
        "저장소 그룹의 이름과 Full Name을 변경합니다. 이름 변경 시 해당 그룹에 속한 모든 저장소의 URL 경로가 함께 변경됩니다.",
    },
    {
      id: 6,
      label: "공개 범위 변경",
      description:
        "그룹의 접근 범위를 공개, 제한(인증된 사용자만), 비공개(구성원만) 중 선택하여 변경합니다. 변경 시 그룹 내 모든 저장소의 접근 권한에 영향을 줄 수 있습니다.",
    },
    {
      id: 7,
      label: "권한 설정",
      description:
        "저장소 관리자가 팀에 대한 액세스 권한을 추가하거나 제거할 수 있는지 여부를 설정합니다. 체크 해제 시 조직 소유자만 팀 액세스를 관리할 수 있습니다.",
    },
    {
      id: 8,
      label: "그룹 삭제",
      description:
        "저장소 그룹과 그룹에 속한 모든 저장소, 팀, 설정을 영구 삭제합니다. 이 작업은 되돌릴 수 없습니다.",
    },
  ],
};

// ─── Slide ──────────────────────────────────────────────────────────────────

export default function Slide07RepositoryGroupSettingsGeneral() {
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
              { id: "settings", label: "설정" },
            ]}
            activeId="settings"
            className="mb-0"
          />
        </div>
      </ContentSection>

      {/* 설정 하위 메뉴 */}
      <ContentSection>
        <div data-annotation-id="4" className="flex gap-2 mb-4">
          <button
            type="button"
            className="px-3 py-1.5 text-[13px] rounded border bg-[#0077ff] text-white border-[#0077ff] font-semibold"
          >
            일반
          </button>
        </div>
      </ContentSection>

      {/* 그룹 이름 변경 */}
      <ContentSection>
        <div data-annotation-id="5" className="bg-white border border-[#e0e0e0] rounded-lg overflow-hidden">
          <div className="px-5 py-3 border-b border-[#e0e0e0] bg-[#f6f8fa]">
            <span className="text-[14px] font-semibold text-[#333]">
              그룹 이름 변경
            </span>
          </div>
          <div className="px-5 py-5 space-y-4">
            <InfoRow label="이름" labelWidth="140px">
              <TextInput value="app-cicd" placeholder="그룹 이름" />
            </InfoRow>
            <InfoRow label="Full Name" labelWidth="140px">
              <TextInput value="App CI/CD" placeholder="Full Name (선택)" />
            </InfoRow>
            <div className="flex justify-end">
              <Button variant="primary" size="md">
                이름 변경
              </Button>
            </div>
          </div>
        </div>
      </ContentSection>

      {/* 공개 범위 변경 */}
      <ContentSection>
        <div data-annotation-id="6" className="bg-white border border-[#e0e0e0] rounded-lg overflow-hidden">
          <div className="px-5 py-3 border-b border-[#e0e0e0] bg-[#f6f8fa]">
            <span className="text-[14px] font-semibold text-[#333]">
              공개 범위 변경
            </span>
          </div>
          <div className="px-5 py-5 space-y-4">
            <InfoRow label="공개 범위" labelWidth="140px" className="items-start">
              <div className="flex flex-col gap-2.5 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div className="w-4 h-4 rounded-full border-[1.5px] border-[#aaa] bg-white" />
                  <span className="text-[13px] text-[#333] tracking-[-0.13px]">
                    공개
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <div className="w-4 h-4 rounded-full border-[1.5px] border-[#aaa] bg-white" />
                  <span className="text-[13px] text-[#333] tracking-[-0.13px]">
                    제한
                  </span>
                  <span className="text-[12px] text-[#999] tracking-[-0.12px]">
                    (인증된 사용자만 볼 수 있음)
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <div className="relative w-4 h-4 rounded-full border-[1.5px] border-[#0077ff] bg-white flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#0077ff]" />
                  </div>
                  <span className="text-[13px] text-[#333] font-medium tracking-[-0.13px]">
                    비공개
                  </span>
                  <span className="text-[12px] text-[#999] tracking-[-0.12px]">
                    (저장소 그룹 구성원만 볼 수 있음)
                  </span>
                </label>
              </div>
            </InfoRow>
            <div className="flex justify-end">
              <Button variant="primary" size="md">
                변경 저장
              </Button>
            </div>
          </div>
        </div>
      </ContentSection>

      {/* 권한 설정 */}
      <ContentSection>
        <div data-annotation-id="7" className="bg-white border border-[#e0e0e0] rounded-lg overflow-hidden">
          <div className="px-5 py-3 border-b border-[#e0e0e0] bg-[#f6f8fa]">
            <span className="text-[14px] font-semibold text-[#333]">
              권한 설정
            </span>
          </div>
          <div className="px-5 py-5 space-y-4">
            <InfoRow label="팀 액세스 권한" labelWidth="140px">
              <Checkbox
                label="저장소 관리자는 팀에 대한 액세스 권한을 추가하거나 제거할 수 있습니다."
                checked
              />
            </InfoRow>
            <div className="flex justify-end">
              <Button variant="primary" size="md">
                변경 저장
              </Button>
            </div>
          </div>
        </div>
      </ContentSection>

      {/* 그룹 삭제 */}
      <ContentSection>
        <div data-annotation-id="8" className="bg-white border border-[#da1e28] rounded-lg overflow-hidden">
          <div className="px-5 py-3 border-b border-[#da1e28] bg-[#fef2f2]">
            <div className="flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-[#da1e28]" />
              <span className="text-[14px] font-semibold text-[#da1e28]">
                저장소 그룹 삭제
              </span>
            </div>
          </div>

          <div className="px-5 py-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[13px] font-semibold text-[#333]">
                  이 저장소 그룹을 삭제
                </p>
                <p className="text-[13px] text-[#555] leading-relaxed">
                  저장소 그룹을 삭제하면 그룹에 속한 모든 저장소, 팀, 설정이 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
                </p>
              </div>
              <div className="ml-8 flex-shrink-0">
                <Button variant="danger" size="md">
                  그룹 삭제
                </Button>
              </div>
            </div>
          </div>
        </div>
      </ContentSection>
    </CcpDashboardLayout>
  );
}
