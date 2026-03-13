import {
  MoreHorizontal,
  ChevronDown,
} from "lucide-react";
import {
  Badge,
  CcpDashboardLayout,
  ContentSection,
  InfoRow,
  Tabs,
} from "../../_components";
import type { SideMenuItem } from "../../_components";
import type { SlideMeta } from "@entities/document";
import {
  SidebarDashboardIcon,
  SidebarNamespaceIcon,
  SidebarApplicationIcon,
  SidebarCicdIcon,
  SidebarSettingsIcon,
  SidebarGitopsIcon,
} from "../../_components";

export const slideMeta: SlideMeta = {
  screenId: "CCP-CAT-002",
  title: "Service Presets 상세",
  section: "카탈로그",
  annotations: [
    { id: 1, label: "프리셋 타이틀 및 상태", description: "선택한 프리셋의 이름과 GitOps 동기화 상태(Stable/Mismatch 등)를 표시합니다. 상태 아이콘에 마우스를 올리면 Sync 상태, Health 상태를 포함한 상세 툴팁이 나타납니다." },
    { id: 2, label: "더보기 메뉴", description: "프리셋에 대한 추가 작업(편집, 복제, 삭제, YAML 보기 등)을 제공하는 컨텍스트 메뉴를 엽니다." },
    { id: 3, label: "상세 탭 네비게이션", description: "기본정보, Params, Workspaces, Workflow, GitOps 탭 간 전환합니다. 각 탭은 프리셋의 서로 다른 설정 영역을 표시합니다. GitOps 탭은 구분선으로 분리되어 배포 관련 정보를 별도로 확인할 수 있습니다." },
    { id: 4, label: "기본정보 카드", description: "프리셋의 이름, 설명, 네임스페이스, API 버전, 유형 등 핵심 메타데이터를 읽기 전용으로 표시합니다." },
    { id: 5, label: "메타데이터 접기/펼치기", description: "Labels, Annotations 등 Kubernetes 메타데이터 섹션을 토글합니다. 접혀 있을 때는 공간을 절약하고, 펼치면 전체 라벨/어노테이션 목록을 확인할 수 있습니다." },
    { id: 6, label: "Labels 목록", description: "프리셋 리소스에 설정된 Kubernetes Labels를 배지 형태로 표시합니다. 리소스 분류 및 셀렉터 매칭에 사용됩니다." },
    { id: 7, label: "Annotations 목록", description: "프리셋 리소스에 설정된 Kubernetes Annotations를 배지 형태로 표시합니다. 부가 메타데이터나 도구 설정 정보가 포함됩니다." },
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
      {
        label: "저장소",
        items: [
          { label: "StorageClasses" },
          { label: "PV" },
          { label: "PVC" },
          { label: "ConfigMaps" },
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
        items: [{ label: "Service Presets", active: true, bold: true }],
      },
    ],
  },
  {
    id: "gitops",
    label: "GitOps",
    icon: <SidebarGitopsIcon className="w-5 h-5" />,
    expandIcon: "plus",
  },
  {
    id: "settings",
    label: "설정/권한",
    icon: <SidebarSettingsIcon className="w-5 h-5" />,
    expandIcon: "plus",
  },
];

// ─── Slide ──────────────────────────────────────────────────────────────────

export default function Slide02ServicePresetsDetail() {
  return (
    <CcpDashboardLayout
      breadcrumbs={[
        { label: "홈" },
        { label: "카탈로그" },
        { label: "Service Presets", isBold: true },
      ]}
      title={
        <span className="group relative inline-flex items-center gap-2" data-annotation-id="1">
          <span className="rounded-full shrink-0 w-2.5 h-2.5 bg-[#00b30e]" />
          <span>docker-build-pipeline</span>
          <Badge variant="info">Preset</Badge>
          {/* Status tooltip */}
          <span className="pointer-events-none absolute top-full left-0 mt-1 z-50 hidden group-hover:inline-flex items-center gap-2 px-3 py-1.5 bg-[#1b2c3f] rounded-[0px_12px_12px_12px] shadow-[4px_4px_8px_#1b2c3f33] whitespace-nowrap">
            <span className="inline-flex items-center gap-1.5">
              <span className="rounded-full w-2 h-2 bg-[#00b30e]" />
              <span className="text-white text-[11px]">Stable</span>
            </span>
            <span className="text-[#ffffff44] text-[11px]">|</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="text-[#00b30e] text-[11px]">♥</span>
              <span className="text-white text-[11px]">Healthy</span>
            </span>
            <span className="text-[#ffffff44] text-[11px]">|</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="text-[#00b30e] text-[11px]">✓</span>
              <span className="text-white text-[11px]">Synced</span>
            </span>
          </span>
        </span>
      }
      sideMenuItems={sideMenuItems}
      headerActions={
        <button
          type="button"
          className="flex items-center justify-center w-8 h-8 rounded hover:bg-[#f0f0f0] text-[#666]"
          data-annotation-id="2"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      }
    >
      {/* Tabs */}
      <ContentSection>
        <div data-annotation-id="3">
          <Tabs
            items={[
              { id: "basic", label: "기본정보" },
              { id: "params", label: "Params" },
              { id: "workspaces", label: "Workspaces" },
              { id: "workflow", label: "Workflow" },
              { id: "gitops", label: "GitOps", dividerBefore: true },
            ]}
            activeId="basic"
            className="mb-0"
          />
        </div>
      </ContentSection>

      {/* Detail Card */}
      <ContentSection card>
        <div className="p-1 space-y-1" data-annotation-id="4">
          <InfoRow label="이름" labelWidth="140px">
            <span className="text-[13px] font-medium text-[#333]">
              docker-build-pipeline
            </span>
          </InfoRow>
          <InfoRow label="설명" labelWidth="140px">
            <span className="text-[13px] font-medium text-[#555]">
              Docker 이미지 빌드 및 레지스트리 푸시 파이프라인
            </span>
          </InfoRow>
          <InfoRow label="네임스페이스" labelWidth="140px">
            <span className="text-[13px] font-medium text-[#333]">
              tekton-catalog
            </span>
          </InfoRow>
          <InfoRow label="API 버전" labelWidth="140px">
            <span className="text-[13px] font-medium text-[#333]">
              tekton.dev/v1beta1
            </span>
          </InfoRow>
          <InfoRow label="유형" labelWidth="140px">
            <Badge variant="info">Pipeline</Badge>
          </InfoRow>

          {/* 메타데이터 */}
          <div data-annotation-id="5">
            <InfoRow label="메타데이터" labelWidth="140px">
              <button
                type="button"
                className="text-[13px] text-[#555] flex items-center gap-1"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </InfoRow>
          </div>

          {/* Labels */}
          <div data-annotation-id="6">
          <InfoRow label="Labels" labelWidth="140px">
            <div className="flex flex-wrap gap-1.5">
              {[
                "app=docker-build",
                "type=pipeline",
                "catalog=tekton",
                "tier=ci",
              ].map((label) => (
                <Badge key={label} variant="neutral" size="sm">
                  {label}
                </Badge>
              ))}
            </div>
          </InfoRow>
          </div>

          {/* Annotations */}
          <div data-annotation-id="7">
          <InfoRow label="Annotations" labelWidth="140px">
            <div className="flex flex-wrap gap-1.5">
              {[
                "app=docker-build",
                "catalog=tekton",
                "version=v1.0",
              ].map((ann) => (
                <Badge key={ann} variant="neutral" size="sm">
                  {ann}
                </Badge>
              ))}
            </div>
          </InfoRow>
          </div>
        </div>
      </ContentSection>
    </CcpDashboardLayout>
  );
}
