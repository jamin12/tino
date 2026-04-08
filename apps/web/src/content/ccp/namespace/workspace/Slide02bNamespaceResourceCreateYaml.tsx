import {
  CcpDashboardLayout,
  CodeEditor,
  ContentSection,
  InfoRow,
  Select,
  Tabs,
  Toggle,
  FormActions,
  createSideMenuItems,
} from "../../_components";
import type { SlideMeta } from "@entities/document";

export const slideMeta: SlideMeta = {
  screenId: "CCP-NSR-002b",
  title: "Namespace 생성 — YAML 모드",
  section: "네임스페이스",
  subSection: "리스트 보기",
  links: [
    { targetScreenId: "CCP-NSR-002", type: "toggle", label: "YAML 모드 OFF → 폼 모드" },
    { targetScreenId: "CCP-NS-002", type: "tab", label: "GitOps 탭 → 워크스페이스 생성" },
  ],
  annotations: [
    {
      id: 1,
      label: "탭 전환",
      description: "- **네임스페이스** (현재): K8s namespace 단일 리소스 생성\n- **GitOps**: 워크스페이스 생성 화면(CCP-NS-002)과 동일",
    },
    {
      id: 2,
      label: "YAML 모드 (활성)",
      description: "현재 YAML 모드가 **활성화**된 상태입니다. 토글을 끄면 폼 모드(CCP-NSR-002)로 전환됩니다.",
    },
    {
      id: 3,
      label: "클러스터 선택",
      description: "YAML 모드에서도 대상 클러스터는 반드시 선택해야 합니다. YAML 내부에는 클러스터 정보가 포함되지 않으므로 별도 지정이 필요합니다.",
    },
    {
      id: 4,
      label: "유형 선택 (필수)",
      description: "YAML 모드에서도 namespace 유형은 **반드시 선택**해야 합니다. YAML manifest에는 포함되지 않는 CCP 내부 분류 값이므로 UI에서 별도로 지정합니다.\n\n- **USER** (기본값): 사용자가 직접 생성/관리하는 Namespace\n- **SYSTEM**: CCP를 위한 Resource 관리 Namespace\n- **CI_CD**: CI/CD 파이프라인에서 사용하는 Namespace\n\n!!!YAML manifest의 kind가 Namespace가 아니면 검증 단계에서 거부됩니다.!!!",
    },
    {
      id: 5,
      label: "YAML 에디터",
      description: "K8s Namespace manifest를 직접 작성합니다. `kubectl apply -f`와 동일한 YAML 형식입니다.\n\n- 구문 하이라이팅, 라인 넘버, 테마 전환 지원\n- 폼 모드에서 전환 시 기존 입력값이 YAML로 자동 변환됩니다\n\n???kind는 반드시 `Namespace`여야 합니다. 다른 리소스 타입은 지원하지 않습니다.???",
    },
    {
      id: 6,
      label: "임시저장",
      description: "현재 YAML 내용과 클러스터·유형 선택값을 임시저장합니다.",
    },
    {
      id: 7,
      label: "검증",
      description: "YAML 구문 검증 + 클러스터 내 동일 이름 namespace 존재 여부를 확인합니다.\n\n- YAML 파싱 오류 시 에디터에 에러 라인 표시\n- kind가 Namespace가 아닌 경우 거부",
    },
    {
      id: 8,
      label: "생성",
      description: "검증을 통과한 후 K8s API를 호출하여 namespace를 생성합니다.\n\n!!!이 기능은 namespace 오브젝트만 생성합니다. 작업 환경(RBAC, Secret 등)이 필요하면 GitOps 탭을 이용하세요.!!!",
    },
  ],
};

// ─── Sample YAML ─────────────────────────────────────────────────────────────

const SAMPLE_YAML = `apiVersion: v1
kind: Namespace
metadata:
  name: my-namespace
  labels:
    team: backend
    env: dev
  annotations:
    description: "Backend dev namespace"`;

// ─── Slide ──────────────────────────────────────────────────────────────────

export default function Slide02bNamespaceResourceCreateYaml() {
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
        {/* Tab + YAML toggle (ON) */}
        <ContentSection className="flex items-center justify-between w-full px-6">
          <Tabs
            items={[
              { id: "namespace", label: "네임스페이스" },
              { id: "gitops", label: "GitOps" },
            ]}
            activeId="namespace"
            data-annotation-id="1"
          />
          <Toggle label="YAML 모드" checked data-annotation-id="2" />
        </ContentSection>

        {/* Cluster + Type selectors (always visible) */}
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

          <InfoRow label="유형 *" labelWidth="120px" data-annotation-id="4">
            <Select
              options={[
                { value: "USER", label: "USER — 사용자 Namespace", selected: true },
                { value: "SYSTEM", label: "SYSTEM — CCP 리소스 관리" },
                { value: "CI_CD", label: "CI_CD — CI/CD 파이프라인" },
              ]}
              className="flex-1"
            />
          </InfoRow>
        </ContentSection>

        {/* YAML Editor */}
        <ContentSection className="px-6" data-annotation-id="5">
          <CodeEditor
            code={SAMPLE_YAML}
            language="yaml"
            theme="dark"
            showLineNumbers
            wordWrap
            className="min-h-[320px]"
          />
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
