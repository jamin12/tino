import {
  CcpDashboardLayout,
  ContentSection,
  Tabs,
  Toggle,
  TextInput,
  Select,
  InfoRow,
  Checkbox,
  KeyValueEditor,
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
  title: "StorageClasses 생성 - Provisioner",
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
          { label: "StorageClasses", active: true, bold: true },
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

export default function SlideStorageCreateProvisioner() {
  return (
    <CcpDashboardLayout
      breadcrumbs={[
        { label: "CI/CD" },
        { label: "저장소" },
        { label: "StorageClasses" },
        { label: "StorageClasses 생성", isBold: true },
      ]}
      title="StorageClasses 생성"
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
                  { id: "provisioner", label: "Provisioner" },
                  { id: "parameters", label: "Parameters" },
                ]}
                activeId="provisioner"
              />
              <div className="flex items-center gap-4">
                <Toggle label="스니펫 추천" checked />
                <Toggle label="YAML 모드" />
              </div>
            </div>

            {/* Provisioner tab content */}
            <div className="flex flex-col gap-5 bg-white rounded-lg border border-[#f0f0f0] shadow-[0px_0px_8px_#00000014] p-6">
              <InfoRow label="Provisioner" labelWidth="160px">
                <TextInput
                  defaultValue="rbd.csi.ceph.com"
                  placeholder="Provisioner 이름을 입력하세요"
                  className="flex-1"
                />
              </InfoRow>

              <InfoRow label="Reclaim Policy" labelWidth="160px">
                <Select
                  label="Delete"
                  options={[
                    { value: "Delete", label: "Delete" },
                    { value: "Retain", label: "Retain" },
                  ]}
                  minWidth="200px"
                />
              </InfoRow>

              <InfoRow label="Volume Binding Mode" labelWidth="160px">
                <Select
                  label="Immediate"
                  options={[
                    { value: "Immediate", label: "Immediate" },
                    { value: "WaitForFirstConsumer", label: "WaitForFirstConsumer" },
                  ]}
                  minWidth="260px"
                />
              </InfoRow>

              <InfoRow label="Volume Expansion" labelWidth="160px">
                <Checkbox label="AllowVolumeExpansion" checked />
              </InfoRow>

              <InfoRow label="Mount Options" labelWidth="160px">
                <TextInput
                  defaultValue="hard,nfsvers=4.1"
                  placeholder="쉼표로 구분하여 입력 (선택)"
                  className="flex-1"
                />
              </InfoRow>

              {/* Parameters */}
              <KeyValueEditor
                label="Parameters"
                pairs={[
                  { key: "clusterID", value: "ceph-cluster-01" },
                  { key: "pool", value: "kubernetes" },
                  { key: "csi.storage.k8s.io/fstype", value: "ext4" },
                ]}
              />
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
                title="Ceph RBD StorageClass"
                description="Ceph RBD Provisioner 기반 StorageClass 스니펫"
                variant="blue"
              />
              <SnippetCard
                title="NFS Provisioner 템플릿"
                description="NFS 외부 Provisioner StorageClass 스니펫"
              />
              <SnippetCard
                title="Local Path StorageClass"
                description="로컬 경로 기반 StorageClass 고급 설정 스니펫"
                variant="red"
              />
            </div>
          </div>
        </div>
      </ContentSection>
    </CcpDashboardLayout>
  );
}
