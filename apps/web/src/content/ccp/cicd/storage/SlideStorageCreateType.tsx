import {
  CcpDashboardLayout,
  ContentSection,
  Tabs,
  Toggle,
  Select,
  InfoRow,
  FormActions,
  SnippetCard,
  Badge,
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
  screenId: "CCP-STR-005-C1",
  title: "Secrets 생성 - Type",
  section: "CI/CD 저장소",
  links: [
    { targetScreenId: "CCP-STR-C00", type: "tab", label: "공통 탭" },
    { targetScreenId: "CCP-STR-005-C2", type: "tab", label: "Data 탭" },
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
          { label: "ConfigMaps" },
          { label: "Secrets", active: true, bold: true },
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

export default function SlideStorageCreateType() {
  return (
    <CcpDashboardLayout
      breadcrumbs={[
        { label: "CI/CD" },
        { label: "저장소" },
        { label: "Secrets" },
        { label: "Secrets 생성", isBold: true },
      ]}
      title="Secrets 생성"
      sideMenuItems={sideMenuItems}
    >
      <ContentSection>
        <div className="flex gap-6">
          <div className="flex-1 min-w-0">
            {/* Tab bar + toggles */}
            <div className="flex items-center justify-between mb-4">
              <Tabs
                items={[
                  { id: "basic", label: "기본정보" },
                  { id: "type", label: "Type" },
                  { id: "data", label: "Data" },
                ]}
                activeId="type"
              />
              <div className="flex items-center gap-4">
                <Toggle label="스니펫 추천" checked />
                <Toggle label="YAML 모드" />
              </div>
            </div>

            {/* Type tab content */}
            <div className="flex flex-col gap-5 bg-white rounded-lg border border-[#f0f0f0] shadow-[0px_0px_8px_#00000014] p-6">
              <InfoRow label="Secret Type" labelWidth="110px">
                <Select
                  label="Opaque"
                  options={[
                    { value: "Opaque", label: "Opaque" },
                    { value: "kubernetes.io/tls", label: "kubernetes.io/tls" },
                    { value: "kubernetes.io/dockerconfigjson", label: "kubernetes.io/dockerconfigjson" },
                    { value: "kubernetes.io/service-account-token", label: "kubernetes.io/service-account-token" },
                  ]}
                  minWidth="320px"
                />
              </InfoRow>

              {/* Type 설명 */}
              <div className="flex flex-col gap-3 p-4 bg-[#f8f9fa] rounded-md border border-[#e9ecef]">
                <div className="flex items-center gap-2">
                  <Badge variant="blue-label" size="sm">Opaque</Badge>
                  <span className="text-[13px] font-medium text-[#333333]">일반 시크릿</span>
                </div>
                <span className="text-xs text-[#666666] leading-5">
                  임의의 사용자 정의 데이터를 저장하는 기본 Secret 타입입니다.
                  비밀번호, API 키, 토큰 등 다양한 민감 정보를 key-value 형태로 저장할 수 있습니다.
                </span>
              </div>

              {/* 타입별 필수 키 안내 */}
              <div className="flex flex-col gap-2">
                <span className="text-[13px] font-semibold text-[#333333]">
                  타입별 필수 키
                </span>
                <div className="flex flex-col gap-1.5 text-xs text-[#666666]">
                  <div className="flex items-center gap-2">
                    <Badge variant="neutral" size="sm">Opaque</Badge>
                    <span>제한 없음 (자유 key-value)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="neutral" size="sm">kubernetes.io/tls</Badge>
                    <span>tls.crt, tls.key</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="neutral" size="sm">kubernetes.io/dockerconfigjson</Badge>
                    <span>.dockerconfigjson</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="neutral" size="sm">kubernetes.io/service-account-token</Badge>
                    <span>자동 생성 (token, ca.crt, namespace)</span>
                  </div>
                </div>
              </div>
            </div>

            <FormActions />
          </div>

          {/* Snippet Panel */}
          <div className="w-[280px] shrink-0">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-bold text-[#333333]">
                스니펫 추천
              </span>
              <span className="text-xs text-[#999999]">총 3개</span>
            </div>
            <div className="flex flex-col gap-3">
              <SnippetCard
                title="TLS Secret 템플릿"
                description="kubernetes.io/tls 타입 인증서 Secret 스니펫"
                variant="blue"
              />
              <SnippetCard
                title="Docker Registry Secret"
                description="컨테이너 레지스트리 인증 Secret 스니펫"
              />
              <SnippetCard
                title="Opaque Secret 일괄 등록"
                description="멀티 키-값 Opaque Secret 등록 스니펫"
                variant="red"
              />
            </div>
          </div>
        </div>
      </ContentSection>
    </CcpDashboardLayout>
  );
}
