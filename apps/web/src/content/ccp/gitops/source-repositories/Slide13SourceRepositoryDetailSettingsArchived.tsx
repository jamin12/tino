import {
  LayoutDashboard,
  Layers,
  AppWindow,
  GitBranch,
  Settings,
  GitCompare,
  AlertTriangle,
  Archive,
  Trash2,
} from "lucide-react";
import {
  Button,
  CcpDashboardLayout,
  ContentSection,
  InfoRow,
  Select,
  Tabs,
} from "../../_components";
import type { SideMenuItem } from "../../_components";
import type { SlideMeta } from "@entities/document";

export const slideMeta: SlideMeta = {
  screenId: "CCP-GIT-032",
  title: "소스 저장소 상세 (설정 - 일반, 모달 없음)",
  section: "GitOps 소스 저장소",
  annotations: [
    {
      id: 1,
      label: "설정 탭 (일반)",
      description:
        "설정 탭의 '일반' 하위 메뉴가 활성화된 상태입니다. 저장소 관리를 위한 위험 작업들이 표시됩니다.",
    },
    {
      id: 2,
      label: "설정 하위 메뉴",
      description:
        "'일반'과 '웹훅' 하위 메뉴를 전환합니다. 현재 '일반'이 활성 상태입니다.",
    },
    {
      id: 3,
      label: "저장소 그룹 이전",
      description:
        "저장소를 다른 그룹으로 이전합니다. 이전 대상 그룹을 선택한 후 실행하며, 기존 접근 권한이 변경될 수 있습니다. 이 작업은 되돌릴 수 없습니다.",
    },
    {
      id: 4,
      label: "저장소 보관",
      description:
        "저장소를 읽기 전용 상태로 전환합니다. 보관 후에는 새로운 커밋과 푸시가 불가능합니다. 클릭 시 확인 모달(CCP-GIT-031)이 표시됩니다.",
    },
    {
      id: 5,
      label: "저장소 삭제",
      description:
        "저장소와 모든 관련 데이터(코드, 이슈, 커밋 이력)를 영구 삭제합니다. 이 작업은 되돌릴 수 없습니다.",
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

// ─── Slide ──────────────────────────────────────────────────────────────────

export default function Slide13SourceRepositoryDetailSettingsArchived() {
  return (
    <CcpDashboardLayout
      breadcrumbs={[
        { label: "홈" },
        { label: "GitOps" },
        { label: "소스 저장소", isBold: true },
      ]}
      title="app1-backend"
      sideMenuItems={sideMenuItems}
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

      {/* 저장소 그룹 이전 */}
      <ContentSection>
        <div data-annotation-id="3" className="bg-white border border-[#e0e0e0] rounded-lg overflow-hidden">
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
              <Select
                label=""
                options={[
                  { value: "", label: "저장소 그룹 선택" },
                  { value: "infra", label: "infra" },
                  { value: "sample", label: "sample" },
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

      {/* 저장소 보관 */}
      <ContentSection>
        <div data-annotation-id="4" className="bg-white border border-[#e0e0e0] rounded-lg overflow-hidden">
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
        <div data-annotation-id="5" className="bg-white border border-[#da1e28] rounded-lg overflow-hidden">
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
    </CcpDashboardLayout>
  );
}
