import {
  Plus,
  RefreshCw,
  MoreHorizontal,
  Settings2,
  Copy,
  FileText,
  FileCode,
  Trash2,
  Info,
  Settings,
  Code2,
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
  SidebarDashboardIcon,
  SidebarNamespaceIcon,
  SidebarApplicationIcon,
  SidebarCicdIcon,
  SidebarSettingsIcon,
  SidebarTenantIcon,
  SidebarConnectionIcon,
  SidebarServiceMeshIcon,
  SidebarGitopsIcon,
  createSideMenuItems,
} from "../../_components";
import type {
  DataTableColumn,
  ActionMenuEntry,
  IconNavItem,
} from "../../_components";
import type { SlideMeta } from "@entities/document";

export const slideMeta: SlideMeta = {
  screenId: "CCP-STR-005-D1",
  title: "Secrets 구성 - 타입 정보",
  section: "CI/CD 저장소",
  links: [
    { targetScreenId: "CCP-STR-005-D2", type: "tab", label: "Data Keys 탭" },
  ],
  annotations: [
    { id: 1, label: "GitOps 현황 요약", description: "Secret 리소스의 GitOps 동기화 상태를 카드로 요약합니다. Stable, Mismatch 등 상태별 수량을 한눈에 파악할 수 있습니다." },
    { id: 2, label: "타입 필터", description: "Secret 타입(Opaque, TLS, dockerconfigjson 등)별로 목록을 필터링합니다." },
    { id: 3, label: "네임스페이스 필터", description: "특정 네임스페이스에 속한 Secret만 표시하도록 필터링합니다." },
    { id: 4, label: "이름 검색", description: "Secret 이름을 기준으로 키워드 검색을 수행합니다." },
    { id: 5, label: "Secret 생성", description: "새 Secret 리소스를 생성합니다. 클릭 시 생성 다이얼로그가 열립니다." },
    { id: 6, label: "동기화", description: "클러스터의 Secret 상태를 GitOps 소스와 동기화합니다." },
    { id: 7, label: "Secret 목록 테이블", description: "등록된 Secret을 GitOps 상태, 이름, 네임스페이스, 타입, Data 수, 생성일 순으로 표시합니다." },
    { id: 8, label: "행 컨텍스트 메뉴", description: "각 Secret에 대한 편집, 복제, 요약 보기, YAML 확인, 삭제 등의 추가 작업을 수행할 수 있는 컨텍스트 메뉴입니다." },
    { id: 9, label: "페이지네이션", description: "Secret 목록이 한 페이지에 표시할 수 있는 수를 초과할 경우 페이지 단위로 탐색합니다." },
    { id: 10, label: "상세 패널", description: "선택한 Secret(db-credentials)의 상세 정보를 표시하는 사이드 패널입니다. 상태, 구성, YAML 탭으로 전환할 수 있습니다." },
    { id: 11, label: "구성 탭 전환", description: "기본정보, 타입 정보, Data Keys 하위 탭으로 구성 정보를 분류하여 탐색합니다. 현재 타입 정보 탭이 활성화되어 있습니다." },
    { id: 12, label: "타입 정보", description: "Secret의 타입(Opaque), Data 키 개수(3), Immutable 설정(false) 등 Secret 유형과 관련된 메타정보를 표시합니다." },
  ],
};

// ─── Side Menu Data ─────────────────────────────────────────────────────────


// ─── Table Data ─────────────────────────────────────────────────────────────

interface SecretRow {
  id: string;
  gitopsColor: string;
  name: string;
  namespace: string;
  type: string;
  data: number;
  age: string;
}

const tableData: SecretRow[] = [
  {
    id: "1",
    gitopsColor: "#00b30e",
    name: "db-credentials",
    namespace: "app-database",
    type: "Opaque",
    data: 3,
    age: "5d",
  },
  {
    id: "2",
    gitopsColor: "#00b30e",
    name: "api-tls-cert",
    namespace: "app-backend",
    type: "kubernetes.io/tls",
    data: 2,
    age: "10d",
  },
  {
    id: "3",
    gitopsColor: "#00b30e",
    name: "registry-auth",
    namespace: "app-cicd",
    type: "kubernetes.io/dockerconfigjson",
    data: 1,
    age: "30d",
  },
  {
    id: "4",
    gitopsColor: "#6366f1",
    name: "oauth2-client",
    namespace: "app-backend",
    type: "Opaque",
    data: 4,
    age: "8d",
  },
  {
    id: "5",
    gitopsColor: "#00b30e",
    name: "grafana-admin",
    namespace: "monitoring",
    type: "Opaque",
    data: 2,
    age: "15d",
  },
  {
    id: "6",
    gitopsColor: "#00b30e",
    name: "sa-token-default",
    namespace: "kube-system",
    type: "kubernetes.io/service-account-token",
    data: 3,
    age: "90d",
  },
];

const typeVariant: Record<string, "success" | "warning" | "info" | "neutral"> =
  {
    Opaque: "neutral",
    "kubernetes.io/tls": "success",
    "kubernetes.io/dockerconfigjson": "info" as "success",
    "kubernetes.io/service-account-token": "warning",
  };

const columns: DataTableColumn<SecretRow>[] = [
  {
    id: "gitops",
    header: "GitOps",
    width: "120px",
    align: "center",
    render: (row) => <StatusDot color={row.gitopsColor} size="md" />,
  },
  {
    id: "name",
    header: "이름",
    width: "220px",
    render: (row) => (
      <TextCell bold color="#111111" className="px-4">
        {row.name}
      </TextCell>
    ),
  },
  {
    id: "namespace",
    header: "네임스페이스",
    width: "140px",
    align: "center",
    render: (row) => <TextCell color="#555555">{row.namespace}</TextCell>,
  },
  {
    id: "type",
    header: "타입",
    width: "280px",
    align: "center",
    render: (row) => (
      <Badge variant={typeVariant[row.type] ?? "neutral"}>{row.type}</Badge>
    ),
  },
  {
    id: "data",
    header: "Data",
    width: "100px",
    align: "center",
    render: (row) => <Badge variant="neutral">{row.data}</Badge>,
  },
  {
    id: "age",
    header: "생성일",
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
  { key: "edit", label: "편집", icon: <Settings2 className={iconClass} /> },
  { key: "duplicate", label: "복제", icon: <Copy className={iconClass} /> },
  { type: "divider" },
  {
    key: "summary",
    label: "요약",
    icon: <FileText className="w-[14px] h-[14px] text-[#0077ff]" />,
  },
  { key: "yaml", label: "YAML", icon: <FileCode className={iconClass} /> },
  {
    key: "delete",
    label: "리소스 삭제",
    icon: <Trash2 className="w-[14px] h-[14px] text-[#da1e28]" />,
  },
];

// ─── Detail Panel Data ──────────────────────────────────────────────────────

const detailIconNavItems: IconNavItem[] = [
  { id: "status", icon: <Info className="w-5 h-5" />, label: "상태" },
  { id: "config", icon: <Settings className="w-5 h-5" />, label: "구성" },
  { id: "yaml", icon: <Code2 className="w-5 h-5" />, label: "YAML" },
];

// ─── Config Tabs ─────────────────────────────────────────────────────────────

const configTabs = [
  { id: "basic", label: "기본정보" },
  { id: "type", label: "타입 정보" },
  { id: "data", label: "Data Keys" },
];

// ─── Slide ──────────────────────────────────────────────────────────────────

export default function SlideSecretsDetailType() {
  return (
    <CcpDashboardLayout
      breadcrumbs={[{ label: "저장소" }, { label: "Secrets", isBold: true }]}
      title="Secrets"
      sideMenuItems={createSideMenuItems({ activeId: "cicd", activeLabel: "Secrets" })}
    >
      <ListDetailLayout
        detail={
          <ResourceDetailPanel
            data-annotation-id="10"
            title="db-credentials"
            statusColor="#00b30e"
            iconNavItems={detailIconNavItems}
            activeIconNavId="config"
          >
            {/* Section Label */}
            <div className="px-5 pt-4 pb-2 flex items-center gap-1.5">
              <TextCell bold color="#111" className="text-[15px]">
                구성
              </TextCell>
              <Info className="w-3.5 h-3.5 text-[#999]" />
            </div>

            {/* Sub Tabs */}
            <div className="px-5" data-annotation-id="11">
              <Tabs items={configTabs} activeId="type" />
            </div>

            {/* Content */}
            <div className="flex-1 px-4 pt-4 pb-4" data-annotation-id="12">
              <div className="bg-white rounded-sm border border-[#f0f0f0] shadow-[0px_0px_8px_#00000014] px-5 py-4 flex flex-col gap-3">
                <InfoRow label="타입">
                  <Badge variant="neutral" size="sm">Opaque</Badge>
                </InfoRow>
                <InfoRow label="Data 개수">
                  <Badge variant="neutral" size="sm">3</Badge>
                </InfoRow>
                <InfoRow label="Immutable">
                  <Badge variant="neutral" size="sm">false</Badge>
                </InfoRow>
              </div>
            </div>
          </ResourceDetailPanel>
        }
        detailWidth="480px"
      >
        {/* Main List Content */}
        <ContentSection card data-annotation-id="1">
          <StatusSummary
            tabs={[{ id: "gitops", label: "GitOps 현황", count: 6 }]}
            activeTabId="gitops"
            cards={[
              { label: "Stable", count: 5, color: "#00b30e" },
              { label: "Mismatch", count: 1, color: "#da1e28" },
              { label: "Updating", count: 0, color: "#00b30e" },
              { label: "Missing", count: 0, color: "#dea600" },
              { label: "Broken", count: 0, color: "#da1e28" },
              { label: "Orphaned", count: 0, color: "#6366f1" },
            ]}
          />
        </ContentSection>

        <ContentSection relative>
          <FilterBar className="gap-2">
            <div data-annotation-id="2">
            <Select
              label="타입"
              options={[
                { value: "", label: "전체" },
                { value: "opaque", label: "Opaque" },
                { value: "tls", label: "kubernetes.io/tls" },
                { value: "docker", label: "dockerconfigjson" },
                { value: "sa-token", label: "service-account-token" },
              ]}
            />
            </div>
            <div data-annotation-id="3">
            <Select
              label="네임스페이스"
              options={[
                { value: "", label: "전체" },
                { value: "app-database", label: "app-database" },
                { value: "app-backend", label: "app-backend" },
                { value: "app-cicd", label: "app-cicd" },
                { value: "monitoring", label: "monitoring" },
                { value: "kube-system", label: "kube-system" },
              ]}
            />
            </div>
            <div data-annotation-id="4">
            <SearchInput placeholder="이름 검색" className="mr-1" />
            </div>
            <Button data-annotation-id="5" variant="primary" size="md">
              <Plus className="w-4 h-4 mr-1.5" />
              생성
            </Button>
            <Button data-annotation-id="6" variant="secondary" size="md">
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              동기화
            </Button>
          </FilterBar>

          <DataTable
            data-annotation-id="7"
            columns={columns}
            data={tableData}
            selectedIds={new Set()}
            onSelectionChange={() => {}}
          />

          <Overlay data-annotation-id="8" top={133} right={0}>
            <ActionMenu items={actionMenuItems} highlightedKeys={["summary"]} static className="w-[160px]" />
          </Overlay>

          <div data-annotation-id="9">
          <Pagination
            currentPage={1}
            totalPages={4}
            visiblePages={[1, 2, 3, 4]}
            className="mt-5 pb-10"
          />
          </div>
        </ContentSection>
      </ListDetailLayout>
    </CcpDashboardLayout>
  );
}
