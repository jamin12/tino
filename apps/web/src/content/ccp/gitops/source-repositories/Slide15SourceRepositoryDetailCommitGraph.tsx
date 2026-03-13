import {
  LayoutDashboard,
  Layers,
  AppWindow,
  GitBranch,
  Settings,
  GitCompare,
  ChevronDown,
  GitCommitHorizontal,
  Copy,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  Badge,
  CcpDashboardLayout,
  ContentSection,
  Tabs,
  ContextMenu,
  Overlay,
} from "../../_components";
import type { SideMenuItem, ContextMenuEntry } from "../../_components";
import type { SlideMeta } from "@entities/document";

export const slideMeta: SlideMeta = {
  screenId: "CCP-GIT-028",
  title: "소스 저장소 상세 (커밋 그래프)",
  section: "GitOps 소스 저장소",
  annotations: [
    {
      id: 1,
      label: "커밋 그래프 뷰 전환",
      description:
        "커밋 이력 탭에서 '커밋 그래프' 버튼이 활성화된 상태입니다. 리스트 뷰와 그래프 뷰를 토글할 수 있습니다.",
    },
    {
      id: 2,
      label: "브랜치 그래프",
      description:
        "커밋 간의 분기(branch)와 병합(merge) 관계를 시각적 그래프로 표시합니다. 각 브랜치는 고유 색상으로 구분되며, 커밋 노드를 따라 흐름을 추적할 수 있습니다.",
    },
    {
      id: 3,
      label: "브랜치 라벨",
      description:
        "해당 커밋이 속한 브랜치명을 뱃지로 표시합니다. main, feature, hotfix 등 브랜치 유형에 따라 색상이 다릅니다.",
    },
    {
      id: 4,
      label: "커밋 액션",
      description:
        "SHA 복사 및 커밋 상세(CCP-GIT-027) 화면으로 이동하는 버튼입니다.",
    },
    {
      id: 5,
      label: "더보기 메뉴",
      description:
        "저장소 그룹에 대한 추가 작업을 수행할 수 있는 컨텍스트 메뉴를 표시합니다.",
    },
    {
      id: 6,
      label: "컨텍스트 메뉴",
      description:
        "더보기 아이콘 클릭 시 표시되는 팝업 메뉴입니다.\n• 저장소 그룹 편집: 저장소 그룹의 이름, 설명 등을 수정합니다.\n• 저장소 그룹 삭제: 저장소 그룹을 삭제합니다. 그룹 내 저장소가 존재하면 삭제할 수 없습니다.",
    },
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
          { label: "배포 애플리케이션" },
          { label: "배포 저장소" },
          { label: "소스 저장소", active: true, bold: true },
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

// ─── Graph Data ─────────────────────────────────────────────────────────────

const LANE_WIDTH = 24;
const LANE_OFFSET = 16;
const ROW_H = 44;

const laneColors = ["#0077ff", "#2cbe4e", "#e36209"];

function laneX(lane: number) {
  return LANE_OFFSET + lane * LANE_WIDTH;
}

interface GraphCommit {
  lane: number;
  /** Active vertical lanes drawn through this row */
  lanes: number[];
  /** Merge line coming from another lane into commit lane */
  mergeFrom?: number;
  /** Branch line going out to another lane from commit lane */
  branchTo?: number;
  message: string;
  author: string;
  sha: string;
  date: string;
  branchLabels?: { name: string; color: string }[];
}

const graphCommits: GraphCommit[] = [
  {
    lane: 0,
    lanes: [0],
    mergeFrom: 1,
    message: "Merge branch 'feature/user-api' into main",
    author: "dev.jpark",
    sha: "ed500b0e43",
    date: "2일 전",
    branchLabels: [
      { name: "main", color: "#0077ff" },
      { name: "feature/user-api", color: "#2cbe4e" },
    ],
  },
  {
    lane: 1,
    lanes: [0, 1],
    message: "feat: UserService에 캐시 레이어 추가",
    author: "s.kim",
    sha: "998af1e0b6",
    date: "3일 전",
  },
  {
    lane: 1,
    lanes: [0, 1],
    message: "fix: 사용자 조회 시 N+1 쿼리 문제 해결",
    author: "dev.jpark",
    sha: "57ee841ebd",
    date: "5일 전",
  },
  {
    lane: 0,
    lanes: [0],
    branchTo: 1,
    message: "feat: Spring Security OAuth2 인증 필터 구현",
    author: "h.lee",
    sha: "975d69e4fe",
    date: "1주 전",
  },
  {
    lane: 0,
    lanes: [0],
    mergeFrom: 1,
    message: "Merge branch 'hotfix/auth-fix' into main",
    author: "s.kim",
    sha: "f95829be15",
    date: "1주 전",
    branchLabels: [{ name: "hotfix/auth-fix", color: "#e36209" }],
  },
  {
    lane: 1,
    lanes: [0, 1],
    message: "fix: 인증 토큰 갱신 오류 수정",
    author: "h.lee",
    sha: "a3c7e19d02",
    date: "1주 전",
  },
  {
    lane: 0,
    lanes: [0],
    branchTo: 1,
    message: "feat: 사용자 검증 로직 UserValidator 분리",
    author: "dev.jpark",
    sha: "1972da6d70",
    date: "2주 전",
  },
  {
    lane: 0,
    lanes: [0],
    message: "test: UserController 통합 테스트 추가",
    author: "h.lee",
    sha: "06e9d52425",
    date: "2주 전",
  },
  {
    lane: 0,
    lanes: [0],
    message: "docs: API 문서 Swagger 어노테이션 추가",
    author: "m.choi",
    sha: "cb9b383c59",
    date: "3주 전",
  },
  {
    lane: 0,
    lanes: [0],
    message: "refactor: DTO 패키지 구조 재정리",
    author: "s.kim",
    sha: "1d077544a2",
    date: "1개월 전",
  },
  {
    lane: 0,
    lanes: [0],
    message: "init: Spring Boot 프로젝트 초기 설정",
    author: "m.choi",
    sha: "ce0d2cbfa9",
    date: "2개월 전",
  },
];

// ─── Graph Row Renderer ─────────────────────────────────────────────────────

function GraphCell({ commit, isLast }: { commit: GraphCommit; isLast: boolean }) {
  const maxLane = Math.max(...commit.lanes, commit.lane, commit.mergeFrom ?? 0, commit.branchTo ?? 0);
  const svgWidth = (maxLane + 1) * LANE_WIDTH + LANE_OFFSET + 8;
  const cy = ROW_H / 2;

  return (
    <svg width={svgWidth} height={ROW_H} className="shrink-0 block">
      {/* Vertical lane lines */}
      {commit.lanes.map((l) => (
        <line
          key={l}
          x1={laneX(l)}
          y1={0}
          x2={laneX(l)}
          y2={isLast && l === commit.lane ? cy : ROW_H}
          stroke={laneColors[l] ?? laneColors[0]}
          strokeWidth={2}
          opacity={0.5}
        />
      ))}

      {/* Merge curve: from mergeFrom lane (top) to commit lane (center) */}
      {commit.mergeFrom !== undefined && (
        <path
          d={`M ${laneX(commit.mergeFrom)} 0 C ${laneX(commit.mergeFrom)} ${cy * 0.5}, ${laneX(commit.lane)} ${cy * 0.5}, ${laneX(commit.lane)} ${cy}`}
          fill="none"
          stroke={laneColors[commit.mergeFrom] ?? laneColors[0]}
          strokeWidth={2}
          opacity={0.5}
        />
      )}

      {/* Branch curve: from commit lane (center) to branchTo lane (bottom) */}
      {commit.branchTo !== undefined && (
        <path
          d={`M ${laneX(commit.lane)} ${cy} C ${laneX(commit.lane)} ${cy + cy * 0.5}, ${laneX(commit.branchTo)} ${cy + cy * 0.5}, ${laneX(commit.branchTo)} ${ROW_H}`}
          fill="none"
          stroke={laneColors[commit.branchTo] ?? laneColors[0]}
          strokeWidth={2}
          opacity={0.5}
        />
      )}

      {/* Commit dot */}
      <circle
        cx={laneX(commit.lane)}
        cy={cy}
        r={5}
        fill={laneColors[commit.lane] ?? laneColors[0]}
        stroke="#fff"
        strokeWidth={2}
      />
    </svg>
  );
}

// ─── Avatar ─────────────────────────────────────────────────────────────────

const avatarColors: Record<string, { bg: string; fg: string }> = {
  "dev.jpark": { bg: "#d4e8d4", fg: "#2d6a2d" },
  "s.kim": { bg: "#d4dce8", fg: "#2d4a6a" },
  "h.lee": { bg: "#e8d4e8", fg: "#6a2d6a" },
  "m.choi": { bg: "#e8e4d4", fg: "#6a5a2d" },
};

function DevAvatar({ author }: { author: string }) {
  const initials = author.split(".").pop()?.slice(0, 2).toUpperCase() ?? "??";
  const color = avatarColors[author] ?? { bg: "#e0e0e0", fg: "#555" };
  return (
    <div
      className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
      style={{ background: color.bg }}
    >
      <span className="text-[11px] font-bold" style={{ color: color.fg }}>
        {initials}
      </span>
    </div>
  );
}

// ─── Slide ──────────────────────────────────────────────────────────────────

export default function Slide15SourceRepositoryDetailCommitGraph() {
  return (
    <CcpDashboardLayout
      breadcrumbs={[
        { label: "홈" },
        { label: "GitOps" },
        { label: "소스 저장소", isBold: true },
      ]}
      title="app1-backend"
      sideMenuItems={sideMenuItems}
      headerActions={
        <button
          data-annotation-id="5"
          type="button"
          className="flex items-center justify-center w-8 h-8 rounded hover:bg-[#f0f0f0] text-[#666]"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      }
      overlay={
        <Overlay data-annotation-id="6" top={100} right={80}>
          <ContextMenu items={repoGroupContextMenu} className="w-[200px]" />
        </Overlay>
      }
    >
      <ContentSection>
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
      </ContentSection>

      <ContentSection>
        {/* Branch selector + 커밋 그래프 toggle */}
        <div className="flex items-center gap-2 mb-4">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#ddd] rounded bg-white text-[13px] text-[#333] hover:bg-[#f6f8fa]"
          >
            <GitBranch className="w-3.5 h-3.5 text-[#555]" />
            main
            <ChevronDown className="w-3.5 h-3.5 text-[#999]" />
          </button>
          <button
            data-annotation-id="1"
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#0077ff] rounded bg-[#eef5ff] text-[13px] text-[#0077ff] font-medium"
          >
            <GitCommitHorizontal className="w-3.5 h-3.5" />
            커밋 그래프
          </button>
        </div>

        {/* Commit graph card */}
        <div className="bg-white border border-[#e0e0e0] rounded overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#e0e0e0] bg-[#f6f8fa]">
            <span className="text-[13px] font-semibold text-[#333]">
              11 커밋
            </span>
            <div className="flex items-center gap-3 text-[12px] text-[#888]">
              <span className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block"
                  style={{ background: laneColors[0] }}
                />
                main
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block"
                  style={{ background: laneColors[1] }}
                />
                feature
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block"
                  style={{ background: laneColors[2] }}
                />
                hotfix
              </span>
            </div>
          </div>

          {/* Graph rows */}
          <div data-annotation-id="2">
            {graphCommits.map((commit, i) => (
              <div
                key={commit.sha}
                className={`flex items-center ${
                  i < graphCommits.length - 1
                    ? "border-b border-[#f0f0f0]"
                    : ""
                } hover:bg-[#f9fafb]`}
              >
                {/* Graph column */}
                <div className="shrink-0 pl-2">
                  <GraphCell
                    commit={commit}
                    isLast={i === graphCommits.length - 1}
                  />
                </div>

                {/* Message + branch labels */}
                <div className="flex-1 min-w-0 px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] text-[#333] truncate">
                      {commit.message}
                    </span>
                    {commit.branchLabels && (
                      <div
                        data-annotation-id={i === 0 ? "3" : undefined}
                        className="flex items-center gap-1 shrink-0"
                      >
                        {commit.branchLabels.map((bl) => (
                          <span
                            key={bl.name}
                            className="px-2 py-0.5 rounded text-[10px] font-semibold text-white whitespace-nowrap"
                            style={{ background: bl.color }}
                          >
                            {bl.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Author */}
                <div className="flex items-center gap-2 shrink-0 px-3">
                  <DevAvatar author={commit.author} />
                  <span className="text-[12px] text-[#555] w-[80px] truncate">
                    {commit.author}
                  </span>
                </div>

                {/* SHA */}
                <div className="shrink-0 px-2">
                  <Badge
                    variant="neutral"
                    className="!text-[11px] !px-2 !py-0.5 font-mono cursor-pointer"
                  >
                    {commit.sha}
                  </Badge>
                </div>

                {/* Date */}
                <div className="shrink-0 px-3 w-[80px] text-right">
                  <span className="text-[12px] text-[#999] whitespace-nowrap">
                    {commit.date}
                  </span>
                </div>

                {/* Actions */}
                <div
                  data-annotation-id={i === 0 ? "4" : undefined}
                  className="flex items-center gap-1 shrink-0 pr-4"
                >
                  <button
                    type="button"
                    className="p-1 text-[#555] hover:bg-[#e8e8e8] rounded"
                    title="복사"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    className="p-1 text-[#555] hover:bg-[#e8e8e8] rounded"
                    title="상세보기"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ContentSection>
    </CcpDashboardLayout>
  );
}
