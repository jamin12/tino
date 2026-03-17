import {
  LayoutDashboard,
  Layers,
  AppWindow,
  GitBranch,
  Settings,
  GitCompare,
  MoreHorizontal,
  Copy,
  ChevronDown,
  ChevronRight,
  FileText,
} from "lucide-react";
import {
  Badge,
  Button,
  CcpDashboardLayout,
  ContentSection,
  Tabs,
  SidebarTenantIcon,
  SidebarConnectionIcon,
  SidebarServiceMeshIcon,
  createSideMenuItems,
} from "../../_components";
import type { SlideMeta } from "@entities/document";

export const slideMeta: SlideMeta = {
  screenId: "CCP-GIT-009",
  title: "배포 저장소 상세 (커밋 상세)",
  section: "GitOps 배포 저장소",
  annotations: [
    {
      id: 1,
      label: "상세 탭 네비게이션",
      description:
        "기본정보(CCP-GIT-004), 파일(CCP-GIT-005), 브랜치/태그(CCP-GIT-007), 커밋 이력(CCP-GIT-008), GitOps(CCP-GIT-010) 탭을 전환합니다.",
    },
    {
      id: 2,
      label: "커밋 메시지",
      description:
        "커밋의 제목(커밋 메시지)을 표시합니다. 긴 메시지의 경우 '...' 버튼으로 상세 내용을 펼칠 수 있습니다.",
    },
    {
      id: 3,
      label: "소스 검색 / Operations",
      description:
        "소스 검색: 해당 커밋 시점의 소스 코드를 검색합니다.\nOperations: 이 커밋에 대한 추가 작업(Cherry-pick, Revert 등)을 수행할 수 있는 드롭다운 메뉴입니다.",
    },
    {
      id: 4,
      label: "커밋 작성자/해시 정보",
      description:
        "커밋 작성자, 작성 시간, 부모 커밋 해시, 현재 커밋 해시를 표시합니다. 해시 클릭 시 해당 커밋으로 이동할 수 있습니다.",
    },
    {
      id: 5,
      label: "변경 파일 요약",
      description:
        "변경된 파일 수, 추가된 줄 수, 삭제된 줄 수를 요약하여 표시합니다. Diff 뷰 모드(Unified/Split) 전환 버튼이 포함됩니다.",
    },
    {
      id: 6,
      label: "변경 파일 목록",
      description:
        "변경된 파일을 목록으로 표시합니다. 파일 클릭 시 해당 파일의 diff 위치로 스크롤됩니다. 각 파일에 변경 유형 아이콘이 표시됩니다.",
    },
    {
      id: 7,
      label: "Diff 뷰어",
      description:
        "각 변경 파일의 코드 변경 내용을 좌우 Split 형태로 표시합니다. 삭제된 줄은 빨간색, 추가된 줄은 녹색으로 강조됩니다. 파일별로 접기/펼치기가 가능합니다.",
    },
    {
      id: 8,
      label: "파일별 액션",
      description:
        "각 파일 diff 헤더에 표시되는 액션 버튼입니다.\n• Unescape: 이스케이프 문자를 원본으로 표시합니다.\n• 파일 보기: 해당 파일의 전체 내용을 코드 뷰어(CCP-GIT-005)에서 확인합니다.",
    },
    {
      id: 9,
      label: "더보기 메뉴",
      description:
        "배포 저장소에 대한 추가 작업을 수행할 수 있는 컨텍스트 메뉴를 표시합니다.",
    },
  ],
};

// ─── Diff Data ──────────────────────────────────────────────────────────────

interface DiffFileData {
  name: string;
  additions: number;
  deletions: number;
  rows: SplitRow[];
}

interface SplitRow {
  leftLine?: number;
  leftContent?: string;
  leftType: "context" | "deletion" | "empty" | "header";
  rightLine?: number;
  rightContent?: string;
  rightType: "context" | "addition" | "empty" | "header";
}

const diffFiles: DiffFileData[] = [
  {
    name: "ARTIFACT.txt",
    additions: 1,
    deletions: 1,
    rows: [
      {
        leftType: "header",
        leftContent: "@ -1 +1 @@",
        rightType: "header",
        rightContent: "@ -1 +1 @@",
      },
      {
        leftLine: 1,
        leftContent:
          "artifactRepository=harbor.cone-chain.net/sample-dev/sample/sample-petgradle-boot:202603101813-e4bc1b3-sample-petgradle-boot-dev-build-pr-bmdb7",
        leftType: "deletion",
        rightLine: 1,
        rightContent:
          "artifactRepository=harbor.cone-chain.net/sample-dev/sample/sample-petgradle-boot:202603111456-def8e03-sample-petgradle-boot-dev-build-pr-cs4sz",
        rightType: "addition",
      },
    ],
  },
  {
    name: "README.md",
    additions: 1,
    deletions: 1,
    rows: [
      {
        leftType: "header",
        leftContent: "@ -1 +1 @@",
        rightType: "header",
        rightContent: "@ -1 +1 @@",
      },
      {
        leftLine: 1,
        leftContent:
          "202603101813-e4bc1b3-sample-petgradle-boot-dev-build-pr-bmdb7",
        leftType: "deletion",
        rightLine: 1,
        rightContent:
          "202603111456-def8e03-sample-petgradle-boot-dev-build-pr-cs4sz",
        rightType: "addition",
      },
    ],
  },
  {
    name: "kubernetes.yaml",
    additions: 1,
    deletions: 1,
    rows: [
      {
        leftType: "header",
        leftContent: "@ -158,7 +158,7 @@ spec:",
        rightType: "header",
        rightContent: "@ -158,7 +158,7 @@ spec:",
      },
      {
        leftLine: 158,
        leftContent: "        -Djava.io.tmpdir=/app/tmp",
        leftType: "context",
        rightLine: 158,
        rightContent: "        -Djava.io.tmpdir=/app/tmp",
        rightType: "context",
      },
      {
        leftLine: 159,
        leftContent: "        -Dlogpath=/app/logs",
        leftType: "context",
        rightLine: 159,
        rightContent: "        -Dlogpath=/app/logs",
        rightType: "context",
      },
      {
        leftLine: 160,
        leftContent: "        -Dhostname=$(POD_NAME)",
        leftType: "context",
        rightLine: 160,
        rightContent: "        -Dhostname=$(POD_NAME)",
        rightType: "context",
      },
      {
        leftLine: 161,
        leftContent:
          "      image: harbor.cone-chain.net/sample-dev/sample/sample-petgradle-boot:202603101813-e4bc1b3-sample-petgradle-boot-dev-build-pr-bmdb7",
        leftType: "deletion",
        rightLine: 161,
        rightContent:
          "      image: harbor.cone-chain.net/sample-dev/sample/sample-petgradle-boot:202603111456-def8e03-sample-petgradle-boot-dev-build-pr-cs4sz",
        rightType: "addition",
      },
      {
        leftLine: 162,
        leftContent: "        imagePullPolicy: Always",
        leftType: "context",
        rightLine: 162,
        rightContent: "        imagePullPolicy: Always",
        rightType: "context",
      },
      {
        leftLine: 163,
        leftContent: "        lifecycle:",
        leftType: "context",
        rightLine: 163,
        rightContent: "        lifecycle:",
        rightType: "context",
      },
      {
        leftLine: 164,
        leftContent: "          preStop:",
        leftType: "context",
        rightLine: 164,
        rightContent: "          preStop:",
        rightType: "context",
      },
    ],
  },
];

// ─── Change Bar ─────────────────────────────────────────────────────────────

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

// ─── Author Avatar ──────────────────────────────────────────────────────────

function AuthorAvatar() {
  return (
    <div className="w-8 h-8 rounded-full bg-[#e0e8f0] flex items-center justify-center shrink-0">
      <span className="text-[13px]">🤖</span>
    </div>
  );
}

// ─── Diff Table ─────────────────────────────────────────────────────────────

function DiffTable({ rows }: { rows: SplitRow[] }) {
  return (
    <table className="w-full text-[11px] font-mono leading-[20px] table-fixed">
      <tbody>
        {rows.map((row, i) => {
          if (row.leftType === "header") {
            return (
              <tr key={i}>
                <td
                  colSpan={2}
                  className="bg-[#ddf4ff] px-3 py-0.5 text-[#57606a] border-r border-[#d0d7de] w-1/2"
                >
                  {row.leftContent}
                </td>
                <td
                  colSpan={2}
                  className="bg-[#ddf4ff] px-3 py-0.5 text-[#57606a] w-1/2"
                >
                  {row.rightContent}
                </td>
              </tr>
            );
          }

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
              <td
                className={`w-[40px] px-2 text-right select-none border-r border-[#eaeaea] ${leftNumBg}`}
              >
                {row.leftLine ?? ""}
              </td>
              <td
                className={`px-2 whitespace-pre overflow-hidden text-ellipsis border-r border-[#e0e0e0] ${leftBg}`}
              >
                {leftPrefix}
                {row.leftContent ?? ""}
              </td>
              <td
                className={`w-[40px] px-2 text-right select-none border-r border-[#eaeaea] ${rightNumBg}`}
              >
                {row.rightLine ?? ""}
              </td>
              <td
                className={`px-2 whitespace-pre overflow-hidden text-ellipsis ${rightBg}`}
              >
                {rightPrefix}
                {row.rightContent ?? ""}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

// ─── Slide ──────────────────────────────────────────────────────────────────

export default function Slide09RepositoryDetailCommitView() {
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
      sideMenuItems={createSideMenuItems({ activeId: "gitops", activeLabel: "배포 저장소" })}
      headerActions={
        <button
          data-annotation-id="9"
          type="button"
          className="flex items-center justify-center w-8 h-8 rounded hover:bg-[#f0f0f0] text-[#666]"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      }
      overlay={undefined}
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
            activeId="commits"
            className="mb-0"
          />
        </div>
      </ContentSection>

      {/* ── Commit Header Card ─────────────────────────────────────── */}
      <ContentSection>
        <div className="bg-white border border-[#e0e0e0] rounded-lg overflow-hidden">
          {/* Commit message + actions */}
          <div className="flex items-start justify-between px-5 pt-5 pb-3">
            <div data-annotation-id="2" className="flex-1 min-w-0">
              <h3 className="text-[15px] font-bold text-[#111] leading-snug">
                202603111456-def8e03-sample-petgradle-boot-dev-build-pr-cs4sz
              </h3>
              {/* expand */}
              <button
                type="button"
                className="mt-2 inline-flex items-center justify-center w-7 h-5 border border-[#ddd] rounded text-[#888] hover:bg-[#f6f8fa]"
              >
                <MoreHorizontal className="w-3.5 h-3.5" />
              </button>
            </div>
            <div data-annotation-id="3" className="flex items-center gap-2 shrink-0 ml-4">
              <Button variant="primary" size="sm">
                소스 검색
              </Button>
              <Button variant="ghost" size="sm" className="!border !border-[#ddd]">
                Operations
                <ChevronDown className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </div>

          {/* Author + Hash row */}
          <div data-annotation-id="4" className="flex items-center justify-between px-5 py-3 border-t border-[#eee]">
            <div className="flex items-center gap-2.5">
              <AuthorAvatar />
              <span className="text-[13px] font-semibold text-[#333]">
                cicdbot
              </span>
              <span className="text-[12px] text-[#999]">그저께</span>
            </div>
            <div className="flex items-center gap-3 text-[12px]">
              <span className="text-[#888]">부모</span>
              <Badge
                variant="neutral"
                className="!text-[11px] !px-2 !py-0.5 font-mono cursor-pointer"
              >
                710afae6ba
              </Badge>
              <span className="text-[#888]">커밋</span>
              <Badge
                variant="neutral"
                className="!text-[11px] !px-2 !py-0.5 font-mono cursor-pointer"
              >
                e8f7039417
              </Badge>
            </div>
          </div>
        </div>
      </ContentSection>

      {/* ── Diff Section ─────────────────────────────────────────── */}
      <ContentSection>
        {/* File change summary bar */}
        <div className="flex items-center justify-between mb-3">
          <div data-annotation-id="5" className="flex items-center gap-2 text-[13px]">
            <span className="text-[#333] font-medium">
              <span className="font-semibold text-[#0077ff]">3개</span>의 변경된 파일
            </span>
            <span className="text-[#888]">과</span>
            <span className="text-[#2cbe4e] font-semibold">3개의 추가작업</span>
            <span className="text-[#888]">그리고</span>
            <span className="text-[#cb2431] font-semibold">3개의 파일을 삭제</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="p-1.5 border border-[#ddd] rounded-l bg-[#f6f8fa] hover:bg-[#eee]"
              title="Unified"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-[#555]">
                <rect x="1" y="1" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <line x1="1" y1="8" x2="15" y2="8" stroke="currentColor" strokeWidth="1" />
              </svg>
            </button>
            <button
              type="button"
              className="p-1.5 border border-[#0077ff] bg-[#eef5ff] hover:bg-[#ddeaff]"
              title="Split"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-[#0077ff]">
                <rect x="1" y="1" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <line x1="8" y1="1" x2="8" y2="15" stroke="currentColor" strokeWidth="1" />
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

        {/* Two-pane: file list + stacked diffs */}
        <div className="flex border border-[#e0e0e0] rounded-lg overflow-hidden bg-white">
          {/* File list sidebar */}
          <div data-annotation-id="6" className="w-[200px] shrink-0 border-r border-[#e0e0e0] bg-[#fafbfc]">
            {diffFiles.map((file, i) => (
              <div
                key={file.name}
                className={`flex items-center gap-2 px-3 py-2.5 text-[12px] cursor-pointer border-b border-[#f0f0f0] ${
                  i === 0
                    ? "bg-[#e8f0fe] text-[#0077ff] font-medium"
                    : "text-[#333] hover:bg-[#f0f0f0]"
                }`}
              >
                <FileText className="w-3.5 h-3.5 shrink-0 text-[#555]" />
                <span className="truncate flex-1">{file.name}</span>
                <span className="shrink-0 w-4 h-4 rounded bg-[#ddd] flex items-center justify-center">
                  <ChevronRight className="w-3 h-3 text-[#555]" />
                </span>
              </div>
            ))}
          </div>

          {/* Stacked diffs */}
          <div data-annotation-id="7" className="flex-1 min-w-0 overflow-auto">
            {diffFiles.map((file, fi) => (
              <div key={file.name} className={fi > 0 ? "border-t border-[#e0e0e0]" : ""}>
                {/* File diff header */}
                <div
                  data-annotation-id={fi === 0 ? "8" : undefined}
                  className="flex items-center justify-between px-4 py-2 bg-[#f6f8fa] border-b border-[#e0e0e0] sticky top-0 z-10"
                >
                  <div className="flex items-center gap-2 text-[12px]">
                    <ChevronDown className="w-3.5 h-3.5 text-[#555]" />
                    <span className="font-semibold text-[#333]">
                      {file.additions + file.deletions}
                    </span>
                    <ChangeBar additions={file.additions} deletions={file.deletions} />
                    <span className="text-[#333] font-medium">{file.name}</span>
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
                      Unescape
                    </button>
                    <button
                      type="button"
                      className="px-2 py-1 border border-[#ddd] rounded text-[#555] hover:bg-[#eee]"
                    >
                      파일 보기
                    </button>
                  </div>
                </div>

                {/* Diff content */}
                <DiffTable rows={file.rows} />
              </div>
            ))}
          </div>
        </div>
      </ContentSection>
    </CcpDashboardLayout>
  );
}
