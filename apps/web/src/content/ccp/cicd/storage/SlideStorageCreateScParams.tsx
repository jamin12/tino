import {
  CcpDashboardLayout,
  ContentSection,
  Tabs,
  Toggle,
  KeyValueEditor,
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
  title: "StorageClasses 생성 - Parameters",
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

export default function SlideStorageCreateScParams() {
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
                activeId="parameters"
              />
              <div className="flex items-center gap-4">
                <Toggle label="스니펫 추천" checked />
                <Toggle label="YAML 모드" />
              </div>
            </div>

            {/* Parameters tab content */}
            <div className="flex flex-col gap-5 bg-white rounded-lg border border-[#f0f0f0] shadow-[0px_0px_8px_#00000014] p-6">
              <KeyValueEditor
                label="Parameters"
                pairs={[
                  { key: "clusterID", value: "ceph-cluster-01" },
                  { key: "pool", value: "kubernetes" },
                  { key: "imageFeatures", value: "layering" },
                  { key: "csi.storage.k8s.io/provisioner-secret-name", value: "rook-csi-rbd-provisioner" },
                  { key: "csi.storage.k8s.io/provisioner-secret-namespace", value: "rook-ceph" },
                  { key: "csi.storage.k8s.io/fstype", value: "ext4" },
                ]}
              />

              {/* 주요 파라미터 안내 */}
              <div className="flex flex-col gap-3 p-4 bg-[#f8f9fa] rounded-md border border-[#e9ecef]">
                <span className="text-[13px] font-semibold text-[#333333]">
                  Provisioner별 주요 Parameters
                </span>
                <div className="flex flex-col gap-2 text-xs text-[#666666]">
                  <div className="flex items-start gap-2">
                    <Badge variant="blue-label" size="sm" className="shrink-0 mt-0.5">Ceph RBD</Badge>
                    <span>clusterID, pool, imageFeatures, csi.storage.k8s.io/fstype</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="blue-label" size="sm" className="shrink-0 mt-0.5">NFS</Badge>
                    <span>server, share, mountOptions</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="blue-label" size="sm" className="shrink-0 mt-0.5">AWS EBS</Badge>
                    <span>type (gp3, io2), iopsPerGB, encrypted, fsType</span>
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
                title="Ceph RBD Parameters"
                description="Ceph RBD 필수 파라미터 프리셋 스니펫"
                variant="blue"
              />
              <SnippetCard
                title="NFS Parameters"
                description="NFS Provisioner 파라미터 스니펫"
              />
              <SnippetCard
                title="AWS EBS gp3 Parameters"
                description="AWS EBS gp3 타입 파라미터 스니펫"
                variant="red"
              />
            </div>
          </div>
        </div>
      </ContentSection>
    </CcpDashboardLayout>
  );
}
