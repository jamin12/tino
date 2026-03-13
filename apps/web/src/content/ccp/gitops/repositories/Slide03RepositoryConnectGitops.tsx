import {
  LayoutDashboard,
  Layers,
  AppWindow,
  GitBranch,
  Settings,
  GitCompare,
} from "lucide-react";
import {
  Button,
  CcpDashboardLayout,
  InfoRow,
  Select,
  Tabs,
  Toggle,
} from "../../_components";
import type { SideMenuItem } from "../../_components";
import type { SlideMeta } from "@entities/document";

export const slideMeta: SlideMeta = {
  screenId: "CCP-GIT-003",
  title: "배포 저장소 생성 (GitOps 연결)",
  section: "GitOps 배포 저장소",
  annotations: [
    {
      id: 1,
      label: "기본정보/GitOps 탭",
      description:
        "저장소 생성 단계를 전환합니다. 현재 'GitOps' 탭이 활성화되어 있으며, '기본정보' 탭(CCP-GIT-002)으로 돌아갈 수 있습니다.",
    },
    {
      id: 2,
      label: "연결 프로토콜",
      description:
        "GitOps(ArgoCD) 연결에 사용할 프로토콜(HTTPS 또는 SSH)을 선택합니다. 프로토콜에 따라 인증 방식이 달라집니다.",
    },
    {
      id: 3,
      label: "TLS 설정",
      description:
        "HTTPS 연결 시 TLS 클라이언트 인증서와 키를 입력합니다. 자체 서명 인증서를 사용하는 환경에서 필요합니다.",
    },
    {
      id: 4,
      label: "고급 설정",
      description:
        "서버 검증 건너뛰기, HTTP basic auth 강제, LFS 지원 등 세부 연결 옵션을 토글로 설정합니다.",
    },
    {
      id: 5,
      label: "취소 버튼",
      description:
        "저장소 생성을 취소하고 목록(CCP-GIT-001) 화면으로 돌아갑니다.",
    },
    {
      id: 6,
      label: "검증 버튼",
      description:
        "입력된 GitOps(ArgoCD) 연결 정보로 저장소 접근 가능 여부를 사전 테스트합니다. 입력된 프로토콜·인증 정보를 사용해 저장소 URL로 curl 요청을 보내 응답 상태를 확인합니다.\n```\ncurl -s -o /dev/null -w \"%{http_code}\" https://gitea.example.com/org/repo.git\n```",
    },
    {
      id: 7,
      label: "생성 버튼",
      description:
        "기본정보와 GitOps 설정을 포함하여 배포 저장소를 최종 생성합니다. 생성 후 목록(CCP-GIT-001) 화면으로 이동합니다.",
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

// ─── Slide ──────────────────────────────────────────────────────────────────

export default function Slide03RepositoryConnectGitops() {
  return (
    <CcpDashboardLayout
      breadcrumbs={[
        { label: "홈" },
        { label: "GitOps" },
        { label: "배포 저장소", isBold: true },
      ]}
      title="배포 저장소 생성"
      sideMenuItems={sideMenuItems}
    >
      <div className="flex gap-0 mx-8 mt-4">
        {/* Left Form Area */}
        <div className="flex-1 bg-white rounded-lg border border-[#e5e5e5] p-6">
          <div data-annotation-id="1">
            <Tabs
              items={[
                { id: "basic", label: "기본정보" },
                { id: "gitops", label: "GitOps", dividerBefore: true },
              ]}
              activeId="gitops"
              className="mb-8"
            />
          </div>

          <div className="space-y-5">
            {/* 연결 프로토콜 */}
            <div data-annotation-id="2">
            <InfoRow label="연결 프로토콜" labelWidth="120px">
              <Select
                label=""
                options={[
                  { value: "https", label: "HTTPS" },
                  { value: "ssh", label: "SSH" },
                ]}
              />
            </InfoRow>
            </div>

            {/* TLS 설정 */}
            <div data-annotation-id="3">
              <label className="block text-[13px] font-semibold text-[#333] mb-2">
                TLS 설정
              </label>
              <div className="space-y-3">
                <div>
                  <span className="block text-[12px] text-[#555] mb-1">
                    TLS client certificate
                  </span>
                  <textarea
                    className="w-full h-[60px] border border-[#ddd] rounded px-3 py-2 text-[13px] text-[#333] resize-none bg-[#fafafa] font-mono"
                    placeholder="-----BEGIN CERTIFICATE-----"
                    readOnly
                  />
                </div>
                <div>
                  <span className="block text-[12px] text-[#555] mb-1">
                    TLS client certificate key
                  </span>
                  <textarea
                    className="w-full h-[60px] border border-[#ddd] rounded px-3 py-2 text-[13px] text-[#333] resize-none bg-[#fafafa] font-mono"
                    placeholder="-----BEGIN RSA PRIVATE KEY-----"
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* 고급 설정 */}
            <div data-annotation-id="4">
              <label className="block text-[13px] font-semibold text-[#333] mb-2">
                고급 설정
              </label>
              <div className="space-y-2">
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

        </div>

      </div>

      {/* Bottom fixed action bar */}
      <div className="sticky bottom-0 left-0 right-0 px-8 py-3 flex justify-end gap-2 mt-4">
        <Button data-annotation-id="5" variant="ghost" size="md">
          취소
        </Button>
        <Button data-annotation-id="6" variant="primary" size="md">
          검증
        </Button>
        <Button data-annotation-id="7" variant="primary" size="md">
          생성
        </Button>
      </div>
    </CcpDashboardLayout>
  );
}
