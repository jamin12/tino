import {
  LayoutDashboard,
  Layers,
  AppWindow,
  GitBranch,
  Settings,
  GitCompare,
  MoreHorizontal,
  Copy,
  Pencil,
  Trash2,
  ChevronDown,
  FolderClosed,
  FileText,
} from "lucide-react";
import {
  Badge,
  CcpDashboardLayout,
  ContentSection,
  Tabs,
  ContextMenu,
  Overlay,
  SidebarTenantIcon,
  SidebarConnectionIcon,
  SidebarServiceMeshIcon,
  createSideMenuItems,
} from "../../_components";
import type { ContextMenuEntry } from "../../_components";
import type { SlideMeta } from "@entities/document";

export const slideMeta: SlideMeta = {
  screenId: "CCP-GIT-027",
  title: "소스 저장소 상세 (커밋 상세)",
  section: "GitOps 소스 저장소",
  annotations: [
    {
      id: 1,
      label: "커밋 이력 탭",
      description:
        "커밋 이력 탭이 활성화된 상태에서 특정 커밋의 상세 내용을 보여줍니다.",
    },
    {
      id: 2,
      label: "커밋 메시지",
      description:
        "선택한 커밋의 제목과 상세 설명을 표시합니다. 더보기 버튼으로 전체 커밋 메시지를 확인할 수 있습니다.",
    },
    {
      id: 3,
      label: "작성자 및 해시 정보",
      description:
        "커밋 작성자, 작성 시점, 부모 커밋 해시, 현재 커밋 해시를 표시합니다. 해시 클릭 시 해당 커밋으로 이동합니다.",
    },
    {
      id: 4,
      label: "변경 요약",
      description:
        "커밋에 포함된 변경 파일 수, 추가 라인 수, 삭제 라인 수를 요약 표시합니다.",
    },
    {
      id: 5,
      label: "Diff 뷰 전환",
      description:
        "Unified(단일 컬럼)와 Split(좌우 분할) 간 diff 표시 모드를 전환합니다.",
    },
    {
      id: 6,
      label: "변경 파일 트리",
      description:
        "커밋에서 변경된 파일을 디렉토리 구조로 표시합니다. 파일 클릭 시 해당 파일의 diff가 오른쪽 뷰어에 표시됩니다.",
    },
    {
      id: 7,
      label: "Diff 뷰어",
      description:
        "선택한 파일의 변경 내용을 좌우 분할(Split) 형태로 표시합니다. 삭제된 라인은 빨간색, 추가된 라인은 초록색으로 강조됩니다.",
    },
    {
      id: 8,
      label: "더보기 메뉴",
      description:
        "저장소 그룹에 대한 추가 작업을 수행할 수 있는 컨텍스트 메뉴를 표시합니다.",
    },
    {
      id: 9,
      label: "컨텍스트 메뉴",
      description:
        "더보기 아이콘 클릭 시 표시되는 팝업 메뉴입니다.\n• 저장소 그룹 편집: 저장소 그룹의 이름, 설명 등을 수정합니다.\n• 저장소 그룹 삭제: 저장소 그룹을 삭제합니다. 그룹 내 저장소가 존재하면 삭제할 수 없습니다.",
    },
  ],
};

// ─── Context Menu ───────────────────────────────────────────────────────────

const repoGroupContextMenu: ContextMenuEntry[] = [
  { id: "settings", label: "설정", icon: <Settings className="w-4 h-4" /> },
  { id: "divider", type: "divider" },
  {
    id: "delete",
    label: "삭제",
    icon: <Trash2 className="w-4 h-4" />,
    textColor: "text-[#da1e28]",
  },
];

// ─── Diff Data ──────────────────────────────────────────────────────────────

interface DiffFile {
  path: string;
  additions: number;
  deletions: number;
  changeBar: number; // 0~100 percentage of additions
}

const diffFiles: DiffFile[] = [
  { path: "src/main/java/com/example/app1/controller/UserController.java", additions: 12, deletions: 3, changeBar: 80 },
  { path: "src/main/java/com/example/app1/service/UserService.java", additions: 8, deletions: 2, changeBar: 80 },
  { path: "src/main/resources/application.yml", additions: 5, deletions: 1, changeBar: 83 },
];

// ─── Diff Line Data ─────────────────────────────────────────────────────────

// Split diff rows: left (old) and right (new) side-by-side
interface SplitRow {
  leftLine?: number;
  leftContent?: string;
  leftType: "context" | "deletion" | "empty" | "header";
  rightLine?: number;
  rightContent?: string;
  rightType: "context" | "addition" | "empty" | "header";
}

const splitRows: SplitRow[] = [
  { leftType: "header", leftContent: "@@ -8,7 +8,19 @@ import org.springframework.web.bind.annotation.*;", rightType: "header", rightContent: "@@ -8,7 +8,19 @@ import org.springframework.web.bind.annotation.*;" },
  { leftLine: 8, leftContent: "import java.util.List;", leftType: "context", rightLine: 8, rightContent: "import java.util.List;", rightType: "context" },
  { leftLine: 9, leftContent: "", leftType: "context", rightLine: 9, rightContent: "", rightType: "context" },
  { leftLine: 10, leftContent: "@RestController", leftType: "context", rightLine: 10, rightContent: "@RestController", rightType: "context" },
  { leftLine: 11, leftContent: "@RequestMapping(\"/api/v1/users\")", leftType: "deletion", rightLine: 11, rightContent: "@RequestMapping(\"/api/v2/users\")", rightType: "addition" },
  { leftLine: 12, leftContent: "@RequiredArgsConstructor", leftType: "context", rightLine: 12, rightContent: "@RequiredArgsConstructor", rightType: "context" },
  { leftLine: 13, leftContent: "public class UserController {", leftType: "context", rightLine: 13, rightContent: "public class UserController {", rightType: "context" },
  { leftLine: 14, leftContent: "", leftType: "context", rightLine: 14, rightContent: "", rightType: "context" },
  { leftLine: 15, leftContent: "    private final UserService userService;", leftType: "context", rightLine: 15, rightContent: "    private final UserService userService;", rightType: "context" },
  { leftType: "empty", rightLine: 16, rightContent: "    private final UserValidator userValidator;", rightType: "addition" },
  { leftLine: 16, leftContent: "", leftType: "context", rightLine: 17, rightContent: "", rightType: "context" },
  { leftLine: 17, leftContent: "    @GetMapping", leftType: "context", rightLine: 18, rightContent: "    @GetMapping", rightType: "context" },
  { leftLine: 18, leftContent: "    public ResponseEntity<List<UserResponse>> getUsers() {", leftType: "deletion", rightLine: 19, rightContent: "    public ResponseEntity<Page<UserResponse>> getUsers(@RequestParam int page, @RequestParam int size) {", rightType: "addition" },
  { leftLine: 19, leftContent: "        return ResponseEntity.ok(userService.findAll());", leftType: "deletion", rightLine: 20, rightContent: "        return ResponseEntity.ok(userService.findAll(PageRequest.of(page, size)));", rightType: "addition" },
  { leftLine: 20, leftContent: "    }", leftType: "context", rightLine: 21, rightContent: "    }", rightType: "context" },
  { leftLine: 21, leftContent: "", leftType: "context", rightLine: 22, rightContent: "", rightType: "context" },
];

// ─── Helper: Change Bar ─────────────────────────────────────────────────────

function ChangeBar({ additions, deletions }: { additions: number; deletions: number }) {
  const total = additions + deletions;
  const blocks = 5;
  const addBlocks = total > 0 ? Math.round((additions / total) * blocks) : 0;
  const delBlocks = blocks - addBlocks;
  return (
    <div className="flex gap-px">
      {Array.from({ length: addBlocks }).map((_, i) => (
        <span key={`a${i}`} className="w-2 h-2 rounded-sm bg-[#2cbe4e]" />
      ))}
      {deletions > 0 &&
        Array.from({ length: delBlocks }).map((_, i) => (
          <span key={`d${i}`} className="w-2 h-2 rounded-sm bg-[#cb2431]" />
        ))}
    </div>
  );
}

// ─── Helper: Author Avatar ──────────────────────────────────────────────────

function AuthorAvatar() {
  return (
    <div className="w-8 h-8 rounded-full bg-[#d4e8d4] flex items-center justify-center shrink-0">
      <span className="text-[12px] font-bold text-[#2d6a2d]">JP</span>
    </div>
  );
}

// ─── Slide ──────────────────────────────────────────────────────────────────

export default function Slide09SourceRepositoryDetailCommitView() {
  return (
    <CcpDashboardLayout
      breadcrumbs={[
        { label: "홈" },
        { label: "GitOps" },
        { label: "소스 저장소", isBold: true },
      ]}
      title="app1-backend"
      sideMenuItems={createSideMenuItems({ activeId: "gitops", activeLabel: "소스 저장소" })}
      headerActions={
        <button
          data-annotation-id="8"
          type="button"
          className="flex items-center justify-center w-8 h-8 rounded hover:bg-[#f0f0f0] text-[#666]"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      }
      overlay={
        <Overlay data-annotation-id="9" top={100} right={80}>
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
          ]}
          activeId="commits"
          className="mb-0"
        />
        </div>
      </ContentSection>

      {/* ── Commit Info Card ─────────────────────────────────────────── */}
      <ContentSection>
        <div className="bg-white border border-[#e0e0e0] rounded-lg overflow-hidden mt-4">
          {/* Commit message */}
          <div data-annotation-id="2" className="px-6 pt-6 pb-4">
            <h3 className="text-[15px] font-bold text-[#111] leading-snug mb-2">
              Refactor UserController: paginated API and input validation
            </h3>
            <div className="text-[13px] text-[#555] leading-relaxed space-y-0.5">
              <p>
                - Upgrade API version v1 → v2 with pagination support
              </p>
              <p>
                - Add UserValidator dependency for request validation
              </p>
            </div>
            {/* expand */}
            <button
              type="button"
              className="mt-2 inline-flex items-center justify-center w-7 h-5 border border-[#ddd] rounded text-[#888] hover:bg-[#f6f8fa]"
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Author + Hash row */}
          <div data-annotation-id="3" className="flex items-center justify-between px-6 py-3 border-t border-[#eee]">
            <div className="flex items-center gap-2.5">
              <AuthorAvatar />
              <span className="text-[13px] font-semibold text-[#333]">
                dev.jpark
              </span>
              <span className="text-[12px] text-[#999]">5일 전</span>
            </div>
            <div className="flex items-center gap-3 text-[12px]">
              <span className="text-[#888]">부모</span>
              <Badge
                variant="neutral"
                className="!text-[11px] !px-2 !py-0.5 font-mono cursor-pointer"
              >
                d392fb1986
              </Badge>
              <span className="text-[#888]">커밋</span>
              <Badge
                variant="neutral"
                className="!text-[11px] !px-2 !py-0.5 font-mono cursor-pointer"
              >
                9d6be96359
              </Badge>
            </div>
          </div>
        </div>
      </ContentSection>

      {/* ── Diff Section ─────────────────────────────────────────────── */}
      <ContentSection>
        {/* File change summary bar */}
        <div className="flex items-center justify-between mb-3">
          <div data-annotation-id="4" className="flex items-center gap-2 text-[13px]">
            <span className="text-[#333] font-medium">
              <span className="font-semibold text-[#0077ff]">3개</span>의 변경된
              파일
            </span>
            <span className="text-[#888]">과</span>
            <span className="text-[#2cbe4e] font-semibold">25개의 추가작업</span>
            <span className="text-[#888]">그리고</span>
            <span className="text-[#cb2431] font-semibold">6개의 삭제</span>
          </div>
          <div data-annotation-id="5" className="flex items-center gap-1">
            {/* diff view toggle buttons */}
            <button
              type="button"
              className="p-1.5 border border-[#ddd] rounded-l bg-[#f6f8fa] hover:bg-[#eee]"
              title="Unified"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                className="text-[#555]"
              >
                <rect
                  x="1"
                  y="1"
                  width="14"
                  height="14"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <line
                  x1="1"
                  y1="8"
                  x2="15"
                  y2="8"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </svg>
            </button>
            <button
              type="button"
              className="p-1.5 border border-[#ddd] bg-white hover:bg-[#eee]"
              title="Split"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                className="text-[#555]"
              >
                <rect
                  x="1"
                  y="1"
                  width="14"
                  height="14"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <line
                  x1="8"
                  y1="1"
                  x2="8"
                  y2="15"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </svg>
            </button>
            <button
              type="button"
              className="p-1.5 border border-[#ddd] rounded-r bg-white hover:bg-[#eee]"
            >
              <MoreHorizontal className="w-3.5 h-3.5 text-[#555]" />
            </button>
          </div>
        </div>

        {/* Two-pane: file tree + diff viewer */}
        <div className="flex border border-[#e0e0e0] rounded-lg overflow-hidden bg-white">
          {/* File tree sidebar */}
          <div data-annotation-id="6" className="w-[260px] shrink-0 border-r border-[#e0e0e0] bg-[#fafbfc]">
            <div className="px-4 py-3 border-b border-[#eee]">
              <span className="text-[12px] font-semibold text-[#333]">
                변경된 파일
              </span>
            </div>
            {/* Tree */}
            <div className="py-2 px-2 text-[12px]">
              {/* src folder */}
              <div className="flex items-center gap-1.5 px-2 py-2 text-[#555]">
                <ChevronDown className="w-3 h-3" />
                <FolderClosed className="w-3.5 h-3.5 text-[#8ab4f8]" />
                <span>src/main/java/.../controller</span>
              </div>
              <div className="flex items-center gap-1.5 pl-8 pr-2 py-2 bg-[#e8f0fe] text-[#333] font-medium rounded">
                <FileText className="w-3.5 h-3.5 text-[#555]" />
                <span>UserController.java</span>
                <span className="ml-auto">
                  <Badge variant="success" size="sm" className="!text-[10px] !px-1 !py-0">
                    +12 -3
                  </Badge>
                </span>
              </div>
              {/* service */}
              <div className="flex items-center gap-1.5 px-2 py-2 text-[#555]">
                <ChevronDown className="w-3 h-3" />
                <FolderClosed className="w-3.5 h-3.5 text-[#8ab4f8]" />
                <span>src/main/java/.../service</span>
              </div>
              <div className="flex items-center gap-1.5 pl-8 pr-2 py-2 text-[#555] rounded">
                <FileText className="w-3.5 h-3.5 text-[#888]" />
                <span>UserService.java</span>
                <span className="ml-auto">
                  <Badge variant="success" size="sm" className="!text-[10px] !px-1 !py-0">
                    +8 -2
                  </Badge>
                </span>
              </div>
              {/* resources */}
              <div className="flex items-center gap-1.5 px-2 py-2 text-[#555]">
                <ChevronDown className="w-3 h-3" />
                <FolderClosed className="w-3.5 h-3.5 text-[#8ab4f8]" />
                <span>src/main/resources</span>
              </div>
              <div className="flex items-center gap-1.5 pl-8 pr-2 py-2 text-[#555] rounded">
                <FileText className="w-3.5 h-3.5 text-[#888]" />
                <span>application.yml</span>
                <span className="ml-auto">
                  <Badge variant="success" size="sm" className="!text-[10px] !px-1 !py-0">
                    +5 -1
                  </Badge>
                </span>
              </div>
            </div>
          </div>

          {/* Diff viewer */}
          <div data-annotation-id="7" className="flex-1 min-w-0 overflow-auto">
            {/* Diff file header */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#f6f8fa] border-b border-[#e0e0e0] sticky top-0 z-10">
              <div className="flex items-center gap-2 text-[12px]">
                <ChevronDown className="w-3.5 h-3.5 text-[#555]" />
                {/* change bar */}
                <ChangeBar additions={12} deletions={3} />
                <span className="text-[#333] font-medium">
                  src/main/java/com/example/app1/controller/UserController.java
                </span>
                <button
                  type="button"
                  className="p-0.5 text-[#999] hover:text-[#333]"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
              <div className="flex items-center gap-2 text-[12px]">
                <button
                  type="button"
                  className="px-2 py-1 border border-[#ddd] rounded text-[#555] hover:bg-[#eee]"
                >
                  UnEscape
                </button>
                <button
                  type="button"
                  className="px-2 py-1 border border-[#ddd] rounded text-[#555] hover:bg-[#eee]"
                >
                  파일 보기
                </button>
              </div>
            </div>

            {/* Split diff view */}
            <table className="w-full text-[11px] font-mono leading-[20px] table-fixed">
              <tbody>
                {splitRows.map((row, i) => {
                  if (row.leftType === "header") {
                    return (
                      <tr key={i}>
                        <td colSpan={2} className="bg-[#ddf4ff] px-3 py-0.5 text-[#57606a] border-r border-[#d0d7de] w-1/2">
                          {row.leftContent}
                        </td>
                        <td colSpan={2} className="bg-[#ddf4ff] px-3 py-0.5 text-[#57606a] w-1/2">
                          {row.rightContent}
                        </td>
                      </tr>
                    );
                  }

                  // Left side classes
                  const leftBg =
                    row.leftType === "deletion"
                      ? "bg-[#ffebe9]"
                      : row.leftType === "empty"
                        ? "bg-[#fafafa]"
                        : "";
                  const leftNumBg =
                    row.leftType === "deletion"
                      ? "bg-[#ffd7d5] text-[#cf222e]"
                      : row.leftType === "empty"
                        ? "bg-[#fafafa] text-transparent"
                        : "text-[#888]";
                  const leftPrefix =
                    row.leftType === "deletion" ? (
                      <span className="text-[#cf222e] select-none">- </span>
                    ) : row.leftType === "empty" ? null : (
                      <span className="select-none">{"  "}</span>
                    );

                  // Right side classes
                  const rightBg =
                    row.rightType === "addition"
                      ? "bg-[#e6ffec]"
                      : row.rightType === "empty"
                        ? "bg-[#fafafa]"
                        : "";
                  const rightNumBg =
                    row.rightType === "addition"
                      ? "bg-[#ccffd8] text-[#1a7f37]"
                      : row.rightType === "empty"
                        ? "bg-[#fafafa] text-transparent"
                        : "text-[#888]";
                  const rightPrefix =
                    row.rightType === "addition" ? (
                      <span className="text-[#1a7f37] select-none">+ </span>
                    ) : row.rightType === "empty" ? null : (
                      <span className="select-none">{"  "}</span>
                    );

                  return (
                    <tr key={i}>
                      {/* Left: line number */}
                      <td className={`w-[40px] px-2 text-right select-none border-r border-[#eaeaea] ${leftNumBg}`}>
                        {row.leftLine ?? ""}
                      </td>
                      {/* Left: content */}
                      <td className={`px-2 whitespace-pre overflow-hidden text-ellipsis border-r border-[#e0e0e0] ${leftBg}`}>
                        {leftPrefix}
                        {row.leftContent ?? ""}
                      </td>
                      {/* Right: line number */}
                      <td className={`w-[40px] px-2 text-right select-none border-r border-[#eaeaea] ${rightNumBg}`}>
                        {row.rightLine ?? ""}
                      </td>
                      {/* Right: content */}
                      <td className={`px-2 whitespace-pre overflow-hidden text-ellipsis ${rightBg}`}>
                        {rightPrefix}
                        {row.rightContent ?? ""}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </ContentSection>
    </CcpDashboardLayout>
  );
}
