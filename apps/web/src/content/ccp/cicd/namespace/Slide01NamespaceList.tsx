import {
  Plus,
  MoreHorizontal,
  Eye,
  FolderPlus,
  Trash2,
} from "lucide-react";
import {
  Badge,
  Button,
  CcpDashboardLayout,
  ContentSection,
  ActionMenu,
  DataTable,
  FilterBar,
  Overlay,
  Pagination,
  SearchInput,
  Select,
  TextCell,
  SidebarDashboardIcon,
  SidebarNamespaceIcon,
  SidebarApplicationIcon,
  SidebarCicdIcon,
  SidebarSettingsIcon,
  SidebarGitopsIcon,
} from "../../_components";
import type {
  SideMenuItem,
  DataTableColumn,
  ActionMenuEntry,
} from "../../_components";
import type { SlideMeta } from "@entities/document";

export const slideMeta: SlideMeta = {
  screenId: "CCP-NS-001",
  title: "Namespace 목록",
  section: "CI/CD 네임스페이스",
  links: [
    { targetScreenId: "CCP-NS-002", type: "navigate", label: "생성 버튼 → NS 생성" },
    { targetScreenId: "CCP-NS-004", type: "navigate", label: "행 클릭 → NS 상세" },
    { targetScreenId: "CCP-NS-007", type: "modal", label: "삭제 → 삭제 모달" },
  ],
  annotations: [
    { id: 1, label: "NS 생성", description: "새 네임스페이스를 생성합니다. Gitea API를 통해 두 개의 Git 레포에 자동으로 리소스가 생성됩니다. ① k8s-cicd-init: sample-cicd/ 폴더를 복제하여 {ns}-cicd/ 생성 (내부 파일의 'sample' → {ns} 치환), 루트 kustomization.yaml에 참조 추가, clusterrolebinding.yaml에 ServiceAccount 권한 추가. ② k8s-app-init: 선택한 환경별로 overlays/{env}/sample-{env}/ 복제 → overlays/{env}/{ns}-{env}/ 생성, 해당 환경의 kustomization.yaml에 참조 추가. 생성되는 파일 목록은 sample 템플릿의 내용에 따라 달라집니다." },
    { id: 2, label: "NS 목록 테이블", description: "생성된 네임스페이스 목록입니다. 배포 환경 컬럼은 각 NS에 연결된 환경을 색상별 뱃지(dev=파랑, stg=노랑, prd=초록)로 표시합니다. 행 클릭 시 상세 화면으로 이동합니다." },
    { id: 3, label: "ActionMenu", description: "상세보기(NS 상세 화면 이동), 환경 추가(기존 NS에 배포 환경 추가), 삭제(환경별/전체 삭제 모달) 메뉴를 제공합니다." },
  ],
};

// ─── Side Menu Data ─────────────────────────────────────────────────────────

const sideMenuItems: SideMenuItem[] = [
  {
    id: "dashboard",
    label: "대시보드",
    icon: <SidebarDashboardIcon className="w-5 h-5" />,
  },
  {
    id: "namespace",
    label: "네임스페이스",
    icon: <SidebarNamespaceIcon className="w-5 h-5" />,
    expandIcon: "plus",
  },
  {
    id: "application",
    label: "애플리케이션",
    icon: <SidebarApplicationIcon className="w-5 h-5" />,
    expandIcon: "plus",
  },
  {
    id: "cicd",
    label: "CI/CD",
    icon: <SidebarCicdIcon className="w-5 h-5" />,
    active: true,
    expanded: true,
    expandIcon: "minus",
    sections: [
      { label: "", items: [{ label: "네임스페이스", active: true, bold: true }] },
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
          { label: "파이프라인 실행" },
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
    id: "gitops",
    label: "GitOps",
    icon: <SidebarGitopsIcon className="w-5 h-5" />,
    expandIcon: "plus",
  },
  {
    id: "settings",
    label: "설정/권한",
    icon: <SidebarSettingsIcon className="w-5 h-5" />,
    expandIcon: "plus",
  },
];

// ─── Table Data ─────────────────────────────────────────────────────────────

interface NamespaceRow {
  id: string;
  name: string;
  environments: { name: string; variant: string }[];
  createdAt: string;
}

const tableData: NamespaceRow[] = [
  {
    id: "1",
    name: "sample",
    environments: [
      { name: "dev", variant: "blue-label" },
      { name: "stg", variant: "yellow-label" },
      { name: "prd", variant: "green-label" },
    ],
    createdAt: "30d",
  },
  {
    id: "2",
    name: "payment",
    environments: [
      { name: "dev", variant: "blue-label" },
      { name: "stg", variant: "yellow-label" },
    ],
    createdAt: "25d",
  },
  {
    id: "3",
    name: "auth",
    environments: [{ name: "dev", variant: "blue-label" }],
    createdAt: "20d",
  },
  {
    id: "4",
    name: "monitoring",
    environments: [
      { name: "dev", variant: "blue-label" },
      { name: "prd", variant: "green-label" },
    ],
    createdAt: "15d",
  },
  {
    id: "5",
    name: "logging",
    environments: [{ name: "prd", variant: "green-label" }],
    createdAt: "10d",
  },
];

const columns: DataTableColumn<NamespaceRow>[] = [
  {
    id: "name",
    header: "이름",
    width: "200px",
    render: (row) => (
      <TextCell bold color="#111111" linked className="px-4">
        {row.name}
      </TextCell>
    ),
  },
  {
    id: "environments",
    header: "배포 환경",
    width: "260px",
    render: (row) => (
      <>
        {row.environments.map((env) => (
          <Badge key={env.name} variant={env.variant as any} size="sm">
            {env.name}
          </Badge>
        ))}
      </>
    ),
  },
  {
    id: "createdAt",
    header: "생성일",
    width: "100px",
    align: "center",
    render: (row) => <TextCell color="#555555">{row.createdAt}</TextCell>,
  },
  {
    id: "actions",
    header: "",
    width: "60px",
    fixed: true,
    align: "center",
    render: () => (
      <Button variant="icon" size="icon" aria-label="더보기">
        <MoreHorizontal className="w-4 h-4 text-[#333333]" />
      </Button>
    ),
  },
];

const iconClass = "w-[14px] h-[14px] text-[#555759]";
const actionMenuItems: ActionMenuEntry[] = [
  { key: "detail", label: "상세보기", icon: <Eye className={iconClass} /> },
  { key: "env-add", label: "환경 추가", icon: <FolderPlus className={iconClass} /> },
  { type: "divider" },
  {
    key: "delete",
    label: "삭제",
    icon: <Trash2 className="w-[14px] h-[14px] text-[#da1e28]" />,
  },
];

// ─── Slide ──────────────────────────────────────────────────────────────────

export default function Slide01NamespaceList() {
  return (
    <CcpDashboardLayout
      breadcrumbs={[
        { label: "CI/CD" },
        { label: "네임스페이스", isBold: true },
      ]}
      title="Namespaces"
      sideMenuItems={sideMenuItems}
    >
      <ContentSection relative>
        <FilterBar className="gap-2">
          <Select
            label="배포 환경"
            options={[
              { value: "", label: "전체" },
              { value: "dev", label: "dev" },
              { value: "stg", label: "stg" },
              { value: "prd", label: "prd" },
            ]}
          />
          <SearchInput placeholder="이름 검색" className="mr-1" />
          <Button variant="primary" size="md" data-annotation-id="1">
            <Plus className="w-4 h-4 mr-1.5" />
            생성
          </Button>
        </FilterBar>

        <DataTable
          columns={columns}
          data={tableData}
          selectedIds={new Set()}
          onSelectionChange={() => {}}
          data-annotation-id="2"
        />

        <Overlay top={133} right={0} data-annotation-id="3">
          <ActionMenu
            items={actionMenuItems}
            highlightedKeys={["detail"]}
            static
            className="w-[160px]"
          />
        </Overlay>

        <Pagination
          currentPage={1}
          totalPages={1}
          visiblePages={[1]}
          className="mt-5 pb-10"
        />
      </ContentSection>
    </CcpDashboardLayout>
  );
}
