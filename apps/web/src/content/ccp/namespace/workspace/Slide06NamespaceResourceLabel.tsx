import {
  Plus,
  RefreshCw,
  MoreHorizontal,
  Tag,
} from "lucide-react";
import {
  AlertBanner,
  Badge,
  Button,
  CcpDashboardLayout,
  ContentSection,
  DataTable,
  FieldGroup,
  FilterBar,
  ItemGroup,
  ItemGroupRow,
  Modal,
  Pagination,
  SearchInput,
  Select,
  StatusDot,
  Tabs,
  TextCell,
  createSideMenuItems,
} from "../../_components";
import type {
  DataTableColumn,
} from "../../_components";
import type { SlideMeta } from "@entities/document";

export const slideMeta: SlideMeta = {
  screenId: "CCP-NSR-006",
  title: "Namespace 타입 라벨 일괄 부여",
  section: "네임스페이스",
  subSection: "리스트 보기",
  links: [
    { targetScreenId: "CCP-NS-001-L", type: "navigate", label: "취소 → 리스트로 복귀" },
    { targetScreenId: "CCP-NSR-005", type: "navigate", label: "개별 편집으로 이동" },
  ],
  annotations: [
    {
      id: 1,
      label: "타입 필터",
      description: "네임스페이스 타입별로 필터링합니다.\n\n- **전체**: 모든 네임스페이스 표시\n- **USER**: 사용자가 직접 생성/관리하는 NS\n- **SYSTEM**: CCP 리소스 관리 NS\n- **CI_CD**: CI/CD 파이프라인 NS\n- **미지정**: 타입 라벨이 없는 NS\n\n미지정 필터를 선택하면 라벨이 필요한 NS만 빠르게 찾을 수 있습니다.",
    },
    {
      id: 2,
      label: "타입 컬럼",
      description: "각 네임스페이스에 부여된 타입 라벨을 표시합니다.\n\n- `ccp.cone-chain.com/type` 라벨 값을 읽어 Badge로 표시\n- 라벨이 없으면 **미지정** Badge(주황색)로 표시하여 시각적으로 구분",
    },
    {
      id: 3,
      label: "라벨 부여 버튼",
      description: "체크박스로 네임스페이스를 선택하면 활성화됩니다.\n\n- 클릭 시 타입 라벨 부여 모달이 열립니다\n- 미지정 NS뿐 아니라 기존 타입을 변경하고 싶은 NS도 선택 가능합니다",
    },
    {
      id: 4,
      label: "안내 배너",
      description: "타입 라벨의 용도를 안내합니다. 타입 라벨은 CCP 내부에서 네임스페이스를 분류·필터링·권한 관리하는 기준으로 사용됩니다.",
    },
    {
      id: 5,
      label: "대상 목록",
      description: "라벨을 부여할 네임스페이스 목록입니다. 리스트에서 체크박스로 선택한 항목이 표시되며, 각 항목의 현재 타입 상태도 함께 표시됩니다.\n\n- GitOps(ArgoCD)로 관리되는 NS는 리스트에서 체크박스가 disabled 처리되어 이 목록에 포함될 수 없습니다\n- 판별 기준: `argocd.argoproj.io/managed-by` 라벨 존재 여부",
    },
    {
      id: 6,
      label: "타입 선택",
      description: "부여할 타입을 선택합니다.\n\n- **USER**: 사용자가 직접 생성/관리하는 Namespace\n- **SYSTEM**: CCP를 위한 Resource 관리 Namespace\n- **CI_CD**: CI/CD 파이프라인에서 사용하는 Namespace\n\n선택한 타입이 대상 NS 전체에 일괄 적용됩니다. 이미 다른 타입이 부여된 NS는 새로운 타입으로 덮어쓰기됩니다.",
    },
    {
      id: 7,
      label: "적용 버튼",
      description: "K8s API를 호출하여 선택된 네임스페이스에 `ccp.cone-chain.com/type` 라벨을 일괄 부여합니다.\n\n- 각 NS에 PATCH 요청으로 라벨 추가/업데이트\n- 완료 후 리스트로 복귀, 타입 컬럼이 갱신됩니다",
    },
  ],
};

// ─── Table Data (Background: 전체 목록 + 선택 상태) ───────────────────────────

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
    width: "180px",
    render: (row) => (
      <TextCell bold color="#111111" linked className="px-4">
        {row.name}
      </TextCell>
    ),
  },
  {
    id: "cluster",
    header: "클러스터",
    width: "130px",
    render: (row) => <TextCell color="#555555">{row.cluster}</TextCell>,
  },
  {
    id: "type",
    header: "타입",
    width: "100px",
    align: "center",
    render: (row) => (
      <Badge variant={row.typeBadge as any} size="sm">
        {row.type}
      </Badge>
    ),
  },
  {
    id: "status",
    header: "상태",
    width: "100px",
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
    width: "80px",
    align: "center",
    render: (row) => <TextCell color="#555555">{row.labels}</TextCell>,
  },
  {
    id: "age",
    header: "Age",
    width: "80px",
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

// ─── Modal target items ────────────────────────────────────────────────────

const labelTargets = [
  { name: "default", cluster: "dev-cluster", currentType: "미지정", badgeVariant: "warning" },
  { name: "kube-public", cluster: "dev-cluster", currentType: "미지정", badgeVariant: "warning" },
  { name: "istio-system", cluster: "dev-cluster", currentType: "미지정", badgeVariant: "warning" },
  { name: "sample-cicd", cluster: "dev-cluster", currentType: "CI_CD", badgeVariant: "purple-solid" },
];

// ─── Slide ──────────────────────────────────────────────────────────────────

export default function Slide06NamespaceResourceLabel() {
  return (
    <CcpDashboardLayout
      gnbPreset="namespace"
      breadcrumbs={[
        { label: "네임스페이스", isBold: true },
      ]}
      title="Namespaces"
      sideMenuItems={createSideMenuItems({ activeId: "namespace" })}
      overlay={
        <Modal
          title="네임스페이스 타입 라벨 부여"
          titleIcon={<Tag className="w-5 h-5 text-[#3b82f6] shrink-0" />}
          titleExtra={
            <Badge variant="neutral" size="sm" className="ml-1">
              4건
            </Badge>
          }
          footer={
            <>
              <Button variant="secondary" size="md">
                취소
              </Button>
              <Button variant="primary" size="md" data-annotation-id="7">
                4건 적용
              </Button>
            </>
          }
        >
          <AlertBanner
            variant="info"
            title="타입 라벨은 CCP에서 네임스페이스를 분류·관리하는 기준입니다"
            data-annotation-id="4"
          >
            부여된 타입에 따라 필터링, 권한 관리, 대시보드 집계에 반영됩니다.
            이미 타입이 있는 NS는 새로운 타입으로 덮어쓰기됩니다.
          </AlertBanner>

          <ItemGroup label="대상 네임스페이스" data-annotation-id="5">
            {labelTargets.map((item) => (
              <ItemGroupRow key={item.name}>
                <TextCell bold color="#111" className="text-[13px] flex-1">
                  {item.name}
                </TextCell>
                <TextCell color="#999" className="text-[12px]">
                  {item.cluster}
                </TextCell>
                <Badge variant={item.badgeVariant as any} size="sm">
                  {item.currentType}
                </Badge>
              </ItemGroupRow>
            ))}
          </ItemGroup>

          <FieldGroup data-annotation-id="6">
            <TextCell bold color="#111" className="text-[13px]">
              부여할 타입
            </TextCell>
            <Select
              options={[
                { value: "", label: "타입을 선택하세요" },
                { value: "USER", label: "USER — 사용자 Namespace" },
                { value: "SYSTEM", label: "SYSTEM — CCP 리소스 관리", selected: true },
                { value: "CI_CD", label: "CI_CD — CI/CD 파이프라인" },
              ]}
              className="w-full"
            />
          </FieldGroup>
        </Modal>
      }
    >
      {/* ─── Background: 전체 목록 + 체크박스 선택 상태 ─────── */}
      <ContentSection relative>
        <FilterBar className="gap-2">
          <Tabs
            items={[
              { id: "list", label: "리스트 보기" },
              { id: "grouped", label: "묶음 보기" },
            ]}
            activeId="list"
            variant="pill"
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
            data-annotation-id="1"
          />
          <SearchInput placeholder="이름 검색" className="mr-1" />
          <Button variant="blue-solid" size="md" data-annotation-id="3">
            <Tag className="w-3.5 h-3.5 mr-1.5" />
            라벨 부여 (4)
          </Button>
          <Button variant="primary" size="md">
            <Plus className="w-4 h-4 mr-1.5" />
            생성
          </Button>
          <Button variant="secondary" size="md">
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            동기화
          </Button>
        </FilterBar>

        <DataTable
          columns={columns}
          data={tableData}
          selectedIds={new Set(["1", "3", "4", "9"])}
          onSelectionChange={() => {}}
          data-annotation-id="2"
        />

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
