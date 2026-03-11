import {
  LayoutDashboard,
  Layers,
  AppWindow,
  GitBranch,
  Settings,
  GitCompare,
  Folder,
  FileText,
  Search,
  Plus,
  Copy,
  MoreHorizontal,
  Pencil,
  Eye,
  Minus,
  Lock,
} from "lucide-react";
import {
  Badge,
  Button,
  CcpDashboardLayout,
  ContentSection,
  CodeEditor,
  SplitPanel,
  Tabs,
  Checkbox,
  Toggle,
} from "../../_components";
import type { SideMenuItem } from "../../_components";
import type { SlideMeta } from "@entities/document";

export const slideMeta: SlideMeta = {
  screenId: "CCP-GIT-006",
  title: "리포지토리 상세 (코드 편집)",
  section: "GitOps Repositories",
  links: [
    { targetScreenId: "CCP-GIT-004", type: "tab", label: "기본정보 탭" },
    { targetScreenId: "CCP-GIT-005", type: "tab", label: "코드 보기 탭" },
  ],
};

// ─── Side Menu Data ─────────────────────────────────────────────────────────

const sideMenuItems: SideMenuItem[] = [
  {
    id: "dashboard",
    label: "대시보드",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    id: "namespace",
    label: "네임스페이스",
    icon: <Layers className="w-5 h-5" />,
    expandIcon: "plus",
  },
  {
    id: "application",
    label: "애플리케이션",
    icon: <AppWindow className="w-5 h-5" />,
    expandIcon: "plus",
  },
  {
    id: "cicd",
    label: "CI/CD",
    icon: <GitBranch className="w-5 h-5" />,
    expandIcon: "plus",
  },
  {
    id: "gitops",
    label: "GitOps",
    icon: <GitCompare className="w-5 h-5" />,
    active: true,
    expanded: true,
    expandIcon: "minus",
    sections: [
      {
        label: "",
        items: [
          { label: "Applications" },
          { label: "Repositories", active: true, bold: true },
        ],
      },
    ],
  },
  {
    id: "settings",
    label: "설정/권한",
    icon: <Settings className="w-5 h-5" />,
    expandIcon: "plus",
  },
];

// ─── Code Sample ────────────────────────────────────────────────────────────

const pipelineRunYaml = `apiVersion: tekton.dev/v1
kind: PipelineRun
metadata:
  annotations:
    argocd.argoproj.io/compare-options: IgnoreExtraneous
    argocd.argoproj.io/sync-options: Prune=false
    createdTimestamp: '2025-08-29T05:26:002'
  finalizers:
    - chains.tekton.dev/eventlistener
  generation: 1
  labels:
    app: app1-maven
    argocd.argoproj.io/instance: build-maven-spring-boot-pipeline
    env: dev
    tekton.dev/pipeline: build-maven-spring-boot-pipeline
    type: build
  name: sample-egovmaven-core-dev-build-pr
  namespace: app-cicd
  resourceVersion: '118853767'
  uid: add627fa-adc5-45a5-8595-cd1975c5b44b
spec:
  params:
    - name: git-host-url
      value: https://gitea.cone-chain.com
    - name: code-repo-org
      value: sample
    - name: code-repo-name
      value: sample-egovmaven-core
    - name: code-repo-url`;

// ─── File Tree ──────────────────────────────────────────────────────────────

interface FileTreeItem {
  name: string;
  type: "folder" | "file";
  active?: boolean;
  date: string;
}

const fileTree: FileTreeItem[] = [
  { name: "dev", type: "folder", date: "2일 전" },
  { name: "stg", type: "folder", date: "4분 전" },
  { name: "prd", type: "folder", date: "5분 전" },
  { name: "build-pr.yaml", type: "file", active: true, date: "14건 전" },
  { name: "kustomization.yaml", type: "file", date: "3일 전" },
  { name: "README.md", type: "file", date: "3일 전" },
];

// ─── Slide ──────────────────────────────────────────────────────────────────

export default function Slide06RepositoryDetailEdit() {
  return (
    <CcpDashboardLayout
      breadcrumbs={[
        { label: "GitOps" },
        { label: "Repositories" },
        { label: "app1-maven-pipeline", isBold: true },
      ]}
      title={
        <span className="group relative inline-flex items-center gap-2">
          <span className="rounded-full shrink-0 w-2.5 h-2.5 bg-[#00b30e]" />
          <span className="cursor-pointer">app1-maven-pipeline</span>
          <Badge variant="info">Pipeline</Badge>
          {/* 호버 툴팁 */}
          <span className="pointer-events-none absolute top-full left-0 mt-1 z-50 hidden group-hover:inline-flex items-center gap-2 px-3 py-1.5 bg-[#1b2c3f] rounded-[0px_12px_12px_12px] shadow-[4px_4px_8px_#1b2c3f33] whitespace-nowrap">
            <span className="inline-flex items-center gap-1.5">
              <span className="rounded-full w-2 h-2 bg-[#00b30e]" />
              <span className="text-white text-[11px]">Stable</span>
            </span>
            <span className="text-[#ffffff44] text-[11px]">|</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="text-[#00b30e] text-[11px]">♥</span>
              <span className="text-white text-[11px]">Healthy</span>
            </span>
            <span className="text-[#ffffff44] text-[11px]">|</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="text-[#00b30e] text-[11px]">✓</span>
              <span className="text-white text-[11px]">Synced</span>
            </span>
          </span>
        </span>
      }
      sideMenuItems={sideMenuItems}
    >
      <ContentSection>
        <Tabs
          items={[
            { id: "basic", label: "기본정보" },
            { id: "code", label: "파일" },
            { id: "branches", label: "브랜치" },
            { id: "commits", label: "커밋 이력" },
            { id: "tags", label: "태그/릴리스" },
            { id: "gitops", label: "GitOps", dividerBefore: true },
          ]}
          activeId="code"
          className="mb-0"
        />
      </ContentSection>

      <ContentSection>
        {/* Toolbar */}
        <div className="flex items-center gap-2 mb-3">
          {/* Branch selector */}
          <Badge variant="neutral" className="!px-3 !py-1.5 cursor-pointer">
            <GitBranch className="w-3.5 h-3.5 mr-1.5" />
            main
            <svg className="w-3 h-3 ml-1.5 text-[#666]" viewBox="0 0 12 12" fill="none">
              <path d="M3 5L6 8L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Badge>
          <button type="button" className="p-1.5 text-[#555] hover:bg-[#f0f0f0] rounded">
            <GitCompare className="w-4 h-4" />
          </button>

          {/* Code search */}
          <div className="flex items-center gap-1.5 flex-1 max-w-[260px] h-[34px] border border-[#ddd] rounded px-3 bg-white">
            <Search className="w-3.5 h-3.5 text-[#999]" />
            <span className="text-[13px] text-[#999]">코드 검색</span>
          </div>

          {/* New file */}
          <Button variant="primary" size="md" className="!bg-[#00b30e] hover:!bg-[#009a0c]">
            <Plus className="w-4 h-4 mr-1" />
            새 파일
          </Button>

          {/* Spacer */}
          <div className="flex-1" />

          {/* HTTPS URL */}
          <span className="text-[12px] font-semibold text-[#555] bg-[#f0f0f0] px-2.5 py-1.5 rounded-l border border-[#ddd] border-r-0">
            HTTPS
          </span>
          <div className="flex items-center h-[34px] border border-[#ddd] rounded-r bg-white px-3 max-w-[420px]">
            <span className="text-[12px] text-[#555] truncate">
              https://gitea.cone-chain.net/sample-cicd/sample-reactnpm-nginx-pipeline.git
            </span>
          </div>
          <button type="button" className="p-1.5 text-[#555] hover:bg-[#f0f0f0] rounded">
            <Copy className="w-4 h-4" />
          </button>
          <button type="button" className="p-1.5 text-[#555] hover:bg-[#f0f0f0] rounded">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Commit info */}
        <div className="flex items-center gap-2 mb-4 text-[12px]">
          <span className="font-semibold text-[#333]">cicdmanager</span>
          <Badge variant="neutral" className="!text-[11px] !px-1.5 font-mono">
            5628ab1c8b
          </Badge>
          <span className="text-[#555]">Initial commit from template</span>
          <span className="text-[#999]">· 17시간 전</span>
        </div>

        {/* File tree + Code editor */}
        <SplitPanel
          leftWidth="240px"
          height="420px"
          left={
            <div className="border border-[#e0e0e0] rounded bg-white h-full overflow-auto">
              {/* 파일 목록 heading */}
              <div className="px-3 py-2 text-[12px] font-semibold text-[#555] border-b border-[#e0e0e0] bg-[#fafafa]">
                파일 목록
              </div>
              {fileTree.map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 px-3 py-2 cursor-pointer text-[13px] border-b border-[#f0f0f0] ${
                    item.active
                      ? "bg-[#e8f0fe] text-[#0077ff] font-semibold"
                      : "text-[#333] hover:bg-[#f6f8fa]"
                  }`}
                >
                  {item.type === "folder" ? (
                    <Folder className="w-4 h-4 text-[#dea600] shrink-0" />
                  ) : (
                    <FileText className="w-4 h-4 text-[#666] shrink-0" />
                  )}
                  <span className="flex-1 truncate">{item.name}</span>
                  <span className="text-[11px] text-[#999] shrink-0">
                    {item.date}
                  </span>
                </div>
              ))}
            </div>
          }
          right={
            <div className="flex flex-col h-full">
              {/* File path header */}
              <div className="flex items-center justify-between px-3 py-2 bg-[#f6f8fa] border border-[#e0e0e0] rounded-t">
                <div className="flex items-center gap-1 text-[13px]">
                  <span className="text-[#555]">app1-maven-pipeline</span>
                  <span className="text-[#999]">/</span>
                  <span className="font-semibold text-[#333]">build-pr.yaml</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="!h-7 !text-[12px]">
                    <Pencil className="w-3 h-3 mr-1" />
                    파일 편집
                  </Button>
                  <Button variant="ghost" size="sm" className="!h-7 !text-[12px]">
                    <Eye className="w-3 h-3 mr-1" />
                    변경내용 미리보기
                  </Button>
                </div>
              </div>

              {/* Code editor */}
              <CodeEditor
                code={pipelineRunYaml}
                language="yaml"
                theme="light"
                fontSize={14}
                showLineNumbers={true}
                wordWrap={true}
                className="flex-1 !rounded-t-none !rounded-b-none !border-t-0 !border-b-0"
              />

              {/* Code editor toolbar */}
              <div className="flex items-center gap-3 px-3 py-1.5 bg-[#f6f8fa] border border-[#e0e0e0] rounded-b text-[12px] text-[#555]">
                {/* Font size */}
                <div className="flex items-center gap-1">
                  <button type="button" className="w-5 h-5 flex items-center justify-center hover:bg-[#e0e0e0] rounded">
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-medium text-[#333] min-w-[30px] text-center">14px</span>
                  <button type="button" className="w-5 h-5 flex items-center justify-center hover:bg-[#e0e0e0] rounded">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <span className="text-[#ddd]">|</span>

                {/* Editor mode */}
                <span className="text-[#555]">에디터</span>

                <span className="text-[#ddd]">|</span>

                {/* Theme */}
                <span className="text-[#555]">Light</span>

                <span className="text-[#ddd]">|</span>

                {/* Minimap */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[#555]">미니맵</span>
                  <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-bold text-white bg-[#0077ff]">
                    ON
                  </span>
                </div>

                <span className="text-[#ddd]">|</span>

                {/* Word wrap */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[#555]">자동 줄바꿈</span>
                  <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-bold text-white bg-[#0077ff]">
                    ON
                  </span>
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Line count */}
                <span className="text-[#999]">25 lines · 0.8 KB</span>
              </div>
            </div>
          }
        />

        {/* Commit Section */}
        <div className="mt-4 p-4 bg-white border border-[#e0e0e0] rounded">
          <h3 className="flex items-center gap-2 text-[14px] font-bold text-[#111] mb-3">
            <Lock className="w-4 h-4 text-[#555]" />
            변경 내용을 커밋
          </h3>

          {/* Commit message */}
          <input
            type="text"
            className="w-full h-[36px] border border-[#ddd] rounded px-3 text-[13px] text-[#333] mb-2"
            defaultValue="Update README.md"
            readOnly
          />
          <textarea
            className="w-full h-[60px] border border-[#ddd] rounded px-3 py-2 text-[13px] text-[#999] resize-none mb-3"
            placeholder="선택적 확장 설명 추가..."
            readOnly
          />

          {/* Options */}
          <div className="space-y-2 mb-4">
            <Checkbox label="Add a Signed-off-by trailer by the committer at the end of the commit log message." />
            <div className="flex items-center gap-2">
              <input type="radio" name="commitType" checked readOnly className="accent-[#0077ff]" />
              <span className="text-[13px] text-[#333]">
                <span className="text-[#0077ff] font-semibold">&apos;main&apos;</span> 브랜치에서 직접 커밋해주세요.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input type="radio" name="commitType" readOnly className="accent-[#0077ff]" />
              <span className="text-[13px] text-[#333]">
                이 커밋에 대한 <span className="font-semibold">새로운 브랜치</span>를 만들고 풀어오기 요청을 시작합니다.
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="md">
              취소
            </Button>
            <Button
              variant="primary"
              size="md"
              className="!bg-[#00b30e] hover:!bg-[#009a0c]"
            >
              변경 내용을 커밋
            </Button>
          </div>
        </div>
      </ContentSection>
    </CcpDashboardLayout>
  );
}
