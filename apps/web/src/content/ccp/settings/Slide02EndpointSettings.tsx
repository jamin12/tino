import { useState, type ReactNode } from "react";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Server,
  GitBranch,
  Box,
  Anchor,
  Workflow,
  X,
} from "lucide-react";
import {
  CcpDashboardLayout,
  ContentSection,
  Button,
  Badge,
  TextInput,
  Select,
  SidebarDashboardIcon,
  SidebarNamespaceIcon,
  SidebarApplicationIcon,
  SidebarCicdIcon,
  SidebarSettingsIcon,
  SidebarGitopsIcon,
  SidebarTenantIcon,
  SidebarConnectionIcon,
  SidebarServiceMeshIcon,
  createSideMenuItems,
} from "../_components";
import type { SlideMeta } from "@entities/document";

export const slideMeta: SlideMeta = {
  screenId: "CCP-SET-002",
  title: "엔드포인트 설정",
  section: "설정",
  annotations: [
    {
      id: 1,
      label: "클러스터 섹션",
      description:
        "등록된 쿠버네티스 클러스터 목록과 연결 상태를 표시합니다. 연결된 클러스터 수와 전체 클러스터 수를 요약합니다.",
    },
    {
      id: 2,
      label: "클러스터 엔드포인트 카드",
      description:
        "각 클러스터의 이름, API Server URL, 인증 방식, 연결 상태를 카드 형태로 표시합니다. in-cluster 뱃지가 표시되면 플랫폼이 해당 클러스터 내부에서 실행 중임을 의미합니다.",
    },
    {
      id: 3,
      label: "클러스터 연결 테스트 버튼",
      description:
        "등록된 모든 클러스터의 API Server 연결 상태를 일괄 확인합니다.",
    },
    {
      id: 4,
      label: "클러스터 추가 버튼",
      description:
        "새 쿠버네티스 클러스터를 등록하기 위한 모달을 엽니다. 클러스터 이름, 유형, API Server URL, 인증 정보를 입력합니다.",
    },
    {
      id: 5,
      label: "컴포넌트 섹션",
      description:
        "CI/CD, GitOps, 레지스트리, 모니터링 등 DevOps 도구의 연결 상태를 관리합니다. 연결됨/전체 수를 요약합니다.",
    },
    {
      id: 6,
      label: "컴포넌트 엔드포인트 카드",
      description:
        "각 DevOps 컴포넌트(Gitea, ArgoCD, Nexus 등)의 이름, URL, 인증 방식, 연결 상태를 표시합니다. 유형별 아이콘으로 구분됩니다.",
    },
    {
      id: 7,
      label: "전체 연결 테스트 버튼",
      description:
        "등록된 모든 컴포넌트의 연결 상태를 일괄 확인합니다. 연결 해제 또는 오류 상태인 컴포넌트를 식별하는 데 사용합니다.",
    },
    {
      id: 8,
      label: "컴포넌트 추가 버튼",
      description:
        "새 DevOps 컴포넌트를 등록하기 위한 모달을 엽니다. 컴포넌트 유형, URL, 인증 정보를 입력합니다.",
    },
    {
      id: 9,
      label: "클러스터 추가 모달",
      description:
        "클러스터 이름, 유형(Kubernetes/OpenShift), API Server URL, 인증 방식(Certificate/Token), 인증서 정보를 입력하여 새 클러스터를 등록합니다. KubeConfig 파일 가져오기와 연결 테스트 기능을 제공합니다.",
    },
    {
      id: 10,
      label: "컴포넌트 추가 모달",
      description:
        "컴포넌트 유형을 선택하고 이름, URL, 인증 방식(Token/Basic Auth/OAuth2), 인증 정보를 입력하여 새 DevOps 컴포넌트를 등록합니다. 연결 테스트로 사전 검증할 수 있습니다.",
    },
  ],
};

// ─── Endpoint 타입별 아이콘 ──────────────────────────────────────────────────

const endpointTypeIcon: Record<string, React.ReactNode> = {
  "API Server": <Server className="w-4 h-4 text-[#4A90D9]" />,
  Gitea: <GitBranch className="w-4 h-4 text-[#609926]" />,
  ArgoCD: <Workflow className="w-4 h-4 text-[#ef4444]" />,
  Tekton: <Anchor className="w-4 h-4 text-[#fd495c]" />,
  Harbor: <Box className="w-4 h-4 text-[#60b932]" />,
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

// ─── Endpoint Card ──────────────────────────────────────────────────────────

function EndpointCard({
  ep,
  showDelete,
}: {
  ep: { id: string; name: string; type: string; url: string; status: "connected" | "disconnected" | "error"; auth: string; desc: string; inCluster?: boolean };
  showDelete?: boolean;
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
      {showDelete && !ep.inCluster && (
        <button type="button" className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded hover:bg-[#fee] text-[#ccc] hover:text-[#da1e28] transition-colors cursor-pointer">
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
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
        <FormRow label="설명">
          <TextInput placeholder="클러스터에 대한 간단한 설명" className="w-full" />
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
            ]}
            minWidth="200px"
          />
        </FormRow>
        <FormRow label="Certificate">
          <textarea
            className="w-full h-[80px] px-2 py-1.5 text-[13px] font-mono text-[#333] bg-white rounded-sm border border-[#ddd] outline-none resize-none placeholder:text-[#999]"
            placeholder="-----BEGIN CERTIFICATE-----"
          />
        </FormRow>
        <FormRow label="Key">
          <textarea
            className="w-full h-[80px] px-2 py-1.5 text-[13px] font-mono text-[#333] bg-white rounded-sm border border-[#ddd] outline-none resize-none placeholder:text-[#999]"
            placeholder="-----BEGIN RSA PRIVATE KEY-----"
          />
        </FormRow>
      </div>
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#f0f0f0]">
        <Button size="md" variant="ghost">KubeConfig 가져오기</Button>
        <div className="flex gap-2">
          <Button size="md" variant="ghost" onClick={onClose}>취소</Button>
          <Button size="md" variant="ghost">연결 테스트</Button>
          <Button size="md" variant="primary">추가</Button>
        </div>
      </div>
    </Modal>
  );
}

// ─── 컴포넌트 추가 모달 ──────────────────────────────────────────────────────

function ComponentAddModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="시스템 컴포넌트 추가" width="520px">
      <div className="space-y-4">
        <FormRow label="컴포넌트 유형">
          <Select
            label="선택하세요"
            value=""
            options={[
              { value: "Gitea", label: "Gitea" },
              { value: "ArgoCD", label: "ArgoCD" },
              { value: "Tekton", label: "Tekton" },
              { value: "Harbor", label: "Harbor" },
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
      <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-[#f0f0f0]">
        <Button size="md" variant="ghost" onClick={onClose}>취소</Button>
        <Button size="md" variant="ghost">연결 테스트</Button>
        <Button size="md" variant="primary">추가</Button>
      </div>
    </Modal>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Slide02EndpointSettings() {
  const [clusterModalOpen, setClusterModalOpen] = useState(false);
  const [componentModalOpen, setComponentModalOpen] = useState(false);

  const clusterEndpoints = [
    { id: "cl-001", name: "K8s API Server (Production)", type: "API Server", url: "https://k8s-api.prod.example.com:6443", status: "connected" as const, auth: "Certificate", desc: "운영 클러스터 API 서버", inCluster: true },
    { id: "cl-002", name: "K8s API Server (Staging)", type: "API Server", url: "https://k8s-api.stg.example.com:6443", status: "connected" as const, auth: "Certificate", desc: "스테이징 클러스터 API 서버" },
    { id: "cl-003", name: "OpenShift (Dev)", type: "API Server", url: "https://api.ocp-dev.example.com:6443", status: "connected" as const, auth: "Token", desc: "개발 OpenShift 클러스터" },
  ];

  const devopsEndpoints = [
    { id: "ep-001", name: "Gitea", type: "Gitea", url: "http://gitea-http.gitea.svc.cluster.local:3000", status: "connected" as const, auth: "OAuth2", desc: "Git 소스코드 저장소" },
    { id: "ep-002", name: "ArgoCD", type: "ArgoCD", url: "http://argocd-server.argocd.svc.cluster.local:8080", status: "connected" as const, auth: "Token", desc: "GitOps 지속적 배포 엔진" },
    { id: "ep-003", name: "Tekton", type: "Tekton", url: "http://tekton-dashboard.tekton-pipelines.svc.cluster.local:9097", status: "connected" as const, auth: "Token", desc: "클라우드 네이티브 CI/CD 파이프라인" },
    { id: "ep-004", name: "Harbor Registry", type: "Harbor", url: "https://harbor.example.com", status: "connected" as const, auth: "Token", desc: "컨테이너 이미지 레지스트리" },
  ];

  const clusterConnected = clusterEndpoints.filter((e) => e.status === "connected").length;
  const devopsConnected = devopsEndpoints.filter((e) => e.status === "connected").length;

  return (
    <CcpDashboardLayout
      breadcrumbs={[
        { label: "설정" },
        { label: "엔드포인트 설정" },
      ]}
      title="엔드포인트 설정"
      sideMenuItems={createSideMenuItems({ activeId: "settings", activeLabel: "엔드포인트 설정" })}
    >
      <ContentSection spacing="md">
        <div className="space-y-5">
          {/* ── 클러스터 ──────────────────────────────────────────────────── */}
          <div data-annotation-id="1" className="bg-white rounded-lg border border-[#e0e0e0] p-5">
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
            <div data-annotation-id="2" className="space-y-3">
              {clusterEndpoints.map((ep) => (
                <EndpointCard key={ep.id} ep={ep} showDelete />
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button data-annotation-id="3" size="sm" variant="ghost">연결 테스트</Button>
              <Button data-annotation-id="4" size="sm" variant="primary" onClick={() => setClusterModalOpen(true)}>클러스터 추가</Button>
            </div>
          </div>

          {/* ── 컴포넌트 ──────────────────────────────────────────────────── */}
          <div data-annotation-id="5" className="bg-white rounded-lg border border-[#e0e0e0] p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-[15px] font-bold text-[#333]">시스템 컴포넌트</h3>
                <p className="text-[12px] text-[#999] mt-1">CI/CD, GitOps, 레지스트리 등 DevOps 도구 연결</p>
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
            <div data-annotation-id="6" className="space-y-3">
              {devopsEndpoints.map((ep) => (
                <EndpointCard key={ep.id} ep={ep} />
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button data-annotation-id="7" size="sm" variant="ghost">전체 연결 테스트</Button>
              <Button data-annotation-id="8" size="sm" variant="primary" onClick={() => setComponentModalOpen(true)}>컴포넌트 추가</Button>
            </div>
          </div>
        </div>
      </ContentSection>

      {/* 모달 */}
      <div data-annotation-id="9"><ClusterAddModal open={clusterModalOpen} onClose={() => setClusterModalOpen(false)} /></div>
      <div data-annotation-id="10"><ComponentAddModal open={componentModalOpen} onClose={() => setComponentModalOpen(false)} /></div>
    </CcpDashboardLayout>
  );
}
