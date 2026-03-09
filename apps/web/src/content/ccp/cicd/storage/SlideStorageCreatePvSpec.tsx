import {
  CcpDashboardLayout,
  ContentSection,
  Tabs,
  Toggle,
  TextInput,
  Select,
  InfoRow,
  Checkbox,
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
  title: "PV 생성 - Spec",
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
          { label: "PV", active: true, bold: true },
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

export default function SlideStorageCreatePvSpec() {
  return (
    <CcpDashboardLayout
      breadcrumbs={[
        { label: "CI/CD" },
        { label: "저장소" },
        { label: "PV" },
        { label: "PV 생성", isBold: true },
      ]}
      title="PV 생성"
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
                  { id: "spec", label: "Spec" },
                ]}
                activeId="spec"
              />
              <div className="flex items-center gap-4">
                <Toggle label="스니펫 추천" checked />
                <Toggle label="YAML 모드" />
              </div>
            </div>

            {/* Spec tab content */}
            <div className="flex flex-col gap-5 bg-white rounded-lg border border-[#f0f0f0] shadow-[0px_0px_8px_#00000014] p-6">
              <InfoRow label="Capacity" labelWidth="130px">
                <div className="flex items-center gap-2">
                  <TextInput defaultValue="50" className="w-24" />
                  <Select
                    label="Gi"
                    options={[
                      { value: "Gi", label: "Gi" },
                      { value: "Mi", label: "Mi" },
                      { value: "Ti", label: "Ti" },
                    ]}
                    minWidth="80px"
                  />
                </div>
              </InfoRow>

              <InfoRow label="Access Modes" labelWidth="130px">
                <div className="flex items-center gap-4">
                  <Checkbox label="ReadWriteOnce" checked />
                  <Checkbox label="ReadOnlyMany" />
                  <Checkbox label="ReadWriteMany" />
                </div>
              </InfoRow>

              <InfoRow label="Reclaim Policy" labelWidth="130px">
                <Select
                  label="Retain"
                  options={[
                    { value: "Retain", label: "Retain" },
                    { value: "Recycle", label: "Recycle" },
                    { value: "Delete", label: "Delete" },
                  ]}
                  minWidth="200px"
                />
              </InfoRow>

              <InfoRow label="StorageClass" labelWidth="130px">
                <Select
                  label="ceph-rbd-sc"
                  options={[
                    { value: "ceph-rbd-sc", label: "ceph-rbd-sc" },
                    { value: "nfs-sc", label: "nfs-sc" },
                    { value: "local-path", label: "local-path" },
                    { value: "", label: "(없음)" },
                  ]}
                  minWidth="200px"
                />
              </InfoRow>

              <InfoRow label="Volume Mode" labelWidth="130px">
                <Select
                  label="Filesystem"
                  options={[
                    { value: "Filesystem", label: "Filesystem" },
                    { value: "Block", label: "Block" },
                  ]}
                  minWidth="200px"
                />
              </InfoRow>

              <InfoRow label="Source Type" labelWidth="130px">
                <Select
                  label="NFS"
                  options={[
                    { value: "nfs", label: "NFS" },
                    { value: "hostPath", label: "HostPath" },
                    { value: "csi", label: "CSI" },
                    { value: "iscsi", label: "iSCSI" },
                    { value: "local", label: "Local" },
                  ]}
                  minWidth="200px"
                />
              </InfoRow>

              <InfoRow label="NFS Server" labelWidth="130px">
                <TextInput
                  defaultValue="10.0.0.100"
                  placeholder="NFS 서버 주소"
                  className="flex-1"
                />
              </InfoRow>

              <InfoRow label="NFS Path" labelWidth="130px">
                <TextInput
                  defaultValue="/exports/data"
                  placeholder="NFS 마운트 경로"
                  className="flex-1"
                />
              </InfoRow>
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
                title="NFS PV 기본 템플릿"
                description="NFS 서버 기반 PersistentVolume 스니펫"
                variant="blue"
              />
              <SnippetCard
                title="HostPath PV 템플릿"
                description="로컬 호스트 경로 PV 스니펫 (개발용)"
              />
              <SnippetCard
                title="CSI PV 고급 설정"
                description="CSI 드라이버 기반 PV 고급 구성 스니펫"
                variant="red"
              />
            </div>
          </div>
        </div>
      </ContentSection>
    </CcpDashboardLayout>
  );
}
