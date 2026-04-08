import {
  Plus,
  RefreshCw,
  MoreHorizontal,
  Trash2,
  AlertTriangle,
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
  TextInput,
  createSideMenuItems,
} from "../../_components";
import type {
  DataTableColumn,
} from "../../_components";
import type { SlideMeta } from "@entities/document";

export const slideMeta: SlideMeta = {
  screenId: "CCP-NSR-003",
  title: "Namespace 리소스 삭제 (다건)",
  section: "네임스페이스",
  subSection: "리스트 보기",
  links: [
    { targetScreenId: "CCP-NS-001-L", type: "navigate", label: "취소 → 리스트로 복귀" },
    { targetScreenId: "CCP-NS-007", type: "navigate", label: "GitOps 삭제로 이동" },
  ],
  annotations: [
    {
      id: 1,
      label: "ArgoCD 관리 경고",
      description: "삭제 대상 중 ArgoCD 라벨이 존재하는 namespace가 **1개라도 포함**되면 이 경고가 표시됩니다.\n\n- ArgoCD가 관리하는 namespace는 K8s API로 삭제해도 GitOps 동기화에 의해 **자동 재생성**됩니다\n- 영구 삭제가 필요하면 GitOps 삭제(CCP-NS-007)를 이용해야 합니다\n- [GitOps 삭제로 이동] 링크를 통해 워크스페이스 삭제 화면으로 바로 이동 가능\n\n!!!경고가 표시되더라도 삭제 자체는 차단하지 않습니다. 일시적으로 namespace를 내리는 용도로 사용할 수 있습니다.!!!",
    },
    {
      id: 2,
      label: "삭제 대상 목록",
      description: "삭제할 namespace 목록을 표시합니다. 리스트에서 체크박스로 여러 개를 선택한 경우 선택된 모든 namespace가 나열됩니다.\n\n- 각 항목에 GitOps 동기화 상태가 표시됩니다\n- ArgoCD 관리 중인 항목은 주황색 점으로 구분됩니다",
    },
    {
      id: 3,
      label: "삭제 확인 입력",
      description: "실수 방지를 위해 **delete**를 입력해야 삭제 버튼이 활성화됩니다.\n\n???단건 삭제 시에는 namespace 이름을, 다건 삭제 시에는 `delete`를 입력합니다.???",
    },
    {
      id: 4,
      label: "삭제 버튼",
      description: "확인 입력이 일치하면 K8s API를 호출하여 선택된 namespace를 일괄 삭제합니다.\n\n- ArgoCD 관리 NS: 삭제 후 동기화 시 재생성됨 (경고 확인 후 진행)\n- 일반 NS: 즉시 영구 삭제",
    },
    {
      id: 5,
      label: "체크박스 다건 선택",
      description: "리스트에서 체크박스로 여러 namespace를 선택한 뒤 상단 삭제 버튼 또는 ActionMenu를 통해 일괄 삭제 모달을 열 수 있습니다.",
    },
  ],
};

// ─── Table Data (Background List) ───────────────────────────────────────────

interface NamespaceResourceRow {
  id: string;
  gitopsColor: string;
  name: string;
  cluster: string;
  status: string;
  statusVariant: string;
  labels: number;
  age: string;
}

const tableData: NamespaceResourceRow[] = [
  { id: "1", gitopsColor: "#cccccc", name: "default", cluster: "dev-cluster", status: "Active", statusVariant: "green-solid", labels: 1, age: "120d" },
  { id: "2", gitopsColor: "#cccccc", name: "kube-system", cluster: "dev-cluster", status: "Active", statusVariant: "green-solid", labels: 1, age: "120d" },
  { id: "3", gitopsColor: "#cccccc", name: "kube-public", cluster: "dev-cluster", status: "Active", statusVariant: "green-solid", labels: 0, age: "120d" },
  { id: "4", gitopsColor: "#00b30e", name: "sample-cicd", cluster: "dev-cluster", status: "Active", statusVariant: "green-solid", labels: 3, age: "30d" },
  { id: "5", gitopsColor: "#00b30e", name: "sample-dev", cluster: "dev-cluster", status: "Active", statusVariant: "green-solid", labels: 2, age: "30d" },
  { id: "6", gitopsColor: "#dea600", name: "sample-stg", cluster: "dev-cluster", status: "Active", statusVariant: "green-solid", labels: 2, age: "25d" },
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


// ─── Delete target items ────────────────────────────────────────────────────

const deleteTargets = [
  { name: "sample-cicd", cluster: "dev-cluster", gitopsColor: "#00b30e", gitopsLabel: "Stable" },
  { name: "sample-dev", cluster: "dev-cluster", gitopsColor: "#00b30e", gitopsLabel: "Stable" },
  { name: "sample-stg", cluster: "dev-cluster", gitopsColor: "#dea600", gitopsLabel: "Mismatch" },
];

// ─── Slide ──────────────────────────────────────────────────────────────────

export default function Slide05NamespaceResourceDelete() {
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
          title="네임스페이스 삭제"
          titleIcon={<AlertTriangle className="w-5 h-5 text-[#da1e28] shrink-0" />}
          titleExtra={
            <Badge variant="neutral" size="sm" className="ml-1">
              {deleteTargets.length}건
            </Badge>
          }
          footer={
            <>
              <Button variant="secondary" size="md">
                취소
              </Button>
              <Button variant="danger" size="md">
                {deleteTargets.length}건 삭제
              </Button>
            </>
          }
          data-annotation-id="4"
        >
          <AlertBanner
            variant="warning"
            title="ArgoCD 관리 중인 네임스페이스가 포함되어 있습니다"
            data-annotation-id="1"
          >
            ArgoCD에 의해 관리되는 네임스페이스는 삭제하더라도 GitOps 동기화에 의해
            재생성됩니다. 영구 삭제가 필요하면 GitOps 삭제를 이용하세요.
          </AlertBanner>

          <ItemGroup label="삭제 대상" data-annotation-id="2">
            {deleteTargets.map((item) => (
              <ItemGroupRow key={item.name}>
                <StatusDot color={item.gitopsColor} size="sm" />
                <TextCell bold color="#111" className="text-[13px] flex-1">
                  {item.name}
                </TextCell>
                <TextCell color="#999" className="text-[12px]">
                  {item.cluster}
                </TextCell>
              </ItemGroupRow>
            ))}
          </ItemGroup>

          <FieldGroup data-annotation-id="3">
            <TextCell color="#555" className="text-[13px]">
              삭제를 확인하려면{" "}
              <TextCell bold color="#da1e28" className="text-[13px]">
                delete
              </TextCell>
              를 입력하세요.
            </TextCell>
            <TextInput placeholder="delete" className="w-full" />
          </FieldGroup>
        </Modal>
      }
    >
      {/* ─── Background: List View with selections ─────────── */}
      <ContentSection relative>
        <FilterBar className="gap-2" data-annotation-id="5">
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
          <SearchInput placeholder="이름 검색" className="mr-1" />
          <Button variant="danger" size="md">
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            선택 삭제 (3)
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
          selectedIds={new Set(["4", "5", "6"])}
          onSelectionChange={() => {}}
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
