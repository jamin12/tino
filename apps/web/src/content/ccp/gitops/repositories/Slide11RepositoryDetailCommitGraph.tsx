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
  MoreHorizontal,
  Link2,
  Unlink,
  Trash2,
} from "lucide-react";
import {
  Badge,
  CcpDashboardLayout,
  ContentSection,
  ContextMenu,
  Overlay,
  Tabs,
} from "../../_components";
import type { SideMenuItem, ContextMenuEntry } from "../../_components";
import type { SlideMeta } from "@entities/document";

export const slideMeta: SlideMeta = {
  screenId: "CCP-GIT-011",
  title: "배포 저장소 상세 (커밋 그래프)",
  section: "GitOps 배포 저장소",
  description: "???저장소 그룹은 Gitea 조직을 기반으로 하며, ArgoCD 프로젝트와 1:1로 매핑됩니다. 하나의 저장소 그룹 안에 여러 배포 저장소가 포함될 수 있습니다.???",
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
        "해당 커밋이 속한 브랜치명을 뱃지로 표시합니다. main, release 등 브랜치 유형에 따라 색상이 다릅니다.",
    },
    {
      id: 4,
      label: "커밋 ID 복사",
      description:
        "해당 커밋의 SHA 해시를 클립보드에 복사하는 버튼입니다.",
    },
    {
      id: 5,
      label: "더보기 메뉴",
      description:
        "배포 저장소에 대한 추가 작업을 수행할 수 있는 컨텍스트 메뉴를 표시합니다.",
    },
    {
      id: 6,
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
  lanes: number[];
  mergeFrom?: number;
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
    message: "Merge branch 'release/v2.1.0' into main",
    author: "cicdbot",
    sha: "ed500b0e43",
    date: "지난달",
    branchLabels: [
      { name: "main", color: "#0077ff" },
      { name: "release/v2.1.0", color: "#2cbe4e" },
    ],
  },
  {
    lane: 1,
    lanes: [0, 1],
    message: "202602020948-194fe31-sample-egov2vm-tomcat-dev-build-pr-4gpjb",
    author: "cicdbot",
    sha: "998af1e0b6",
    date: "5개월 전",
  },
  {
    lane: 1,
    lanes: [0, 1],
    message: "202510211122-194fe31-sample-egov2vm-tomcat-dev-build-pr-qddbd",
    author: "cicdbot",
    sha: "57ee841ebd",
    date: "5개월 전",
  },
  {
    lane: 0,
    lanes: [0],
    branchTo: 1,
    message: "202510201349-194fe31-sample-egov2vm-tomcat-dev-build-pr-6vrtq",
    author: "cicdbot",
    sha: "975d69e4fe",
    date: "6개월 전",
  },
  {
    lane: 0,
    lanes: [0],
    mergeFrom: 1,
    message: "Merge branch 'hotfix/config-fix' into main",
    author: "cicdbot",
    sha: "f95829be15",
    date: "6개월 전",
    branchLabels: [{ name: "hotfix/config-fix", color: "#e36209" }],
  },
  {
    lane: 1,
    lanes: [0, 1],
    message: "202509191120-194fe31-sample-egov2vm-tomcat-dev-build-pr-wnc4v",
    author: "cicdbot",
    sha: "1972da6d70",
    date: "7개월 전",
  },
  {
    lane: 0,
    lanes: [0],
    branchTo: 1,
    message: "202509011047-194fe31-sample-egov2vm-tomcat-dev-build-pr-n2lpr",
    author: "cicdbot",
    sha: "06e9d52425",
    date: "7개월 전",
  },
  {
    lane: 0,
    lanes: [0],
    message: "202508290144-194fe31-sample-egov2vm-tomcat-dev-build-pr-8p6w9",
    author: "cicdbot",
    sha: "cb9b383c59",
    date: "8개월 전",
  },
  {
    lane: 0,
    lanes: [0],
    message: "202507251755-194fe31-sample-egov2vm-tomcat-dev-build-pr-rdjx7",
    author: "cicdbot",
    sha: "1d077544a2",
    date: "9개월 전",
  },
  {
    lane: 0,
    lanes: [0],
    message: "202506231754-194fe31-sample-egov2vm-tomcat-dev-build-pr-rwvgr",
    author: "cicdbot",
    sha: "70324f2855",
    date: "9개월 전",
  },
  {
    lane: 0,
    lanes: [0],
    message: "202506171604-194fe31-sample-egov2vm-tomcat-dev-build-pr-k678w",
    author: "cicdbot",
    sha: "ce0d2cbfa9",
    date: "9개월 전",
  },
];

// ─── Graph Row Renderer ─────────────────────────────────────────────────────

function GraphCell({ commit, isLast }: { commit: GraphCommit; isLast: boolean }) {
  const maxLane = Math.max(...commit.lanes, commit.lane, commit.mergeFrom ?? 0, commit.branchTo ?? 0);
  const svgWidth = (maxLane + 1) * LANE_WIDTH + LANE_OFFSET + 8;
  const cy = ROW_H / 2;

  return (
    <svg width={svgWidth} height={ROW_H} className="shrink-0 block">
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

      {commit.mergeFrom !== undefined && (
        <path
          d={`M ${laneX(commit.mergeFrom)} 0 C ${laneX(commit.mergeFrom)} ${cy * 0.5}, ${laneX(commit.lane)} ${cy * 0.5}, ${laneX(commit.lane)} ${cy}`}
          fill="none"
          stroke={laneColors[commit.mergeFrom] ?? laneColors[0]}
          strokeWidth={2}
          opacity={0.5}
        />
      )}

      {commit.branchTo !== undefined && (
        <path
          d={`M ${laneX(commit.lane)} ${cy} C ${laneX(commit.lane)} ${cy + cy * 0.5}, ${laneX(commit.branchTo)} ${cy + cy * 0.5}, ${laneX(commit.branchTo)} ${ROW_H}`}
          fill="none"
          stroke={laneColors[commit.branchTo] ?? laneColors[0]}
          strokeWidth={2}
          opacity={0.5}
        />
      )}

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

function BotAvatar() {
  return (
    <div className="w-7 h-7 rounded-full bg-[#f0e0e0] flex items-center justify-center shrink-0">
      <span className="text-[12px]">🤖</span>
    </div>
  );
}

// ─── Slide ──────────────────────────────────────────────────────────────────

export default function Slide11RepositoryDetailCommitGraph() {
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
              { id: "gitops", label: "GitOps", dividerBefore: true },
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
                release
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
                  <BotAvatar />
                  <span className="text-[12px] text-[#555] w-[60px] truncate">
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
                    title="커밋 ID 복사"
                  >
                    <Copy className="w-3.5 h-3.5" />
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
