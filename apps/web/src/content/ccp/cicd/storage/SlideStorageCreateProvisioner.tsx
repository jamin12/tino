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
  screenId: "CCP-STR-001-C2",
  title: "StorageClasses 생성 - Provisioner",
  section: "CI/CD 저장소",
  links: [
    { targetScreenId: "CCP-STR-C00", type: "tab", label: "공통 탭" },
    { targetScreenId: "CCP-STR-001-C3", type: "tab", label: "Parameters 탭" },
  ],
  annotations: [
    { id: 1, label: "생성 폼 탭", description: "기본정보, Provisioner, Parameters 탭을 전환합니다. Provisioner 탭이 활성 상태로, 스토리지 프로비저너 설정을 편집합니다." },
    { id: 2, label: "스니펫 추천 토글", description: "ON 시 우측에 스니펫 추천 패널을 표시합니다. 자주 사용하는 Provisioner 설정을 빠르게 적용할 수 있습니다." },
    { id: 3, label: "YAML 모드 토글", description: "ON 시 폼 입력 대신 YAML 에디터로 전환하여 직접 매니페스트를 편집할 수 있습니다." },
    { id: 4, label: "Provisioner 입력", description: "CSI 드라이버 이름 등 Provisioner를 지정합니다. 스토리지 볼륨을 동적으로 프로비저닝하는 드라이버를 결정합니다." },
    { id: 5, label: "Reclaim Policy 선택", description: "PV가 해제될 때 볼륨 처리 방식을 설정합니다. Delete는 볼륨을 자동 삭제하고, Retain은 수동 정리를 위해 보존합니다." },
    { id: 6, label: "Volume Binding Mode 선택", description: "PVC에 볼륨을 바인딩하는 시점을 설정합니다. Immediate는 즉시 바인딩하고, WaitForFirstConsumer는 Pod가 스케줄링될 때까지 대기합니다." },
    { id: 7, label: "Volume Expansion 체크박스", description: "체크 시 PVC 용량 확장을 허용합니다. 운영 중 스토리지 용량이 부족할 때 PVC 크기를 늘릴 수 있습니다." },
    { id: 8, label: "Mount Options 입력", description: "볼륨 마운트 시 적용할 옵션을 쉼표로 구분하여 입력합니다. NFS 버전이나 마운트 모드 등을 지정할 수 있습니다." },
    { id: 9, label: "Parameters key-value 에디터", description: "Provisioner에 전달할 추가 파라미터를 key-value 쌍으로 입력합니다. 클러스터 ID, 풀 이름, 파일시스템 타입 등을 지정합니다." },
    { id: 10, label: "폼 액션 버튼", description: "생성/취소 등 폼 제출 액션을 제공합니다. 모든 필수 필드가 채워졌을 때 생성 버튼이 활성화됩니다." },
    { id: 11, label: "스니펫 추천 패널", description: "StorageClass Provisioner 유형에 맞는 추천 스니펫을 표시합니다. 클릭 시 해당 프로비저너 설정이 폼에 자동 반영됩니다." },
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
              <div data-annotation-id="1">
                <Tabs
                  items={[
                    { id: "basic", label: "기본정보" },
                    { id: "provisioner", label: "Provisioner" },
                    { id: "parameters", label: "Parameters" },
                  ]}
                  activeId="provisioner"
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

            {/* Provisioner tab content */}
            <div className="flex flex-col gap-5 bg-white rounded-lg border border-[#f0f0f0] shadow-[0px_0px_8px_#00000014] p-6">
              <div data-annotation-id="4">
                <InfoRow label="Provisioner" labelWidth="160px">
                  <TextInput
                    defaultValue="rbd.csi.ceph.com"
                    placeholder="Provisioner 이름을 입력하세요"
                    className="flex-1"
                  />
                </InfoRow>
              </div>

              <div data-annotation-id="5">
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
              </div>

              <div data-annotation-id="6">
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
              </div>

              <div data-annotation-id="7">
                <InfoRow label="Volume Expansion" labelWidth="160px">
                  <Checkbox label="AllowVolumeExpansion" checked />
                </InfoRow>
              </div>

              <div data-annotation-id="8">
                <InfoRow label="Mount Options" labelWidth="160px">
                  <TextInput
                    defaultValue="hard,nfsvers=4.1"
                    placeholder="쉼표로 구분하여 입력 (선택)"
                    className="flex-1"
                  />
                </InfoRow>
              </div>

              {/* Parameters */}
              <div data-annotation-id="9">
                <KeyValueEditor
                  label="Parameters"
                  pairs={[
                    { key: "clusterID", value: "ceph-cluster-01" },
                    { key: "pool", value: "kubernetes" },
                    { key: "csi.storage.k8s.io/fstype", value: "ext4" },
                  ]}
                />
              </div>
            </div>

            <FormActions data-annotation-id="10" />
          </div>

          {/* Snippet Panel */}
          <div className="w-[280px] shrink-0" data-annotation-id="11">
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
