import {
  MoreHorizontal,
  Eye,
  Settings2,
  Trash2,
  Info,
  Plus,
  RefreshCw,
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
  StatusDot,
  StatusSummary,
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
  screenId: "CCP-NSR-004",
  title: "Namespace 리소스 상세",
  section: "네임스페이스",
  links: [
    { targetScreenId: "CCP-NSR-005", type: "navigate", label: "편집 → NS 수정" },
  ],
  annotations: [
    {
      id: 1,
      label: "기본 정보",
      description: "K8s namespace의 기본 메타데이터를 표시합니다.\n\n- **이름**: namespace 이름\n- **클러스터**: 소속 클러스터\n- **상태**: Active / Terminating\n- **GitOps**: ArgoCD 동기화 상태 (관리 대상이 아니면 Unmanaged)\n- **Age**: 생성 이후 경과 시간",
    },
    {
      id: 2,
      label: "Labels",
      description: "namespace에 설정된 K8s Labels (key=value 쌍)을 표시합니다. `kubectl get ns {name} -o jsonpath='{.metadata.labels}'`와 동일한 정보입니다.",
    },
    {
      id: 3,
      label: "Annotations",
      description: "namespace에 설정된 K8s Annotations (key=value 쌍)을 표시합니다.",
    },
    {
      id: 4,
      label: "편집 버튼",
      description: "이 namespace의 Labels, Annotations를 수정하는 편집 화면(CCP-NSR-005)으로 이동합니다.",
    },
    {
      id: 5,
      label: "ActionMenu",
      description: "상세보기(현재 화면) 및 삭제 기능을 제공합니다.",
    },
  ],
};

// ─── List Table Data ────────────────────────────────────────────────────────

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

const iconClass = "w-[14px] h-[14px] text-[#555759]";
const listActionMenuItems: ActionMenuEntry[] = [
  { key: "detail", label: "상세보기", icon: <Eye className={iconClass} /> },
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

// ─── Slide ──────────────────────────────────────────────────────────────────

export default function Slide03NamespaceResourceDetail() {
  return (
    <CcpDashboardLayout
      gnbPreset="namespace"
      breadcrumbs={[
        { label: "네임스페이스" },
        { label: "default", isBold: true },
      ]}
      title="Namespaces"
      sideMenuItems={createSideMenuItems({ activeId: "namespace" })}
    >
      <ListDetailLayout
        detail={
          <ResourceDetailPanel
            title="default"
            statusColor="#cccccc"
            iconNavItems={detailIconNavItems}
            activeIconNavId="detail"
          >
            {/* ── 기본 정보 ── */}
            <div className="px-5 pt-4 pb-2 flex items-center gap-1.5">
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
                  <Badge variant="green-solid" size="sm">Active</Badge>
                </InfoRow>
                <InfoRow label="GitOps">
                  <Badge variant="neutral" size="sm">Unmanaged</Badge>
                </InfoRow>
                <InfoRow label="Age">
                  <TextCell color="#6d7073" className="text-[13px]">120d</TextCell>
                </InfoRow>
              </div>
            </div>

            {/* ── Labels ── */}
            <div className="px-5 pt-2 pb-2 flex items-center justify-between border-t border-[#f0f0f0]">
              <TextCell bold color="#111" className="text-[15px]">
                Labels
              </TextCell>
            </div>

            <div className="px-4 pt-1 pb-4" data-annotation-id="2">
              <div className="bg-white rounded-sm border border-[#f0f0f0] shadow-[0px_0px_8px_#00000014] px-5 py-3 flex flex-col gap-2">
                <InfoRow label="kubernetes.io/metadata.name">
                  <TextCell color="#6d7073" className="text-[12px]">default</TextCell>
                </InfoRow>
              </div>
            </div>

            {/* ── Annotations ── */}
            <div className="px-5 pt-2 pb-2 flex items-center justify-between border-t border-[#f0f0f0]">
              <TextCell bold color="#111" className="text-[15px]">
                Annotations
              </TextCell>
            </div>

            <div className="px-4 pt-1 pb-4" data-annotation-id="3">
              <div className="bg-white rounded-sm border border-[#f0f0f0] shadow-[0px_0px_8px_#00000014] px-5 py-3 flex flex-col gap-2">
                <TextCell color="#999" className="text-[12px]">
                  설정된 Annotation이 없습니다.
                </TextCell>
              </div>
            </div>

            {/* ── 편집 버튼 ── */}
            <div className="px-4 pb-4" data-annotation-id="4">
              <Button variant="secondary" size="md" className="w-full">
                <Settings2 className="w-3.5 h-3.5 mr-1.5" />
                편집
              </Button>
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
            selectedIds={new Set()}
            onSelectionChange={() => {}}
          />

          <Overlay top={56} right={0} data-annotation-id="5">
            <ActionMenu
              items={listActionMenuItems}
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
      </ListDetailLayout>
    </CcpDashboardLayout>
  );
}
