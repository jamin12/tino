import { useState } from "react";
import {
  LayoutDashboard,
  Layers,
  AppWindow,
  GitBranch,
  Settings,
  GitCompare,
  Copy,
} from "lucide-react";
import {
  Button,
  CcpDashboardLayout,
  ContentSection,
  InfoRow,
  Select,
  Tabs,
  Toggle,
  SidebarTenantIcon,
  SidebarConnectionIcon,
  SidebarServiceMeshIcon,
  createSideMenuItems,
} from "../../_components";

import type { SlideMeta } from "@entities/document";

function QuestionIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 14C3.1339 14 0 10.8661 0 7C0 3.1339 3.1339 0 7 0C10.8661 0 14 3.1339 14 7C14 10.8661 10.8661 14 7 14ZM6.3 9.1V10.5H7.7V9.1H6.3ZM7.7 7.9485C8.26257 7.77894 8.74552 7.41297 9.06091 6.91722C9.3763 6.42147 9.50313 5.82894 9.41831 5.24753C9.3335 4.66612 9.04268 4.13451 8.59881 3.74952C8.15494 3.36453 7.58756 3.15178 7 3.15C6.4336 3.14996 5.88466 3.34611 5.44655 3.7051C5.00844 4.06408 4.70821 4.56374 4.5969 5.1191L5.9703 5.3942C6.00928 5.1992 6.10282 5.01928 6.24006 4.87537C6.37729 4.73146 6.55257 4.62948 6.7455 4.58129C6.93843 4.53311 7.14107 4.5407 7.32985 4.60318C7.51864 4.66566 7.6858 4.78047 7.81188 4.93424C7.93797 5.08801 8.0178 5.27442 8.04208 5.47179C8.06636 5.66916 8.03409 5.86936 7.94904 6.04911C7.86399 6.22886 7.72964 6.38075 7.56163 6.48713C7.39362 6.59351 7.19885 6.64999 7 6.65C6.81435 6.65 6.6363 6.72375 6.50503 6.85503C6.37375 6.9863 6.3 7.16435 6.3 7.35V8.4H7.7V7.9485Z" fill="#999999"/>
    </svg>
  );
}

export const slideMeta: SlideMeta = {
  screenId: "CCP-GIT-002",
  title: "배포 저장소 생성 (기본정보)",
  section: "GitOps 배포 저장소",
  annotations: [
    {
      id: 1,
      label: "기본정보/GitOps 탭",
      description:
        "저장소 생성 단계를 전환합니다. '기본정보' 탭에서 저장소 기본 속성을 입력하고, 'GitOps' 탭(CCP-GIT-003)에서 연결 설정을 구성합니다.",
    },
    {
      id: 2,
      label: "이름 입력",
      description:
        "저장소 이름을 입력합니다. 필수 항목이며, 저장소 URL 생성에 사용됩니다.",
    },
    {
      id: 3,
      label: "설명 입력",
      description:
        "저장소에 대한 부가 설명을 입력합니다. 선택 항목입니다.",
    },
    {
      id: 4,
      label: "저장소 그룹 (Gitea 조직 + ArgoCD 프로젝트) 선택",
      description:
        "저장소가 속할 저장소 그룹 (Gitea 조직 + ArgoCD 프로젝트)을 선택합니다. 필수 항목이며, 그룹에 따라 저장소 URL 경로가 결정됩니다. CONE-Chain 등 시스템 영역 조직은 제외하고 조회됩니다.",
    },
    {
      id: 5,
      label: "가시성 선택",
      description:
        "저장소의 공개/비공개 여부를 설정합니다. 필수 항목입니다.",
    },
    {
      id: 6,
      label: "Topic 선택",
      description:
        "저장소의 용도(Manifest, Pipeline, Artifact)를 지정합니다. Topic에 따라 사용 가능한 템플릿 목록이 변경됩니다.",
    },
    {
      id: 7,
      label: "템플릿 선택",
      description:
        "선택한 Topic에 해당하는 템플릿 저장소 목록을 조회하여 표시합니다. 템플릿을 선택하면 해당 구조로 저장소가 초기화되며, 'None' 선택 시 빈 저장소가 생성되고 추가 옵션(브랜치, 라이센스 등)이 표시됩니다.",
    },
    {
      id: 8,
      label: "저장소 URL",
      description:
        "생성될 저장소의 Git URL을 미리 표시합니다. 클립보드 버튼으로 복사할 수 있습니다.",
    },
    {
      id: 9,
      label: "취소 버튼",
      description:
        "저장소 생성을 취소하고 목록(CCP-GIT-001) 화면으로 돌아갑니다.",
    },
    {
      id: 10,
      label: "생성 버튼",
      description:
        "입력된 정보로 새 배포 저장소를 생성합니다. 필수 항목 미입력 시 유효성 검증 오류가 표시됩니다.",
    },
  ],
};

// ─── Side Menu Data ─────────────────────────────────────────────────────────


// ─── Slide ──────────────────────────────────────────────────────────────────

export default function Slide02RepositoryConnect() {
  const [useTemplate, setUseTemplate] = useState(true);
  const [topic, setTopic] = useState("manifest");
  const [template, setTemplate] = useState("sample-cicd/sample-egovmaven-tomcat-gitops");

  const templateOptionsByTopic: Record<string, { value: string; label: string }[]> = {
    manifest: [
      { value: "none", label: "None" },
      { value: "sample-cicd/sample-egovmaven-tomcat-gitops", label: "sample-cicd/sample-egovmaven-tomcat-gitops" },
      { value: "sample-cicd/sample-springboot-gitops", label: "sample-cicd/sample-springboot-gitops" },
    ],
    pipeline: [
      { value: "none", label: "None" },
      { value: "sample-cicd/sample-jenkins-pipeline", label: "sample-cicd/sample-jenkins-pipeline" },
      { value: "sample-cicd/sample-tekton-pipeline", label: "sample-cicd/sample-tekton-pipeline" },
    ],
    artifact: [
      { value: "none", label: "None" },
      { value: "sample-cicd/sample-docker-artifact-dev", label: "sample-cicd/sample-docker-artifact-dev" },
      { value: "sample-cicd/sample-docker-artifact-prd", label: "sample-cicd/sample-docker-artifact-prd" },
      { value: "sample-cicd/sample-helm-chart-dev", label: "sample-cicd/sample-helm-chart-dev" },
      { value: "sample-cicd/sample-helm-chart-prd", label: "sample-cicd/sample-helm-chart-prd" },
    ],
  };

  const handleTopicChange = (newTopic: string) => {
    setTopic(newTopic);
    setTemplate("none");
  };

  return (
    <CcpDashboardLayout
      breadcrumbs={[
        { label: "홈" },
        { label: "GitOps" },
        { label: "배포 저장소", isBold: true },
      ]}
      title="배포 저장소 생성"
      sideMenuItems={createSideMenuItems({ activeId: "gitops", activeLabel: "배포 저장소" })}
    >
      <div className="flex gap-0 mx-8 mt-4">
        {/* Left Form Area */}
        <div className="flex-1 bg-white rounded-lg border border-[#e5e5e5] p-6">
          <div data-annotation-id="1">
            <Tabs
              items={[
                { id: "basic", label: "기본정보" },
                { id: "gitops", label: "GitOps", dividerBefore: true },
              ]}
              activeId="basic"
              className="mb-8"
            />
          </div>

          <div className="space-y-5">
            {/* 이름 */}
            <div data-annotation-id="2">
            <InfoRow label={<span>이름<span className="text-[#da1e28]">*</span></span>} labelWidth="120px">
              <input
                type="text"
                value="app1-gitops"
                readOnly
                className="w-full border border-[#ddd] rounded px-3 py-1.5 text-[13px] text-[#333] bg-white"
              />
            </InfoRow>
            </div>

            {/* 설명 */}
            <div data-annotation-id="3">
            <InfoRow label="설명" labelWidth="120px">
              <input
                type="text"
                value="app1-gitops 리포지토리"
                readOnly
                className="w-full border border-[#ddd] rounded px-3 py-1.5 text-[13px] text-[#333] bg-white"
              />
            </InfoRow>
            </div>

            {/* 저장소 그룹 */}
            <div data-annotation-id="4">
            <InfoRow label={<span>저장소 그룹<span className="text-[#da1e28]">*</span></span>} labelWidth="120px">
              <Select
                label=""
                options={[
                  { value: "app-cicd", label: "app-cicd" },
                  { value: "infra-ops", label: "infra-ops" },
                  { value: "sample-cicd", label: "sample-cicd" },
                ]}
              />
            </InfoRow>
            </div>

            {/* 가시성 */}
            <div data-annotation-id="5">
            <InfoRow label={<span>가시성<span className="text-[#da1e28]">*</span></span>} labelWidth="120px">
              <Select
                label=""
                options={[
                  { value: "private", label: "비공개" },
                  { value: "public", label: "공개" },
                ]}
              />
            </InfoRow>
            </div>

            {/* Topic */}
            <div data-annotation-id="6">
            <InfoRow
              label={
                <span className="flex items-center gap-1">
                  Topic<span className="text-[#da1e28]">*</span>
                  <QuestionIcon className="w-3.5 h-3.5" />
                </span>
              }
              labelWidth="120px"
            >
              <Select
                label=""
                options={[
                  { value: "manifest", label: "Manifest" },
                  { value: "pipeline", label: "Pipeline" },
                  { value: "artifact", label: "Artifact" },
                ]}
                value={topic}
                onValueChange={handleTopicChange}
              />
            </InfoRow>
            </div>

            {/* 템플릿 */}
            <div data-annotation-id="7">
            <InfoRow
              label={
                <span className="flex items-center gap-1">
                  템플릿
                  <QuestionIcon className="w-3.5 h-3.5" />
                </span>
              }
              labelWidth="120px"
            >
              <Select
                label=""
                options={templateOptionsByTopic[topic] ?? templateOptionsByTopic.manifest}
                value={template}
                onValueChange={setTemplate}
              />
            </InfoRow>
            </div>

            {template === "none" && (
              <>
                <div className="border-t border-[#e5e5e5]" />

                {/* 기본 브랜치 */}
                <InfoRow label="기본 브랜치" labelWidth="120px">
                  <Select
                    label=""
                    options={[
                      { value: "main", label: "main" },
                      { value: "master", label: "master" },
                      { value: "develop", label: "develop" },
                    ]}
                  />
                </InfoRow>

                {/* 라이센스 */}
                <InfoRow label="라이센스" labelWidth="120px">
                  <Select
                    label=""
                    options={[
                      { value: "gpl", label: "GPL" },
                      { value: "mit", label: "MIT" },
                      { value: "apache", label: "Apache 2.0" },
                      { value: "none", label: "None" },
                    ]}
                  />
                </InfoRow>

                {/* .gitignore 템플릿 */}
                <InfoRow label=".gitignore 템플릿" labelWidth="120px">
                  <Select
                    label=""
                    options={[
                      { value: "default", label: "Default" },
                      { value: "node", label: "Node" },
                      { value: "java", label: "Java" },
                      { value: "python", label: "Python" },
                    ]}
                  />
                </InfoRow>

                {/* README */}
                <InfoRow label="README" labelWidth="120px">
                  <Select
                    label=""
                    options={[
                      { value: "default", label: "Default" },
                      { value: "none", label: "None" },
                    ]}
                  />
                </InfoRow>

                {/* 저장소 */}
                <InfoRow label="저장소" labelWidth="120px">
                  <div className="flex items-center gap-2.5">
                    <Toggle checked={useTemplate} onChange={setUseTemplate} />
                    <span className="text-[13px] text-[#555]">
                      템플릿 저장소로 설정
                    </span>
                  </div>
                </InfoRow>

                {/* 초기화 */}
                <InfoRow
                  label={
                    <span className="flex items-center gap-1">
                      초기화
                      <QuestionIcon className="w-3.5 h-3.5" />
                    </span>
                  }
                  labelWidth="120px"
                >
                  <div className="flex items-center gap-2.5">
                    <Toggle checked={true} />
                    <span className="text-[13px] text-[#555]">
                      .gitignore, 라이센스 그리고 README 추가
                    </span>
                  </div>
                </InfoRow>
              </>
            )}

            <div className="border-t border-[#e5e5e5]" />

            {/* 저장소 URL */}
            <div data-annotation-id="8">
            <InfoRow label="저장소 URL" labelWidth="120px">
              <span className="text-[13px] font-medium text-[#0077ff] leading-5">
                https://gitea.cone-chain.com/app-cicd/app1-gitops.git
              </span>
              <button
                type="button"
                className="ml-2 px-2 py-1 text-[12px] text-[#555] border border-[#ddd] rounded hover:bg-[#f6f8fa] flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                클립보드
              </button>
            </InfoRow>
            </div>
          </div>

        </div>

      </div>

      {/* Bottom fixed action bar */}
      <div className="sticky bottom-0 left-0 right-0 px-8 py-3 flex justify-end gap-2 mt-4">
        <Button data-annotation-id="9" variant="ghost" size="md">
          취소
        </Button>
        <Button data-annotation-id="10" variant="primary" size="md">
          생성
        </Button>
      </div>
    </CcpDashboardLayout>
  );
}
