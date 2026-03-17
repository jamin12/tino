import {
  MoreHorizontal,
  Save,
  Rocket,
  X,
} from "lucide-react";
import {
  Badge,
  Button,
  CcpDashboardLayout,
  ContentSection,
  Tabs,
  CodeEditor,
  createSideMenuItems,
} from "../../_components";
import type { SlideMeta } from "@entities/document";
import {
  SidebarDashboardIcon,
  SidebarNamespaceIcon,
  SidebarApplicationIcon,
  SidebarCicdIcon,
  SidebarSettingsIcon,
  SidebarGitopsIcon,
  SidebarTenantIcon,
  SidebarConnectionIcon,
  SidebarServiceMeshIcon,
} from "../../_components";

export const slideMeta: SlideMeta = {
  screenId: "CCP-CAT-003",
  title: "Service Presets 편집",
  section: "카탈로그",
  annotations: [
    { id: 1, label: "편집 상태 표시", description: "현재 프리셋이 편집 모드임을 나타냅니다. '편집 중' 배지가 표시되어 저장되지 않은 변경사항이 있음을 시각적으로 알려줍니다." },
    { id: 2, label: "편집 액션 버튼", description: "취소 버튼은 변경사항을 폐기하고 상세 화면으로 돌아갑니다. 임시저장은 현재 변경사항을 서버에 임시 저장합니다. 배포 버튼은 변경된 YAML을 GitOps 워크플로를 통해 클러스터에 반영합니다." },
    { id: 3, label: "편집 탭 네비게이션", description: "기본정보, Params, Workspaces, Workflow, YAML, GitOps 탭 간 전환합니다. 현재 YAML 탭이 활성화되어 리소스 정의를 직접 편집할 수 있습니다." },
    { id: 4, label: "에디터 도구 모음", description: "편집 중인 파일명, 언어(YAML), 인코딩(UTF-8) 정보를 표시하고, YAML 문법 유효성 검증 결과를 실시간으로 보여줍니다." },
    { id: 5, label: "YAML 코드 에디터", description: "프리셋의 전체 Kubernetes YAML 정의를 직접 편집할 수 있는 코드 에디터입니다. 구문 강조, 자동 완성을 지원하며 변경 내용은 실시간으로 유효성이 검사됩니다." },
    { id: 6, label: "편집 정보 및 액션", description: "마지막 수정 시간과 수정자를 표시하고, 변경사항 비교(diff 뷰)와 원본 복원 기능을 제공합니다." },
  ],
};

// ─── YAML Content ───────────────────────────────────────────────────────────

const yamlContent = `apiVersion: tekton.dev/v1beta1
kind: Pipeline
metadata:
  name: docker-build-pipeline
  namespace: tekton-catalog
  labels:
    app: docker-build
    type: pipeline
    catalog: tekton
    tier: ci
spec:
  params:
    - name: git-url
      type: string
      description: "Git 저장소 URL"
    - name: git-revision
      type: string
      default: "main"
      description: "Git 브랜치 또는 태그"
    - name: image-name
      type: string
      description: "빌드할 Docker 이미지 이름"
    - name: image-tag
      type: string
      default: "latest"
      description: "Docker 이미지 태그"
    - name: dockerfile-path
      type: string
      default: "./Dockerfile"
      description: "Dockerfile 경로"
  workspaces:
    - name: source
      description: "소스코드 워크스페이스"
    - name: docker-credentials
      description: "Docker 레지스트리 인증 정보"
  tasks:
    - name: fetch-source
      taskRef:
        name: git-clone
        kind: ClusterTask
      params:
        - name: url
          value: "$(params.git-url)"
        - name: revision
          value: "$(params.git-revision)"
      workspaces:
        - name: output
          workspace: source
    - name: build-and-push
      taskRef:
        name: kaniko
        kind: ClusterTask
      runAfter:
        - fetch-source
      params:
        - name: IMAGE
          value: "$(params.image-name):$(params.image-tag)"
        - name: DOCKERFILE
          value: "$(params.dockerfile-path)"
      workspaces:
        - name: source
          workspace: source
        - name: dockerconfig
          workspace: docker-credentials`;

// ─── Slide ──────────────────────────────────────────────────────────────────

export default function Slide03ServicePresetsEdit() {
  return (
    <CcpDashboardLayout
      breadcrumbs={[
        { label: "홈" },
        { label: "카탈로그" },
        { label: "Service Presets", isBold: true },
      ]}
      title={
        <span className="inline-flex items-center gap-2" data-annotation-id="1">
          <span className="rounded-full shrink-0 w-2.5 h-2.5 bg-[#00b30e]" />
          <span>docker-build-pipeline</span>
          <Badge variant="info">Preset</Badge>
          <Badge variant="warning" size="sm">
            편집 중
          </Badge>
        </span>
      }
      sideMenuItems={createSideMenuItems({ activeId: "cicd", activeLabel: "Service Presets" })}
      headerActions={
        <div className="flex items-center gap-2" data-annotation-id="2">
          <Button variant="secondary" size="md">
            <X className="w-3.5 h-3.5 mr-1.5" />
            취소
          </Button>
          <Button variant="secondary" size="md">
            <Save className="w-3.5 h-3.5 mr-1.5" />
            임시저장
          </Button>
          <Button variant="primary" size="md">
            <Rocket className="w-3.5 h-3.5 mr-1.5" />
            배포
          </Button>
        </div>
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
              { id: "yaml", label: "YAML" },
              { id: "gitops", label: "GitOps", dividerBefore: true },
            ]}
            activeId="yaml"
            className="mb-0"
          />
        </div>
      </ContentSection>

      {/* YAML Editor */}
      <ContentSection>
        {/* Editor toolbar */}
        <div className="flex items-center justify-between mb-2" data-annotation-id="4">
          <div className="flex items-center gap-2 text-[12px] text-[#888]">
            <span>docker-build-pipeline.yaml</span>
            <span className="text-[#ccc]">|</span>
            <span>YAML</span>
            <span className="text-[#ccc]">|</span>
            <span>UTF-8</span>
          </div>
          <div className="flex items-center gap-2 text-[12px]">
            <Badge variant="success" size="sm">
              유효한 YAML
            </Badge>
          </div>
        </div>

        {/* Code Editor */}
        <div data-annotation-id="5">
          <CodeEditor
            code={yamlContent}
            language="yaml"
          />
        </div>

        {/* Bottom info */}
        <div className="flex items-center justify-between mt-3 text-[12px] text-[#888]" data-annotation-id="6">
          <div className="flex items-center gap-3">
            <span>
              마지막 수정: <span className="text-[#555]">방금 전</span>
            </span>
            <span>
              수정자: <span className="text-[#555]">홍길동</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#0077ff] cursor-pointer hover:underline">
              변경사항 비교
            </span>
            <span className="text-[#ccc]">|</span>
            <span className="text-[#0077ff] cursor-pointer hover:underline">
              원본 복원
            </span>
          </div>
        </div>
      </ContentSection>
    </CcpDashboardLayout>
  );
}
