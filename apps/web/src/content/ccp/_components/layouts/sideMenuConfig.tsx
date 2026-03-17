import {
  SidebarDashboardIcon,
  SidebarNamespaceIcon,
  SidebarApplicationIcon,
  SidebarCicdIcon,
  SidebarGitopsIcon,
  SidebarConnectionIcon,
  SidebarServiceMeshIcon,
  SidebarTenantIcon,
  SidebarSettingsIcon,
} from "../icons";
import type { SideMenuItem, MenuSection } from "./SideMenu";

// ─── 각 메뉴별 하위 섹션 정의 ─────────────────────────────────────────────────

const cicdSections: MenuSection[] = [
  { label: "", items: [{ label: "네임스페이스" }] },
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
      { label: "파이프라인 구성" },
      { label: "파이프라인 실행" },
      { label: "파이프라인 큐" },
      { label: "파이프라인 통계" },
      { label: "트리거 구성" },
      { label: "트리거 실행" },
    ],
  },
  {
    label: "카탈로그",
    items: [{ label: "Service Presets" }],
  },
];

const gitopsSections: MenuSection[] = [
  {
    label: "",
    items: [
      { label: "배포 애플리케이션" },
      { label: "배포 저장소" },
      { label: "소스 저장소" },
      { label: "저장소 그룹" },
    ],
  },
];

const tenantSections: MenuSection[] = [
  {
    label: "",
    items: [
      { label: "조직 관리" },
      { label: "프로젝트 관리" },
      { label: "멤버 관리" },
    ],
  },
];

const settingsSections: MenuSection[] = [
  {
    label: "",
    items: [
      { label: "시스템 설정" },
      { label: "엔드포인트 설정" },
    ],
  },
];

// ─── 메뉴 아이템 기본 정의 ────────────────────────────────────────────────────

interface MenuDef {
  id: string;
  label: string;
  icon: React.ReactNode;
  sections?: MenuSection[];
}

const menuDefs: MenuDef[] = [
  { id: "dashboard", label: "대시보드", icon: <SidebarDashboardIcon className="w-5 h-5" /> },
  { id: "namespace", label: "네임스페이스", icon: <SidebarNamespaceIcon className="w-5 h-5" /> },
  { id: "application", label: "애플리케이션", icon: <SidebarApplicationIcon className="w-5 h-5" /> },
  { id: "cicd", label: "CI/CD", icon: <SidebarCicdIcon className="w-5 h-5" />, sections: cicdSections },
  { id: "gitops", label: "GitOps", icon: <SidebarGitopsIcon className="w-5 h-5" />, sections: gitopsSections },
  { id: "connection", label: "연결", icon: <SidebarConnectionIcon className="w-5 h-5" /> },
  { id: "service-mesh", label: "서비스 메시", icon: <SidebarServiceMeshIcon className="w-5 h-5" /> },
  { id: "tenant", label: "테넌트", icon: <SidebarTenantIcon className="w-5 h-5" />, sections: tenantSections },
  { id: "settings", label: "설정", icon: <SidebarSettingsIcon className="w-5 h-5" />, sections: settingsSections },
];

// ─── createSideMenuItems ──────────────────────────────────────────────────────

export interface CreateSideMenuOptions {
  /** 활성화할 메뉴 id */
  activeId: string;
  /** 활성화할 하위 항목 label (bold 처리됨) */
  activeLabel?: string;
}

function deepCloneSections(sections: MenuSection[]): MenuSection[] {
  return sections.map((section) => ({
    ...section,
    items: section.items?.map((item) => ({ ...item })),
    children: section.children?.map((child) => ({
      ...child,
      items: child.items?.map((item) => ({ ...item })),
    })),
  }));
}

export function createSideMenuItems({ activeId, activeLabel }: CreateSideMenuOptions): SideMenuItem[] {
  return menuDefs.map((def) => {
    const isActive = def.id === activeId;

    if (!isActive) {
      return {
        id: def.id,
        label: def.label,
        icon: def.icon,
        expandIcon: "plus" as const,
      };
    }

    // 활성 메뉴
    const item: SideMenuItem = {
      id: def.id,
      label: def.label,
      icon: def.icon,
      active: true,
      expandIcon: def.sections ? "minus" as const : "minus" as const,
    };

    if (def.sections) {
      item.expanded = true;
      item.sections = deepCloneSections(def.sections);

      // 하위 항목 활성화
      if (activeLabel) {
        for (const section of item.sections) {
          if (section.items) {
            for (const sub of section.items) {
              if (sub.label === activeLabel) {
                sub.active = true;
                sub.bold = true;
              }
            }
          }
        }
      }
    }

    return item;
  });
}
