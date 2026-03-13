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
  screenId: "CCP-STR-C00",
  title: "리소스 생성 (공통)",
  section: "CI/CD 저장소",
  links: [
    { targetScreenId: "CCP-STR-001-C2", type: "tab", label: "SC Provisioner 탭" },
    { targetScreenId: "CCP-STR-001-C3", type: "tab", label: "SC Parameters 탭" },
{ targetScreenId: "CCP-STR-003-C2", type: "tab", label: "PVC Spec 탭" },
    { targetScreenId: "CCP-STR-004-C1", type: "tab", label: "ConfigMaps Data 탭" },
    { targetScreenId: "CCP-STR-005-C1", type: "tab", label: "Secrets Type 탭" },
  ],
  annotations: [
    { id: 1, label: "안내 배너", description: "리소스 생성 시 기본 설정과 YAML 모드 전환이 가능함을 안내합니다. 처음 사용자가 흐름을 이해할 수 있도록 가이드합니다." },
    { id: 2, label: "생성 폼 탭", description: "기본정보와 Data 탭을 전환합니다. 리소스 유형에 따라 탭 구성이 달라지며, 현재는 기본정보 탭이 활성 상태입니다." },
    { id: 3, label: "스니펫 추천 토글", description: "ON 시 우측에 스니펫 추천 패널을 표시합니다. 자주 사용하는 설정을 빠르게 적용할 수 있습니다." },
    { id: 4, label: "YAML 모드 토글", description: "ON 시 폼 입력 대신 YAML 에디터로 전환하여 직접 매니페스트를 편집할 수 있습니다." },
    { id: 5, label: "이름 입력 및 중복검사", description: "리소스 이름을 입력합니다. 영문 소문자, 숫자, 하이픈만 허용되며 최대 63자입니다. 중복검사 버튼으로 클러스터 내 이름 충돌 여부를 확인합니다." },
    { id: 6, label: "설명 입력", description: "리소스에 대한 설명을 자유롭게 입력합니다. 팀원이 리소스 용도를 파악하는 데 사용됩니다." },
    { id: 7, label: "네임스페이스", description: "리소스가 생성될 네임스페이스를 표시합니다. 읽기 전용으로, 현재 선택된 네임스페이스 컨텍스트에 따라 자동 설정됩니다." },
    { id: 8, label: "메타데이터 섹션", description: "Labels와 Annotations를 key-value 형태로 입력할 수 있는 접을 수 있는 섹션입니다. 리소스 분류와 관리 정보를 추가합니다." },
    { id: 9, label: "폼 액션 버튼", description: "생성/취소 등 폼 제출 액션을 제공합니다. 모든 필수 필드가 채워졌을 때 생성 버튼이 활성화됩니다." },
    { id: 10, label: "스니펫 추천 패널", description: "현재 리소스 유형에 맞는 추천 스니펫 목록을 표시합니다. 클릭 시 해당 스니펫의 설정값이 폼에 자동으로 채워집니다." },
  ],
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
          data-annotation-id="1"
        />
      </ContentSection>

      <ContentSection>
        {/* ─── Form + Snippet Split ─────────────────────────────────── */}
        <div className="flex gap-6">
          {/* ─── Left: Form Area ──────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Tab bar + toggles */}
            <div className="flex items-center justify-between mb-4">
              <div data-annotation-id="2">
                <Tabs
                  items={[
                    { id: "basic", label: "기본정보" },
                    { id: "data", label: "Data" },
                  ]}
                  activeId="basic"
                />
              </div>
              <div className="flex items-center gap-4">
                <div data-annotation-id="3">
                  <Toggle label="스니펫 추천" checked />
                </div>
                <div data-annotation-id="4">
                  <Toggle label="YAML 모드" />
                </div>
              </div>
            </div>

            {/* Form fields */}
            <div className="flex flex-col gap-4 bg-white rounded-lg border border-[#f0f0f0] shadow-[0px_0px_8px_#00000014] p-6">
              {/* 이름 */}
              <div data-annotation-id="5">
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
              </div>

              {/* 설명 */}
              <div data-annotation-id="6">
                <InfoRow label="설명" labelWidth="86px">
                  <TextInput
                    placeholder="리소스에 대한 설명을 입력하세요."
                    defaultValue="애플리케이션 공통 설정"
                    className="flex-1"
                  />
                </InfoRow>
              </div>

              {/* 네임스페이스 */}
              <div data-annotation-id="7">
                <InfoRow label="네임스페이스" labelWidth="86px">
                  <TextInput
                    defaultValue="app-backend"
                    readOnly
                    className="flex-1"
                  />
                </InfoRow>
              </div>

              {/* 메타데이터 (Collapsible) */}
              <CollapsibleSection
                data-annotation-id="8"
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
            <FormActions data-annotation-id="9" />
          </div>

          {/* ─── Right: Snippet Panel ────────────────────────────── */}
          <div className="w-[280px] shrink-0" data-annotation-id="10">
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
