import {
  CcpDashboardLayout,
  ContentSection,
  Tabs,
  Toggle,
  TextInput,
  Button,
  KeyValueEditor,
  FormActions,
  SnippetCard,
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
  screenId: "CCP-STR-004-C1",
  title: "ConfigMaps 생성 - Data",
  section: "CI/CD 저장소",
  links: [
    { targetScreenId: "CCP-STR-C00", type: "tab", label: "공통 탭" },
  ],
  annotations: [
    { id: 1, label: "생성 폼 탭", description: "기본정보와 Data 탭을 전환합니다. Data 탭이 활성 상태로, ConfigMap에 저장할 key-value 데이터를 편집합니다." },
    { id: 2, label: "스니펫 추천 토글", description: "ON 시 우측에 스니펫 추천 패널을 표시합니다. 자주 사용하는 설정을 빠르게 적용할 수 있습니다." },
    { id: 3, label: "YAML 모드 토글", description: "ON 시 폼 입력 대신 YAML 에디터로 전환하여 직접 매니페스트를 편집할 수 있습니다." },
    { id: 4, label: "Data key-value 에디터", description: "ConfigMap에 저장할 데이터를 key-value 쌍으로 입력합니다. 행 추가/삭제가 가능하며, Spring 설정 등 애플리케이션 설정값을 등록합니다." },
    { id: 5, label: "파일에서 추가", description: "로컬 파일을 선택하여 ConfigMap 데이터로 일괄 등록합니다. 설정 파일을 직접 업로드할 때 사용합니다." },
    { id: 6, label: "폼 액션 버튼", description: "생성/취소 등 폼 제출 액션을 제공합니다. 모든 필수 필드가 채워졌을 때 생성 버튼이 활성화됩니다." },
    { id: 7, label: "스니펫 추천 패널", description: "ConfigMap 유형에 맞는 추천 스니펫을 표시합니다. 클릭 시 해당 스니펫의 key-value 데이터가 에디터에 자동 반영됩니다." },
  ],
};

// ─── Side Menu Data ─────────────────────────────────────────────────────────


// ─── Slide ──────────────────────────────────────────────────────────────────

export default function SlideStorageCreateData() {
  return (
    <CcpDashboardLayout
      breadcrumbs={[
        { label: "CI/CD" },
        { label: "저장소" },
        { label: "ConfigMaps" },
        { label: "ConfigMaps 생성", isBold: true },
      ]}
      title="ConfigMaps 생성"
      sideMenuItems={createSideMenuItems({ activeId: "cicd", activeLabel: "ConfigMaps" })}
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
                    { id: "data", label: "Data" },
                  ]}
                  activeId="data"
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

            {/* Data tab content */}
            <div className="flex flex-col gap-4 bg-white rounded-lg border border-[#f0f0f0] shadow-[0px_0px_8px_#00000014] p-6">
              <div data-annotation-id="4">
                <KeyValueEditor
                  label="Data"
                  pairs={[
                    { key: "spring.datasource.url", value: "jdbc:mysql://db:3306/app" },
                    { key: "spring.datasource.username", value: "admin" },
                    { key: "server.port", value: "8080" },
                  ]}
                />
              </div>

              {/* 파일에서 추가 */}
              <div className="flex items-center gap-2 pt-2 border-t border-[#f0f0f0]" data-annotation-id="5">
                <Button variant="ghost" size="md">
                  파일에서 추가
                </Button>
                <TextInput
                  placeholder="파일을 선택하세요"
                  readOnly
                  className="flex-1"
                />
              </div>
            </div>

            <FormActions data-annotation-id="6" />
          </div>

          {/* Snippet Panel */}
          <div className="w-[280px] shrink-0" data-annotation-id="7">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-bold text-[#333333]">
                스니펫 추천
              </span>
              <span className="text-xs text-[#999999]">총 3개</span>
            </div>
            <div className="flex flex-col gap-3">
              <SnippetCard
                title="Spring Boot 설정 템플릿"
                description="Spring Boot 애플리케이션 기본 설정 ConfigMap 스니펫"
                variant="blue"
              />
              <SnippetCard
                title="Nginx 설정 템플릿"
                description="기본 Nginx 리버스 프록시 설정 스니펫"
              />
              <SnippetCard
                title="환경변수 일괄 등록"
                description="멀티 환경변수 ConfigMap 일괄 등록 스니펫"
                variant="red"
              />
            </div>
          </div>
        </div>
      </ContentSection>
    </CcpDashboardLayout>
  );
}
