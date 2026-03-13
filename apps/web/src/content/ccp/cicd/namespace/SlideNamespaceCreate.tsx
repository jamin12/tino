import {
  Badge,
  Button,
  CcpDashboardLayout,
  Checkbox,
  ContentSection,
  InfoRow,
  TextCell,
  TextInput,
  Tooltip,
  FormActions,
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
  screenId: "CCP-NS-002",
  title: "Namespace 생성",
  section: "CI/CD 네임스페이스",
  links: [],
  annotations: [
    { id: 1, label: "NS 이름 입력", description: "sample-cicd/ 템플릿 폴더 내 모든 파일에서 'sample'을 입력한 이름으로 치환합니다. 영문 소문자, 숫자, 하이픈만 사용 가능합니다. 중복검사로 k8s-cicd-init 레포에 동일 이름의 폴더가 이미 존재하는지 확인합니다." },
    { id: 2, label: "배포 환경 선택", description: "기존 환경(dev/stg/prd) 중 생성할 환경을 체크합니다. 선택한 환경별로 k8s-app-init 레포의 overlays/{env}/sample-{env}/ 폴더를 복제하여 overlays/{env}/{ns}-{env}/ 폴더가 생성되고, 내부 파일의 'sample'이 입력한 NS 이름으로 치환됩니다. 해당 환경의 kustomization.yaml resources에도 자동으로 참조가 추가됩니다." },
    { id: 3, label: "생성 미리보기", description: "입력한 이름과 선택한 환경에 따라 Gitea API가 두 레포에 생성할 파일 경로입니다. 생성되는 파일 목록은 sample 템플릿의 내용에 따라 달라지며, 공통적으로 k8s-cicd-init에는 {ns}-cicd/ 폴더(sample-cicd/ 복제), 루트 kustomization.yaml 참조 추가, clusterrolebinding.yaml 권한 추가가 반영되고, k8s-app-init에는 환경별 overlays/{env}/{ns}-{env}/ 폴더(sample-{env}/ 복제)와 환경 kustomization.yaml 참조 추가가 반영됩니다." },
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
      { label: "", items: [{ label: "네임스페이스", active: true, bold: true }] },
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
        items: [{ label: "Service Presets" }],
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

export default function SlideNamespaceCreate() {
  return (
    <CcpDashboardLayout
      breadcrumbs={[
        { label: "CI/CD" },
        { label: "네임스페이스" },
        { label: "Namespace 생성", isBold: true },
      ]}
      title="Namespace 생성"
      sideMenuItems={sideMenuItems}
    >
      <ContentSection>
        <div className="max-w-[640px]">
          {/* Form fields */}
          <div className="flex flex-col gap-5 bg-white rounded-lg border border-[#f0f0f0] shadow-[0px_0px_8px_#00000014] p-6">
            {/* 안내 */}
            <TextCell color="#6d7073" className="text-[12px]">
              sample 템플릿을 기반으로 네임스페이스가 생성됩니다. 이름과 배포 환경을 설정한 후 생성 버튼을 클릭하세요.
            </TextCell>

            {/* ── 기본정보 ── */}
            <div className="flex flex-col gap-4">
              <TextCell bold color="#111" className="text-[14px]">
                기본정보
              </TextCell>

              {/* 이름 */}
              <div data-annotation-id="1">
                <InfoRow label="이름" labelWidth="86px">
                  <div className="relative flex items-center gap-2 flex-1">
                    <TextInput
                      placeholder="영문 소문자(a-z), 숫자(0-9), 하이픈(-)만 사용"
                      defaultValue="my-service"
                      className="flex-1"
                    />
                    <Button variant="blue-solid" size="md">
                      중복검사
                    </Button>
                    <Tooltip className="absolute -bottom-8 left-0 z-10">
                      입력한 이름으로 {"{ns}-cicd"} 폴더와 배포 환경이 생성됩니다.
                    </Tooltip>
                  </div>
                </InfoRow>
              </div>
            </div>

            {/* ── 배포 환경 ── */}
            <div className="flex flex-col gap-4 pt-4 border-t border-[#f0f0f0]">
              <div className="flex flex-col gap-2">
                <TextCell bold color="#111" className="text-[14px]">
                  배포 환경
                </TextCell>
                <TextCell color="#6d7073" className="text-[12px]">
                  생성할 배포 환경을 선택하세요. 선택한 환경별로 k8s-app-init 레포에 리소스가 생성됩니다.
                </TextCell>
              </div>

              {/* 기존 환경 체크박스 */}
              <div className="flex flex-col gap-3 pl-1" data-annotation-id="2">
                <div className="flex items-center gap-3">
                  <Checkbox label="dev" checked />
                  <Badge variant="blue-label" size="sm">개발</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox label="stg" checked />
                  <Badge variant="yellow-label" size="sm">스테이징</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox label="prd" />
                  <Badge variant="green-label" size="sm">운영</Badge>
                </div>
              </div>

            </div>

            {/* ── 생성 미리보기 ── */}
            <div className="flex flex-col gap-2 pt-4 border-t border-[#f0f0f0]" data-annotation-id="3">
              <TextCell bold color="#111" className="text-[13px]">
                생성될 리소스 미리보기
              </TextCell>
              <div className="bg-[#f8f9fa] rounded-md p-4 flex flex-col gap-2">
                <TextCell color="#333" className="text-[13px]">
                  k8s-cicd-init
                </TextCell>
                <div className="pl-3 flex flex-col gap-1">
                  <TextCell color="#6d7073" className="text-[12px]">
                    my-service-cicd/ (sample-cicd/ 복제, 내부 파일의 'sample' → 'my-service' 치환)
                  </TextCell>
                  <TextCell color="#6d7073" className="text-[12px]">
                    kustomization.yaml (루트, 참조 추가)
                  </TextCell>
                  <TextCell color="#6d7073" className="text-[12px]">
                    clusterrolebinding.yaml (ServiceAccount 권한 추가)
                  </TextCell>
                </div>
                <TextCell color="#333" className="text-[13px]">
                  k8s-app-init
                </TextCell>
                <div className="pl-3 flex flex-col gap-1">
                  <TextCell color="#6d7073" className="text-[12px]">
                    overlays/dev/my-service-dev/ (sample-dev/ 복제)
                  </TextCell>
                  <TextCell color="#6d7073" className="text-[12px]">
                    overlays/dev/kustomization.yaml (참조 추가)
                  </TextCell>
                  <TextCell color="#6d7073" className="text-[12px]">
                    overlays/stg/my-service-stg/ (sample-stg/ 복제)
                  </TextCell>
                  <TextCell color="#6d7073" className="text-[12px]">
                    overlays/stg/kustomization.yaml (참조 추가)
                  </TextCell>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <FormActions
            left={<></>}
            actions={[
              { label: "취소", variant: "gray-solid" },
              { label: "생성", variant: "primary" },
            ]}
          />
        </div>
      </ContentSection>
    </CcpDashboardLayout>
  );
}
