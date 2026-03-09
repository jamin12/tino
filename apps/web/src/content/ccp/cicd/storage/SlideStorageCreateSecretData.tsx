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
  SidebarGitopsIcon,
} from "../../_components";
import type { SideMenuItem } from "../../_components";
import type { SlideMeta } from "@entities/document";

export const slideMeta: SlideMeta = {
  title: "Secrets 생성 - Data",
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
                activeId="data"
              />
              <div className="flex items-center gap-4">
                <Toggle label="스니펫 추천" checked />
                <Toggle label="YAML 모드" />
              </div>
            </div>

            {/* Data tab content */}
            <div className="flex flex-col gap-4 bg-white rounded-lg border border-[#f0f0f0] shadow-[0px_0px_8px_#00000014] p-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-semibold text-[#333333] tracking-[-0.13px] leading-5">
                  Data
                </span>
                <Button variant="icon" size="icon" aria-label="추가">
                  <span className="text-[#0077ff] text-lg font-bold">+</span>
                </Button>
              </div>

              {/* Secret data rows with masking */}
              <SecretDataRow keyName="DB_PASSWORD" value="s3cur3P@ss!" masked />
              <SecretDataRow keyName="API_KEY" value="ak_live_12345abcdef" masked />
              <SecretDataRow keyName="JWT_SECRET" value="myJwtSecretKey2025" masked={false} />

              {/* 파일에서 추가 */}
              <div className="flex items-center gap-2 pt-2 border-t border-[#f0f0f0]">
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
