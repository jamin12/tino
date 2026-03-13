import {
  LayoutDashboard,
  Layers,
  AppWindow,
  GitBranch,
  Settings,
  GitCompare,
  Folder,
  FileText,
  Pencil,
  Link2,
  Unlink,
  Trash2,
  Eye,
  MoreHorizontal,
} from "lucide-react";
import {
  Badge,
  Button,
  CcpDashboardLayout,
  ContextMenu,
  ContentSection,
  CodeEditor,
  Overlay,
  SplitPanel,
  Tabs,
} from "../../_components";
import type { SideMenuItem, ContextMenuEntry } from "../../_components";
import type { SlideMeta } from "@entities/document";

export const slideMeta: SlideMeta = {
  screenId: "CCP-GIT-005",
  title: "배포 저장소 상세 (파일)",
  section: "GitOps 배포 저장소",
  description:
    "???파일 탭 최초 진입 시 저장소에 README 파일(README.md 등)이 존재하면 해당 파일을 우선적으로 선택하여 코드 뷰어에 표시합니다.???",
  annotations: [
    {
      id: 1,
      label: "상세 탭 네비게이션",
      description:
        "기본정보(CCP-GIT-004), 파일, 브랜치/태그(CCP-GIT-007), 커밋 이력(CCP-GIT-008), GitOps(CCP-GIT-010) 탭을 전환합니다. 현재 '파일' 탭이 활성화되어 있습니다.",
    },
    {
      id: 2,
      label: "브랜치/커밋 정보",
      description:
        "현재 선택된 브랜치 이름, 최신 커밋 작성자, 커밋 해시, 커밋 메시지 및 시간을 표시합니다.",
    },
    {
      id: 3,
      label: "파일 트리",
      description:
        "저장소의 디렉토리 구조를 트리 형태로 표시합니다. 파일 클릭 시 우측 코드 뷰어에 해당 파일의 내용이 표시됩니다.",
    },
    {
      id: 4,
      label: "파일 편집/미리보기",
      description:
        "'파일 편집' 클릭 시 웹 코드 에디터(CCP-GIT-006) 화면으로 전환되어 파일을 직접 수정할 수 있습니다. '변경내용 미리보기' 클릭 시 편집 전후의 Diff를 확인하는 미리보기(CCP-GIT-006-1) 화면으로 전환됩니다.",
    },
    {
      id: 5,
      label: "코드 뷰어",
      description:
        "선택된 파일의 내용을 구문 강조와 줄 번호와 함께 표시합니다. YAML, JSON 등 다양한 언어를 지원하며, 4번 '파일 편집' 버튼을 통해 직접 수정할 수 있습니다.",
    },
    {
      id: 6,
      label: "더보기 메뉴",
      description:
        "배포 저장소에 대한 추가 작업을 수행할 수 있는 컨텍스트 메뉴를 표시합니다.",
    },
    {
      id: 7,
      label: "컨텍스트 메뉴",
      description:
        "더보기 아이콘 클릭 시 표시되는 팝업 메뉴입니다.\n• 애플리케이션 생성: 연결된 앱을 만듭니다.\n• 설정: 해당 저장소의 상세 화면 설정 탭으로 이동합니다.\n• 연결: GitOps 연결을 설정합니다.\n• 연결해제: GitOps 연결을 해제합니다.\n• 삭제: 저장소를 삭제합니다.",
    },
  ],
};

// ─── Context Menu Data ──────────────────────────────────────────────────────

const repoGroupContextMenu: ContextMenuEntry[] = [
  { id: "create-app", label: "애플리케이션 생성", icon: <Link2 className="w-4 h-4" /> },
  { id: "settings", label: "설정", icon: <Settings className="w-4 h-4" /> },
  { id: "connect", label: "연결", icon: <Link2 className="w-4 h-4" /> },
  {
    id: "disconnect",
    label: "연결해제",
    icon: <Unlink className="w-4 h-4" />,
    textColor: "text-[#da1e28]",
  },
  { id: "divider", type: "divider" },
  {
    id: "delete",
    label: "삭제",
    icon: <Trash2 className="w-4 h-4" />,
    textColor: "text-[#da1e28]",
  },
];

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
          { label: "배포 애플리케이션" },
          { label: "배포 저장소", active: true, bold: true },
          { label: "소스 저장소" },
          { label: "저장소 그룹" },
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

const sampleYaml = `apiVersion: tekton.dev/v1beta1
kind: Pipeline
metadata:
  name: build-pr
  namespace: app-cicd
spec:
  params:
    - name: git-url
      type: string
      description: "Git repository URL"
    - name: git-revision
      type: string
      default: "main"
    - name: image-name
      type: string
      description: "Container image name"
  workspaces:
    - name: shared-workspace
    - name: maven-settings
  tasks:
    - name: fetch-source
      taskRef:
        name: git-clone
        kind: ClusterTask
      params:
        - name: url
          value: \$(params.git-url)
        - name: revision
          value: \$(params.git-revision)
      workspaces:
        - name: output
          workspace: shared-workspace
    - name: maven-build
      runAfter:
        - fetch-source
      taskRef:
        name: maven
      params:
        - name: GOALS
          value: ["clean", "package", "-DskipTests"]`;

// ─── File Tree ──────────────────────────────────────────────────────────────

interface FileTreeItem {
  name: string;
  type: "folder" | "file";
  active?: boolean;
  indent?: number;
  date: string;
}

const fileTree: FileTreeItem[] = [
  { name: "dev", type: "folder", indent: 0, date: "2일 전" },
  { name: "stg", type: "folder", indent: 0, date: "4분 전" },
  { name: "prd", type: "folder", indent: 0, date: "5분 전" },
  {
    name: "build-pr.yaml",
    type: "file",
    active: true,
    indent: 0,
    date: "14건 전",
  },
  { name: "kustomization.yaml", type: "file", indent: 0, date: "3일 전" },
  { name: "README.md", type: "file", indent: 0, date: "3일 전" },
];

// ─── Slide ──────────────────────────────────────────────────────────────────

export default function Slide05RepositoryDetailCode() {
  return (
    <CcpDashboardLayout
      breadcrumbs={[
        { label: "홈" },
        { label: "GitOps" },
        { label: "배포 저장소", isBold: true },
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
      headerActions={
        <button
          data-annotation-id="6"
          type="button"
          className="flex items-center justify-center w-8 h-8 rounded hover:bg-[#f0f0f0] text-[#666]"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      }
      overlay={
        <Overlay data-annotation-id="7" top={100} right={80}>
          <ContextMenu items={repoGroupContextMenu} className="w-[200px]" />
        </Overlay>
      }
    >
      <ContentSection>
        <div data-annotation-id="1">
          <Tabs
            items={[
              { id: "basic", label: "기본정보" },
              { id: "files", label: "파일" },
              { id: "branches", label: "브랜치/태그" },
              { id: "commits", label: "커밋 이력" },
              { id: "settings", label: "설정" },
              { id: "gitops", label: "GitOps", dividerBefore: true },
            ]}
            activeId="files"
            className="mb-0"
          />
        </div>
      </ContentSection>

      <ContentSection>
        {/* Branch & commit info */}
        <div data-annotation-id="2" className="flex items-center gap-3 mb-3">
          <Badge variant="neutral" className="!px-3 !py-1">
            <GitBranch className="w-3 h-3 mr-1" />
            main
          </Badge>
          <div className="flex items-center gap-2 text-[12px] text-[#555]">
            <span className="font-semibold text-[#333]">cicdmanager</span>
            <Badge variant="neutral" className="!text-[11px] !px-1.5 font-mono">
              5628ab1c8b
            </Badge>
            <span>Initial commit from template</span>
            <span className="text-[#999]">· 17시간 전</span>
          </div>
        </div>

        {/* File tree + Code viewer */}
        <SplitPanel
          leftWidth="240px"
          height="520px"
          left={
            <div data-annotation-id="3" className="border border-[#e0e0e0] rounded bg-white h-full overflow-auto">
              {fileTree.map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 px-3 py-2 cursor-pointer text-[13px] border-b border-[#f0f0f0] ${
                    item.active
                      ? "bg-[#e8f0fe] text-[#0077ff] font-semibold"
                      : "text-[#333] hover:bg-[#f6f8fa]"
                  }`}
                  style={{ paddingLeft: `${12 + (item.indent || 0) * 16}px` }}
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
              {/* File tab header */}
              <div className="flex items-center justify-between px-3 py-2 bg-[#f6f8fa] border border-[#e0e0e0] rounded-t">
                <div className="flex items-center gap-2 text-[13px] text-[#555]">
                  <span>app1-maven-pipeline</span>
                  <span className="text-[#999]">/</span>
                  <span className="font-semibold text-[#333]">
                    build-pr.yaml
                  </span>
                </div>
                <div data-annotation-id="4" className="flex items-center gap-2">
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
              <div data-annotation-id="5" className="flex-1">
              <CodeEditor
                code={sampleYaml}
                language="yaml"
                theme="light"
                fontSize={13}
                showLineNumbers={true}
                wordWrap={true}
                className="flex-1 !rounded-t-none !border-t-0"
              />
              </div>
            </div>
          }
        />
      </ContentSection>
    </CcpDashboardLayout>
  );
}
