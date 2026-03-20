import {
  Plus,
  MoreHorizontal,
  Eye,
  Trash2,
  Info,
  FolderPlus,
} from "lucide-react";
import {
  Badge,
  Button,
  CcpDashboardLayout,
  ContentSection,
  ActionMenu,
  DataTable,
  FilterBar,
  InfoRow,
  ListDetailLayout,
  Overlay,
  Pagination,
  ResourceDetailPanel,
  SearchInput,
  Select,
  Tabs,
  TextCell,
  createSideMenuItems,
} from "../../_components";
import type {
  DataTableColumn,
  ActionMenuEntry,
  IconNavItem,
} from "../../_components";
import type { SlideMeta } from "@entities/document";

export const slideMeta: SlideMeta = {
  screenId: "CCP-NS-004",
  title: "Namespace 상세",
  section: "네임스페이스",
  links: [
    { targetScreenId: "CCP-NS-006", type: "navigate", label: "환경 추가" },
  ],
  annotations: [
    { id: 1, label: "기본 정보", description: "NS 이름, 상태, CICD 레포 경로, 배포 환경, Labels 등 기본 정보를 표시합니다. CICD 레포 경로는 k8s-cicd-init 레포에서 이 NS의 파이프라인 리소스가 위치한 폴더입니다." },
    { id: 2, label: "환경 추가 버튼", description: "기존 NS에 새 배포 환경을 추가합니다. 환경 추가 화면(CCP-NS-006)으로 이동하여 기존 환경 선택 또는 새 환경을 생성할 수 있습니다." },
    { id: 3, label: "환경 목록 테이블", description: "이 NS에 연결된 배포 환경 목록입니다. 환경명, 동기화 상태, k8s-app-init 레포 경로를 표시합니다." },
  ],
};

// ─── Side Menu Data ─────────────────────────────────────────────────────────


// ─── Namespace List Table Data ──────────────────────────────────────────────

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

// ─── Detail Panel ───────────────────────────────────────────────────────────

const detailIconNavItems: IconNavItem[] = [
  { id: "detail", icon: <Info className="w-5 h-5" />, label: "상세" },
];

// ─── Detail Panel: Environment Table ────────────────────────────────────────

interface EnvRow {
  id: string;
  envName: string;
  envVariant: string;
  status: string;
  statusVariant: string;
  appInitPath: string;
}

const envTableData: EnvRow[] = [
  {
    id: "1",
    envName: "dev",
    envVariant: "blue-label",
    status: "Active",
    statusVariant: "success",
    appInitPath: "overlays/dev/sample-dev/",
  },
  {
    id: "2",
    envName: "stg",
    envVariant: "yellow-label",
    status: "Active",
    statusVariant: "success",
    appInitPath: "overlays/stg/sample-stg/",
  },
  {
    id: "3",
    envName: "prd",
    envVariant: "green-label",
    status: "Active",
    statusVariant: "success",
    appInitPath: "overlays/prd/sample-prd/",
  },
];

const envColumns: DataTableColumn<EnvRow>[] = [
  {
    id: "envName",
    header: "환경",
    width: "100px",
    render: (row) => (
      <Badge variant={row.envVariant as any} size="sm">
        {row.envName}
      </Badge>
    ),
  },
  {
    id: "status",
    header: "상태",
    width: "90px",
    align: "center",
    render: (row) => (
      <Badge variant={row.statusVariant as any}>{row.status}</Badge>
    ),
  },
  {
    id: "appInitPath",
    header: "경로",
    width: "200px",
    render: (row) => (
      <TextCell color="#6d7073" className="text-[12px]">
        {row.appInitPath}
      </TextCell>
    ),
  },
];

// ─── Slide ──────────────────────────────────────────────────────────────────

export default function SlideNamespaceDetail() {
  return (
    <CcpDashboardLayout
      gnbPreset="namespace"
      breadcrumbs={[
        { label: "네임스페이스" },
        { label: "워크스페이스", isBold: true },
      ]}
      title="Namespaces"
      sideMenuItems={createSideMenuItems({ activeId: "namespace" })}
    >
      <ListDetailLayout
        detail={
          <ResourceDetailPanel
            title="sample"
            statusColor="#00b30e"
            iconNavItems={detailIconNavItems}
            activeIconNavId="detail"
          >
            {/* ── 기본 정보 ── */}
            <div className="px-5 pt-4 pb-2 flex items-center gap-1.5">
              <TextCell bold color="#111" className="text-[15px]">
                기본 정보
              </TextCell>
              <Info className="w-3.5 h-3.5 text-[#999]" />
            </div>

            <div className="px-4 pt-2 pb-4" data-annotation-id="1">
              <div className="bg-white rounded-sm border border-[#f0f0f0] shadow-[0px_0px_8px_#00000014] px-5 py-4 flex flex-col gap-3">
                <InfoRow label="이름">
                  <TextCell color="#333" className="text-[13px]">sample</TextCell>
                </InfoRow>
                <InfoRow label="상태">
                  <Badge variant="success">Active</Badge>
                </InfoRow>
                <InfoRow label="CICD 레포">
                  <TextCell color="#6d7073" className="text-[13px]">
                    k8s-cicd-init/sample-cicd/
                  </TextCell>
                </InfoRow>
                <InfoRow label="Labels">
                  <Badge variant="neutral" size="sm">
                    cone-chain-portal.managed-by: CI_CD
                  </Badge>
                </InfoRow>
                <InfoRow label="생성일">
                  <TextCell color="#6d7073" className="text-[13px]">30일 전</TextCell>
                </InfoRow>
              </div>
            </div>

            {/* ── 배포 환경 ── */}
            <div className="px-5 pt-2 pb-2 flex items-center justify-between border-t border-[#f0f0f0]">
              <div className="flex items-center gap-1.5">
                <TextCell bold color="#111" className="text-[15px]">
                  배포 환경
                </TextCell>
                <Badge variant="neutral" size="sm">3</Badge>
              </div>
              <Button variant="primary" size="sm" data-annotation-id="2">
                <FolderPlus className="w-3.5 h-3.5 mr-1" />
                환경 추가
              </Button>
            </div>

            <div className="flex-1 px-4 pt-2 pb-4" data-annotation-id="3">
              <DataTable
                columns={envColumns}
                data={envTableData}
              />
            </div>
          </ResourceDetailPanel>
        }
        detailWidth="480px"
      >
        {/* Main List Content */}
        <ContentSection relative>
          <FilterBar className="gap-2">
            <Tabs
              items={[
                { id: "list", label: "리스트 보기" },
                { id: "grouped", label: "묶음 보기" },
              ]}
              activeId="grouped"
              variant="pill"
            />
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
            <Button variant="primary" size="md">
              <Plus className="w-4 h-4 mr-1.5" />
              생성
            </Button>
          </FilterBar>

          <DataTable
            columns={columns}
            data={tableData}
            selectedIds={new Set()}
            onSelectionChange={() => {}}
          />

          <Overlay top={133} right={0}>
            <ActionMenu
              items={actionMenuItems}
              highlightedKeys={["summary"]}
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
      </ListDetailLayout>
    </CcpDashboardLayout>
  );
}
