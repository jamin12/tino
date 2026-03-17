import { Eye, EyeOff } from "lucide-react";
import {
  CcpDashboardLayout,
  ContentSection,
  Tabs,
  Toggle,
  TextInput,
  Button,
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
  screenId: "CCP-STR-005-C2",
  title: "Secrets 생성 - Data",
  section: "CI/CD 저장소",
  links: [
    { targetScreenId: "CCP-STR-C00", type: "tab", label: "공통 탭" },
    { targetScreenId: "CCP-STR-005-C1", type: "tab", label: "Type 탭" },
  ],
  annotations: [
    { id: 1, label: "생성 폼 탭", description: "기본정보, Type, Data 탭을 전환합니다. Data 탭이 활성 상태로, Secret에 저장할 민감 데이터를 편집합니다." },
    { id: 2, label: "스니펫 추천 토글", description: "ON 시 우측에 스니펫 추천 패널을 표시합니다. 자주 사용하는 Secret 템플릿을 빠르게 적용할 수 있습니다." },
    { id: 3, label: "YAML 모드 토글", description: "ON 시 폼 입력 대신 YAML 에디터로 전환하여 직접 매니페스트를 편집할 수 있습니다." },
    { id: 4, label: "Data 헤더 및 추가 버튼", description: "Secret의 key-value 데이터 목록의 헤더입니다. + 버튼으로 새로운 시크릿 데이터 행을 추가합니다." },
    { id: 5, label: "Secret 데이터 행", description: "각 행은 key와 마스킹된 value로 구성됩니다. 눈 아이콘으로 값을 표시/숨김 전환하고, X 버튼으로 행을 삭제합니다." },
    { id: 6, label: "파일에서 추가", description: "로컬 파일을 선택하여 Secret 데이터로 일괄 등록합니다. 인증서나 설정 파일을 직접 업로드할 때 사용합니다." },
    { id: 7, label: "폼 액션 버튼", description: "생성/취소 등 폼 제출 액션을 제공합니다. 모든 필수 필드가 채워졌을 때 생성 버튼이 활성화됩니다." },
    { id: 8, label: "스니펫 추천 패널", description: "Secret 유형에 맞는 추천 스니펫을 표시합니다. 클릭 시 해당 스니펫의 key-value 데이터가 폼에 자동 반영됩니다." },
  ],
};

// ─── Side Menu Data ─────────────────────────────────────────────────────────


// ─── Secret Data Row ────────────────────────────────────────────────────────

interface SecretDataRowProps {
  keyName: string;
  value: string;
  masked?: boolean;
}

function SecretDataRow({ keyName, value, masked = true }: SecretDataRowProps) {
  return (
    <div className="flex items-center gap-2">
      <TextInput defaultValue={keyName} placeholder="key" className="flex-1" readOnly />
      <div className="relative flex-1">
        <TextInput
          defaultValue={masked ? "••••••••••" : value}
          placeholder="value"
          className="w-full pr-8"
          readOnly
        />
        <Button
          variant="icon"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 !w-6 !h-6"
          aria-label={masked ? "보기" : "숨기기"}
        >
          {masked ? (
            <EyeOff className="w-3.5 h-3.5 text-[#999999]" />
          ) : (
            <Eye className="w-3.5 h-3.5 text-[#0077ff]" />
          )}
        </Button>
      </div>
      <Button variant="icon" size="icon" aria-label="삭제">
        <span className="text-[#da1e28] text-sm font-bold">✕</span>
      </Button>
    </div>
  );
}

// ─── Slide ──────────────────────────────────────────────────────────────────

export default function SlideStorageCreateSecretData() {
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
              {/* Header */}
              <div className="flex items-center justify-between" data-annotation-id="4">
                <span className="text-[13px] font-semibold text-[#333333] tracking-[-0.13px] leading-5">
                  Data
                </span>
                <Button variant="icon" size="icon" aria-label="추가">
                  <span className="text-[#0077ff] text-lg font-bold">+</span>
                </Button>
              </div>

              {/* Secret data rows with masking */}
              <div className="flex flex-col gap-4" data-annotation-id="5">
                <SecretDataRow keyName="DB_PASSWORD" value="s3cur3P@ss!" masked />
                <SecretDataRow keyName="API_KEY" value="ak_live_12345abcdef" masked />
                <SecretDataRow keyName="JWT_SECRET" value="myJwtSecretKey2025" masked={false} />
              </div>

              {/* 파일에서 추가 */}
              <div className="flex items-center gap-2 pt-2 border-t border-[#f0f0f0]" data-annotation-id="6">
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
