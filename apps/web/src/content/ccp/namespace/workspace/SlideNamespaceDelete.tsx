import {
  Plus,
  MoreHorizontal,
  Eye,
  FolderPlus,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import {
  Badge,
  Button,
  CcpDashboardLayout,
  Checkbox,
  ContentSection,
  ActionMenu,
  DataTable,
  FilterBar,
  InfoRow,
  Overlay,
  Pagination,
  SearchInput,
  Select,
  Tabs,
  TextCell,
  TextInput,
  createSideMenuItems,
} from "../../_components";
import type {
  DataTableColumn,
  ActionMenuEntry,
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
  screenId: "CCP-NS-007",
  title: "Namespace 삭제 모달",
  section: "네임스페이스",
  subSection: "묶음 보기",
  links: [],
  annotations: [
    { id: 1, label: "삭제 유형 선택", description: "환경별 삭제는 선택한 배포 환경의 app-init 리소스만 제거하고 CICD 파이프라인은 유지합니다. 전체 삭제는 CICD 파이프라인과 모든 배포 환경을 함께 제거합니다." },
    { id: 2, label: "환경 선택 체크박스", description: "환경별 삭제 시 제거할 배포 환경을 선택합니다. 선택한 환경의 overlays/{env}/{ns}-{env}/ 폴더와 kustomization.yaml 참조가 제거됩니다." },
    { id: 3, label: "영향 범위 미리보기", description: "선택한 환경에 따라 삭제되거나 수정될 파일 경로를 빨간색(폴더 삭제)과 주황색(참조 제거)으로 구분하여 보여줍니다." },
    { id: 4, label: "삭제 확인 입력", description: "실수로 삭제하는 것을 방지하기 위해 네임스페이스 이름을 직접 입력해야 삭제 버튼이 활성화됩니다." },
  ],
};

// ─── Side Menu Data ─────────────────────────────────────────────────────────


// ─── Table Data (Background List) ───────────────────────────────────────────

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

export default function SlideNamespaceDelete() {
  return (
    <CcpDashboardLayout
      gnbPreset="namespace"
      breadcrumbs={[
        { label: "네임스페이스", isBold: true },
      ]}
      title="Namespaces"
      sideMenuItems={createSideMenuItems({ activeId: "namespace" })}
      overlay={
        /* ─── Modal Backdrop + Dialog ─────────────────────────── */
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[520px] bg-white rounded-lg shadow-[0px_4px_24px_#00000033] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center gap-3 px-6 pt-5 pb-3">
              <AlertTriangle className="w-5 h-5 text-[#da1e28] shrink-0" />
              <TextCell bold color="#111" className="text-[16px]">
                네임스페이스 삭제
              </TextCell>
            </div>

            {/* Modal Body */}
            <div className="px-6 pb-4 flex flex-col gap-4">
              <TextCell color="#555" className="text-[13px]">
                삭제된 리소스는 Gitea 레포에서 영구적으로 제거됩니다.
                복구하려면 수동으로 다시 생성해야 합니다.
              </TextCell>

              {/* 대상 NS */}
              <InfoRow label="네임스페이스" labelWidth="100px">
                <TextCell bold color="#111" className="text-[14px]">sample</TextCell>
              </InfoRow>

              {/* 삭제 유형 */}
              <div data-annotation-id="1">
                <Tabs
                  items={[
                    { id: "env", label: "환경별 삭제" },
                    { id: "all", label: "전체 삭제" },
                  ]}
                  activeId="env"
                />
              </div>

              {/* 환경 선택 */}
              <div className="flex flex-col gap-2" data-annotation-id="2">
                <TextCell color="#6d7073" className="text-[12px]">
                  삭제할 배포 환경을 선택하세요. CICD 파이프라인 리소스는 유지됩니다.
                </TextCell>
                <div className="flex flex-col gap-2.5 pl-1">
                  <div className="flex items-center gap-3">
                    <Checkbox label="dev" />
                    <Badge variant="blue-label" size="sm">개발</Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox label="stg" checked />
                    <Badge variant="yellow-label" size="sm">스테이징</Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox label="prd" />
                    <Badge variant="green-label" size="sm">운영</Badge>
                  </div>
                </div>
              </div>

              {/* 영향 범위 */}
              <div className="bg-[#f8f9fa] rounded-md p-3 flex flex-col gap-1.5" data-annotation-id="3">
                <TextCell bold color="#333" className="text-[12px]">
                  삭제될 리소스 (stg)
                </TextCell>
                <TextCell color="#da1e28" className="text-[12px]">
                  overlays/stg/sample-stg/ (폴더 삭제)
                </TextCell>
                <TextCell color="#dea600" className="text-[12px]">
                  overlays/stg/kustomization.yaml (참조 제거)
                </TextCell>
              </div>

              {/* 확인 입력 */}
              <div className="flex flex-col gap-1.5" data-annotation-id="4">
                <TextCell color="#555" className="text-[13px]">
                  삭제를 확인하려면 네임스페이스 이름을 입력하세요.
                </TextCell>
                <TextInput placeholder="sample" className="w-full" />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#f0f0f0]">
              <Button variant="secondary" size="md">
                취소
              </Button>
              <Button variant="danger" size="md">
                삭제
              </Button>
            </div>
          </div>
        </div>
      }
    >
      {/* ─── Background: List View (dimmed) ─────────────────── */}
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

        <Overlay top={133} right={0}>
          <ActionMenu
            items={actionMenuItems}
            highlightedKeys={["delete"]}
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
