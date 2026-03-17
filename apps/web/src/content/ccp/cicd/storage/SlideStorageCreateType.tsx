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
  SidebarTenantIcon,
  SidebarConnectionIcon,
  SidebarServiceMeshIcon,
  SidebarGitopsIcon,
  createSideMenuItems,
} from "../../_components";

import type { SlideMeta } from "@entities/document";

export const slideMeta: SlideMeta = {
  screenId: "CCP-STR-005-C1",
  title: "Secrets 생성 - Type",
  section: "CI/CD 저장소",
  links: [
    { targetScreenId: "CCP-STR-C00", type: "tab", label: "공통 탭" },
    { targetScreenId: "CCP-STR-005-C2", type: "tab", label: "Data 탭" },
  ],
  annotations: [
    { id: 1, label: "생성 폼 탭", description: "기본정보, Type, Data 탭을 전환합니다. Type 탭이 활성 상태로, Secret의 타입을 선택하고 관련 정보를 확인합니다." },
    { id: 2, label: "스니펫 추천 토글", description: "ON 시 우측에 스니펫 추천 패널을 표시합니다. 자주 사용하는 Secret 타입별 템플릿을 빠르게 적용할 수 있습니다." },
    { id: 3, label: "YAML 모드 토글", description: "ON 시 폼 입력 대신 YAML 에디터로 전환하여 직접 매니페스트를 편집할 수 있습니다." },
    { id: 4, label: "Secret Type 선택", description: "Secret의 타입을 선택합니다. Opaque(일반), TLS(인증서), dockerconfigjson(레지스트리 인증), service-account-token 중 선택하며, 타입에 따라 Data 탭의 필수 키가 달라집니다." },
    { id: 5, label: "선택된 타입 설명", description: "현재 선택한 Secret 타입의 용도와 특성을 설명합니다. 사용자가 적절한 타입을 선택하도록 가이드합니다." },
    { id: 6, label: "타입별 필수 키 안내", description: "각 Secret 타입별로 Data 탭에서 반드시 입력해야 할 키 이름을 안내합니다. 예를 들어 TLS는 tls.crt과 tls.key가 필요합니다." },
    { id: 7, label: "폼 액션 버튼", description: "생성/취소 등 폼 제출 액션을 제공합니다. 모든 필수 필드가 채워졌을 때 생성 버튼이 활성화됩니다." },
    { id: 8, label: "스니펫 추천 패널", description: "Secret 타입에 맞는 추천 스니펫을 표시합니다. 클릭 시 해당 타입의 기본 구성이 폼에 자동 반영됩니다." },
  ],
};

// ─── Side Menu Data ─────────────────────────────────────────────────────────


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
      sideMenuItems={createSideMenuItems({ activeId: "cicd", activeLabel: "Secrets" })}
    >
      <ContentSection>
        <div className="flex gap-6">
          <div className="flex-1 min-w-0">
            {/* Tab bar + toggles */}
            <div className="flex items-center justify-between mb-4">
              <div data-annotation-id="1">
                <Tabs
                  items={[
                    { id: "basic", label: "기본정보" },
                    { id: "type", label: "Type" },
                    { id: "data", label: "Data" },
                  ]}
                  activeId="type"
                />
              </div>
              <div className="flex items-center gap-4">
                <div data-annotation-id="2">
                  <Toggle label="스니펫 추천" checked />
                </div>
                <div data-annotation-id="3">
                  <Toggle label="YAML 모드" />
                </div>
              </div>
            </div>

            {/* Type tab content */}
            <div className="flex flex-col gap-5 bg-white rounded-lg border border-[#f0f0f0] shadow-[0px_0px_8px_#00000014] p-6">
              <div data-annotation-id="4">
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
              </div>

              {/* Type 설명 */}
              <div className="flex flex-col gap-3 p-4 bg-[#f8f9fa] rounded-md border border-[#e9ecef]" data-annotation-id="5">
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
              <div className="flex flex-col gap-2" data-annotation-id="6">
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

            <FormActions data-annotation-id="7" />
          </div>

          {/* Snippet Panel */}
          <div className="w-[280px] shrink-0" data-annotation-id="8">
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
