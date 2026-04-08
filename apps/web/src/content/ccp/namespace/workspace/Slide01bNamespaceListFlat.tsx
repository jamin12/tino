import {
  Plus,
  RefreshCw,
  MoreHorizontal,
  Eye,
  Tag,
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
  StatusDot,
  StatusSummary,
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
  screenId: "CCP-NS-001-L",
  title: "Namespace 목록 (리스트 보기)",
  section: "네임스페이스",
  subSection: "리스트 보기",
  links: [
    { targetScreenId: "CCP-NS-001", type: "tab", label: "묶음 보기 전환" },
    { targetScreenId: "CCP-NSR-002", type: "navigate", label: "생성 버튼 → NS 생성" },
    { targetScreenId: "CCP-NSR-004", type: "navigate", label: "행 클릭 → NS 상세" },
    { targetScreenId: "CCP-NSR-003", type: "navigate", label: "ActionMenu 삭제 → NS 삭제 모달" },
    { targetScreenId: "CCP-NSR-006", type: "navigate", label: "라벨 부여 버튼 → 타입 라벨 부여 모달" },
  ],
  annotations: [
    {
      id: 1,
      label: "GitOps 현황 요약",
      description: "클러스터 내 namespace 리소스의 GitOps 동기화 상태를 카드로 요약합니다.\n\n- **Stable**: ArgoCD 선언과 클러스터 상태 일치\n- **Mismatch**: 선언과 실제 상태가 불일치\n- **Updating**: 동기화 진행 중\n- **Missing**: 선언은 있으나 클러스터에 리소스 없음\n- **Broken**: 동기화 실패 또는 오류 상태\n- **Orphaned**: ArgoCD 관리 대상이지만 선언이 삭제된 리소스",
    },
    {
      id: 2,
      label: "보기 전환 탭",
      description: "리스트 보기와 묶음 보기를 전환합니다.\n\n- **리스트 보기** (현재): K8s API 기반, 클러스터의 모든 namespace를 개별 리소스로 표시하되 GitOps 컬럼으로 동기화 상태도 함께 확인\n- **묶음 보기**: Gitea 저장소 기반, 워크스페이스 단위로 묶어서 표시",
    },
    {
      id: 3,
      label: "NS 생성",
      description: "K8s namespace를 단일 리소스로 직접 생성합니다. 워크스페이스와 달리 RBAC, PV/PVC, Secret 등의 부가 리소스 없이 namespace 오브젝트만 생성됩니다.",
    },
    {
      id: 4,
      label: "동기화",
      description: "클러스터의 namespace 상태를 GitOps 소스와 동기화합니다. ArgoCD Application 상태를 최신으로 갱신합니다.",
    },
    {
      id: 5,
      label: "NS 리스트 테이블",
      description: "K8s API를 데이터 소스로 사용하여 클러스터에 존재하는 모든 namespace를 표시합니다.\n\n- **GitOps 컬럼**: ArgoCD Application과 매칭하여 동기화 상태를 StatusDot으로 표시. 매칭되지 않는 namespace(시스템 NS 등)는 회색 점으로 표시\n- K8s API 기반이므로 워크스페이스 소속 여부는 알 수 없으나, GitOps 관리 여부는 ArgoCD 연동으로 확인 가능",
    },
    {
      id: 6,
      label: "ActionMenu",
      description: "상세보기(라벨, 어노테이션 등 K8s 메타데이터 확인) 및 삭제 기능을 제공합니다.",
    },
    {
      id: 7,
      label: "타입 컬럼",
      description: "각 네임스페이스에 부여된 타입 라벨(`ccp.cone-chain.com/type`)을 Badge로 표시합니다.\n\n- **USER** (파란색): 사용자가 직접 생성/관리하는 NS\n- **SYSTEM** (회색): CCP 리소스 관리 NS\n- **CI_CD** (보라색): CI/CD 파이프라인 NS\n- **미지정** (주황색): 타입 라벨이 없는 NS",
    },
    {
      id: 8,
      label: "타입 필터",
      description: "네임스페이스 타입별로 필터링합니다. '미지정'을 선택하면 타입 라벨이 없는 NS만 빠르게 확인할 수 있습니다.",
    },
    {
      id: 9,
      label: "라벨 부여",
      description: "체크박스로 네임스페이스를 선택하면 활성화됩니다. 클릭 시 타입 라벨 부여 모달(CCP-NSR-006)이 열리며, 미지정 NS에 신규 부여하거나 기존 타입을 변경할 수 있습니다.",
    },
    {
      id: 10,
      label: "GitOps 관리 NS 선택 제한",
      description: "GitOps(ArgoCD)로 관리되는 네임스페이스는 체크박스가 비활성화(disabled)되어 라벨 부여 대상에서 제외됩니다.\n\n- **판별 기준**: NS Labels에 `argocd.argoproj.io/managed-by` 키가 존재하면 GitOps 관리 대상\n- **사유**: Git 저장소가 Single Source of Truth이므로 CCP 웹에서 라벨을 변경해도 다음 ArgoCD sync 시 원복됨\n- **안내**: disabled 행 hover 시 Tooltip으로 \"GitOps로 관리되는 네임스페이스는 라벨을 직접 변경할 수 없습니다\" 표시\n- GitOps 관리 NS의 타입 라벨을 변경하려면 Git 저장소에서 직접 수정해야 합니다",
    },
  ],
};

// ─── Table Data ─────────────────────────────────────────────────────────────

interface NamespaceResourceRow {
  id: string;
  gitopsColor: string;
  name: string;
  cluster: string;
  status: string;
  statusVariant: string;
  type: string;
  typeBadge: string;
  labels: number;
  age: string;
}

const tableData: NamespaceResourceRow[] = [
  { id: "1", gitopsColor: "#cccccc", name: "default", cluster: "dev-cluster", status: "Active", statusVariant: "green-solid", type: "미지정", typeBadge: "warning", labels: 1, age: "120d" },
  { id: "2", gitopsColor: "#cccccc", name: "kube-system", cluster: "dev-cluster", status: "Active", statusVariant: "green-solid", type: "SYSTEM", typeBadge: "neutral", labels: 1, age: "120d" },
  { id: "3", gitopsColor: "#cccccc", name: "kube-public", cluster: "dev-cluster", status: "Active", statusVariant: "green-solid", type: "미지정", typeBadge: "warning", labels: 0, age: "120d" },
  { id: "4", gitopsColor: "#00b30e", name: "sample-cicd", cluster: "dev-cluster", status: "Active", statusVariant: "green-solid", type: "CI_CD", typeBadge: "purple-solid", labels: 3, age: "30d" },
  { id: "5", gitopsColor: "#00b30e", name: "sample-dev", cluster: "dev-cluster", status: "Active", statusVariant: "green-solid", type: "USER", typeBadge: "blue-solid", labels: 2, age: "30d" },
  { id: "6", gitopsColor: "#dea600", name: "sample-stg", cluster: "dev-cluster", status: "Active", statusVariant: "green-solid", type: "USER", typeBadge: "blue-solid", labels: 2, age: "25d" },
  { id: "7", gitopsColor: "#00b30e", name: "sample-prd", cluster: "prd-cluster", status: "Active", statusVariant: "green-solid", type: "USER", typeBadge: "blue-solid", labels: 2, age: "25d" },
  { id: "8", gitopsColor: "#00b30e", name: "payment-cicd", cluster: "dev-cluster", status: "Active", statusVariant: "green-solid", type: "CI_CD", typeBadge: "purple-solid", labels: 3, age: "20d" },
  { id: "9", gitopsColor: "#cccccc", name: "istio-system", cluster: "dev-cluster", status: "Active", statusVariant: "green-solid", type: "미지정", typeBadge: "warning", labels: 4, age: "90d" },
  { id: "10", gitopsColor: "#cccccc", name: "argocd", cluster: "dev-cluster", status: "Active", statusVariant: "green-solid", type: "미지정", typeBadge: "warning", labels: 2, age: "90d" },
  { id: "11", gitopsColor: "#cccccc", name: "temp-test", cluster: "dev-cluster", status: "Terminating", statusVariant: "warning", type: "미지정", typeBadge: "warning", labels: 0, age: "2d" },
];

const columns: DataTableColumn<NamespaceResourceRow>[] = [
  {
    id: "gitops",
    header: "GitOps",
    width: "80px",
    align: "center",
    render: (row) => <StatusDot color={row.gitopsColor} size="md" />,
  },
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
    id: "cluster",
    header: "클러스터",
    width: "140px",
    render: (row) => <TextCell color="#555555">{row.cluster}</TextCell>,
  },
  {
    id: "type",
    header: "타입",
    width: "100px",
    align: "center",
    render: (row) => (
      <Badge variant={row.typeBadge as any} size="sm" data-annotation-id="7">
        {row.type}
      </Badge>
    ),
  },
  {
    id: "status",
    header: "상태",
    width: "120px",
    align: "center",
    render: (row) => (
      <Badge variant={row.statusVariant as any} size="sm">
        {row.status}
      </Badge>
    ),
  },
  {
    id: "labels",
    header: "Labels",
    width: "100px",
    align: "center",
    render: (row) => <TextCell color="#555555">{row.labels}</TextCell>,
  },
  {
    id: "age",
    header: "Age",
    width: "100px",
    align: "center",
    render: (row) => <TextCell color="#555555">{row.age}</TextCell>,
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
  { type: "divider" },
  {
    key: "delete",
    label: "삭제",
    icon: <Trash2 className="w-[14px] h-[14px] text-[#da1e28]" />,
  },
];

// ─── Slide ──────────────────────────────────────────────────────────────────

export default function Slide01bNamespaceListFlat() {
  return (
    <CcpDashboardLayout
      gnbPreset="namespace"
      breadcrumbs={[
        { label: "네임스페이스", isBold: true },
      ]}
      title="Namespaces"
      sideMenuItems={createSideMenuItems({ activeId: "namespace" })}
    >
      <ContentSection card data-annotation-id="1">
        <StatusSummary
          tabs={[{ id: "gitops", label: "GitOps 현황", count: 11 }]}
          activeTabId="gitops"
          cards={[
            { label: "Stable", count: 5, color: "#00b30e" },
            { label: "Mismatch", count: 0, color: "#da1e28" },
            { label: "Updating", count: 1, color: "#dea600" },
            { label: "Missing", count: 0, color: "#da1e28" },
            { label: "Broken", count: 0, color: "#da1e28" },
            { label: "Orphaned", count: 0, color: "#6366f1" },
          ]}
        />
      </ContentSection>

      <ContentSection relative>
        <FilterBar className="gap-2">
          <Tabs
            items={[
              { id: "list", label: "리스트 보기" },
              { id: "grouped", label: "묶음 보기" },
            ]}
            activeId="list"
            variant="pill"
            data-annotation-id="2"
          />
          <Select
            label="상태"
            options={[
              { value: "", label: "전체" },
              { value: "active", label: "Active" },
              { value: "terminating", label: "Terminating" },
            ]}
          />
          <Select
            label="타입"
            options={[
              { value: "", label: "전체" },
              { value: "USER", label: "USER" },
              { value: "SYSTEM", label: "SYSTEM" },
              { value: "CI_CD", label: "CI_CD" },
              { value: "none", label: "미지정" },
            ]}
            data-annotation-id="8"
          />
          <SearchInput placeholder="이름 검색" className="mr-1" />
          <Button variant="blue-solid" size="md" data-annotation-id="9">
            <Tag className="w-3.5 h-3.5 mr-1.5" />
            라벨 부여
          </Button>
          <Button variant="primary" size="md" data-annotation-id="3">
            <Plus className="w-4 h-4 mr-1.5" />
            생성
          </Button>
          <Button variant="secondary" size="md" data-annotation-id="4">
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            동기화
          </Button>
        </FilterBar>

        <DataTable
          columns={columns}
          data={tableData}
          selectedIds={new Set()}
          onSelectionChange={() => {}}
          data-annotation-id="5"
        />

        <Overlay top={190} right={0} data-annotation-id="6">
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
