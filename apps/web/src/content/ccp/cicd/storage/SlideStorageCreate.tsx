import {
  CcpDashboardLayout,
  ContentSection,
  Tabs,
  Toggle,
  TextInput,
  Button,
  InfoRow,
  Tooltip,
  CollapsibleSection,
  KeyValueEditor,
  FormBanner,
  FormActions,
  SnippetCard,
  SidebarDashboardIcon,
  SidebarNamespaceIcon,
  SidebarApplicationIcon,
  SidebarCicdIcon,
  SidebarSettingsIcon,
  SidebarGitopsIcon,
} from "../../_components";
import type { SideMenuItem } from "../../_components";
import type { SlideMeta } from "@entities/document";

export const slideMeta: SlideMeta = {
  title: "리소스 생성 (공통)",
  section: "CI/CD 저장소",
};

// ─── Side Menu Data ─────────────────────────────────────────────────────────

const sideMenuItems: SideMenuItem[] = [
  {
    id: "dashboard",
    label: "대시보드",
    icon: <SidebarDashboardIcon className="w-5 h-5" />,
  },
  {
    id: "namespace",
    label: "네임스페이스",
    icon: <SidebarNamespaceIcon className="w-5 h-5" />,
    expandIcon: "plus",
  },
  {
    id: "application",
    label: "애플리케이션",
    icon: <SidebarApplicationIcon className="w-5 h-5" />,
    expandIcon: "plus",
  },
  {
    id: "cicd",
    label: "CI/CD",
    icon: <SidebarCicdIcon className="w-5 h-5" />,
    active: true,
    expanded: true,
    expandIcon: "minus",
    sections: [
      { label: "", items: [{ label: "네임스페이스" }] },
      {
        label: "저장소",
        items: [
          { label: "StorageClasses" },
          { label: "PV" },
          { label: "PVC" },
          { label: "ConfigMaps", active: true, bold: true },
          { label: "Secrets" },
        ],
      },
      {
        label: "파이프라인",
        items: [
          { label: "파이프라인 정의" },
          { label: "파이프라인 실행" },
          { label: "파이프라인 트리거" },
          { label: "파이프라인 통계" },
        ],
      },
      {
        label: "카탈로그",
        items: [{ label: "Service Presets" }],
      },
    ],
  },
  {
    id: "settings",
    label: "설정/권한",
    icon: <SidebarSettingsIcon className="w-5 h-5" />,
    expandIcon: "plus",
  },
  {
    id: "gitops",
    label: "GitOps",
    icon: <SidebarGitopsIcon className="w-5 h-5" />,
    expandIcon: "plus",
  },
];

// ─── Slide ──────────────────────────────────────────────────────────────────

export default function SlideStorageCreate() {
  return (
    <CcpDashboardLayout
      breadcrumbs={[
        { label: "CI/CD" },
        { label: "저장소" },
        { label: "ConfigMaps" },
        { label: "ConfigMaps 생성", isBold: true },
      ]}
      title="ConfigMaps 생성"
      sideMenuItems={sideMenuItems}
    >
      <ContentSection>
        <FormBanner
          title="리소스 생성을 쉽고 빠르게!"
          lines={[
            "기본 설정만 입력하면 바로 시작할 수 있어요.",
            "고급 설정을 원하시면 'YAML 모드'를 ON 해보세요.",
          ]}
        />
      </ContentSection>

      <ContentSection>
        {/* ─── Form + Snippet Split ─────────────────────────────────── */}
        <div className="flex gap-6">
          {/* ─── Left: Form Area ──────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Tab bar + toggles */}
            <div className="flex items-center justify-between mb-4">
              <Tabs
                items={[
                  { id: "basic", label: "기본정보" },
                  { id: "data", label: "Data" },
                ]}
                activeId="basic"
              />
              <div className="flex items-center gap-4">
                <Toggle label="스니펫 추천" checked />
                <Toggle label="YAML 모드" />
              </div>
            </div>

            {/* Form fields */}
            <div className="flex flex-col gap-4 bg-white rounded-lg border border-[#f0f0f0] shadow-[0px_0px_8px_#00000014] p-6">
              {/* 이름 */}
              <InfoRow label="이름" labelWidth="86px">
                <div className="relative flex items-center gap-2 flex-1">
                  <TextInput
                    placeholder="영문 소문자(a-z), 숫자(0-9), 하이픈(-)만 사용 가능하며, 최대 63자까지 입력할 수 있습니다."
                    defaultValue="app-config"
                    className="flex-1"
                  />
                  <Button variant="blue-solid" size="md">
                    중복검사
                  </Button>
                  <Tooltip className="absolute -bottom-8 left-0 z-10">
                    영문 소문자(a-z), 숫자(0-9), 하이픈(-)만 사용해
                    <br />
                    최대 63자까지 입력할 수 있습니다.
                  </Tooltip>
                </div>
              </InfoRow>

              {/* 설명 */}
              <InfoRow label="설명" labelWidth="86px">
                <TextInput
                  placeholder="리소스에 대한 설명을 입력하세요."
                  defaultValue="애플리케이션 공통 설정"
                  className="flex-1"
                />
              </InfoRow>

              {/* 네임스페이스 */}
              <InfoRow label="네임스페이스" labelWidth="86px">
                <TextInput
                  defaultValue="app-backend"
                  readOnly
                  className="flex-1"
                />
              </InfoRow>

              {/* 메타데이터 (Collapsible) */}
              <CollapsibleSection
                title="메타데이터"
                variant="subtle"
                expanded
                onToggle={() => {}}
              >
                <KeyValueEditor
                  label="Labels"
                  pairs={[{ key: "", value: "" }]}
                />
                <KeyValueEditor
                  label="Annotations"
                  pairs={[{ key: "", value: "" }]}
                />
              </CollapsibleSection>
            </div>

            {/* Bottom Actions */}
            <FormActions />
          </div>

          {/* ─── Right: Snippet Panel ────────────────────────────── */}
          <div className="w-[280px] shrink-0">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-bold text-[#333333]">
                스니펫 추천
              </span>
              <span className="text-xs text-[#999999]">총 3개</span>
            </div>
            <div className="flex flex-col gap-3">
              <SnippetCard
                title="기본 리소스 템플릿"
                description="기본 리소스 설정 스니펫"
                variant="blue"
              />
              <SnippetCard
                title="공통 메타데이터 설정"
                description="표준 Labels/Annotations 스니펫"
              />
              <SnippetCard
                title="리소스 정리 정책"
                description="빌드 리소스 정리 정책 Task 추가 스니펫"
                variant="red"
              />
            </div>
          </div>
        </div>
      </ContentSection>
    </CcpDashboardLayout>
  );
}
