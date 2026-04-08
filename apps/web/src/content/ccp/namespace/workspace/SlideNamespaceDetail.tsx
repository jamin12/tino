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

// ─── Sub-row Data ──────────────────────────────────────────────────────────

interface SubNamespace {
  name: string;
  cluster: string;
  syncStatus: "Synced" | "OutOfSync" | "Missing";
  syncVariant: string;
  repo: string;
}

const subRowsMap: Record<string, SubNamespace[]> = {
  sample: [
    { name: "sample-cicd", cluster: "dev-cluster", syncStatus: "Synced", syncVariant: "green-solid", repo: "k8s-cicd-init" },
    { name: "sample-dev", cluster: "dev-cluster", syncStatus: "Synced", syncVariant: "green-solid", repo: "k8s-app-init" },
    { name: "sample-stg", cluster: "dev-cluster", syncStatus: "OutOfSync", syncVariant: "warning", repo: "k8s-app-init" },
    { name: "sample-prd", cluster: "prd-cluster", syncStatus: "Synced", syncVariant: "green-solid", repo: "k8s-app-init" },
  ],
  payment: [
    { name: "payment-cicd", cluster: "dev-cluster", syncStatus: "Synced", syncVariant: "green-solid", repo: "k8s-cicd-init" },
    { name: "payment-dev", cluster: "dev-cluster", syncStatus: "Synced", syncVariant: "green-solid", repo: "k8s-app-init" },
    { name: "payment-stg", cluster: "dev-cluster", syncStatus: "Synced", syncVariant: "green-solid", repo: "k8s-app-init" },
  ],
  auth: [
    { name: "auth-cicd", cluster: "dev-cluster", syncStatus: "Synced", syncVariant: "green-solid", repo: "k8s-cicd-init" },
    { name: "auth-dev", cluster: "dev-cluster", syncStatus: "Missing", syncVariant: "red-solid", repo: "k8s-app-init" },
  ],
  monitoring: [
    { name: "monitoring-cicd", cluster: "dev-cluster", syncStatus: "Synced", syncVariant: "green-solid", repo: "k8s-cicd-init" },
    { name: "monitoring-dev", cluster: "dev-cluster", syncStatus: "Synced", syncVariant: "green-solid", repo: "k8s-app-init" },
    { name: "monitoring-prd", cluster: "prd-cluster", syncStatus: "Synced", syncVariant: "green-solid", repo: "k8s-app-init" },
  ],
  logging: [
    { name: "logging-cicd", cluster: "dev-cluster", syncStatus: "Synced", syncVariant: "green-solid", repo: "k8s-cicd-init" },
    { name: "logging-prd", cluster: "prd-cluster", syncStatus: "Synced", syncVariant: "green-solid", repo: "k8s-app-init" },
  ],
};

export const slideMeta: SlideMeta = {
  screenId: "CCP-NS-004",
  title: "Namespace 상세",
  section: "네임스페이스",
  subSection: "묶음 보기",
  links: [
    { targetScreenId: "CCP-NS-006", type: "navigate", label: "환경 추가" },
  ],
  annotations: [
    { id: 1, label: "기본 정보", description: "Namespace의 이름, 클러스터, 상태, GitOps 관리 여부, 생성 경과일을 표시합니다." },
    { id: 2, label: "Labels", description: "K8s Namespace에 부여된 Labels 목록입니다." },
    { id: 3, label: "Annotations", description: "K8s Namespace에 부여된 Annotations 목록입니다. 설정된 Annotation이 없으면 안내 메시지를 표시합니다." },
    { id: 4, label: "sub-row 상세보기", description: "펼침 행의 각 Namespace 항목마다 ⋮ 버튼이 제공되어 개별 Namespace의 상세 정보를 확인할 수 있습니다." },
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
      <TextCell bold color="#111111" className="px-4">
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

// ─── Sub-row Renderer ──────────────────────────────────────────────────────

function renderSubRows(row: NamespaceRow) {
  const subs = subRowsMap[row.name];
  if (!subs) return null;

  return (
    <div className="flex flex-col">
      <div className="flex items-center h-8 bg-[#f4f6f8] border-b border-[#e8e8e8] pl-12">
        <span className="w-[200px] text-xs font-bold text-[#666666] tracking-[-0.12px]">
          Namespace
        </span>
        <span className="w-[120px] text-xs font-bold text-[#666666] tracking-[-0.12px]">
          클러스터
        </span>
        <span className="w-[120px] text-xs font-bold text-[#666666] tracking-[-0.12px]">
          Sync 상태
        </span>
        <span className="w-[160px] text-xs font-bold text-[#666666] tracking-[-0.12px]">
          저장소
        </span>
      </div>
      {subs.map((sub, idx) => (
        <div
          key={sub.name}
          className={`flex items-center h-10 pl-12 ${idx < subs.length - 1 ? "border-b border-[#f0f0f0]" : ""}`}
        >
          <span className="w-[200px]">
            <TextCell linked color="#0066cc" className="text-sm">
              {sub.name}
            </TextCell>
          </span>
          <span className="w-[120px] text-xs text-[#888888] tracking-[-0.12px]">
            {sub.cluster}
          </span>
          <span className="w-[120px]">
            <Badge variant={sub.syncVariant as any} size="sm">
              {sub.syncStatus}
            </Badge>
          </span>
          <span className="w-[160px] text-xs text-[#888888] tracking-[-0.12px]">
            {sub.repo}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Slide ──────────────────────────────────────────────────────────────────

export default function SlideNamespaceDetail() {
  return (
    <CcpDashboardLayout
      gnbPreset="namespace"
      breadcrumbs={[
        { label: "네임스페이스", isBold: true },
      ]}
      title="Namespaces"
      sideMenuItems={createSideMenuItems({ activeId: "namespace" })}
    >
      <ListDetailLayout
        detail={
          <ResourceDetailPanel
            title="sample-dev"
            statusColor="#00b30e"
            iconNavItems={detailIconNavItems}
            activeIconNavId="detail"
          >
            {/* ── 기본 정보 ── */}
            <div className="px-5 pt-4 pb-2">
              <TextCell bold color="#111" className="text-[15px]">
                기본 정보
              </TextCell>
            </div>

            <div className="px-4 pt-2 pb-4" data-annotation-id="1">
              <div className="bg-white rounded-sm border border-[#f0f0f0] shadow-[0px_0px_8px_#00000014] px-5 py-4 flex flex-col gap-3">
                <InfoRow label="이름">
                  <TextCell color="#333" className="text-[13px]">default</TextCell>
                </InfoRow>
                <InfoRow label="클러스터">
                  <TextCell color="#333" className="text-[13px]">dev-cluster</TextCell>
                </InfoRow>
                <InfoRow label="상태">
                  <Badge variant="success">Active</Badge>
                </InfoRow>
                <InfoRow label="GitOps">
                  <Badge variant="neutral">Unmanaged</Badge>
                </InfoRow>
                <InfoRow label="Age">
                  <TextCell color="#333" className="text-[13px]">120d</TextCell>
                </InfoRow>
              </div>
            </div>

            {/* ── Labels ── */}
            <div className="px-5 pt-2 pb-2">
              <TextCell bold color="#111" className="text-[15px]">
                Labels
              </TextCell>
            </div>

            <div className="px-4 pt-2 pb-4" data-annotation-id="2">
              <div className="bg-white rounded-sm border border-[#f0f0f0] shadow-[0px_0px_8px_#00000014] px-5 py-4">
                <TextCell color="#333" className="text-[13px]">
                  kubernetes.io/metadata.name
                </TextCell>
              </div>
            </div>

            {/* ── Annotations ── */}
            <div className="px-5 pt-2 pb-2">
              <TextCell bold color="#111" className="text-[15px]">
                Annotations
              </TextCell>
            </div>

            <div className="px-4 pt-2 pb-4" data-annotation-id="3">
              <div className="bg-white rounded-sm border border-[#f0f0f0] shadow-[0px_0px_8px_#00000014] px-5 py-4">
                <TextCell color="#999" className="text-[13px]">
                  설정된 Annotation이 없습니다.
                </TextCell>
              </div>
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
            expandedId="1"
            onExpandChange={() => {}}
            renderSubRows={renderSubRows}
          />


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
