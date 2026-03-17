import { useState } from "react";
import {
  Clock,
  Calendar,
  GitBranch,
  Hash,
  CheckCircle2,
  MessageSquare,
  Braces,
  FileCode2,
  X,
} from "lucide-react";
import {
  CcpDashboardLayout,
  ContentSection,
  RunDetailCard,
  PipelineGraph,
  TaskListPanel,
  LogViewer,
  ListDetailLayout,
  ResourceDetailPanel,
  IconNavItem,
  SidebarDashboardIcon,
  SidebarNamespaceIcon,
  SidebarApplicationIcon,
  SidebarCicdIcon,
  SidebarSettingsIcon,
  SidebarGitopsIcon,
  SidebarTenantIcon,
  SidebarConnectionIcon,
  SidebarServiceMeshIcon,
  createSideMenuItems,
} from "../../_components";
import type { SlideMeta } from "@entities/document";

export const slideMeta: SlideMeta = {
  screenId: "CCP-PLS-002",
  title: "PipelineRun 상세",
  section: "CI/CD 파이프라인 통계",
  links: [
    {
      targetScreenId: "CCP-PLS-001",
      type: "navigate",
      label: "뒤로가기 → 파이프라인 실행 현황",
    },
  ],
  annotations: [
    {
      id: 1,
      label: "뒤로가기",
      description:
        "파이프라인 실행 현황(CCP-PLS-001) 목록 화면으로 돌아갑니다.",
    },
    {
      id: 2,
      label: "PipelineRun 요약 카드",
      description:
        "선택한 PipelineRun의 기본 정보를 표시합니다.\n• 실행 이름 및 상태(Succeeded/Failed 등) 뱃지\n• 파이프라인 정의명\n• 시작 시각, 소요 시간, 실행 네임스페이스, 트리거 사용자",
    },
    {
      id: 3,
      label: "파이프라인 실행 그래프",
      description:
        "PipelineRun에 포함된 Task 스테이지를 시각적 그래프로 표시합니다. 각 노드는 TaskRun의 실행 상태(성공/실행중/대기/실패)와 소요 시간을 보여줍니다.",
    },
    {
      id: 4,
      label: "TaskRun 목록 패널",
      description:
        "해당 PipelineRun에 속한 TaskRun 목록을 표시합니다. 각 TaskRun의 상태 아이콘과 소요 시간을 확인할 수 있으며, 항목 클릭 시 해당 TaskRun의 로그를 우측 로그 뷰어에 표시합니다.\n```\nGET /apis/results.tekton.dev/v1alpha2/parents/-/results/-/records\n  ?filter=data.metadata.labels['tekton.dev/pipelineRun'] == '{pipelineRunName}'\n    && data_type == \"tekton.dev/v1.TaskRun\"\n  &order_by=create_time asc\n```",
    },
    {
      id: 5,
      label: "로그 뷰어",
      description:
        "TaskRun 목록에서 선택한 TaskRun의 실행 로그를 터미널 형태로 표시합니다. 복사 및 다운로드 기능을 제공합니다.\n```\nGET /apis/results.tekton.dev/v1alpha2/parents/{namespace}/results/{resultId}/logs/{recordId}\n```",
    },
  ],
};

// ─── Pipeline Stages ────────────────────────────────────────────────────────

const pipelineStages = [
  { id: "fetch", name: "cicd-fetch", status: "success" as const, duration: "6s" },
  { id: "build", name: "cicd-push", status: "success" as const, duration: "4m 53s" },
  { id: "deploy-trigger", name: "deploy-trigger", status: "success" as const, duration: "7s" },
  { id: "cleanup", name: "cleanup-policy", status: "success" as const, duration: "5s" },
];

// ─── TaskRun Stages (for TaskListPanel) ─────────────────────────────────────

const taskStages = [
  { id: "fetch", name: "cicd-fetch", status: "success" as const, duration: "6s" },
  { id: "build", name: "cicd-push", status: "success" as const, duration: "4m 53s" },
  { id: "deploy-trigger", name: "deploy-trigger", status: "success" as const, duration: "7s" },
  { id: "cleanup", name: "cleanup-policy", status: "success" as const, duration: "5s" },
];

// ─── Log Content ────────────────────────────────────────────────────────────

const logContent = `[prepare] 2025/07/18 11:26:35 Entrypoint initialization
[place-scripts] 2025/07/18 11:26:36 Decoded script /tekton/scripts/script-0-t)xc5

========================================
  파이프라인 실행 로그:
========================================

[tkn] All PipelineRuns(Completed) deleted in namespace "inje-msa-demo-cicd"
[tkn] NAME                              STARTED      DURATION  STATUS
[tkn] auth-service-dev-build-pr-zhmqf   1 minute ago ---       Running
[tkn] auth-service-dev-build-pr-q9a5u   12 min ago   10m 27s   Failed

[tkn] --label app=auth-service,env=dev,type=deploy,tekton.dev/pipeline=auth-service-dev-deploy-pr

[git-clone] Cloning into '/workspace/source'...
[git-clone] Successfully cloned https://gitea.cone-chain.com/app-cicd/auth-service-gitops.git
[git-clone] Checked out revision main

[build] STEP 1/12 : FROM gradle:8.5-jdk17 AS builder
[build] STEP 2/12 : WORKDIR /app
[build] STEP 3/12 : COPY build.gradle settings.gradle ./
[build] STEP 4/12 : RUN gradle dependencies --no-daemon
[build] STEP 5/12 : COPY src ./src
[build] STEP 6/12 : RUN gradle bootJar --no-daemon
[build] BUILD SUCCESS in 4m 31s`;

// ─── PipelineRun YAML ────────────────────────────────────────────────────────

const pipelineRunYaml = `apiVersion: tekton.dev/v1
kind: PipelineRun
metadata:
  name: auth-service-dev-build-pr-zhmqf
  namespace: inje-msa-demo-cicd
  labels:
    app: auth-service
    env: dev
    type: build
    tekton.dev/pipeline: auth-service-dev-build-pr
  annotations:
    tekton.dev/tags: "build,ci"
spec:
  pipelineRef:
    name: auth-service-dev-build-pr
  params:
    - name: git-host-url
      value: https://gitea.cone-chain.com
    - name: code-repo-org
      value: sample
    - name: code-repo-name
      value: sample-egoweaver-core
    - name: code-repo-url
      value: >-
        \$(params.git-host-url)/\$(params.code-repo-org)/\$(params.code-repo-name)
    - name: code-revision
      value: dev
    - name: java-version
      value: "11"
    - name: build-profile
      value: dev
    - name: skip-code-test
      value: "false"
  workspaces:
    - name: shared-workspace
      persistentVolumeClaim:
        claimName: auth-service-cicd-pvc
    - name: maven-settings
      configMap:
        name: maven-settings
  taskRunTemplate:
    serviceAccountName: pipeline
  timeouts:
    pipeline: 30m
    tasks: 20m
status:
  completionTime: "2025-07-18T11:25:16Z"
  startTime: "2025-07-18T11:20:05Z"
  conditions:
    - type: Succeeded
      status: "True"
      reason: Succeeded
      message: >-
        Tasks Completed: 5 (Failed: 1 (Ignored: 1),
        Cancelled 0), Skipped: 0`;

// ─── YAML IconNav ───────────────────────────────────────────────────────────

const yamlIconNavItems: IconNavItem[] = [
  { id: "yaml", icon: <FileCode2 className="w-5 h-5" />, label: "YAML" },
];

// ─── YAML Line ──────────────────────────────────────────────────────────────

function YamlLine({ line, lineNum }: { line: string; lineNum: number }) {
  const keyMatch = line.match(/^(\s*)([\w.-]+)(:)(.*)/);
  return (
    <div className="flex hover:bg-[#f4f6f8]">
      <span className="w-8 flex-shrink-0 text-right pr-3 text-[#c0c0c0] select-none">{lineNum}</span>
      {keyMatch ? (
        <span>
          {keyMatch[1]}
          <span className="text-[#0077ff]">{keyMatch[2]}</span>
          <span className="text-[#333]">:</span>
          <span className={keyMatch[4].includes('"') ? "text-[#16a34a]" : "text-[#555]"}>{keyMatch[4]}</span>
        </span>
      ) : (
        <span className={
          line.trimStart().startsWith("-") ? "text-[#16a34a]"
            : line.trimStart().startsWith("#") ? "text-[#999]"
            : "text-[#555]"
        }>{line || " "}</span>
      )}
    </div>
  );
}

// ─── Slide ──────────────────────────────────────────────────────────────────

export default function Slide02PipelineRunDetail() {
  const [yamlOpen, setYamlOpen] = useState(false);

  return (
    <CcpDashboardLayout
      breadcrumbs={[
        { label: "홈" },
        { label: "CI/CD" },
        { label: "파이프라인 통계" },
      ]}
      title={<span className="inline-flex items-center gap-2.5 font-mono">auth-service-dev-build-pr-zhmqf</span>}
      sideMenuItems={createSideMenuItems({ activeId: "cicd", activeLabel: "파이프라인 통계" })}
    >
      <ListDetailLayout
        detail={
          yamlOpen ? (
            <ResourceDetailPanel
              title="auth-service-dev-build-pr-zhmqf"
              iconNavItems={yamlIconNavItems}
              activeIconNavId="yaml"
            >
              <div className="px-5 pt-4 pb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-bold text-[#111]">YAML</span>
                  <span className="text-[11px] text-[#999] font-mono">읽기 전용</span>
                </div>
                <button
                  type="button"
                  onClick={() => setYamlOpen(false)}
                  className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#f0f0f0] text-[#888] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="px-4 pt-2 pb-4">
                <div className="bg-white rounded-sm border border-[#f0f0f0] shadow-[0px_0px_8px_#00000014] overflow-auto max-h-[calc(100vh-200px)]">
                  <pre className="text-[12px] leading-[1.7] font-mono p-4">
                    {pipelineRunYaml.split("\n").map((line, i) => (
                      <YamlLine key={i} line={line} lineNum={i + 1} />
                    ))}
                  </pre>
                </div>
              </div>
            </ResourceDetailPanel>
          ) : <div />
        }
        detailWidth={yamlOpen ? "650px" : "0px"}
      >
        {/* ── Run Summary Card ── */}
        <ContentSection>
          <div data-annotation-id="2">
            <RunDetailCard
              showBack
              columns={4}
              actions={
                <button
                  type="button"
                  onClick={() => setYamlOpen(!yamlOpen)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium border rounded-lg transition-colors cursor-pointer ${
                    yamlOpen
                      ? "text-[#0077ff] bg-[#e8f1ff] border-[#b3d4ff]"
                      : "text-[#475569] bg-white border-[#e2e8f0] hover:bg-[#f1f5f9] hover:text-[#0f172a]"
                  }`}
                >
                  <FileCode2 className="w-3.5 h-3.5" />
                  YAML
                </button>
              }
              infoItems={[
                {
                  icon: <Hash className="w-full h-full" />,
                  label: "실행 이름",
                  value: "auth-service-dev-build-pr-zhmqf",
                },
                {
                  icon: <GitBranch className="w-full h-full" />,
                  label: "파이프라인",
                  value: "auth-service-dev-build-pr",
                },
                {
                  icon: <Braces className="w-full h-full" />,
                  label: "네임스페이스",
                  value: "inje-msa-demo-cicd",
                },
                {
                  icon: <CheckCircle2 className="w-full h-full" />,
                  label: "상태",
                  value: "Succeeded",
                  badge: { label: "Succeeded", variant: "success" as const },
                },
                {
                  icon: <Calendar className="w-full h-full" />,
                  label: "시작 시간",
                  value: "2025-07-18 20:20:05",
                },
                {
                  icon: <Calendar className="w-full h-full" />,
                  label: "종료 시간",
                  value: "2025-07-18 20:25:16",
                },
                {
                  icon: <Clock className="w-full h-full" />,
                  label: "소요 시간",
                  value: "5분 11초",
                },
                {
                  icon: <MessageSquare className="w-full h-full" />,
                  label: "메시지",
                  value: "Tasks Completed: 5 (Failed: 1 (Ignored: 1), Cancelled 0), Skipped: 0",
                },
              ]}
            />
          </div>
        </ContentSection>

        {/* ── Pipeline Graph ── */}
        <ContentSection>
          <div data-annotation-id="3">
            <PipelineGraph stages={pipelineStages} />
          </div>
        </ContentSection>

        {/* ── TaskRun List + Log Viewer ── */}
        <ContentSection>
          <div className="flex gap-4 h-[480px]">
            <div className="w-[280px] flex-shrink-0" data-annotation-id="4">
              <TaskListPanel
                title="TaskRun 목록"
                stages={taskStages}
                activeStageId="build"
              />
            </div>
            <div className="flex-1" data-annotation-id="5">
              <LogViewer
                title="cicd-push — auth-service-dev-build-pr-zhmqf-cicd-push"
                content={logContent}
                showCursor={false}
              />
            </div>
          </div>
        </ContentSection>
      </ListDetailLayout>
    </CcpDashboardLayout>
  );
}
