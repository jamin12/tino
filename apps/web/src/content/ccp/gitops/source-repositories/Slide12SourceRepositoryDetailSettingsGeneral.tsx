import {
  LayoutDashboard,
  Layers,
  AppWindow,
  GitBranch,
  Settings,
  GitCompare,
  AlertTriangle,
  Archive,
  Copy,
  Trash2,
} from "lucide-react";
import {
  Button,
  CcpDashboardLayout,
  ContentSection,
  InfoRow,
  Overlay,
  Select,
  Tabs,
  SidebarTenantIcon,
  SidebarConnectionIcon,
  SidebarServiceMeshIcon,
  createSideMenuItems,
} from "../../_components";
import type { SlideMeta } from "@entities/document";
import { Check, X } from "lucide-react";

export const slideMeta: SlideMeta = {
  screenId: "CCP-GIT-031",
  title: "소스 저장소 상세 (설정 - 일반)",
  section: "GitOps 소스 저장소",
  annotations: [
    {
      id: 1,
      label: "설정 탭 (일반)",
      description:
        "설정 탭의 '일반' 하위 메뉴가 활성화된 상태입니다. 저장소 관리를 위한 설정 및 위험 작업들이 표시됩니다.",
    },
    {
      id: 2,
      label: "설정 하위 메뉴",
      description:
        "'일반'과 '웹훅' 하위 메뉴를 전환합니다. 현재 '일반'이 활성 상태입니다.",
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
      label: "저장소 그룹 이전",
      description:
        "저장소를 다른 그룹으로 이전합니다. 이전 대상 그룹을 선택한 후 실행하며, 기존 접근 권한이 변경될 수 있습니다. 이 작업은 되돌릴 수 없습니다.",
    },
    {
      id: 6,
      label: "이전 대상 그룹 선택",
      description:
        "저장소를 이전할 대상 그룹을 드롭다운에서 선택합니다.",
    },
    {
      id: 7,
      label: "저장소 그룹 이전 버튼",
      description:
        "선택한 그룹으로 저장소를 이전합니다. 클릭 시 확인 과정을 거칩니다.",
    },
    {
      id: 8,
      label: "저장소 보관",
      description:
        "저장소를 읽기 전용 상태로 전환합니다. 보관 후에는 새로운 커밋과 푸시가 불가능합니다. 보관 해제로 다시 활성화할 수 있습니다.",
    },
    {
      id: 9,
      label: "저장소 삭제",
      description:
        "저장소와 모든 관련 데이터(코드, 이슈, 커밋 이력)를 영구 삭제합니다. 이 작업은 되돌릴 수 없습니다.",
    },
    {
      id: 10,
      label: "보관 확인 모달",
      description:
        "저장소 보관 실행 전 최종 확인 대화상자입니다. '예' 클릭 시 보관이 실행되고, '아니오' 클릭 시 취소됩니다.",
    },
  ],
};

// ─── Slide ──────────────────────────────────────────────────────────────────

export default function Slide12SourceRepositoryDetailSettingsGeneral() {
  return (
    <CcpDashboardLayout
      breadcrumbs={[
        { label: "홈" },
        { label: "GitOps" },
        { label: "소스 저장소", isBold: true },
      ]}
      title="app1-backend"
      sideMenuItems={createSideMenuItems({ activeId: "gitops", activeLabel: "소스 저장소" })}
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
          activeId="settings"
          className="mb-0"
        />
        </div>
      </ContentSection>

      <ContentSection>
        {/* 설정 하위 메뉴 */}
        <div data-annotation-id="2" className="flex gap-2 mb-4">
          {["일반", "웹훅"].map((item) => (
            <button
              key={item}
              type="button"
              className={`px-3 py-1.5 text-[13px] rounded border ${
                item === "일반"
                  ? "bg-[#0077ff] text-white border-[#0077ff] font-semibold"
                  : "bg-white text-[#555] border-[#ddd] hover:bg-[#f6f8fa]"
              }`}
            >
              {item}
            </button>
          ))}
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
                value="app1-backend"
                readOnly
                className="w-full border border-[#ddd] rounded px-3 py-1.5 text-[13px] text-[#333] bg-white"
              />
            </InfoRow>
            <InfoRow label="저장소 URL" labelWidth="140px">
              <span className="text-[13px] font-medium text-[#0077ff] leading-5">
                https://gitea.cone-chain.com/app/app1-backend.git
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

      {/* 저장소 그룹 이전 */}
      <ContentSection>
        <div data-annotation-id="5" className="bg-white border border-[#e0e0e0] rounded-lg overflow-hidden">
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
              <span className="text-[13px] font-medium text-[#333]">app</span>
            </InfoRow>

            <InfoRow label="이전 저장소 그룹" labelWidth="140px">
              <div data-annotation-id="6">
              <Select
                label=""
                options={[
                  { value: "", label: "저장소 그룹 선택" },
                  { value: "infra", label: "infra" },
                  { value: "sample", label: "sample" },
                ]}
              />
              </div>
            </InfoRow>

            <div className="bg-[#fff8e1] border border-[#ffe082] rounded px-4 py-3">
              <p className="text-[12px] text-[#8d6e00] leading-relaxed">
                이 작업은 되돌릴 수 없습니다. 이전 후 기존 URL로의 접근은 자동으로 리다이렉트되지만, 로컬 클론의 리모트 URL은 수동으로 업데이트해야 합니다.
              </p>
            </div>

            <div className="flex justify-end">
              <Button data-annotation-id="7" variant="danger" size="md">
                저장소 그룹 이전
              </Button>
            </div>
          </div>
        </div>
      </ContentSection>

      {/* 저장소 보관 */}
      <ContentSection>
        <div data-annotation-id="8" className="bg-white border border-[#e0e0e0] rounded-lg overflow-hidden">
          <div className="px-5 py-3 border-b border-[#e0e0e0] bg-[#f6f8fa]">
            <div className="flex items-center gap-2">
              <Archive className="w-4 h-4 text-[#d97706]" />
              <span className="text-[14px] font-semibold text-[#333]">
                저장소 보관
              </span>
            </div>
          </div>

          <div className="px-5 py-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[13px] font-semibold text-[#333]">
                  이 저장소를 보관
                </p>
                <p className="text-[13px] text-[#555] leading-relaxed">
                  보관된 저장소는 새로운 커밋과 푸시가 불가능합니다. 보관을 해제하면 다시 활성화됩니다.
                </p>
              </div>
              <div className="ml-8 flex-shrink-0">
                <Button variant="danger" size="md">
                  저장소 보관
                </Button>
              </div>
            </div>
          </div>
        </div>
      </ContentSection>

      {/* 저장소 삭제 */}
      <ContentSection>
        <div data-annotation-id="9" className="bg-white border border-[#da1e28] rounded-lg overflow-hidden">
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
                  저장소를 삭제하면 모든 데이터(코드, 이슈, 커밋 이력 등)가 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
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

      {/* 보관 확인 모달 */}
      <Overlay position="fixed" top={0} left={0}>
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div data-annotation-id="10" className="bg-white rounded-lg shadow-xl w-[520px]">
            <div className="px-6 py-4 border-b border-[#e0e0e0]">
              <h3 className="text-[15px] font-bold text-[#333]">
                이 저장소를 보관
              </h3>
            </div>
            <div className="px-6 py-5">
              <p className="text-[13px] text-[#555] leading-relaxed">
                저장소를 보관하면 완전히 읽기 전용으로 전환됩니다. 누구도(본인 포함) 새로운 커밋을 생성하거나 푸시할 수 없습니다.
              </p>
            </div>
            <div className="px-6 py-3 border-t border-[#e0e0e0] flex justify-end gap-2">
              <Button variant="ghost" size="md">
                <span className="flex items-center gap-1.5">
                  <X className="w-3.5 h-3.5" />
                  아니오
                </span>
              </Button>
              <Button variant="primary" size="md">
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  예
                </span>
              </Button>
            </div>
          </div>
        </div>
      </Overlay>
    </CcpDashboardLayout>
  );
}
