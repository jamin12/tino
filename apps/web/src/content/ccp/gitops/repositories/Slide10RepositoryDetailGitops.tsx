import {
  LayoutDashboard,
  Layers,
  AppWindow,
  GitBranch,
  Settings,
  GitCompare,
  MoreHorizontal,
  Pencil,
  Link2,
  Unlink,
  Trash2,
} from "lucide-react";
import {
  Badge,
  Button,
  CcpDashboardLayout,
  ContentSection,
  ContextMenu,
  InfoRow,
  Overlay,
  Tabs,
  Toggle,
  SidebarTenantIcon,
  SidebarConnectionIcon,
  SidebarServiceMeshIcon,
  createSideMenuItems,
} from "../../_components";
import type { ContextMenuEntry} from "../../_components";
import type { SlideMeta } from "@entities/document";

export const slideMeta: SlideMeta = {
  screenId: "CCP-GIT-010",
  title: "배포 저장소 상세 (GitOps)",
  section: "GitOps 배포 저장소",
  annotations: [
    {
      id: 1,
      label: "상세 탭 네비게이션",
      description:
        "기본정보(CCP-GIT-004), 파일(CCP-GIT-005), 브랜치/태그(CCP-GIT-007), 커밋 이력(CCP-GIT-008), GitOps 탭을 전환합니다. 현재 'GitOps' 탭이 활성화되어 있습니다.",
    },
    {
      id: 2,
      label: "연결 프로토콜",
      description:
        "GitOps 연결 프로토콜(HTTPS/SSH)을 드롭다운으로 선택할 수 있습니다.",
    },
    {
      id: 3,
      label: "TLS 설정",
      description:
        "TLS 클라이언트 인증서와 키를 표시합니다. 기본 상태에서는 읽기 전용(비활성화)이며, '편집' 버튼 클릭 시 입력 필드가 활성화되어 수정할 수 있습니다.",
    },
    {
      id: 4,
      label: "고급 설정",
      description:
        "Skip server verification, Force HTTP basic auth, Enable LFS support 등 현재 설정 상태를 토글로 표시합니다.",
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

// ─── Context Menu ───────────────────────────────────────────────────────────

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

// ─── Slide ──────────────────────────────────────────────────────────────────

export default function Slide10RepositoryDetailGitops() {
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
      sideMenuItems={createSideMenuItems({ activeId: "gitops", activeLabel: "배포 저장소" })}
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
            activeId="gitops"
            className="mb-0"
          />
        </div>
      </ContentSection>

      <ContentSection card>
        <div className="p-1 space-y-5">
          {/* 연결 프로토콜 */}
          <div data-annotation-id="2">
          <InfoRow label="연결 프로토콜" labelWidth="140px">
            <select className="h-[34px] border border-[#ddd] rounded px-3 text-[13px] text-[#333] bg-white min-w-[160px]">
              <option value="https">HTTPS</option>
              <option value="ssh">SSH</option>
            </select>
          </InfoRow>
          </div>

          {/* TLS 설정 */}
          <div data-annotation-id="3" className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-semibold text-[#333] w-[140px] shrink-0">
                TLS 설정
              </span>
              <button type="button" className="flex items-center gap-1 text-[12px] text-[#0077ff] hover:underline">
                <Pencil className="w-3 h-3" />
                편집
              </button>
              <Button variant="primary" size="sm" className="!h-7 !text-[12px]">
                저장
              </Button>
            </div>

            <div className="ml-[140px] space-y-3">
              <div>
                <span className="block text-[12px] text-[#555] mb-1">
                  TLS client certificate
                </span>
                <textarea
                  className="w-full min-h-[60px] border border-[#ccc] rounded px-3 py-2 text-[13px] text-[#333] bg-white font-mono resize-y"
                  defaultValue={"-----BEGIN CERTIFICATE-----\nMIIDXTCCAkWgAwIBAgIJAJC1HiIAZAiUMA...\n-----END CERTIFICATE-----"}
                  rows={3}
                />
              </div>
              <div>
                <span className="block text-[12px] text-[#555] mb-1">
                  TLS client certificate key
                </span>
                <textarea
                  className="w-full min-h-[60px] border border-[#ccc] rounded px-3 py-2 text-[13px] text-[#333] bg-white font-mono resize-y"
                  defaultValue={"-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEA0Z3VS5JJcds3xfn/yg...\n-----END RSA PRIVATE KEY-----"}
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* 고급 설정 */}
          <div data-annotation-id="4" className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-semibold text-[#333] w-[140px] shrink-0">
                고급 설정
              </span>
            </div>

            <div className="ml-[140px] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#333]">
                  Skip server verification
                </span>
                <Toggle checked={true} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#333]">
                  Force HTTP basic auth
                </span>
                <Toggle checked={true} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#333]">
                  Enable LFS support
                </span>
                <Toggle checked={false} />
              </div>
            </div>
          </div>
        </div>
      </ContentSection>
    </CcpDashboardLayout>
  );
}
