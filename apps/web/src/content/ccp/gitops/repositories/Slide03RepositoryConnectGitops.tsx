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
  title: "리포지토리 연결 (GitOps 연결)",
  section: "GitOps Repositories",
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

// ─── Slide ──────────────────────────────────────────────────────────────────

export default function Slide03RepositoryConnectGitops() {
  return (
    <CcpDashboardLayout
      breadcrumbs={[
        { label: "GitOps" },
        { label: "Repositories" },
        { label: "리포지토리 연결", isBold: true },
      ]}
      title="리포지토리 연결"
      sideMenuItems={sideMenuItems}
    >
      <div className="flex gap-0 mx-8">
        {/* Left Form Area */}
        <div className="flex-1 bg-white rounded-lg border border-[#e5e5e5] p-6">
          <Tabs
            items={[
              { id: "basic", label: "기본정보" },
              { id: "gitops", label: "GitOps", dividerBefore: true },
            ]}
            activeId="gitops"
            className="mb-8"
          />

          <div className="space-y-5">
            {/* 연결 프로토콜 */}
            <InfoRow label="연결 프로토콜" labelWidth="120px">
              <Select
                label=""
                options={[
                  { value: "https", label: "HTTPS" },
                  { value: "ssh", label: "SSH" },
                ]}
              />
            </InfoRow>

            {/* TLS 설정 */}
            <div>
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
            <div>
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
                    Enable LFS support (Git only)
                  </span>
                  <Toggle checked={false} />
                </div>
              </div>
            </div>

            {/* 프록시 */}
            <div>
              <label className="block text-[13px] font-semibold text-[#333] mb-2">
                프록시
              </label>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#333]">Enable OCI</span>
                <Toggle checked={false} />
              </div>
            </div>

          </div>

          {/* Bottom buttons */}
          <div className="flex justify-end gap-2 mt-8 pt-4 border-t border-[#e5e5e5]">
            <Button variant="ghost" size="md">
              취소
            </Button>
            <Button variant="ghost" size="md">
              임시저장
            </Button>
            <Button variant="secondary" size="md">
              검증
            </Button>
            <Button variant="primary" size="md">
              생성
            </Button>
          </div>
        </div>

      </div>
    </CcpDashboardLayout>
  );
}
