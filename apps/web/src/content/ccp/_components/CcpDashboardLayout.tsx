import type { ReactNode } from "react";
import {
  LayoutDashboard,
  Layers,
  AppWindow,
  GitBranch,
  Settings,
  GitCompare,
  Building2,
  FolderOpen,
  Braces,
} from "lucide-react";
import { SideMenu } from "./SideMenu";
import { GlobalNav } from "./GlobalNav";
import { PageHeader } from "./PageHeader";
import type { SideMenuItem } from "./SideMenu";
import type { NavSelector } from "./GlobalNav";

// ─── Default Data ────────────────────────────────────────────────────────────

const defaultLogo = (
  <div className="flex items-center gap-2">
    <div className="w-6 h-6 rounded bg-[#0077ff] flex items-center justify-center">
      <span className="text-white text-xs font-bold">C</span>
    </div>
    <span className="text-white font-bold text-base tracking-[-0.16px]">
      CONE-Chain
    </span>
  </div>
);

const defaultSideMenuItems: SideMenuItem[] = [
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
    active: true,
    expanded: true,
    expandIcon: "minus",
    sections: [
      { label: "네임스페이스", items: [] },
      {
        label: "저장소",
        items: [
          { label: "StorageClasses" },
          { label: "PV" },
          { label: "PVC" },
          { label: "ConfigMaps" },
          { label: "Secrets" },
        ],
      },
      {
        label: "파이프라인",
        items: [
          { label: "파이프라인 정의" },
          { label: "파이프라인 실행", active: true, bold: true },
          { label: "파이프라인 트리거" },
          { label: "파이프라인 통계" },
        ],
      },
      {
        label: "카탈로그",
        items: [{ label: "Service Presets" }],
      },
    ],
  },
  {
    id: "settings",
    label: "설정/권한",
    icon: <Settings className="w-5 h-5" />,
    expandIcon: "plus",
  },
  {
    id: "gitops",
    label: "GitOps",
    icon: <GitCompare className="w-5 h-5" />,
    expandIcon: "plus",
  },
];

const defaultNavSelectors: NavSelector[] = [
  {
    label: "조직",
    value: "NHN Cloud",
    icon: <Building2 className="w-4 h-4" />,
  },
  {
    label: "프로젝트",
    value: "Project-Dummy-1",
    icon: <FolderOpen className="w-4 h-4" />,
  },
  {
    label: "네임스페이스",
    value: "전체 네임스페이스",
    icon: <Braces className="w-4 h-4" />,
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

interface BreadcrumbItem {
  label: string;
  isBold?: boolean;
}

interface CcpDashboardLayoutProps {
  /** PageHeader breadcrumbs */
  breadcrumbs: BreadcrumbItem[];
  /** PageHeader title */
  title: string;
  /** Main content area */
  children: ReactNode;
  /** Override default SideMenu logo */
  logo?: ReactNode;
  /** Override default SideMenu items */
  sideMenuItems?: SideMenuItem[];
  /** Override default GlobalNav selectors */
  navSelectors?: NavSelector[];
  /** Override default user name */
  userName?: string;
  /** Override default action button */
  actionButton?: { label: string; onClick?: () => void };
  /** Additional actions in PageHeader */
  headerActions?: ReactNode;
}

export function CcpDashboardLayout({
  breadcrumbs,
  title,
  children,
  logo = defaultLogo,
  sideMenuItems = defaultSideMenuItems,
  navSelectors = defaultNavSelectors,
  userName = "홍길동",
  actionButton = { label: "Yaml 가져오기" },
  headerActions,
}: CcpDashboardLayoutProps) {
  return (
    <div className="relative w-[1920px] h-[1050px] flex bg-[#f6f8fa] overflow-hidden">
      <SideMenu logo={logo} items={sideMenuItems} className="h-[1050px]" />

      <div className="flex flex-col flex-1 min-w-0">
        <GlobalNav
          selectors={navSelectors}
          userName={userName}
          actionButton={actionButton}
        />

        <div className="flex-1 overflow-auto">
          <PageHeader
            breadcrumbs={breadcrumbs}
            title={title}
            actions={headerActions}
          />
          {children}
        </div>
      </div>
    </div>
  );
}

export type { CcpDashboardLayoutProps, BreadcrumbItem };
