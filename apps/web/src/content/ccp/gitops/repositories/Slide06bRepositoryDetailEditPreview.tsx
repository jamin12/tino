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
  Link2,
  Unlink,
  Trash2,
} from "lucide-react";
import {
  Badge,
  Button,
  CcpDashboardLayout,
  ContextMenu,
  ContentSection,
  Overlay,
  SplitPanel,
  Tabs,
} from "../../_components";
import type { SideMenuItem, ContextMenuEntry } from "../../_components";
import type { SlideMeta } from "@entities/document";

export const slideMeta: SlideMeta = {
  screenId: "CCP-GIT-006-1",
  title: "배포 저장소 상세 (변경내용 미리보기)",
  section: "GitOps 배포 저장소",
  annotations: [
    {
      id: 1,
      label: "미리보기 탭 활성",
      description:
        "'변경내용 미리보기' 버튼이 활성화된 상태입니다. '파일 편집' 버튼을 클릭하면 코드 에디터(CCP-GIT-006)로 돌아갑니다.",
    },
    {
      id: 2,
      label: "Diff 뷰어",
      description:
        "편집 전후의 변경 내용을 줄 단위로 비교합니다. 삭제된 줄은 빨간색(-), 추가된 줄은 초록색(+)으로 표시됩니다. 줄 번호는 변경 전(왼쪽)과 변경 후(오른쪽) 두 개를 표시합니다.",
    },
    {
      id: 3,
      label: "커밋 메시지 입력",
      description:
        "커밋 제목과 선택적 확장 설명을 입력합니다. 제목은 필수이며, 변경 사항을 간결하게 요약합니다.",
    },
    {
      id: 4,
      label: "브랜치 직접 커밋",
      description:
        "현재 선택된 브랜치(main)에 직접 커밋합니다. 별도의 리뷰 과정 없이 즉시 반영됩니다.",
    },
    {
      id: 5,
      label: "새 브랜치 + 끌어오기 요청",
      description:
        "이 커밋에 대한 새로운 브랜치를 만들고 끌어오기 요청(Pull Request)을 시작합니다. 브랜치 이름을 직접 입력할 수 있으며, 기본값은 'devopsadmin-patch-1' 형식입니다.",
    },
    {
      id: 6,
      label: "커밋 / 취소",
      description:
        "변경 내용을 확인한 후 '변경 내용을 커밋' 버튼으로 커밋을 수행합니다. '취소' 클릭 시 파일 뷰어(CCP-GIT-005) 화면으로 전환됩니다.",
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

// ─── Diff Data ──────────────────────────────────────────────────────────────

interface DiffLine {
  type: "context" | "removed" | "added" | "header";
  oldNum?: number;
  newNum?: number;
  content: string;
}

const diffLines: DiffLine[] = [
  { type: "header", content: "@@ -14,9 +14,11 @@ metadata:" },
  { type: "context", oldNum: 14, newNum: 14, content: "    app: app1-maven" },
  { type: "context", oldNum: 15, newNum: 15, content: "    argocd.argoproj.io/instance: build-maven-spring-boot-pipeline" },
  { type: "context", oldNum: 16, newNum: 16, content: "    env: dev" },
  { type: "removed", oldNum: 17, content: "    tekton.dev/pipeline: build-maven-spring-boot-pipeline" },
  { type: "added", newNum: 17, content: "    tekton.dev/pipeline: build-maven-spring-boot-pipeline-v2" },
  { type: "context", oldNum: 18, newNum: 18, content: "    type: build" },
  { type: "removed", oldNum: 19, content: "  name: sample-egovmaven-core-dev-build-pr" },
  { type: "added", newNum: 19, content: "  name: sample-egovmaven-core-dev-build-pr-v2" },
  { type: "context", oldNum: 20, newNum: 20, content: "  namespace: app-cicd" },
  { type: "context", oldNum: 21, newNum: 21, content: "  resourceVersion: '118853767'" },
  { type: "context", oldNum: 22, newNum: 22, content: "  uid: add627fa-adc5-45a5-8595-cd1975c5b44b" },
  { type: "header", content: "@@ -24,6 +26,8 @@ spec:" },
  { type: "context", oldNum: 24, newNum: 26, content: "  params:" },
  { type: "context", oldNum: 25, newNum: 27, content: "    - name: git-host-url" },
  { type: "context", oldNum: 26, newNum: 28, content: "      value: https://gitea.cone-chain.com" },
  { type: "added", newNum: 29, content: "    - name: build-timeout" },
  { type: "added", newNum: 30, content: "      value: '3600'" },
  { type: "context", oldNum: 27, newNum: 31, content: "    - name: code-repo-org" },
  { type: "context", oldNum: 28, newNum: 32, content: "      value: sample" },
  { type: "context", oldNum: 29, newNum: 33, content: "    - name: code-repo-name" },
  { type: "context", oldNum: 30, newNum: 34, content: "      value: sample-egovmaven-core" },
];

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

// ─── Diff Line Component ────────────────────────────────────────────────────

function DiffRow({ line }: { line: DiffLine }) {
  if (line.type === "header") {
    return (
      <div className="flex items-center bg-[#e8eefb] text-[#555] text-[12px] font-mono px-2 py-1 border-b border-[#d8dde6]">
        <span className="w-[40px] text-center text-[#999] select-none shrink-0">...</span>
        <span className="w-[40px] text-center text-[#999] select-none shrink-0">...</span>
        <span className="pl-2">{line.content}</span>
      </div>
    );
  }

  const bgColor =
    line.type === "removed"
      ? "bg-[#ffeef0]"
      : line.type === "added"
        ? "bg-[#e6ffec]"
        : "bg-white";

  const numColor =
    line.type === "removed"
      ? "text-[#cb2431]"
      : line.type === "added"
        ? "text-[#22863a]"
        : "text-[#999]";

  const prefix =
    line.type === "removed" ? "-" : line.type === "added" ? "+" : " ";

  return (
    <div
      className={`flex items-center ${bgColor} text-[12px] font-mono border-b border-[#f0f0f0] hover:brightness-95`}
    >
      <span
        className={`w-[40px] text-right pr-2 ${numColor} select-none shrink-0`}
      >
        {line.oldNum ?? ""}
      </span>
      <span
        className={`w-[40px] text-right pr-2 ${numColor} select-none shrink-0 border-r border-[#e0e0e0]`}
      >
        {line.newNum ?? ""}
      </span>
      <span className="pl-2 whitespace-pre text-[#333]">
        <span className={numColor}>{prefix}</span>
        {line.content}
      </span>
    </div>
  );
}

// ─── Slide ──────────────────────────────────────────────────────────────────

export default function Slide06bRepositoryDetailEditPreview() {
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
        </span>
      }
      sideMenuItems={sideMenuItems}
      headerActions={
        <button
          type="button"
          className="flex items-center justify-center w-8 h-8 rounded hover:bg-[#f0f0f0] text-[#666]"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      }
    >
      <ContentSection>
        <Tabs
          items={[
            { id: "basic", label: "기본정보" },
            { id: "code", label: "파일" },
            { id: "branches", label: "브랜치/태그" },
            { id: "commits", label: "커밋 이력" },
            { id: "settings", label: "설정" },
            { id: "gitops", label: "GitOps", dividerBefore: true },
          ]}
          activeId="code"
          className="mb-0"
        />
      </ContentSection>

      <ContentSection>
        {/* Toolbar */}
        <div className="flex items-center gap-2 mb-3">
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

          <div className="flex items-center gap-1.5 flex-1 max-w-[260px] h-[34px] border border-[#ddd] rounded px-3 bg-white">
            <Search className="w-3.5 h-3.5 text-[#999]" />
            <span className="text-[13px] text-[#999]">코드 검색</span>
          </div>

          <Button variant="primary" size="md">
            <Plus className="w-4 h-4 mr-1" />
            새 파일
          </Button>

          <div className="flex-1" />

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

        {/* File tree + Diff viewer */}
        <SplitPanel
          leftWidth="240px"
          height="420px"
          left={
            <div className="border border-[#e0e0e0] rounded bg-white h-full overflow-auto">
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
                <div data-annotation-id="1" className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="!h-7 !text-[12px]">
                    <Pencil className="w-3 h-3 mr-1" />
                    파일 편집
                  </Button>
                  <Button variant="primary" size="sm" className="!h-7 !text-[12px]">
                    <Eye className="w-3 h-3 mr-1" />
                    변경내용 미리보기
                  </Button>
                </div>
              </div>

              {/* Diff viewer */}
              <div data-annotation-id="2" className="flex-1 border-x border-b border-[#e0e0e0] rounded-b overflow-auto bg-white">
                {/* Diff stats header */}
                <div className="flex items-center gap-3 px-3 py-2 border-b border-[#e0e0e0] bg-[#fafafa] text-[12px]">
                  <span className="font-semibold text-[#333]">build-pr.yaml</span>
                  <span className="text-[#22863a]">+4</span>
                  <span className="text-[#cb2431]">-2</span>
                </div>

                {/* Diff lines */}
                {diffLines.map((line, i) => (
                  <DiffRow key={i} line={line} />
                ))}
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

          <div data-annotation-id="3">
            <input
              type="text"
              className="w-full h-[36px] border border-[#ddd] rounded px-3 text-[13px] text-[#333] mb-2"
              defaultValue="Update build-pr.yaml"
              readOnly
            />
            <textarea
              className="w-full h-[60px] border border-[#ddd] rounded px-3 py-2 text-[13px] text-[#999] resize-none mb-3"
              placeholder="선택적 확장 설명 추가..."
              readOnly
            />
          </div>

          <div className="space-y-2 mb-4">
            <div data-annotation-id="4" className="flex items-center gap-2">
              <input type="radio" name="commitType" readOnly className="accent-[#0077ff]" />
              <span className="text-[13px] text-[#333]">
                <span className="text-[#0077ff] font-semibold">&apos;main&apos;</span> 브랜치에서 직접 커밋해주세요.
              </span>
            </div>
            <div data-annotation-id="5" className="flex items-center gap-2">
              <input type="radio" name="commitType" checked readOnly className="accent-[#0077ff]" />
              <span className="text-[13px] text-[#333]">
                이 커밋에 대한 <span className="font-semibold">새로운 브랜치</span>를 만들고 끌어오기 요청을 시작합니다.
              </span>
            </div>
            <div className="ml-6 mt-1">
              <input
                type="text"
                className="w-[260px] h-[34px] border border-[#ddd] rounded px-3 text-[13px] text-[#333]"
                defaultValue="devopsadmin-patch-1"
                readOnly
              />
            </div>
          </div>
        </div>
      </ContentSection>

      {/* Bottom fixed action bar */}
      <div data-annotation-id="6" className="sticky bottom-0 left-0 right-0 px-8 py-3 flex justify-end gap-2">
        <Button variant="ghost" size="md">
          취소
        </Button>
        <Button variant="primary" size="md">
          변경 내용을 커밋
        </Button>
      </div>
    </CcpDashboardLayout>
  );
}
