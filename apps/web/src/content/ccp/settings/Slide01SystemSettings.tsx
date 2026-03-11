import { useState, type ReactNode } from "react";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Server,
  Globe,
  Database,
  Shield,
  GitBranch,
  Box,
  Search,
  BarChart3,
  Activity,
  Bug,
  Anchor,
  Workflow,
  X,
} from "lucide-react";
import {
  CcpDashboardLayout,
  ContentSection,
  Button,
  Badge,
  Tabs,
  Toggle,
  TextInput,
  Select,
  SidebarDashboardIcon,
  SidebarNamespaceIcon,
  SidebarApplicationIcon,
  SidebarCicdIcon,
  SidebarSettingsIcon,
  SidebarGitopsIcon,
} from "../_components";
import type { SideMenuItem } from "../_components";
import type { SlideMeta } from "@entities/document";

export const slideMeta: SlideMeta = {
  screenId: "CCP-SET-001",
  title: "시스템 설정",
  section: "설정/권한",
  links: [],
};

// ─── Side Menu ──────────────────────────────────────────────────────────────

const sideMenuItems: SideMenuItem[] = [
  {
    id: "dashboard",
    label: "대시보드",
    icon: <SidebarDashboardIcon className="w-5 h-5" />,
    expandIcon: "plus",
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
    expandIcon: "plus",
  },
  {
    id: "gitops",
    label: "GitOps",
    icon: <SidebarGitopsIcon className="w-5 h-5" />,
    expandIcon: "plus",
  },
  {
    id: "settings",
    label: "설정/권한",
    icon: <SidebarSettingsIcon className="w-5 h-5" />,
    active: true,
    expandIcon: "minus",
    sections: [
      {
        items: [
          { id: "system-settings", label: "시스템 설정", active: true },
          { id: "user-management", label: "사용자 관리" },
          { id: "role-management", label: "역할 관리" },
          { id: "audit-log", label: "감사 로그" },
        ],
      },
    ],
  },
];

// ─── Endpoint 타입별 아이콘 ──────────────────────────────────────────────────

const endpointTypeIcon: Record<string, React.ReactNode> = {
  // 클러스터
  "API Server": <Server className="w-4 h-4 text-[#4A90D9]" />,
  // DevOps 컴포넌트
  Gitea: <GitBranch className="w-4 h-4 text-[#609926]" />,
  ArgoCD: <Workflow className="w-4 h-4 text-[#ef4444]" />,
  Nexus: <Database className="w-4 h-4 text-[#3b82f6]" />,
  Tekton: <Anchor className="w-4 h-4 text-[#fd495c]" />,
  Harbor: <Box className="w-4 h-4 text-[#60b932]" />,
  SonarQube: <Bug className="w-4 h-4 text-[#4e9bcd]" />,
  Kiali: <Activity className="w-4 h-4 text-[#003d6b]" />,
  Jaeger: <Search className="w-4 h-4 text-[#66cfe3]" />,
  OpenSearch: <Globe className="w-4 h-4 text-[#005eb8]" />,
  Grafana: <BarChart3 className="w-4 h-4 text-[#f46800]" />,
};

// ─── 상태 뱃지 ──────────────────────────────────────────────────────────────

function StatusIndicator({ status }: { status: "connected" | "disconnected" | "error" }) {
  const map = {
    connected: { icon: <CheckCircle2 className="w-3.5 h-3.5 text-[#009d32]" />, label: "연결됨", color: "text-[#009d32]" },
    disconnected: { icon: <XCircle className="w-3.5 h-3.5 text-[#888]" />, label: "연결 해제", color: "text-[#888]" },
    error: { icon: <AlertTriangle className="w-3.5 h-3.5 text-[#da1e28]" />, label: "오류", color: "text-[#da1e28]" },
  };
  const s = map[status];
  return (
    <span className={`inline-flex items-center gap-1 text-[13px] font-medium ${s.color}`}>
      {s.icon} {s.label}
    </span>
  );
}

// ─── 폼 행 (label : value) ──────────────────────────────────────────────────

function FormRow({
  label,
  children,
  description,
}: {
  label: string;
  children: React.ReactNode;
  description?: string;
}) {
  return (
    <div className="flex items-start py-3 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-[#f0f0f0]">
      <div className="w-[180px] flex-shrink-0 pt-1">
        <span className="text-[13px] font-medium text-[#333]">{label}</span>
        {description && (
          <p className="text-[11px] text-[#999] mt-0.5">{description}</p>
        )}
      </div>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

// ─── Endpoint 관리 탭 ────────────────────────────────────────────────────────

function EndpointCard({
  ep,
}: {
  ep: { id: string; name: string; type: string; url: string; status: "connected" | "disconnected" | "error"; auth: string; desc: string; inCluster?: boolean };
}) {
  return (
    <div className="flex items-center gap-4 px-4 py-3 h-[52px] rounded border border-[#eee] bg-[#fafbfc] hover:bg-[#f4f7fa] transition-colors">
      <div className="flex-shrink-0 w-5">{endpointTypeIcon[ep.type]}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-medium text-[#333] truncate">{ep.name}</span>
          <Badge variant="blue-label" size="sm">{ep.type}</Badge>
          {ep.inCluster && <Badge variant="green-solid" size="sm">in-cluster</Badge>}
        </div>
        <div className="flex items-center gap-1 mt-0.5">
          <span className="text-[12px] text-[#888] font-mono truncate">{ep.url}</span>
          <ExternalLink className="w-3 h-3 text-[#bbb] flex-shrink-0" />
        </div>
      </div>
      <div className="flex-shrink-0 text-right">
        <StatusIndicator status={ep.status} />
        <div className="text-[11px] text-[#aaa] mt-0.5">{ep.auth}</div>
      </div>
    </div>
  );
}

function EndpointManagementTab({
  onAddCluster,
  onAddComponent,
}: {
  onAddCluster: () => void;
  onAddComponent: () => void;
}) {
  const clusterEndpoints = [
    { id: "cl-001", name: "K8s API Server (Production)", type: "API Server", url: "https://k8s-api.prod.example.com:6443", status: "connected" as const, auth: "Certificate", desc: "운영 클러스터 API 서버", inCluster: true },
    { id: "cl-002", name: "K8s API Server (Staging)", type: "API Server", url: "https://k8s-api.stg.example.com:6443", status: "connected" as const, auth: "Certificate", desc: "스테이징 클러스터 API 서버" },
    { id: "cl-003", name: "OpenShift (Dev)", type: "API Server", url: "https://api.ocp-dev.example.com:6443", status: "connected" as const, auth: "Token", desc: "개발 OpenShift 클러스터" },
  ];

  const devopsEndpoints = [
    { id: "ep-001", name: "Gitea", type: "Gitea", url: "https://gitea.example.com", status: "connected" as const, auth: "OAuth2", desc: "Git 소스코드 저장소" },
    { id: "ep-002", name: "ArgoCD", type: "ArgoCD", url: "https://argocd.example.com", status: "connected" as const, auth: "Token", desc: "GitOps 지속적 배포 엔진" },
    { id: "ep-003", name: "Nexus Repository", type: "Nexus", url: "https://nexus.example.com", status: "connected" as const, auth: "Basic Auth", desc: "아티팩트 및 패키지 저장소" },
    { id: "ep-004", name: "Tekton", type: "Tekton", url: "https://tekton.example.com", status: "connected" as const, auth: "Token", desc: "클라우드 네이티브 CI/CD 파이프라인" },
    { id: "ep-005", name: "Harbor Registry", type: "Harbor", url: "https://harbor.example.com", status: "connected" as const, auth: "Token", desc: "컨테이너 이미지 레지스트리" },
    { id: "ep-006", name: "SonarQube", type: "SonarQube", url: "https://sonarqube.example.com", status: "connected" as const, auth: "Token", desc: "코드 품질 및 보안 분석" },
    { id: "ep-007", name: "Kiali", type: "Kiali", url: "https://kiali.example.com", status: "connected" as const, auth: "Token", desc: "서비스 메시 관찰성 콘솔" },
    { id: "ep-008", name: "Jaeger", type: "Jaeger", url: "https://jaeger.example.com", status: "disconnected" as const, auth: "Token", desc: "분산 트레이싱 시스템" },
    { id: "ep-009", name: "OpenSearch", type: "OpenSearch", url: "https://opensearch.example.com", status: "connected" as const, auth: "Basic Auth", desc: "로그 수집 및 검색 엔진" },
    { id: "ep-010", name: "Grafana", type: "Grafana", url: "https://grafana.example.com", status: "connected" as const, auth: "Token", desc: "모니터링 대시보드 및 시각화" },
  ];

  const clusterConnected = clusterEndpoints.filter((e) => e.status === "connected").length;
  const devopsConnected = devopsEndpoints.filter((e) => e.status === "connected").length;

  return (
    <>
      {/* ── 클러스터 ──────────────────────────────────────────────────── */}
      <div className="bg-white rounded-lg border border-[#e0e0e0] p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-[15px] font-bold text-[#333]">클러스터</h3>
            <p className="text-[12px] text-[#999] mt-1">마지막 상태 갱신: 2026. 3. 9. 오후 2:35:14</p>
          </div>
          <div className="flex items-center gap-6 text-right">
            <div>
              <div className="text-[11px] text-[#888]">연결된 클러스터</div>
              <div className="text-[18px] font-bold text-[#333]">{clusterConnected} <span className="text-[13px] font-normal text-[#999]">개</span></div>
            </div>
            <div>
              <div className="text-[11px] text-[#888]">전체 클러스터</div>
              <div className="text-[18px] font-bold text-[#333]">{clusterEndpoints.length} <span className="text-[13px] font-normal text-[#999]">개</span></div>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          {clusterEndpoints.map((ep) => (
            <EndpointCard key={ep.id} ep={ep} />
          ))}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button size="sm" variant="ghost">연결 테스트</Button>
          <Button size="sm" variant="primary" onClick={onAddCluster}>클러스터 추가</Button>
        </div>
      </div>

      {/* ── 컴포넌트 ──────────────────────────────────────────────────── */}
      <div className="bg-white rounded-lg border border-[#e0e0e0] p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-[15px] font-bold text-[#333]">컴포넌트</h3>
            <p className="text-[12px] text-[#999] mt-1">CI/CD, GitOps, 레지스트리, 시크릿 관리 등 DevOps 도구 연결</p>
          </div>
          <div className="flex items-center gap-6 text-right">
            <div>
              <div className="text-[11px] text-[#888]">연결됨</div>
              <div className="text-[18px] font-bold text-[#333]">{devopsConnected} <span className="text-[13px] font-normal text-[#999]">개</span></div>
            </div>
            <div>
              <div className="text-[11px] text-[#888]">전체 컴포넌트</div>
              <div className="text-[18px] font-bold text-[#333]">{devopsEndpoints.length} <span className="text-[13px] font-normal text-[#999]">개</span></div>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          {devopsEndpoints.map((ep) => (
            <EndpointCard key={ep.id} ep={ep} />
          ))}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button size="sm" variant="ghost">전체 연결 테스트</Button>
          <Button size="sm" variant="primary" onClick={onAddComponent}>컴포넌트 추가</Button>
        </div>
      </div>
    </>
  );
}

// ─── 시스템 설정 탭 ──────────────────────────────────────────────────────────

function SystemSettingsTab() {
  return (
    <>
      {/* 일반 설정 */}
      <div className="bg-white rounded-lg border border-[#e0e0e0] p-5">
        <h3 className="text-[14px] font-bold text-[#333] mb-3">일반 설정</h3>
        <div className="space-y-0">
          <FormRow label="세션 타임아웃" description="비활동 시 자동 로그아웃 (분)">
            <div className="flex items-center gap-2">
              <TextInput type="number" defaultValue="30" className="w-[100px]" />
              <span className="text-[13px] text-[#888]">분</span>
            </div>
          </FormRow>
        </div>
      </div>

      {/* GitOps 설정 */}
      <div className="bg-white rounded-lg border border-[#e0e0e0] p-5">
        <h3 className="text-[14px] font-bold text-[#333] mb-3">GitOps 설정</h3>
        <div className="space-y-0">
          <FormRow label="GitOps 자동 동기화" description="Git 변경 시 자동 클러스터 동기화">
            <Toggle checked={true} />
          </FormRow>
          <FormRow label="동기화 주기" description="자동 동기화 간격">
            <div className="flex items-center gap-2">
              <TextInput type="number" defaultValue="180" className="w-[100px]" />
              <span className="text-[13px] text-[#888]">초</span>
            </div>
          </FormRow>
          <FormRow label="롤백 히스토리" description="앱별 롤백 가능 최대 리비전 수">
            <div className="flex items-center gap-2">
              <TextInput type="number" defaultValue="10" className="w-[100px]" />
              <span className="text-[13px] text-[#888]">개</span>
            </div>
          </FormRow>
        </div>
      </div>

      {/* 보안 설정 */}
      <div className="bg-white rounded-lg border border-[#e0e0e0] p-5">
        <h3 className="text-[14px] font-bold text-[#333] mb-3">보안 설정</h3>
        <div className="space-y-0">
          <FormRow label="감사 로그" description="사용자 활동 및 변경 사항 기록">
            <Toggle checked={true} />
          </FormRow>
          <FormRow label="감사 로그 보관" description="자동 삭제까지의 보관 기간">
            <div className="flex items-center gap-2">
              <TextInput type="number" defaultValue="90" className="w-[100px]" />
              <span className="text-[13px] text-[#888]">일</span>
            </div>
          </FormRow>
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className="flex justify-end gap-2 mt-1">
        <Button size="md" variant="ghost">초기화</Button>
        <Button size="md" variant="primary">설정 저장</Button>
      </div>
    </>
  );
}

// ─── Modal ───────────────────────────────────────────────────────────────────

function Modal({
  open,
  onClose,
  title,
  children,
  width = "480px",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  width?: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        className="relative bg-white rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-[#e0e0e0]"
        style={{ width }}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e0e0e0]">
          <h2 className="text-[15px] font-bold text-[#333]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#f0f0f0] text-[#888] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {/* 본문 */}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

// ─── 클러스터 추가 모달 ──────────────────────────────────────────────────────

function ClusterAddModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="클러스터 추가" width="520px">
      <div className="space-y-4">
        <FormRow label="클러스터 이름">
          <TextInput placeholder="예: K8s Production" className="w-full" />
        </FormRow>
        <FormRow label="유형">
          <Select
            label="Kubernetes"
            value="k8s"
            options={[
              { value: "k8s", label: "Kubernetes" },
              { value: "openshift", label: "OpenShift" },
            ]}
            minWidth="200px"
          />
        </FormRow>
        <FormRow label="API Server URL">
          <TextInput placeholder="https://k8s-api.example.com:6443" className="w-full" />
        </FormRow>
        <FormRow label="인증 방식">
          <Select
            label="Certificate"
            value="certificate"
            options={[
              { value: "certificate", label: "Certificate" },
              { value: "token", label: "Token" },
              { value: "kubeconfig", label: "Kubeconfig" },
            ]}
            minWidth="200px"
          />
        </FormRow>
        <FormRow label="인증 정보">
          <textarea
            className="w-full h-[80px] px-2 py-1.5 text-[13px] font-mono text-[#333] bg-white rounded-sm border border-[#ddd] outline-none resize-none placeholder:text-[#999]"
            placeholder="인증서 또는 토큰 값을 입력하세요"
          />
        </FormRow>
        <FormRow label="설명">
          <TextInput placeholder="클러스터에 대한 간단한 설명" className="w-full" />
        </FormRow>
      </div>
      {/* 하단 버튼 */}
      <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-[#f0f0f0]">
        <Button size="md" variant="ghost" onClick={onClose}>취소</Button>
        <Button size="md" variant="ghost">연결 테스트</Button>
        <Button size="md" variant="primary">추가</Button>
      </div>
    </Modal>
  );
}

// ─── 컴포넌트 추가 모달 ──────────────────────────────────────────────────────

function ComponentAddModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="컴포넌트 추가" width="520px">
      <div className="space-y-4">
        <FormRow label="컴포넌트 유형">
          <Select
            label="선택하세요"
            value=""
            options={[
              { value: "Gitea", label: "Gitea" },
              { value: "ArgoCD", label: "ArgoCD" },
              { value: "Nexus", label: "Nexus" },
              { value: "Tekton", label: "Tekton" },
              { value: "Harbor", label: "Harbor" },
              { value: "SonarQube", label: "SonarQube" },
              { value: "Kiali", label: "Kiali" },
              { value: "Jaeger", label: "Jaeger" },
              { value: "OpenSearch", label: "OpenSearch" },
              { value: "Grafana", label: "Grafana" },
            ]}
            minWidth="200px"
          />
        </FormRow>
        <FormRow label="이름">
          <TextInput placeholder="예: ArgoCD Production" className="w-full" />
        </FormRow>
        <FormRow label="URL">
          <TextInput placeholder="https://argocd.example.com" className="w-full" />
        </FormRow>
        <FormRow label="인증 방식">
          <Select
            label="Token"
            value="token"
            options={[
              { value: "token", label: "Token" },
              { value: "basic", label: "Basic Auth" },
              { value: "oauth2", label: "OAuth2" },
            ]}
            minWidth="200px"
          />
        </FormRow>
        <FormRow label="인증 정보">
          <textarea
            className="w-full h-[80px] px-2 py-1.5 text-[13px] font-mono text-[#333] bg-white rounded-sm border border-[#ddd] outline-none resize-none placeholder:text-[#999]"
            placeholder="토큰 또는 인증 정보를 입력하세요"
          />
        </FormRow>
        <FormRow label="설명">
          <TextInput placeholder="컴포넌트에 대한 간단한 설명" className="w-full" />
        </FormRow>
      </div>
      {/* 하단 버튼 */}
      <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-[#f0f0f0]">
        <Button size="md" variant="ghost" onClick={onClose}>취소</Button>
        <Button size="md" variant="ghost">연결 테스트</Button>
        <Button size="md" variant="primary">추가</Button>
      </div>
    </Modal>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Slide01SystemSettings() {
  const [activeTab, setActiveTab] = useState("system-config");
  const [clusterModalOpen, setClusterModalOpen] = useState(false);
  const [componentModalOpen, setComponentModalOpen] = useState(false);

  const tabItems = [
    { id: "system-config", label: "시스템 설정" },
    { id: "endpoints", label: "엔드포인트 설정" },
  ];

  return (
    <CcpDashboardLayout
      breadcrumbs={[
        { label: "설정/권한" },
        { label: "시스템 설정" },
      ]}
      title="시스템 설정"
      sideMenuItems={sideMenuItems}
    >
      <ContentSection spacing="sm">
        <Tabs
          items={tabItems}
          activeId={activeTab}
          onTabChange={setActiveTab}
        />
      </ContentSection>

      <ContentSection spacing="md">
        <div className="space-y-5">
          {activeTab === "endpoints" && (
            <EndpointManagementTab
              onAddCluster={() => setClusterModalOpen(true)}
              onAddComponent={() => setComponentModalOpen(true)}
            />
          )}
          {activeTab === "system-config" && <SystemSettingsTab />}
        </div>
      </ContentSection>

      {/* 모달 */}
      <ClusterAddModal open={clusterModalOpen} onClose={() => setClusterModalOpen(false)} />
      <ComponentAddModal open={componentModalOpen} onClose={() => setComponentModalOpen(false)} />
    </CcpDashboardLayout>
  );
}
