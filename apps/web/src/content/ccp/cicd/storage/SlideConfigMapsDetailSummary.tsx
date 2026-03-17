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
  CheckCircle2,
  Heart,
} from "lucide-react";
import {
  Badge,
  Button,
  CcpDashboardLayout,
  CollapsibleSection,
  ContentSection,
  ActionMenu,
  DataTable,
  Divider,
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
  screenId: "CCP-STR-004-D1",
  title: "ConfigMaps 상세 - 요약",
  section: "CI/CD 저장소",
  links: [
    { targetScreenId: "CCP-STR-004-D2", type: "tab", label: "기본정보 탭" },
    { targetScreenId: "CCP-STR-004-D3", type: "tab", label: "Data 탭" },
    { targetScreenId: "CCP-STR-004-D4", type: "tab", label: "설정 탭" },
    { targetScreenId: "CCP-STR-004-D5", type: "tab", label: "YAML 탭" },
  ],
  annotations: [
    { id: 1, label: "GitOps 현황 요약", description: "ConfigMap 리소스의 GitOps 동기화 상태를 카드로 요약합니다. Stable, Mismatch, Updating 등 상태별 수량을 한눈에 파악할 수 있습니다." },
    { id: 2, label: "네임스페이스 필터", description: "특정 네임스페이스에 속한 ConfigMap만 표시하도록 필터링합니다." },
    { id: 3, label: "이름 검색", description: "ConfigMap 이름을 기준으로 키워드 검색을 수행합니다." },
    { id: 4, label: "ConfigMap 생성", description: "새 ConfigMap 리소스를 생성합니다. 클릭 시 생성 다이얼로그가 열립니다." },
    { id: 5, label: "동기화", description: "클러스터의 ConfigMap 상태를 GitOps 소스와 동기화합니다." },
    { id: 6, label: "ConfigMap 목록 테이블", description: "등록된 ConfigMap을 GitOps 상태, 이름, 네임스페이스, Data 수, 생성일 순으로 표시합니다." },
    { id: 7, label: "행 컨텍스트 메뉴", description: "각 ConfigMap에 대한 편집, 복제, 요약 보기, 구성, YAML 확인, 삭제 등의 추가 작업을 수행할 수 있는 컨텍스트 메뉴입니다." },
    { id: 8, label: "페이지네이션", description: "ConfigMap 목록이 한 페이지에 표시할 수 있는 수를 초과할 경우 페이지 단위로 탐색합니다." },
    { id: 9, label: "상세 패널", description: "선택한 ConfigMap(app-config)의 상세 정보를 표시하는 사이드 패널입니다. 현재 상태(요약) 탭이 활성화되어 있습니다." },
    { id: 10, label: "상태 섹션", description: "GitOps 동기화 상태(Stable), Sync/Health 상태, GitOps 설정 여부, 소스 URL 및 브랜치 정보를 접이식 섹션으로 표시합니다." },
    { id: 11, label: "기본정보 섹션", description: "ConfigMap의 이름, 설명, 네임스페이스, API 버전 등 핵심 메타데이터를 접이식 섹션으로 표시합니다." },
    { id: 12, label: "설정 섹션", description: "Labels와 Annotations를 배지 형태로 요약 표시합니다. 전체 목록은 구성 > 설정 탭에서 확인할 수 있습니다." },
  ],
};

// ─── Side Menu Data ─────────────────────────────────────────────────────────


// ─── Table Data ─────────────────────────────────────────────────────────────

interface ConfigMapRow {
  id: string;
  gitopsColor: string;
  name: string;
  namespace: string;
  data: number;
  age: string;
}

const tableData: ConfigMapRow[] = [
  { id: "1", gitopsColor: "#00b30e", name: "app-config", namespace: "app-backend", data: 5, age: "10d" },
  { id: "2", gitopsColor: "#00b30e", name: "nginx-config", namespace: "app-frontend", data: 2, age: "12d" },
  { id: "3", gitopsColor: "#00b30e", name: "redis-config", namespace: "app-database", data: 3, age: "5d" },
  { id: "4", gitopsColor: "#6366f1", name: "fluentd-config", namespace: "monitoring", data: 8, age: "20d" },
  { id: "5", gitopsColor: "#00b30e", name: "prometheus-rules", namespace: "monitoring", data: 12, age: "15d" },
];

const columns: DataTableColumn<ConfigMapRow>[] = [
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
      <TextCell bold color="#111111" className="px-4">
        {row.name}
      </TextCell>
    ),
  },
  {
    id: "namespace",
    header: "네임스페이스",
    width: "130px",
    align: "center",
    render: (row) => <TextCell color="#555555">{row.namespace}</TextCell>,
  },
  {
    id: "data",
    header: "Data",
    width: "70px",
    align: "center",
    render: (row) => <Badge variant="neutral">{row.data}</Badge>,
  },
  {
    id: "age",
    header: "생성일",
    width: "70px",
    align: "center",
    render: (row) => <TextCell color="#555555">{row.age}</TextCell>,
  },
  {
    id: "actions",
    header: "",
    width: "50px",
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
  { key: "summary", label: "요약", icon: <FileText className="w-[14px] h-[14px] text-[#0077ff]" /> },
  { key: "config", label: "구성", icon: <Settings className={iconClass} /> },
  { key: "yaml", label: "YAML", icon: <FileCode className={iconClass} /> },
  { type: "divider" },
  { key: "delete", label: "리소스 삭제", icon: <Trash2 className="w-[14px] h-[14px] text-[#da1e28]" /> },
];

// ─── Detail Panel Data ──────────────────────────────────────────────────────

const detailIconNavItems: IconNavItem[] = [
  { id: "status", icon: <Info className="w-5 h-5" />, label: "상태" },
  { id: "config", icon: <Settings className="w-5 h-5" />, label: "구성" },
  { id: "yaml", icon: <Code2 className="w-5 h-5" />, label: "YAML" },
];

// ─── Slide ──────────────────────────────────────────────────────────────────

export default function SlideConfigMapsDetailSummary() {
  return (
    <CcpDashboardLayout
      breadcrumbs={[{ label: "저장소" }, { label: "ConfigMaps", isBold: true }]}
      title="ConfigMaps"
      sideMenuItems={createSideMenuItems({ activeId: "cicd", activeLabel: "ConfigMaps" })}
    >
      <ListDetailLayout
        detail={
          <ResourceDetailPanel
            data-annotation-id="9"
            title="app-config"
            statusColor="#00b30e"
            iconNavItems={detailIconNavItems}
            activeIconNavId="status"
          >
            <div className="px-4 pt-4 flex flex-col gap-3">
              {/* ── 상태 ─────────────────────────────────── */}
              <CollapsibleSection data-annotation-id="10" title="상태" expanded onToggle={() => {}}>
                <InfoRow label="GitOps">
                  <StatusDot color="#00b30e" size="md" />
                  <Badge variant="success" size="sm">Stable</Badge>
                </InfoRow>
                <InfoRow label="Sync">
                  <Badge variant="neutral" size="sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#18BE94] shrink-0" />
                    Synced
                  </Badge>
                </InfoRow>
                <InfoRow label="Health">
                  <Badge variant="neutral" size="sm">
                    <Heart className="w-3.5 h-3.5 text-[#18BE94] shrink-0" fill="#18BE94" />
                    Healthy
                  </Badge>
                </InfoRow>

                <Divider />

                <InfoRow label="GitOps 설정">
                  <Badge variant="on" size="sm">ON</Badge>
                </InfoRow>
                <InfoRow label="URL">
                  <TextCell linked color="#0077ff" className="text-[12px] break-all">
                    https://gitea.cone-chain.com/app-cicd/app-config.git
                  </TextCell>
                </InfoRow>
                <InfoRow label="Branch">
                  <TextCell color="#333" className="text-[13px]">main</TextCell>
                </InfoRow>
              </CollapsibleSection>

              {/* ── 기본정보 ──────────────────────────────── */}
              <CollapsibleSection data-annotation-id="11" title="기본정보" expanded onToggle={() => {}}>
                <InfoRow label="이름">
                  <TextCell color="#6d7073" className="text-[13px]">app-config</TextCell>
                </InfoRow>
                <InfoRow label="설명">
                  <TextCell color="#6d7073" className="text-[13px]">
                    Backend application configuration
                  </TextCell>
                </InfoRow>
                <InfoRow label="네임스페이스">
                  <TextCell color="#6d7073" className="text-[13px]">app-backend</TextCell>
                </InfoRow>
                <InfoRow label="API 버전">
                  <TextCell color="#6d7073" className="text-[13px]">v1</TextCell>
                </InfoRow>
              </CollapsibleSection>

              {/* ── 설정 ─────────────────────────────────── */}
              <CollapsibleSection data-annotation-id="12" title="설정" expanded onToggle={() => {}}>
                <InfoRow label="Labels">
                  <Badge variant="neutral" size="sm">type: build</Badge>
                  <Badge variant="neutral" size="sm">env: dev</Badge>
                  <Badge variant="neutral" size="sm">+3</Badge>
                </InfoRow>
                <InfoRow label="Annotations">
                  <Badge variant="neutral" size="sm">trigger: webhook.config</Badge>
                  <Badge variant="neutral" size="sm">env: dev</Badge>
                  <Badge variant="neutral" size="sm">+3</Badge>
                </InfoRow>
              </CollapsibleSection>
            </div>
          </ResourceDetailPanel>
        }
        detailWidth="480px"
      >
        {/* Main List Content */}
        <ContentSection card data-annotation-id="1">
          <StatusSummary
            tabs={[{ id: "gitops", label: "GitOps 현황", count: 5 }]}
            activeTabId="gitops"
            cards={[
              { label: "Stable", count: 4, color: "#00b30e" },
              { label: "Mismatch", count: 0, color: "#da1e28" },
              { label: "Updating", count: 1, color: "#6366f1" },
              { label: "Missing", count: 0, color: "#dea600" },
            ]}
          />
        </ContentSection>

        <ContentSection relative>
          <FilterBar className="gap-2">
            <div data-annotation-id="2">
            <Select
              label="네임스페이스"
              options={[
                { value: "", label: "전체" },
                { value: "app-backend", label: "app-backend" },
                { value: "app-frontend", label: "app-frontend" },
                { value: "monitoring", label: "monitoring" },
              ]}
            />
            </div>
            <div data-annotation-id="3">
            <SearchInput placeholder="이름 검색" className="mr-1" />
            </div>
            <Button data-annotation-id="4" variant="primary" size="md">
              <Plus className="w-4 h-4 mr-1.5" />
              생성
            </Button>
            <Button data-annotation-id="5" variant="secondary" size="md">
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              동기화
            </Button>
          </FilterBar>

          <DataTable
            data-annotation-id="6"
            columns={columns}
            data={tableData}
            selectedIds={new Set()}
            onSelectionChange={() => {}}
          />

          <Overlay data-annotation-id="7" top={90} right={0}>
            <ActionMenu
              items={actionMenuItems}
              highlightedKeys={["summary"]}
              static
              className="w-[160px]"
            />
          </Overlay>

          <div data-annotation-id="8">
          <Pagination
            currentPage={1}
            totalPages={3}
            visiblePages={[1, 2, 3]}
            className="mt-3 pb-6"
          />
          </div>
        </ContentSection>
      </ListDetailLayout>
    </CcpDashboardLayout>
  );
}
