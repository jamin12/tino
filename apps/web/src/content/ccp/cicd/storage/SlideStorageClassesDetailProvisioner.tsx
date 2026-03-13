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
  SidebarGitopsIcon,
} from "../../_components";
import type {
  SideMenuItem,
  DataTableColumn,
  ActionMenuEntry,
  IconNavItem,
} from "../../_components";
import type { SlideMeta } from "@entities/document";

export const slideMeta: SlideMeta = {
  screenId: "CCP-STR-001-D1",
  title: "StorageClasses 구성 - 프로비저너",
  section: "CI/CD 저장소",
  links: [
    { targetScreenId: "CCP-STR-001-D2", type: "tab", label: "Parameters 탭" },
  ],
  annotations: [
    { id: 1, label: "GitOps 현황 요약", description: "StorageClass 리소스의 GitOps 동기화 상태를 카드로 요약합니다. Stable, Mismatch, Updating 등 상태별 수량을 한눈에 파악할 수 있습니다." },
    { id: 2, label: "프로비저너 필터", description: "프로비저너 유형별로 StorageClass 목록을 필터링합니다. '전체'를 선택하면 모든 프로비저너의 항목이 표시됩니다." },
    { id: 3, label: "이름 검색", description: "StorageClass 이름을 기준으로 키워드 검색을 수행합니다. 입력 즉시 목록이 필터링됩니다." },
    { id: 4, label: "StorageClass 생성", description: "새 StorageClass 리소스를 생성합니다. 클릭 시 생성 다이얼로그가 열립니다." },
    { id: 5, label: "동기화", description: "클러스터의 StorageClass 상태를 GitOps 소스와 동기화합니다. 최신 상태를 반영하기 위해 사용합니다." },
    { id: 6, label: "StorageClass 목록 테이블", description: "등록된 StorageClass를 GitOps 상태, 이름, 프로비저너, 기본 여부, 생성일 순으로 표시합니다. 행 클릭 시 해당 리소스의 상세 화면으로 이동합니다." },
    { id: 7, label: "행 컨텍스트 메뉴", description: "각 StorageClass에 대한 편집, 복제, 요약 보기, 구성, YAML 확인, 삭제 등의 추가 작업을 수행할 수 있는 컨텍스트 메뉴입니다." },
    { id: 8, label: "페이지네이션", description: "StorageClass 목록이 한 페이지에 표시할 수 있는 수를 초과할 경우 페이지 단위로 탐색합니다." },
    { id: 9, label: "상세 패널", description: "선택한 StorageClass(standard)의 상세 정보를 표시하는 사이드 패널입니다. 상태, 구성, YAML 탭으로 전환할 수 있습니다." },
    { id: 10, label: "구성 탭 전환", description: "기본정보, 프로비저너, Parameters 하위 탭으로 구성 정보를 분류하여 탐색합니다. 현재 프로비저너 탭이 활성화되어 있습니다." },
    { id: 11, label: "프로비저너 정보", description: "Provisioner, Reclaim Policy, Volume Binding Mode, Allow Expansion 등 StorageClass의 프로비저너 관련 설정값을 표시합니다." },
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
      { label: "", items: [{ label: "네임스페이스" }] },
      {
        label: "저장소",
        items: [
          { label: "StorageClasses", active: true, bold: true },
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
    id: "settings",
    label: "설정/권한",
    icon: <SidebarSettingsIcon className="w-5 h-5" />,
    expandIcon: "plus",
  },
  {
    id: "gitops",
    label: "GitOps",
    icon: <SidebarGitopsIcon className="w-5 h-5" />,
    expandIcon: "plus",
  },
];

// ─── Table Data ─────────────────────────────────────────────────────────────

interface StorageClassRow {
  id: string;
  gitopsColor: string;
  name: string;
  provisioner: string;
  isDefault: boolean;
  age: string;
}

const tableData: StorageClassRow[] = [
  {
    id: "1",
    gitopsColor: "#00b30e",
    name: "standard",
    provisioner: "kubernetes.io/no-provisioner",
    isDefault: true,
    age: "90d",
  },
  {
    id: "2",
    gitopsColor: "#00b30e",
    name: "local-storage",
    provisioner: "kubernetes.io/no-provisioner",
    isDefault: false,
    age: "90d",
  },
  {
    id: "3",
    gitopsColor: "#00b30e",
    name: "nfs-client",
    provisioner: "nfs-subdir-external-provisioner",
    isDefault: false,
    age: "45d",
  },
  {
    id: "4",
    gitopsColor: "#6366f1",
    name: "ceph-block",
    provisioner: "rook-ceph.rbd.csi.ceph.com",
    isDefault: false,
    age: "30d",
  },
  {
    id: "5",
    gitopsColor: "#00b30e",
    name: "ceph-filesystem",
    provisioner: "rook-ceph.cephfs.csi.ceph.com",
    isDefault: false,
    age: "30d",
  },
];

const columns: DataTableColumn<StorageClassRow>[] = [
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
    width: "240px",
    render: (row) => (
      <TextCell bold color="#111111" className="px-4">
        {row.isDefault ? `${row.name} (default)` : row.name}
      </TextCell>
    ),
  },
  {
    id: "provisioner",
    header: "프로비저너",
    width: "300px",
    render: (row) => <Badge variant="neutral">{row.provisioner}</Badge>,
  },
  {
    id: "default",
    header: "기본 여부",
    width: "120px",
    align: "center",
    render: (row) => (
      <Badge variant={row.isDefault ? "success" : "neutral"}>
        {row.isDefault ? "Default" : "-"}
      </Badge>
    ),
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
    icon: <FileText className={iconClass} />,
  },
  { key: "config", label: "구성", icon: <Settings className="w-[14px] h-[14px] text-[#0077ff]" /> },
  { key: "yaml", label: "YAML", icon: <FileCode className={iconClass} /> },
  { type: "divider" },
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
  { id: "provisioner", label: "프로비저너" },
  { id: "params", label: "Parameters" },
];

// ─── Slide ──────────────────────────────────────────────────────────────────

export default function SlideStorageClassesDetailProvisioner() {
  return (
    <CcpDashboardLayout
      breadcrumbs={[
        { label: "저장소" },
        { label: "StorageClasses", isBold: true },
      ]}
      title="Storage Classes"
      sideMenuItems={sideMenuItems}
    >
      <ListDetailLayout
        detail={
          <ResourceDetailPanel
            data-annotation-id="9"
            title="standard"
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
            <div className="px-5" data-annotation-id="10">
              <Tabs items={configTabs} activeId="provisioner" />
            </div>

            {/* Content */}
            <div className="flex-1 px-4 pt-4 pb-4" data-annotation-id="11">
              <div className="bg-white rounded-sm border border-[#f0f0f0] shadow-[0px_0px_8px_#00000014] px-5 py-4 flex flex-col gap-3">
                <InfoRow label="Provisioner">
                  <TextCell color="#6d7073" className="text-[13px]">
                    kubernetes.io/no-provisioner
                  </TextCell>
                </InfoRow>
                <InfoRow label="Reclaim Policy">
                  <Badge variant="success" size="sm">Retain</Badge>
                </InfoRow>
                <InfoRow label="Volume Binding">
                  <TextCell color="#6d7073" className="text-[13px]">WaitForFirstConsumer</TextCell>
                </InfoRow>
                <InfoRow label="Allow Expansion">
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
            tabs={[{ id: "gitops", label: "GitOps 현황", count: 5 }]}
            activeTabId="gitops"
            cards={[
              { label: "Stable", count: 4, color: "#00b30e" },
              { label: "Mismatch", count: 0, color: "#da1e28" },
              { label: "Updating", count: 1, color: "#00b30e" },
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
              label="프로비저너"
              options={[
                { value: "", label: "전체" },
                { value: "no-provisioner", label: "no-provisioner" },
                { value: "nfs", label: "nfs-subdir" },
                { value: "ceph-rbd", label: "rook-ceph (RBD)" },
                { value: "ceph-fs", label: "rook-ceph (CephFS)" },
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

          <Overlay data-annotation-id="7" top={133} right={0}>
            <ActionMenu
              items={actionMenuItems}
              highlightedKeys={["config"]}
              static
              className="w-[160px]"
            />
          </Overlay>

          <div data-annotation-id="8">
          <Pagination
            currentPage={1}
            totalPages={1}
            visiblePages={[1]}
            className="mt-5 pb-10"
          />
          </div>
        </ContentSection>
      </ListDetailLayout>
    </CcpDashboardLayout>
  );
}
