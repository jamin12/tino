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
  Tabs,
  TextCell,
  createSideMenuItems,
} from "../../_components";
import type {
  DataTableColumn,
  ActionMenuEntry,
} from "../../_components";
import type { SlideMeta } from "@entities/document";

export const slideMeta: SlideMeta = {
  screenId: "CCP-NS-001",
  title: "Namespace 목록 (묶음 보기)",
  section: "네임스페이스",
  links: [
    { targetScreenId: "CCP-NS-001-L", type: "tab", label: "리스트 보기 전환" },
    { targetScreenId: "CCP-NS-002", type: "navigate", label: "생성 버튼 → NS 생성" },
    { targetScreenId: "CCP-NS-004", type: "navigate", label: "행 클릭 → NS 상세" },
    { targetScreenId: "CCP-NS-007", type: "modal", label: "삭제 → 삭제 모달" },
  ],
  annotations: [
    {
      id: 1,
      label: "보기 전환 탭",
      description: "두 보기는 **데이터 소스 자체가 다릅니다**.\n\n- **묶음 보기** (현재): Gitea 저장소(k8s-cicd-init + k8s-app-init)의 폴더 구조를 데이터 소스로 사용합니다. GitOps로 관리되는 워크스페이스만 표시되며, `default`, `kube-system` 같은 시스템 NS는 나타나지 않습니다.\n- **리스트 보기**: K8s API(`kubectl get namespaces`)를 데이터 소스로 사용합니다. 클러스터에 실제 존재하는 모든 namespace를 개별 행으로 표시하며, 워크스페이스로 생성된 NS는 `managed` 뱃지로 구분됩니다.",
    },
    {
      id: 2,
      label: "워크스페이스 생성",
      description: "새 워크스페이스를 생성합니다. 단순 K8s namespace 하나가 아니라 **작업에 필요한 모든 리소스를 세트로 프로비저닝**합니다.\n\nGitea API를 통해 두 저장소에 동시 작업:\n- **k8s-cicd-init**: `{name}-cicd` NS + ServiceAccount, RBAC, LimitRange, LocalQueue, PV/PVC, Secret 다수, RoleBinding\n- **k8s-app-init**: `{name}-{env}` NS + Secret(Docker/TLS), Istio Gateway, VirtualService, AuthorizationPolicy",
    },
    {
      id: 3,
      label: "묶음 목록 테이블 (펼침 행)",
      description: "Gitea 저장소의 폴더 구조를 기반으로 워크스페이스 단위로 묶인 목록입니다. GitOps로 관리되는 대상만 표시됩니다.\n\n- **배포 환경 뱃지**: 각 워크스페이스에 연결된 환경(dev/stg/prd)을 색상별로 표시\n- **▶ 펼침**: 클릭 시 해당 워크스페이스의 개별 K8s namespace 목록과 Sync 상태를 확인\n- **Sync 상태**: Gitea 저장소의 선언(desired)과 클러스터 실제 상태(actual)의 일치 여부를 ArgoCD Application 상태로 표시\n  - `Synced`: 선언과 클러스터 상태 일치\n  - `OutOfSync`: ArgoCD가 아직 반영하지 않은 변경 존재\n  - `Missing`: 선언은 있으나 클러스터에 리소스가 없음",
    },
    {
      id: 4,
      label: "ActionMenu",
      description: "상세보기(워크스페이스 상세 화면 이동), 환경 추가(기존 워크스페이스에 배포 환경 추가), 삭제(환경별/전체 삭제 모달) 메뉴를 제공합니다.",
    },
  ],
};

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

// ─── Sub-row Renderer ──────────────────────────────────────────────────────

function renderSubRows(row: NamespaceRow) {
  const subs = subRowsMap[row.name];
  if (!subs) return null;

  return (
    <div className="flex flex-col">
      {/* Sub-row header */}
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
      {/* Sub-rows */}
      {subs.map((sub, idx) => (
        <div
          key={sub.name}
          className={`flex items-center h-10 pl-12 ${idx < subs.length - 1 ? "border-b border-[#f0f0f0]" : ""}`}
        >
          <span className="w-[200px] text-sm text-[#333333] tracking-[-0.14px]">
            {sub.name}
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

export default function Slide01NamespaceListGrouped() {
  return (
    <CcpDashboardLayout
      gnbPreset="namespace"
      breadcrumbs={[
        { label: "네임스페이스", isBold: true },
      ]}
      title="Namespaces"
      sideMenuItems={createSideMenuItems({ activeId: "namespace" })}
    >
      <ContentSection relative>
        <FilterBar className="gap-2">
          <Tabs
            items={[
              { id: "list", label: "리스트 보기" },
              { id: "grouped", label: "묶음 보기" },
            ]}
            activeId="grouped"
            variant="pill"
            data-annotation-id="1"
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
          <Button variant="primary" size="md" data-annotation-id="2">
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
          data-annotation-id="3"
        />

        <Overlay top={133} right={0} data-annotation-id="4">
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
