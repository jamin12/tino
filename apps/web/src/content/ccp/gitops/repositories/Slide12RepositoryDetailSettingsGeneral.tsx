import {
  LayoutDashboard,
  Layers,
  AppWindow,
  GitBranch,
  Settings,
  GitCompare,
  AlertTriangle,
  Copy,
  MoreHorizontal,
  Pencil,
  Link2,
  Unlink,
  Trash2,
} from "lucide-react";
import {
  Badge,
  Button,
  CcpDashboardLayout,
  ContentSection,
  ContextMenu,
  InfoRow,
  Overlay,
  Select,
  Tabs,
  SidebarTenantIcon,
  SidebarConnectionIcon,
  SidebarServiceMeshIcon,
  createSideMenuItems,
} from "../../_components";
import type { ContextMenuEntry} from "../../_components";
import type { SlideMeta } from "@entities/document";

export const slideMeta: SlideMeta = {
  screenId: "CCP-GIT-012",
  title: "배포 저장소 상세 (설정 - 일반)",
  section: "GitOps 배포 저장소",
  annotations: [
    {
      id: 1,
      label: "설정 탭",
      description:
        "설정 탭이 활성화된 상태입니다. 배포 저장소 관리를 위한 위험 작업들이 표시됩니다.",
    },
    {
      id: 2,
      label: "설정 하위 메뉴",
      description:
        "'일반' 하위 메뉴가 활성 상태입니다. 배포 저장소는 일반 설정만 제공합니다.",
    },
    {
      id: 3,
      label: "저장소 이름 변경",
      description:
        "저장소의 이름을 변경합니다. 변경 완료 시 변경된 이름의 현재 화면으로 리다이렉트됩니다. 이름 변경 시 Git URL이 함께 변경되므로, 기존 클론의 리모트 URL을 수동으로 업데이트해야 합니다.",
    },
    {
      id: 4,
      label: "가시성 변경",
      description:
        "저장소의 가시성(공개/비공개)을 변경합니다. 가시성 변경 시 접근 권한 범위가 달라집니다.",
    },
    {
      id: 5,
      label: "Topic 변경",
      description:
        "저장소의 Topic(Pipeline, Manifest, Artifact) 유형을 변경합니다. 변경 시 기존 Topic은 제거되고 선택한 Topic으로 대체됩니다. Topic 변경 시 목록 필터 분류가 변경됩니다.",
    },
    {
      id: 6,
      label: "저장소 그룹 이전",
      description:
        "저장소를 다른 그룹으로 이전합니다. 이전 대상 그룹을 선택한 후 실행하며, 기존 접근 권한이 변경될 수 있습니다. 이 작업은 되돌릴 수 없습니다.",
    },
    {
      id: 7,
      label: "GitOps 연결 해제",
      description:
        "저장소의 GitOps 연결을 해제합니다. 해제 후에는 자동 배포가 중단되며, 다시 연결하려면 GitOps 탭에서 재설정해야 합니다.",
    },
    {
      id: 8,
      label: "저장소 삭제",
      description:
        "저장소와 모든 관련 데이터(코드, 커밋 이력, GitOps 설정)를 영구 삭제합니다. Gitea에서 저장소가 삭제되며, Argo CD에서 해당 저장소 연결도 함께 제거됩니다. 이 작업은 되돌릴 수 없습니다.",
    },
    {
      id: 9,
      label: "더보기 메뉴",
      description:
        "배포 저장소에 대한 추가 작업을 수행할 수 있는 컨텍스트 메뉴를 표시합니다.",
    },
    {
      id: 10,
      label: "컨텍스트 메뉴",
      description:
        "더보기 아이콘 클릭 시 표시되는 팝업 메뉴입니다.\n• 애플리케이션 생성: 연결된 앱을 만듭니다.\n• 설정: 해당 저장소의 상세 화면 설정 탭으로 이동합니다.\n• 연결: GitOps 연결을 설정합니다.\n• 연결해제: GitOps 연결을 해제합니다.\n• 삭제: 저장소를 삭제합니다.",
    },
  ],
};

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

// ─── Slide ──────────────────────────────────────────────────────────────────

export default function Slide12RepositoryDetailSettingsGeneral() {
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
          <span className="cursor-pointer">app1-gitops</span>
          <Badge variant="info">Pipeline</Badge>
        </span>
      }
      sideMenuItems={createSideMenuItems({ activeId: "gitops", activeLabel: "배포 저장소" })}
      headerActions={
        <button
          data-annotation-id="9"
          type="button"
          className="flex items-center justify-center w-8 h-8 rounded hover:bg-[#f0f0f0] text-[#666]"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      }
      overlay={
        <Overlay data-annotation-id="10" top={100} right={80}>
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
            activeId="settings"
            className="mb-0"
          />
        </div>
      </ContentSection>

      <ContentSection>
        {/* 설정 하위 메뉴 */}
        <div data-annotation-id="2" className="flex gap-2 mb-4">
          <button
            type="button"
            className="px-3 py-1.5 text-[13px] rounded border bg-[#0077ff] text-white border-[#0077ff] font-semibold"
          >
            일반
          </button>
        </div>
      </ContentSection>

      {/* 저장소 이름 변경 */}
      <ContentSection>
        <div data-annotation-id="3" className="bg-white border border-[#e0e0e0] rounded-lg overflow-hidden">
          <div className="px-5 py-3 border-b border-[#e0e0e0] bg-[#f6f8fa]">
            <span className="text-[14px] font-semibold text-[#333]">
              저장소 이름 변경
            </span>
          </div>
          <div className="px-5 py-5 space-y-4">
            <InfoRow label="저장소 이름" labelWidth="140px">
              <input
                type="text"
                value="app1-gitops"
                readOnly
                className="w-full border border-[#ddd] rounded px-3 py-1.5 text-[13px] text-[#333] bg-white"
              />
            </InfoRow>
            <InfoRow label="저장소 URL" labelWidth="140px">
              <span className="text-[13px] font-medium text-[#0077ff] leading-5">
                https://gitea.cone-chain.com/app-cicd/app1-gitops.git
              </span>
              <button
                type="button"
                className="ml-2 px-2 py-1 text-[12px] text-[#555] border border-[#ddd] rounded hover:bg-[#f6f8fa] flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                클립보드
              </button>
            </InfoRow>
            <div className="flex justify-end">
              <Button variant="primary" size="md">
                이름 변경
              </Button>
            </div>
          </div>
        </div>
      </ContentSection>

      {/* 가시성 변경 */}
      <ContentSection>
        <div data-annotation-id="4" className="bg-white border border-[#e0e0e0] rounded-lg overflow-hidden">
          <div className="px-5 py-3 border-b border-[#e0e0e0] bg-[#f6f8fa]">
            <span className="text-[14px] font-semibold text-[#333]">
              가시성 변경
            </span>
          </div>
          <div className="px-5 py-5 space-y-4">
            <InfoRow label="가시성" labelWidth="140px">
              <Select
                label=""
                options={[
                  { value: "private", label: "비공개" },
                  { value: "public", label: "공개" },
                ]}
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

      {/* Topic 변경 */}
      <ContentSection>
        <div data-annotation-id="5" className="bg-white border border-[#e0e0e0] rounded-lg overflow-hidden">
          <div className="px-5 py-3 border-b border-[#e0e0e0] bg-[#f6f8fa]">
            <span className="text-[14px] font-semibold text-[#333]">
              Topic 변경
            </span>
          </div>
          <div className="px-5 py-5 space-y-4">
            <InfoRow label="Topic" labelWidth="140px">
              <Select
                label=""
                options={[
                  { value: "pipeline", label: "Pipeline" },
                  { value: "manifest", label: "Manifest" },
                  { value: "artifact", label: "Artifact" },
                ]}
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

      {/* 저장소 그룹 이전 */}
      <ContentSection>
        <div data-annotation-id="6" className="bg-white border border-[#e0e0e0] rounded-lg overflow-hidden">
          <div className="px-5 py-3 border-b border-[#e0e0e0] bg-[#f6f8fa]">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#d97706]" />
              <span className="text-[14px] font-semibold text-[#333]">
                저장소 그룹 이전
              </span>
            </div>
          </div>

          <div className="px-5 py-5 space-y-4">
            <p className="text-[13px] text-[#555] leading-relaxed">
              이 저장소를 다른 저장소 그룹으로 이전합니다. 이전 후에는 기존 그룹의 접근 권한이 변경될 수 있습니다.
            </p>

            <InfoRow label="현재 저장소 그룹" labelWidth="140px">
              <span className="text-[13px] font-medium text-[#333]">app-cicd</span>
            </InfoRow>

            <InfoRow label="이전 저장소 그룹" labelWidth="140px">
              <Select
                label=""
                options={[
                  { value: "", label: "저장소 그룹 선택" },
                  { value: "infra-ops", label: "infra-ops" },
                  { value: "sample-cicd", label: "sample-cicd" },
                ]}
              />
            </InfoRow>

            <div className="bg-[#fff8e1] border border-[#ffe082] rounded px-4 py-3">
              <p className="text-[12px] text-[#8d6e00] leading-relaxed">
                이 작업은 되돌릴 수 없습니다. 이전 후 기존 URL로의 접근은 자동으로 리다이렉트되지만, 로컬 클론의 리모트 URL은 수동으로 업데이트해야 합니다.
              </p>
            </div>

            <div className="flex justify-end">
              <Button variant="danger" size="md">
                저장소 그룹 이전
              </Button>
            </div>
          </div>
        </div>
      </ContentSection>

      {/* GitOps 연결 해제 */}
      <ContentSection>
        <div data-annotation-id="7" className="bg-white border border-[#e0e0e0] rounded-lg overflow-hidden">
          <div className="px-5 py-3 border-b border-[#e0e0e0] bg-[#f6f8fa]">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#d97706]" />
              <span className="text-[14px] font-semibold text-[#333]">
                GitOps 연결 해제
              </span>
            </div>
          </div>

          <div className="px-5 py-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[13px] font-semibold text-[#333]">
                  이 저장소의 GitOps 연결 해제
                </p>
                <p className="text-[13px] text-[#555] leading-relaxed">
                  GitOps 연결을 해제하면 자동 배포가 중단됩니다. 다시 연결하려면 GitOps 탭에서 재설정해야 합니다.
                </p>
              </div>
              <div className="ml-8 flex-shrink-0">
                <Button variant="danger" size="md">
                  연결 해제
                </Button>
              </div>
            </div>
          </div>
        </div>
      </ContentSection>

      {/* 저장소 삭제 */}
      <ContentSection>
        <div data-annotation-id="8" className="bg-white border border-[#da1e28] rounded-lg overflow-hidden">
          <div className="px-5 py-3 border-b border-[#da1e28] bg-[#fef2f2]">
            <div className="flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-[#da1e28]" />
              <span className="text-[14px] font-semibold text-[#da1e28]">
                저장소 삭제
              </span>
            </div>
          </div>

          <div className="px-5 py-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[13px] font-semibold text-[#333]">
                  이 저장소를 삭제
                </p>
                <p className="text-[13px] text-[#555] leading-relaxed">
                  저장소를 삭제하면 모든 데이터(코드, 커밋 이력, GitOps 설정 등)가 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
                </p>
              </div>
              <div className="ml-8 flex-shrink-0">
                <Button variant="danger" size="md">
                  저장소 삭제
                </Button>
              </div>
            </div>
          </div>
        </div>
      </ContentSection>
    </CcpDashboardLayout>
  );
}
