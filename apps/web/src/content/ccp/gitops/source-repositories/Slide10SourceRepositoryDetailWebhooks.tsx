import {
  LayoutDashboard,
  Layers,
  AppWindow,
  GitBranch,
  Settings,
  GitCompare,
  Check,
  X,
  Trash2,
  Pencil,
} from "lucide-react";
import {
  Badge,
  Button,
  CcpDashboardLayout,
  ContentSection,
  Tabs,
} from "../../_components";
import type { SideMenuItem } from "../../_components";
import type { SlideMeta } from "@entities/document";

export const slideMeta: SlideMeta = {
  screenId: "CCP-GIT-029",
  title: "소스 저장소 상세 (웹훅)",
  section: "GitOps 소스 저장소",
  annotations: [
    {
      id: 1,
      label: "설정 탭",
      description:
        "저장소 상세의 설정 탭이 활성화된 상태입니다. 하위 메뉴에서 '웹훅'이 선택되어 있습니다.",
    },
    {
      id: 2,
      label: "설정 하위 메뉴",
      description:
        "설정 탭 내에서 '고급'과 '웹훅' 하위 메뉴를 전환합니다. 현재 '웹훅'이 활성 상태입니다.",
    },
    {
      id: 3,
      label: "웹훅 추가 버튼",
      description:
        "새 웹훅을 등록하는 폼(CCP-GIT-030) 화면으로 이동합니다.",
    },
    {
      id: 4,
      label: "웹훅 목록 테이블",
      description:
        "등록된 웹훅을 상태, 대상 URL, 타입, 브랜치 필터, 이벤트, 수정일, 활성 여부 컬럼으로 표시합니다. 행 클릭 시 해당 웹훅의 상세/편집 화면으로 이동합니다.",
    },
    {
      id: 5,
      label: "웹훅 상태 아이콘",
      description:
        "마지막 전송 결과를 아이콘으로 표시합니다. 초록색 체크는 성공, 빨간색 X는 실패, 회색 대시는 아직 실행되지 않은 상태를 의미합니다.",
    },
    {
      id: 6,
      label: "웹훅 액션",
      description:
        "각 웹훅의 편집(연필 아이콘) 및 삭제(휴지통 아이콘) 작업을 수행합니다. 삭제 시 확인 모달이 표시됩니다.",
    },
    {
      id: 7,
      label: "안내 배너",
      description:
        "웹훅의 동작 원리를 설명하는 안내 문구를 표시합니다.",
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

// ─── Webhook Data ───────────────────────────────────────────────────────────

interface Hook {
  id: number;
  type: string;
  active: boolean;
  config: {
    url: string;
    content_type: string;
  };
  events: string[];
  branch_filter: string;
  authorization_header: string;
  created_at: string;
  updated_at: string;
  lastStatus: "success" | "failure" | "none";
}

const webhooks: Hook[] = [
  {
    id: 1,
    type: "gitea",
    active: true,
    config: {
      url: "http://el-sample-petmaven-boot-dev-build-el.sample-cicd.svc.cluster.local:8080",
      content_type: "json",
    },
    events: ["push", "create", "delete"],
    branch_filter: "dev",
    authorization_header: "",
    created_at: "2026-01-10T09:30:00Z",
    updated_at: "2026-03-11T14:22:00Z",
    lastStatus: "success",
  },
  {
    id: 2,
    type: "gitea",
    active: true,
    config: {
      url: "http://el-app1-backend-stg-build-el.sample-cicd.svc.cluster.local:8080",
      content_type: "json",
    },
    events: ["push"],
    branch_filter: "release/*",
    authorization_header: "",
    created_at: "2026-01-15T11:00:00Z",
    updated_at: "2026-03-09T08:45:00Z",
    lastStatus: "success",
  },
  {
    id: 3,
    type: "gitea",
    active: true,
    config: {
      url: "http://sonarqube.cone-chain.com/api/webhooks/incoming",
      content_type: "json",
    },
    events: ["push", "pull_request"],
    branch_filter: "*",
    authorization_header: "Bearer sq_token_abc123",
    created_at: "2026-02-05T16:20:00Z",
    updated_at: "2026-03-07T10:15:00Z",
    lastStatus: "failure",
  },
  {
    id: 4,
    type: "slack",
    active: false,
    config: {
      url: "http://slack-webhook-relay.infra.svc.cluster.local:3000/gitea",
      content_type: "json",
    },
    events: ["push", "pull_request", "issues"],
    branch_filter: "main",
    authorization_header: "",
    created_at: "2026-02-20T13:10:00Z",
    updated_at: "2026-02-26T09:00:00Z",
    lastStatus: "none",
  },
];

const eventLabels: Record<string, string> = {
  push: "푸시",
  create: "브랜치 생성",
  delete: "브랜치 삭제",
  pull_request: "Pull Request",
  issues: "이슈",
  release: "릴리스",
  tag_create: "태그 생성",
  tag_delete: "태그 삭제",
};

function formatRelativeDate(dateStr: string) {
  const now = new Date("2026-03-12T00:00:00Z");
  const d = new Date(dateStr);
  const diffMs = now.getTime() - d.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days < 1) return "오늘";
  if (days < 7) return `${days}일 전`;
  if (days < 30) return `${Math.floor(days / 7)}주 전`;
  if (days < 365) return `${Math.floor(days / 30)}개월 전`;
  return `${Math.floor(days / 365)}년 전`;
}

// ─── Slide ──────────────────────────────────────────────────────────────────

export default function Slide10SourceRepositoryDetailWebhooks() {
  return (
    <CcpDashboardLayout
      breadcrumbs={[
        { label: "홈" },
        { label: "GitOps" },
        { label: "소스 저장소", isBold: true },
      ]}
      title="app1-backend"
      sideMenuItems={sideMenuItems}
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
          activeId="settings"
          className="mb-0"
        />
        </div>
      </ContentSection>

      <ContentSection>
        {/* 설정 하위 메뉴 */}
        <div data-annotation-id="2" className="flex gap-2 mb-4">
          {["고급", "웹훅"].map((item) => (
            <button
              key={item}
              type="button"
              className={`px-3 py-1.5 text-[13px] rounded border ${
                item === "웹훅"
                  ? "bg-[#0077ff] text-white border-[#0077ff] font-semibold"
                  : "bg-white text-[#555] border-[#ddd] hover:bg-[#f6f8fa]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </ContentSection>

      <ContentSection>
        {/* Webhook Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-[14px] font-semibold text-[#333]">
              웹훅
            </h3>
            <Badge variant="neutral" className="!text-[11px] !px-1.5">
              {webhooks.length}
            </Badge>
          </div>
          <Button data-annotation-id="3" variant="primary" size="sm">
            웹훅 추가
          </Button>
        </div>

        {/* Webhook List */}
        <div data-annotation-id="4" className="bg-white border border-[#e0e0e0] rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#e0e0e0] bg-[#f6f8fa] text-[12px] font-semibold text-[#555]">
                <th className="px-4 py-2.5 font-semibold" style={{ width: "40px" }}>상태</th>
                <th className="px-4 py-2.5 font-semibold">대상 URL</th>
                <th className="px-4 py-2.5 font-semibold" style={{ width: "70px" }}>타입</th>
                <th className="px-4 py-2.5 font-semibold" style={{ width: "100px" }}>Branch filter</th>
                <th className="px-4 py-2.5 font-semibold" style={{ width: "180px" }}>이벤트</th>
                <th className="px-4 py-2.5 font-semibold" style={{ width: "80px" }}>수정일</th>
                <th className="px-4 py-2.5 font-semibold text-right" style={{ width: "60px" }}>활성</th>
                <th className="px-4 py-2.5 font-semibold text-right" style={{ width: "70px" }} />
              </tr>
            </thead>
            <tbody>
              {webhooks.map((wh, i) => (
                <tr
                  key={wh.id}
                  className={`${
                    i < webhooks.length - 1 ? "border-b border-[#f0f0f0]" : ""
                  } hover:bg-[#f9fafb] cursor-pointer`}
                >
                  <td data-annotation-id="5" className="px-4 py-3">
                    {wh.lastStatus === "success" ? (
                      <div className="w-5 h-5 rounded-full bg-[#2cbe4e] flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    ) : wh.lastStatus === "failure" ? (
                      <div className="w-5 h-5 rounded-full bg-[#cb2431] flex items-center justify-center">
                        <X className="w-3 h-3 text-white" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-[#ddd] flex items-center justify-center">
                        <span className="text-[10px] text-[#888]">—</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[12px] font-mono text-[#0077ff] break-all leading-snug block max-w-[420px] truncate">
                      {wh.config.url}
                    </span>
                    <span className="text-[11px] text-[#999] mt-0.5 block">
                      POST · {wh.config.content_type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="neutral" className="!text-[11px] !px-2">
                      {wh.type}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="neutral" className="!text-[11px] !px-2 font-mono">
                      {wh.branch_filter}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 flex-wrap">
                      {wh.events.map((event) => (
                        <Badge key={event} variant="neutral" className="!text-[10px] !px-1.5">
                          {eventLabels[event] ?? event}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[12px] text-[#999]">{formatRelativeDate(wh.updated_at)}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {wh.active ? (
                      <Badge variant="green-solid" className="!text-[10px] !px-1.5 !py-0">활성</Badge>
                    ) : (
                      <Badge variant="neutral" className="!text-[10px] !px-1.5 !py-0">비활성</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div data-annotation-id="6" className="flex items-center justify-end gap-1">
                      <button type="button" className="p-1 text-[#555] hover:bg-[#e8e8e8] rounded" title="편집">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" className="p-1 text-[#cb2431] hover:bg-[#ffeef0] rounded" title="삭제">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Info banner */}
        <div data-annotation-id="7" className="mt-3 px-4 py-2.5 bg-[#f0f7ff] border border-[#d4e4f7] rounded">
          <span className="text-[12px] text-[#555]">
            이벤트에 대한 정보가 등록된 웹훅 URL로 전송됩니다.
          </span>
        </div>
      </ContentSection>
    </CcpDashboardLayout>
  );
}
