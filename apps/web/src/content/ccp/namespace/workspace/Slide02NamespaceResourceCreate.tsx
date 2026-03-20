import {
  Button,
  CcpDashboardLayout,
  ContentSection,
  InfoRow,
  Select,
  Tabs,
  TextInput,
  Toggle,
  FormActions,
  createSideMenuItems,
} from "../../_components";
import type { SlideMeta } from "@entities/document";

export const slideMeta: SlideMeta = {
  screenId: "CCP-NSR-002",
  title: "Namespace 생성 (리스트)",
  section: "네임스페이스",
  links: [
    { targetScreenId: "CCP-NS-002", type: "tab", label: "GitOps 탭 → 워크스페이스 생성" },
  ],
  annotations: [
    {
      id: 1,
      label: "탭 전환",
      description: "- **네임스페이스** (현재): K8s namespace 단일 리소스 생성 폼\n- **GitOps**: 워크스페이스 생성 화면(CCP-NS-002)과 동일. RBAC, PV/PVC, Secret, VirtualService 등 전체 작업 환경을 프로비저닝",
    },
    {
      id: 2,
      label: "YAML 모드 토글",
      description: "활성화하면 폼 대신 YAML 에디터가 표시됩니다. `kubectl apply -f`와 동일한 방식으로 namespace를 생성할 수 있습니다.",
    },
    {
      id: 3,
      label: "클러스터 선택",
      description: "namespace를 생성할 대상 클러스터를 선택합니다. GNB에서 선택된 클러스터가 기본값으로 설정됩니다.",
    },
    {
      id: 4,
      label: "네임스페이스 이름",
      description: "생성할 K8s namespace의 이름을 입력합니다.\n\n???RFC 1123: 소문자 영문, 숫자, 하이픈(-) 사용 가능. 63자 이내.???",
    },
    {
      id: 5,
      label: "레이블 / 어노테이션",
      description: "namespace에 추가할 K8s Labels, Annotations (key=value 쌍)을 설정합니다. 추가 버튼으로 여러 쌍을 입력할 수 있습니다.",
    },
    {
      id: 6,
      label: "임시저장",
      description: "현재 입력한 폼 상태를 임시저장합니다. 나중에 생성 화면에 재진입하면 저장된 상태를 복원할 수 있습니다.",
    },
    {
      id: 7,
      label: "검증",
      description: "생성 전 사전 검증을 수행합니다. 선택한 클러스터에 동일 이름의 namespace가 이미 존재하는지, 이름이 RFC 1123 규격에 맞는지 등을 확인하여 충돌 및 유효성 여부를 알려줍니다.",
    },
    {
      id: 8,
      label: "생성",
      description: "검증을 통과한 후 K8s API를 호출하여 namespace를 생성합니다.\n\n!!!이 기능은 namespace 오브젝트만 생성합니다. 작업 환경(RBAC, Secret 등)이 필요하면 GitOps 탭을 이용하세요.!!!",
    },
  ],
};

// ─── Slide ──────────────────────────────────────────────────────────────────

export default function Slide02NamespaceResourceCreate() {
  return (
    <CcpDashboardLayout
      gnbPreset="namespace"
      breadcrumbs={[
        { label: "네임스페이스" },
        { label: "네임스페이스 생성", isBold: true },
      ]}
      title="네임스페이스 생성"
      sideMenuItems={createSideMenuItems({ activeId: "namespace" })}
    >
      <ContentSection card>
        {/* Tab + YAML toggle */}
        <ContentSection className="flex items-center justify-between w-full px-6">
          <Tabs
            items={[
              { id: "namespace", label: "네임스페이스" },
              { id: "gitops", label: "GitOps" },
            ]}
            activeId="namespace"
            data-annotation-id="1"
          />
          <Toggle label="YAML 모드" data-annotation-id="2" />
        </ContentSection>

        {/* Form */}
        <ContentSection className="flex flex-col gap-5 px-6">
          <InfoRow label="클러스터" labelWidth="120px" data-annotation-id="3">
            <Select
              options={[
                { value: "", label: "선택하세요" },
                { value: "dev-cluster", label: "dev-cluster" },
                { value: "prd-cluster", label: "prd-cluster" },
              ]}
              className="flex-1"
            />
          </InfoRow>

          <InfoRow label="네임스페이스 이름 ⓘ" labelWidth="120px" data-annotation-id="4">
            <TextInput
              placeholder="예: my-namespace"
              className="flex-1"
            />
          </InfoRow>

          <InfoRow label="레이블 ⓘ" labelWidth="120px" data-annotation-id="5">
            <ContentSection className="flex items-center gap-2 flex-1">
              <TextInput placeholder="key" className="flex-1" />
              <TextInput placeholder="value" className="flex-1" />
              <Button variant="blue-solid" size="sm">
                추가
              </Button>
            </ContentSection>
          </InfoRow>

          <InfoRow label="어노테이션 ⓘ" labelWidth="120px">
            <ContentSection className="flex items-center gap-2 flex-1">
              <TextInput placeholder="key" className="flex-1" />
              <TextInput placeholder="value" className="flex-1" />
              <Button variant="blue-solid" size="sm">
                추가
              </Button>
            </ContentSection>
          </InfoRow>
        </ContentSection>

        <FormActions
          actions={[
            { label: "취소", variant: "gray-solid" },
            { label: "임시저장", variant: "ghost", annotationId: 6 },
            { label: "검증", variant: "blue-solid", annotationId: 7 },
            { label: "생성", variant: "primary", annotationId: 8 },
          ]}
        />
      </ContentSection>
    </CcpDashboardLayout>
  );
}
