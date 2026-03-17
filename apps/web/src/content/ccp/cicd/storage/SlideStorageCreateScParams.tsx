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
  SidebarTenantIcon,
  SidebarConnectionIcon,
  SidebarServiceMeshIcon,
  SidebarGitopsIcon,
  createSideMenuItems,
} from "../../_components";

import type { SlideMeta } from "@entities/document";

export const slideMeta: SlideMeta = {
  screenId: "CCP-STR-001-C3",
  title: "StorageClasses 생성 - Parameters",
  section: "CI/CD 저장소",
  links: [
    { targetScreenId: "CCP-STR-C00", type: "tab", label: "공통 탭" },
    { targetScreenId: "CCP-STR-001-C2", type: "tab", label: "Provisioner 탭" },
  ],
  annotations: [
    { id: 1, label: "생성 폼 탭", description: "기본정보, Provisioner, Parameters 탭을 전환합니다. Parameters 탭이 활성 상태로, Provisioner에 전달할 세부 파라미터를 편집합니다." },
    { id: 2, label: "스니펫 추천 토글", description: "ON 시 우측에 스니펫 추천 패널을 표시합니다. Provisioner별 파라미터 프리셋을 빠르게 적용할 수 있습니다." },
    { id: 3, label: "YAML 모드 토글", description: "ON 시 폼 입력 대신 YAML 에디터로 전환하여 직접 매니페스트를 편집할 수 있습니다." },
    { id: 4, label: "Parameters key-value 에디터", description: "StorageClass의 Parameters를 key-value 쌍으로 관리합니다. Provisioner별 필수 파라미터(클러스터 ID, 풀, 시크릿 정보 등)를 입력합니다." },
    { id: 5, label: "Provisioner별 주요 Parameters 안내", description: "Ceph RBD, NFS, AWS EBS 등 주요 Provisioner별로 필요한 파라미터 키를 안내합니다. 입력 시 참고할 수 있는 레퍼런스 역할입니다." },
    { id: 6, label: "폼 액션 버튼", description: "생성/취소 등 폼 제출 액션을 제공합니다. 모든 필수 필드가 채워졌을 때 생성 버튼이 활성화됩니다." },
    { id: 7, label: "스니펫 추천 패널", description: "Parameters 탭에 맞는 Provisioner별 파라미터 프리셋 스니펫을 표시합니다. 클릭 시 해당 파라미터 세트가 에디터에 자동 반영됩니다." },
  ],
};

// ─── Side Menu Data ─────────────────────────────────────────────────────────


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
      sideMenuItems={createSideMenuItems({ activeId: "cicd", activeLabel: "StorageClasses" })}
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
                    { id: "provisioner", label: "Provisioner" },
                    { id: "parameters", label: "Parameters" },
                  ]}
                  activeId="parameters"
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

            {/* Parameters tab content */}
            <div className="flex flex-col gap-5 bg-white rounded-lg border border-[#f0f0f0] shadow-[0px_0px_8px_#00000014] p-6">
              <div data-annotation-id="4">
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
              </div>

              {/* 주요 파라미터 안내 */}
              <div className="flex flex-col gap-3 p-4 bg-[#f8f9fa] rounded-md border border-[#e9ecef]" data-annotation-id="5">
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
