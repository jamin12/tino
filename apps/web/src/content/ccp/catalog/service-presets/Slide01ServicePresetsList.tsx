import {
  MoreHorizontal,
  Search,
  ChevronDown,
  ExternalLink,
  Rocket,
} from "lucide-react";
import {
  Badge,
  CcpDashboardLayout,
  ContentSection,
  StatusSummary,
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
  screenId: "CCP-CAT-001",
  title: "Service Presets 목록",
  section: "카탈로그",
  annotations: [
    { id: 1, label: "GitOps 현황 요약", description: "전체 Service Preset 리소스의 GitOps 동기화 상태를 6가지 카테고리(Stable, Mismatch, Updating, Missing, Broken, Orphaned)로 분류하여 보여줍니다. 각 항목을 클릭하면 해당 상태의 프리셋만 필터링됩니다." },
    { id: 2, label: "유형 필터 탭", description: "프리셋 목록을 유형별(전체, Pipeline, Trigger, Task)로 필터링합니다. 선택된 탭에 해당하는 리소스만 테이블에 표시됩니다." },
    { id: 3, label: "검색 및 정렬 필터", description: "GitOps 상태, 이름 등의 조건으로 프리셋을 정렬/필터링하고, 키워드 검색으로 이름이나 설명에 일치하는 프리셋을 찾습니다." },
    { id: 4, label: "프리셋 목록 테이블", description: "등록된 Service Preset 리소스의 목록입니다. 각 행은 GitOps 동기화 상태, 유형 배지, 이름(클릭 시 상세 화면으로 이동), 설명, 네임스페이스, 생성시간을 표시합니다. 체크박스로 다중 선택하여 일괄 작업을 수행할 수 있습니다." },
    { id: 5, label: "행 더보기 메뉴", description: "개별 프리셋 행의 컨텍스트 메뉴입니다. 편집, 복제, 삭제 등의 작업을 수행할 수 있습니다." },
    { id: 6, label: "페이지네이션", description: "프리셋 목록의 페이지를 이동하고, 한 페이지에 표시할 항목 수를 변경할 수 있습니다." },
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

// ─── Preset Data ────────────────────────────────────────────────────────────

interface PresetItem {
  name: string;
  type: "Pipeline" | "Trigger" | "Task";
  description: string;
  namespace: string;
  updatedAt: string;
  gitopsStatus: "Stable" | "Mismatch" | "Updating";
}

const presets: PresetItem[] = [
  {
    name: "docker-build-pipeline",
    type: "Pipeline",
    description: "Docker 이미지 빌드 및 레지스트리 푸시 파이프라인",
    namespace: "tekton-catalog",
    updatedAt: "30분 전",
    gitopsStatus: "Stable",
  },
  {
    name: "maven-deploy-pipeline",
    type: "Pipeline",
    description: "Maven 빌드 및 배포 자동화 파이프라인",
    namespace: "tekton-catalog",
    updatedAt: "30분 전",
    gitopsStatus: "Stable",
  },
  {
    name: "gradle-build-pipeline",
    type: "Pipeline",
    description: "Gradle 프로젝트 빌드 파이프라인",
    namespace: "tekton-catalog",
    updatedAt: "30분 전",
    gitopsStatus: "Stable",
  },
  {
    name: "gradle-deploy-pipeline",
    type: "Pipeline",
    description: "Gradle 빌드 후 Kubernetes 배포 파이프라인",
    namespace: "tekton-catalog",
    updatedAt: "30분 전",
    gitopsStatus: "Stable",
  },
  {
    name: "git-push-trigger",
    type: "Trigger",
    description: "Git Push 이벤트 기반 CI 트리거",
    namespace: "tekton-catalog",
    updatedAt: "1시간 전",
    gitopsStatus: "Stable",
  },
  {
    name: "gradle-build-task",
    type: "Task",
    description: "Gradle 단일 태스크 빌드 프리셋",
    namespace: "tekton-catalog",
    updatedAt: "30분 전",
    gitopsStatus: "Stable",
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function GitOpsDot({ status }: { status: PresetItem["gitopsStatus"] }) {
  const color =
    status === "Stable"
      ? "bg-[#00b30e]"
      : status === "Mismatch"
        ? "bg-[#ff6b00]"
        : "bg-[#0077ff]";
  return <span className={`inline-block w-2 h-2 rounded-full ${color}`} />;
}

function TypeBadge({ type }: { type: PresetItem["type"] }) {
  const variant =
    type === "Pipeline"
      ? "info"
      : type === "Trigger"
        ? "warning"
        : ("neutral" as const);
  return <Badge variant={variant}>{type}</Badge>;
}

// ─── Slide ──────────────────────────────────────────────────────────────────

export default function Slide01ServicePresetsList() {
  return (
    <CcpDashboardLayout
      breadcrumbs={[
        { label: "홈" },
        { label: "카탈로그" },
        { label: "Service Presets", isBold: true },
      ]}
      title="Service Presets"
      sideMenuItems={sideMenuItems}
    >
      {/* GitOps Status Summary */}
      <ContentSection>
        <div className="mb-1" data-annotation-id="1">
          <Badge variant="primary" size="sm">
            GitOps 현황 <span className="ml-1 font-bold">60</span>
          </Badge>
        </div>
        <div className="grid grid-cols-6 gap-3 mt-3">
          {[
            { label: "Stable", count: 10, color: "#00b30e" },
            { label: "Mismatch", count: 0, color: "#ff6b00" },
            { label: "Updating", count: 0, color: "#0077ff" },
            { label: "Missing", count: 0, color: "#ff6b00" },
            { label: "Broken", count: 0, color: "#da1e28" },
            { label: "Orphaned", count: 0, color: "#888" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center py-4 border border-[#e8e8e8] rounded-lg bg-white"
            >
              <div className="flex items-center gap-1.5 text-[12px] text-[#666] mb-1">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                {item.label}
              </div>
              <span className="text-[22px] font-bold text-[#111]">
                {item.count}
                <span className="text-[13px] font-normal text-[#999] ml-0.5">
                  개
                </span>
              </span>
            </div>
          ))}
        </div>
      </ContentSection>

      {/* Filter & Table */}
      <ContentSection>
        {/* Filter tabs */}
        <div className="flex items-center gap-2 mb-4" data-annotation-id="2">
          {["전체", "Pipeline", "Trigger", "Task"].map((tab, idx) => (
            <button
              key={tab}
              type="button"
              className={`px-3 py-1.5 text-[13px] rounded border ${
                idx === 0
                  ? "bg-[#111] text-white border-[#111]"
                  : "bg-white text-[#555] border-[#ddd] hover:bg-[#f6f8fa]"
              }`}
            >
              {tab}
            </button>
          ))}

          {/* Right: search & action */}
          <div className="ml-auto flex items-center gap-2" data-annotation-id="3">
            <div className="flex items-center gap-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 h-[34px] border border-[#ddd] rounded bg-white text-[13px] text-[#555]">
                GitOps 상태
                <ChevronDown className="w-3.5 h-3.5 text-[#999]" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 h-[34px] border border-[#ddd] rounded bg-white text-[13px] text-[#555]">
                이름
                <ChevronDown className="w-3.5 h-3.5 text-[#999]" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 h-[34px] border border-[#ddd] rounded px-3 bg-white w-[180px]">
              <span className="text-[13px] text-[#999]">키워드 검색</span>
            </div>
            <button
              type="button"
              className="flex items-center justify-center w-[34px] h-[34px] border border-[#ddd] rounded bg-white hover:bg-[#f6f8fa]"
            >
              <Search className="w-3.5 h-3.5 text-[#555]" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-[#e0e0e0] rounded overflow-hidden" data-annotation-id="4">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#e0e0e0] bg-[#fafafa] text-[12px] font-semibold text-[#555]">
                <th className="px-4 py-2.5 w-[40px]">
                  <input type="checkbox" className="accent-[#0077ff]" />
                </th>
                <th className="px-4 py-2.5 w-[50px]">GitOps</th>
                <th className="px-4 py-2.5 w-[100px]">유형</th>
                <th className="px-4 py-2.5">이름</th>
                <th className="px-4 py-2.5">설명</th>
                <th className="px-4 py-2.5 w-[130px]">네임스페이스</th>
                <th className="px-4 py-2.5 w-[80px] text-right">생성시간</th>
                <th className="px-4 py-2.5 w-[50px]" />
              </tr>
            </thead>
            <tbody>
              {presets.map((preset, i) => (
                <tr
                  key={preset.name}
                  className={`${
                    i < presets.length - 1
                      ? "border-b border-[#f0f0f0]"
                      : ""
                  } hover:bg-[#f9fafb]`}
                >
                  <td className="px-4 py-2.5">
                    <input type="checkbox" className="accent-[#0077ff]" />
                  </td>
                  <td className="px-4 py-2.5">
                    <GitOpsDot status={preset.gitopsStatus} />
                  </td>
                  <td className="px-4 py-2.5">
                    <TypeBadge type={preset.type} />
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="text-[13px] text-[#0077ff] font-medium cursor-pointer hover:underline">
                      {preset.name}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="text-[12px] text-[#888]">
                      {preset.description}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="text-[13px] text-[#333]">
                      {preset.namespace}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <span className="text-[12px] text-[#999]">
                      {preset.updatedAt}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <button
                      type="button"
                      className="p-1 text-[#888] hover:bg-[#eee] rounded"
                      data-annotation-id="5"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-1 mt-4" data-annotation-id="6">
          <span className="text-[12px] text-[#999]">«</span>
          <span className="text-[12px] text-[#999] mx-1">‹</span>
          <span className="w-6 h-6 flex items-center justify-center bg-[#0077ff] text-white text-[12px] rounded">
            1
          </span>
          {[2, 3, 4, 5].map((n) => (
            <span
              key={n}
              className="w-6 h-6 flex items-center justify-center text-[12px] text-[#555] cursor-pointer hover:bg-[#eee] rounded"
            >
              {n}
            </span>
          ))}
          <span className="text-[12px] text-[#999] mx-1">⋯</span>
          <span className="w-6 h-6 flex items-center justify-center text-[12px] text-[#555]">
            32
          </span>
          <span className="text-[12px] text-[#999] mx-1">›</span>
          <span className="text-[12px] text-[#999]">»</span>
          <span className="ml-3 text-[12px] text-[#999]">5 ∨</span>
        </div>
      </ContentSection>
    </CcpDashboardLayout>
  );
}
