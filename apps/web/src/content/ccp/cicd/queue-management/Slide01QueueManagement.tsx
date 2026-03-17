import { useState } from "react";
import {
  MoreHorizontal,
  Plus,
  Cpu,
  HardDrive,
  Box,
  Settings2,
  X,
  ChevronRight,
} from "lucide-react";
import {
  Badge,
  Button,
  CcpDashboardLayout,
  ContentSection,
  TextInput,
  Select,
  createSideMenuItems,
} from "../../_components";
import type { SlideMeta } from "@entities/document";

export const slideMeta: SlideMeta = {
  screenId: "CCP-QUE-001",
  title: "파이프라인 큐",
  section: "CI/CD",
  annotations: [
    {
      id: 1,
      label: "리소스 현황 요약",
      description:
        "관리 클러스터(Common)의 CI/CD 리소스 현황을 표시합니다.\n• CPU, 메모리, Pod 수의 총 할당량(nominalQuota)과 현재 사용량을 보여줍니다.\n• 사용률이 80% 이상이면 Warning, 90% 이상이면 Critical 상태로 표시됩니다.",
    },
    {
      id: 2,
      label: "ClusterQueue 목록",
      description:
        "클러스터 수준의 리소스 큐 목록입니다.\n• 각 ClusterQueue의 이름, 전략(BestEffortFIFO/StrictFIFO), 할당된 ResourceFlavor, CPU/메모리/Pod 쿼터, 대기 중인 워크로드 수를 표시합니다.\n• 행 클릭 시 해당 ClusterQueue의 상세 화면으로 이동합니다.",
    },
    {
      id: 3,
      label: "LocalQueue 목록",
      description:
        "네임스페이스별 로컬 큐 목록입니다.\n• 각 LocalQueue가 연결된 ClusterQueue, 네임스페이스, 대기/실행 중인 워크로드 수를 표시합니다.\n• PipelineRun 실행 시 `kueue.x-k8s.io/queue-name` 라벨로 연동됩니다.",
    },
    {
      id: 4,
      label: "ResourceFlavor 목록",
      description:
        "노드 그룹 추상화 리소스입니다.\n• nodeSelector, toleration 등 노드 선택 조건을 정의하며 ClusterQueue에서 참조합니다.\n• 각 Flavor의 이름, nodeSelector 라벨, 연결된 ClusterQueue 수를 표시합니다.",
    },
    {
      id: 5,
      label: "ClusterQueue 추가 버튼",
      description:
        "새 ClusterQueue를 생성하는 모달을 엽니다. 큐 이름, 전략, ResourceFlavor 선택, CPU/메모리/Pod nominalQuota를 설정합니다.",
    },
    {
      id: 6,
      label: "LocalQueue 추가 버튼",
      description:
        "새 LocalQueue를 생성하는 모달을 엽니다. 큐 이름, 대상 네임스페이스, 연결할 ClusterQueue를 선택합니다.",
    },
    {
      id: 7,
      label: "ClusterQueue 생성 모달",
      description:
        "ClusterQueue 생성 폼입니다.\n• 이름, 큐잉 전략(BestEffortFIFO/StrictFIFO), ResourceFlavor 선택\n• CPU(cores), Memory(Gi), Pod 수의 nominalQuota 입력\n• namespaceSelector 라벨(`kueue.x-k8s.io/enabled: true`) 자동 포함\n• API: `POST /apis/kueue.x-k8s.io/v1beta1/clusterqueues`",
    },
  ],
};

// ─── Data ────────────────────────────────────────────────────────────────────

interface ClusterQueueItem {
  name: string;
  strategy: "BestEffortFIFO" | "StrictFIFO";
  flavor: string;
  cpu: string;
  memory: string;
  pods: number;
  pendingWorkloads: number;
  activeWorkloads: number;
}

const clusterQueues: ClusterQueueItem[] = [
  {
    name: "tekton-worker-cq",
    strategy: "BestEffortFIFO",
    flavor: "tekton-worker-rf",
    cpu: "6",
    memory: "11Gi",
    pods: 5,
    pendingWorkloads: 2,
    activeWorkloads: 3,
  },
  {
    name: "batch-processing-cq",
    strategy: "StrictFIFO",
    flavor: "gpu-worker-rf",
    cpu: "16",
    memory: "32Gi",
    pods: 10,
    pendingWorkloads: 0,
    activeWorkloads: 5,
  },
  {
    name: "default-cq",
    strategy: "BestEffortFIFO",
    flavor: "default-rf",
    cpu: "8",
    memory: "16Gi",
    pods: 20,
    pendingWorkloads: 0,
    activeWorkloads: 2,
  },
];

interface LocalQueueItem {
  name: string;
  namespace: string;
  clusterQueue: string;
  pendingWorkloads: number;
  activeWorkloads: number;
}

const localQueues: LocalQueueItem[] = [
  { name: "tekton-worker-lq", namespace: "sample-cicd", clusterQueue: "tekton-worker-cq", pendingWorkloads: 1, activeWorkloads: 2 },
  { name: "tekton-worker-lq", namespace: "production", clusterQueue: "tekton-worker-cq", pendingWorkloads: 1, activeWorkloads: 1 },
  { name: "batch-lq", namespace: "data-team", clusterQueue: "batch-processing-cq", pendingWorkloads: 0, activeWorkloads: 3 },
  { name: "default-lq", namespace: "dev-team", clusterQueue: "default-cq", pendingWorkloads: 0, activeWorkloads: 1 },
  { name: "default-lq", namespace: "staging", clusterQueue: "default-cq", pendingWorkloads: 0, activeWorkloads: 1 },
];

interface ResourceFlavorItem {
  name: string;
  nodeSelector: string;
  clusterQueues: number;
}

const resourceFlavors: ResourceFlavorItem[] = [
  { name: "tekton-worker-rf", nodeSelector: "node-role: tekton-worker", clusterQueues: 1 },
  { name: "gpu-worker-rf", nodeSelector: "node-role: gpu-worker", clusterQueues: 1 },
  { name: "default-rf", nodeSelector: "—", clusterQueues: 1 },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function UsageBar({ used, total, unit }: { used: number; total: number; unit: string }) {
  const pct = total > 0 ? (used / total) * 100 : 0;
  const color = pct >= 90 ? "bg-[#da1e28]" : pct >= 80 ? "bg-[#ff6b00]" : "bg-[#0077ff]";
  return (
    <div className="flex-1">
      <div className="flex items-end justify-between mb-1">
        <span className="text-[22px] font-bold text-[#111]">
          {used}<span className="text-[13px] font-normal text-[#999] ml-0.5">/ {total} {unit}</span>
        </span>
        <span className={`text-[12px] font-medium ${pct >= 90 ? "text-[#da1e28]" : pct >= 80 ? "text-[#ff6b00]" : "text-[#555]"}`}>
          {pct.toFixed(0)}%
        </span>
      </div>
      <div className="h-1.5 bg-[#f0f0f0] rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function FormRow({ label, children, description }: { label: string; children: React.ReactNode; description?: string }) {
  return (
    <div className="flex items-start py-3 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-[#f0f0f0]">
      <div className="w-[160px] flex-shrink-0 pt-1">
        <span className="text-[13px] font-medium text-[#333]">{label}</span>
        {description && <p className="text-[11px] text-[#999] mt-0.5">{description}</p>}
      </div>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

function Modal({ open, onClose, title, children, width = "520px" }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; width?: string }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-[#e0e0e0]" style={{ width }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e0e0e0]">
          <h2 className="text-[15px] font-bold text-[#333]">{title}</h2>
          <button type="button" onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#f0f0f0] text-[#888] cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

// ─── ClusterQueue 생성 모달 ──────────────────────────────────────────────────

function ClusterQueueCreateModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="ClusterQueue 생성" width="560px">
      <div className="space-y-4">
        <FormRow label="큐 이름">
          <TextInput placeholder="예: tekton-worker-cq" className="w-full" />
        </FormRow>
        <FormRow label="큐잉 전략">
          <Select
            label="BestEffortFIFO"
            value="best-effort"
            options={[
              { value: "best-effort", label: "BestEffortFIFO" },
              { value: "strict", label: "StrictFIFO" },
            ]}
            minWidth="200px"
          />
        </FormRow>
        <FormRow label="ResourceFlavor">
          <Select
            label="tekton-worker-rf"
            value="tekton-worker-rf"
            options={resourceFlavors.map((rf) => ({ value: rf.name, label: rf.name }))}
            minWidth="200px"
          />
        </FormRow>

        <div className="border-t border-[#f0f0f0] pt-3 mt-3">
          <span className="text-[13px] font-semibold text-[#333]">리소스 쿼터 (nominalQuota)</span>
        </div>
        <FormRow label="CPU" description="코어 수">
          <TextInput placeholder="6" className="w-[120px]" />
          <span className="text-[12px] text-[#999] ml-2">cores</span>
        </FormRow>
        <FormRow label="Memory" description="메모리 용량">
          <TextInput placeholder="11" className="w-[120px]" />
          <span className="text-[12px] text-[#999] ml-2">Gi</span>
        </FormRow>
        <FormRow label="Pods" description="최대 Pod 수">
          <TextInput placeholder="5" className="w-[120px]" />
          <span className="text-[12px] text-[#999] ml-2">개</span>
        </FormRow>

        <div className="bg-[#f6f8fa] rounded border border-[#e8e8e8] px-4 py-3 mt-2">
          <div className="flex items-center gap-1.5 text-[12px] text-[#555]">
            <Settings2 className="w-3.5 h-3.5" />
            <span className="font-medium">namespaceSelector</span>
          </div>
          <div className="mt-1.5 font-mono text-[11px] text-[#666]">
            matchLabels:<br />
            &nbsp;&nbsp;kueue.x-k8s.io/enabled: "true"
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-[#f0f0f0]">
        <Button size="md" variant="ghost" onClick={onClose}>취소</Button>
        <Button size="md" variant="primary">생성</Button>
      </div>
    </Modal>
  );
}

// ─── Slide ───────────────────────────────────────────────────────────────────

export default function Slide01QueueManagement() {
  const [cqModalOpen, setCqModalOpen] = useState(false);

  const totalCpu = clusterQueues.reduce((sum, cq) => sum + parseInt(cq.cpu), 0);
  const usedCpu = 18;
  const totalMem = 59;
  const usedMem = 34;
  const totalPods = clusterQueues.reduce((sum, cq) => sum + cq.pods, 0);
  const usedPods = clusterQueues.reduce((sum, cq) => sum + cq.activeWorkloads, 0);

  return (
    <CcpDashboardLayout
      breadcrumbs={[
        { label: "CI/CD" },
        { label: "파이프라인" },
        { label: "파이프라인 큐", isBold: true },
      ]}
      title="파이프라인 큐"
      sideMenuItems={createSideMenuItems({ activeId: "cicd", activeLabel: "파이프라인 큐" })}
    >
      {/* ── 리소스 현황 요약 ─────────────────────────────────────────── */}
      <ContentSection>
        <div data-annotation-id="1" className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-4 p-5 border border-[#e8e8e8] rounded-lg bg-white">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#eef4ff]">
              <Cpu className="w-5 h-5 text-[#0077ff]" />
            </div>
            <UsageBar used={usedCpu} total={totalCpu} unit="cores" />
          </div>
          <div className="flex items-center gap-4 p-5 border border-[#e8e8e8] rounded-lg bg-white">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#eef9ee]">
              <HardDrive className="w-5 h-5 text-[#00b30e]" />
            </div>
            <UsageBar used={usedMem} total={totalMem} unit="Gi" />
          </div>
          <div className="flex items-center gap-4 p-5 border border-[#e8e8e8] rounded-lg bg-white">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#fff4ec]">
              <Box className="w-5 h-5 text-[#ff6b00]" />
            </div>
            <UsageBar used={usedPods} total={totalPods} unit="pods" />
          </div>
        </div>
      </ContentSection>

      {/* ── ClusterQueue 목록 ────────────────────────────────────────── */}
      <ContentSection>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-[14px] font-bold text-[#333]">ClusterQueue</h3>
            <Badge variant="neutral" size="sm">{clusterQueues.length}</Badge>
          </div>
          <Button data-annotation-id="5" size="sm" variant="primary" onClick={() => setCqModalOpen(true)}>
            <Plus className="w-3.5 h-3.5 mr-1" />
            ClusterQueue 추가
          </Button>
        </div>
        <div data-annotation-id="2" className="bg-white border border-[#e0e0e0] rounded overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#e0e0e0] bg-[#fafafa] text-[12px] font-semibold text-[#555]">
                <th className="px-4 py-2.5">이름</th>
                <th className="px-4 py-2.5 w-[130px]">전략</th>
                <th className="px-4 py-2.5 w-[140px]">ResourceFlavor</th>
                <th className="px-4 py-2.5 w-[80px] text-right">CPU</th>
                <th className="px-4 py-2.5 w-[80px] text-right">Memory</th>
                <th className="px-4 py-2.5 w-[60px] text-right">Pods</th>
                <th className="px-4 py-2.5 w-[70px] text-center">대기</th>
                <th className="px-4 py-2.5 w-[70px] text-center">실행</th>
                <th className="px-4 py-2.5 w-[44px]" />
              </tr>
            </thead>
            <tbody>
              {clusterQueues.map((cq, i) => (
                <tr key={cq.name} className={`${i < clusterQueues.length - 1 ? "border-b border-[#f0f0f0]" : ""} hover:bg-[#f9fafb]`}>
                  <td className="px-4 py-2.5">
                    <span className="text-[13px] text-[#0077ff] font-medium cursor-pointer hover:underline">{cq.name}</span>
                  </td>
                  <td className="px-4 py-2.5">
                    <Badge variant="neutral" size="sm">{cq.strategy}</Badge>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="text-[12px] text-[#555] font-mono">{cq.flavor}</span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <span className="text-[13px] text-[#333] font-mono">{cq.cpu}</span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <span className="text-[13px] text-[#333] font-mono">{cq.memory}</span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <span className="text-[13px] text-[#333] font-mono">{cq.pods}</span>
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    {cq.pendingWorkloads > 0 ? (
                      <Badge variant="warning" size="sm">{cq.pendingWorkloads}</Badge>
                    ) : (
                      <span className="text-[12px] text-[#bbb]">0</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <span className="text-[13px] text-[#333]">{cq.activeWorkloads}</span>
                  </td>
                  <td className="px-4 py-2.5">
                    <button type="button" className="p-1 text-[#888] hover:bg-[#eee] rounded">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ContentSection>

      {/* ── LocalQueue 목록 ──────────────────────────────────────────── */}
      <ContentSection>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-[14px] font-bold text-[#333]">LocalQueue</h3>
            <Badge variant="neutral" size="sm">{localQueues.length}</Badge>
          </div>
          <Button data-annotation-id="6" size="sm" variant="primary">
            <Plus className="w-3.5 h-3.5 mr-1" />
            LocalQueue 추가
          </Button>
        </div>
        <div data-annotation-id="3" className="bg-white border border-[#e0e0e0] rounded overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#e0e0e0] bg-[#fafafa] text-[12px] font-semibold text-[#555]">
                <th className="px-4 py-2.5">이름</th>
                <th className="px-4 py-2.5 w-[150px]">네임스페이스</th>
                <th className="px-4 py-2.5 w-[180px]">ClusterQueue</th>
                <th className="px-4 py-2.5 w-[70px] text-center">대기</th>
                <th className="px-4 py-2.5 w-[70px] text-center">실행</th>
                <th className="px-4 py-2.5 w-[44px]" />
              </tr>
            </thead>
            <tbody>
              {localQueues.map((lq, i) => (
                <tr key={`${lq.name}-${lq.namespace}`} className={`${i < localQueues.length - 1 ? "border-b border-[#f0f0f0]" : ""} hover:bg-[#f9fafb]`}>
                  <td className="px-4 py-2.5">
                    <span className="text-[13px] text-[#0077ff] font-medium cursor-pointer hover:underline">{lq.name}</span>
                  </td>
                  <td className="px-4 py-2.5">
                    <Badge variant="info" size="sm">{lq.namespace}</Badge>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="text-[12px] text-[#555] flex items-center gap-1">
                      <ChevronRight className="w-3 h-3 text-[#bbb]" />
                      {lq.clusterQueue}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    {lq.pendingWorkloads > 0 ? (
                      <Badge variant="warning" size="sm">{lq.pendingWorkloads}</Badge>
                    ) : (
                      <span className="text-[12px] text-[#bbb]">0</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <span className="text-[13px] text-[#333]">{lq.activeWorkloads}</span>
                  </td>
                  <td className="px-4 py-2.5">
                    <button type="button" className="p-1 text-[#888] hover:bg-[#eee] rounded">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ContentSection>

      {/* ── ResourceFlavor 목록 ──────────────────────────────────────── */}
      <ContentSection>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-[14px] font-bold text-[#333]">ResourceFlavor</h3>
            <Badge variant="neutral" size="sm">{resourceFlavors.length}</Badge>
          </div>
          <Button size="sm" variant="primary">
            <Plus className="w-3.5 h-3.5 mr-1" />
            ResourceFlavor 추가
          </Button>
        </div>
        <div data-annotation-id="4" className="bg-white border border-[#e0e0e0] rounded overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#e0e0e0] bg-[#fafafa] text-[12px] font-semibold text-[#555]">
                <th className="px-4 py-2.5">이름</th>
                <th className="px-4 py-2.5">nodeSelector</th>
                <th className="px-4 py-2.5 w-[130px] text-center">연결된 ClusterQueue</th>
                <th className="px-4 py-2.5 w-[44px]" />
              </tr>
            </thead>
            <tbody>
              {resourceFlavors.map((rf, i) => (
                <tr key={rf.name} className={`${i < resourceFlavors.length - 1 ? "border-b border-[#f0f0f0]" : ""} hover:bg-[#f9fafb]`}>
                  <td className="px-4 py-2.5">
                    <span className="text-[13px] text-[#0077ff] font-medium cursor-pointer hover:underline">{rf.name}</span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="text-[12px] text-[#555] font-mono">{rf.nodeSelector}</span>
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <span className="text-[13px] text-[#333]">{rf.clusterQueues}</span>
                  </td>
                  <td className="px-4 py-2.5">
                    <button type="button" className="p-1 text-[#888] hover:bg-[#eee] rounded">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ContentSection>

      {/* 모달 */}
      <div data-annotation-id="7">
        <ClusterQueueCreateModal open={cqModalOpen} onClose={() => setCqModalOpen(false)} />
      </div>
    </CcpDashboardLayout>
  );
}
