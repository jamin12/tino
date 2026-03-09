import {
  LayoutDashboard,
  Layers,
  AppWindow,
  GitBranch,
  Settings,
  GitCompare,
  RefreshCw,
  Pencil,
  Plus,
  Copy,
} from "lucide-react";
import {
  Badge,
  Button,
  CcpDashboardLayout,
  ContentSection,
  InfoRow,
  Tabs,

} from "../../_components";
import type { SideMenuItem } from "../../_components";
import type { SlideMeta } from "@entities/document";

export const slideMeta: SlideMeta = {
  screenId: "CCP-GIT-004",
  title: "리포지토리 상세 (기본정보)",
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

export default function Slide04RepositoryDetail() {
  return (
    <CcpDashboardLayout
      breadcrumbs={[
        { label: "GitOps" },
        { label: "Repositories" },
        { label: "app1-maven-pipeline", isBold: true },
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
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="md">
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            동기화
          </Button>
          <Button variant="secondary" size="md" className="!border-[#00b30e] !text-[#00b30e]">
            <Pencil className="w-3.5 h-3.5 mr-1.5" />
            수정
          </Button>
          <Button variant="primary" size="md">
            <Plus className="w-4 h-4 mr-1.5" />
            앱 생성
          </Button>
        </div>
      }
    >
      <ContentSection>
        <Tabs
          items={[
            { id: "basic", label: "기본정보" },
            { id: "files", label: "파일" },
            { id: "branches", label: "브랜치" },
            { id: "commits", label: "커밋 이력" },
            { id: "tags", label: "태그/릴리스" },
            { id: "gitops", label: "GitOps", dividerBefore: true },
          ]}
          activeId="basic"
          className="mb-0"
        />
      </ContentSection>

      <ContentSection card>
        <div className="p-1 space-y-1">
          <InfoRow label="리포지토리 연결" labelWidth="140px">
            <span className="text-[13px] font-medium text-[#333]">선택</span>
          </InfoRow>
          <InfoRow label="유형" labelWidth="140px">
            <span className="text-[13px] font-medium text-[#333]">git</span>
          </InfoRow>
          <InfoRow label="리포지토리" labelWidth="140px">
            <span className="text-[13px] font-medium text-[#0077ff]">
              https://gitea.cone-chain.com/app-cicd/app1-maven-pipeline.git
            </span>
            <button
              type="button"
              className="ml-2 px-2 py-1 text-[12px] text-[#555] border border-[#ddd] rounded hover:bg-[#f6f8fa] flex items-center gap-1"
            >
              <Copy className="w-3 h-3" />
              클립보드
            </button>
          </InfoRow>
          <InfoRow label="Topic" labelWidth="140px">
            <Badge variant="info">Pipeline</Badge>
          </InfoRow>
          <InfoRow label="프로젝트" labelWidth="140px">
            <span className="text-[13px] font-medium text-[#333]">
              app-cicd
            </span>
          </InfoRow>
          <InfoRow label="이름" labelWidth="140px">
            <span className="text-[13px] font-bold text-[#111]">
              app1-maven-pipeline
            </span>
          </InfoRow>
          <InfoRow label="네임스페이스" labelWidth="140px">
            <span className="text-[13px] font-medium text-[#333]">
              app-cicd
            </span>
          </InfoRow>
          <InfoRow label="설명" labelWidth="140px">
            <span className="text-[13px] font-medium text-[#555]">
              app1-maven-pipeline 리포지토리
            </span>
          </InfoRow>
          <InfoRow label="기본 브랜치" labelWidth="140px">
            <Badge variant="neutral">main</Badge>
          </InfoRow>
          <InfoRow label="생성시간" labelWidth="140px">
            <span className="text-[13px] font-medium text-[#555]">
              2024-01-15 14:30:22
            </span>
          </InfoRow>
          <InfoRow label="라이선스" labelWidth="140px">
            <span className="text-[13px] font-medium text-[#555]">GPL</span>
          </InfoRow>
          <InfoRow label="템플릿" labelWidth="140px">
            <Badge variant="info">Pipeline</Badge>
          </InfoRow>
        </div>
      </ContentSection>
    </CcpDashboardLayout>
  );
}
