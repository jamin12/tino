import { Calendar, Download, Image } from "lucide-react";
import {
  Badge,
  Button,
  CcpDashboardLayout,
  ContentSection,
  DataTable,
  Pagination,
  Select,
  StatusDot,
  TextCell,
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
} from "../../_components";
import type { DataTableColumn } from "../../_components";
import type { SlideMeta } from "@entities/document";

export const slideMeta: SlideMeta = {
  screenId: "CCP-PLS-001",
  title: "파이프라인 통계 목록",
  section: "CI/CD 파이프라인 통계",
  links: [
    {
      targetScreenId: "CCP-PLS-002",
      type: "navigate",
      label: "테이블 행 클릭 → PipelineRun 상세",
    },
  ],
  annotations: [
    {
      id: 1,
      label: "조회 필터",
      description:
        "파이프라인 실행 통계의 검색 조건을 설정합니다. 조회 기준은 Tekton Results Summary API의 Group By pipeline 기준으로 조회됩니다.\n• 조회 시작일시: 검색 범위의 시작 시각입니다. 기본값은 현재 시각 기준 1개월 전이며, 최대 선택 가능 시각은 조회 종료일시입니다.\n• 조회 종료일시: 검색 범위의 종료 시각입니다. 기본값은 현재 시각이며, 최소 선택 가능 시각은 조회 시작일시입니다.\n• PNG: 차트 영역을 PNG 이미지로 다운로드합니다.",
    },
    {
      id: 2,
      label: "실행 요약 차트",
      description:
        "조회 조건에 해당하는 PipelineRun 실행 결과를 도넛 차트로 요약합니다. 상태별 색상 구분:\n• Succeeded(초록): Reason=succeeded, Condition.status=true\n• Failed(빨강): Reason=failed, Condition.status=false\n• Cancelled(주황): Reason=cancelled, Condition.status=false\n• Running(파랑): Reason=running, Condition.status=unknown\n• Others(회색): Skipped, Timeout, Pending 등 기타 상태\n```\nGET /apis/results.tekton.dev/v1alpha2/parents/-/results/-/records/summary\n  ?filter=data_type == \"tekton.dev/v1.PipelineRun\"\n    && timestamp(data.status.startTime) >= timestamp(\"{startTime}\")\n    && timestamp(data.status.startTime) <= timestamp(\"{endTime}\")\n  &summary=running,cancelled,succeeded,failed,others,total,\n    min_duration,max_duration,avg_duration,total_duration,last_runtime\n  &group_by=pipeline\n```",
    },
    {
      id: 3,
      label: "실행 시간 통계",
      description:
        "조회 범위 내 파이프라인 실행 시간을 집계합니다.\n• Avg: 평균 수행 시간\n• Min: 최소 수행 시간\n• Max: 최대 수행 시간\n• Total: 총 수행 시간\n• Last Runtime: 가장 최근 실행 완료 시각",
    },
    {
      id: 4,
      label: "실행 결과 테이블",
      description:
        "조회 조건에 해당하는 개별 PipelineRun/TaskRun 실행 결과를 목록으로 표시합니다. 실행이름, 실행일시(startTime), 완료일시(completionTime), 메시지(conditions[0].message), 상태(Succeeded/Failed 등), 실행결과(소요 시간) 컬럼으로 구성됩니다.\n```\nGET /apis/results.tekton.dev/v1alpha2/parents/-/results/-/records\n  ?filter=data.status.startTime >= \"{startTime}\"\n    && data.status.startTime <= \"{endTime}\"\n    && data_type == \"tekton.dev/v1.PipelineRun\"\n  &order_by=create_time desc\n  &page_size={pageSize}\n```",
    },
    {
      id: 5,
      label: "XLSX 내보내기",
      description:
        "현재 조회된 파이프라인 실행 결과를 XLSX 파일로 내보냅니다.",
    },
  ],
};

// ─── Daily Bar Chart ────────────────────────────────────────────────────────

interface DailyData {
  date: string;
  succeeded: number;
  failed: number;
  cancelled: number;
}

const dailyData: DailyData[] = [
  { date: "07/07", succeeded: 5, failed: 2, cancelled: 0 },
  { date: "07/08", succeeded: 3, failed: 1, cancelled: 0 },
  { date: "07/09", succeeded: 7, failed: 0, cancelled: 1 },
  { date: "07/10", succeeded: 4, failed: 3, cancelled: 0 },
  { date: "07/11", succeeded: 6, failed: 1, cancelled: 0 },
  { date: "07/12", succeeded: 2, failed: 0, cancelled: 0 },
  { date: "07/13", succeeded: 0, failed: 0, cancelled: 0 },
  { date: "07/14", succeeded: 8, failed: 2, cancelled: 0 },
  { date: "07/15", succeeded: 5, failed: 4, cancelled: 0 },
  { date: "07/16", succeeded: 6, failed: 1, cancelled: 1 },
  { date: "07/17", succeeded: 9, failed: 3, cancelled: 0 },
  { date: "07/18", succeeded: 7, failed: 2, cancelled: 0 },
  { date: "07/19", succeeded: 4, failed: 1, cancelled: 0 },
  { date: "07/20", succeeded: 3, failed: 0, cancelled: 0 },
  { date: "07/21", succeeded: 5, failed: 2, cancelled: 0 },
  { date: "07/22", succeeded: 6, failed: 1, cancelled: 0 },
  { date: "07/23", succeeded: 2, failed: 3, cancelled: 0 },
  { date: "07/24", succeeded: 4, failed: 1, cancelled: 0 },
  { date: "07/25", succeeded: 7, failed: 2, cancelled: 0 },
  { date: "07/26", succeeded: 1, failed: 0, cancelled: 0 },
  { date: "07/27", succeeded: 0, failed: 0, cancelled: 0 },
  { date: "07/28", succeeded: 3, failed: 1, cancelled: 0 },
  { date: "07/29", succeeded: 5, failed: 2, cancelled: 0 },
  { date: "07/30", succeeded: 6, failed: 1, cancelled: 0 },
  { date: "07/31", succeeded: 4, failed: 0, cancelled: 0 },
  { date: "08/01", succeeded: 8, failed: 3, cancelled: 0 },
  { date: "08/02", succeeded: 5, failed: 1, cancelled: 0 },
  { date: "08/03", succeeded: 2, failed: 0, cancelled: 0 },
  { date: "08/04", succeeded: 6, failed: 2, cancelled: 0 },
  { date: "08/05", succeeded: 4, failed: 1, cancelled: 0 },
  { date: "08/06", succeeded: 3, failed: 1, cancelled: 0 },
];

const barColors = {
  succeeded: "#00b30f",
  failed: "#da1e28",
  cancelled: "#f97316",
};

function DailyBarChart({ data }: { data: DailyData[] }) {
  const maxVal = Math.max(...data.map((d) => d.succeeded + d.failed + d.cancelled), 1);
  const chartH = 120;
  const barW = 14;
  const gap = 4;
  const totalW = data.length * (barW + gap);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-end overflow-x-auto" style={{ height: chartH }}>
        {data.map((d) => {
          const total = d.succeeded + d.failed + d.cancelled;
          const sH = (d.succeeded / maxVal) * chartH;
          const fH = (d.failed / maxVal) * chartH;
          const cH = (d.cancelled / maxVal) * chartH;
          return (
            <div key={d.date} className="flex flex-col items-center" style={{ width: barW + gap }}>
              <div className="flex flex-col-reverse" style={{ height: chartH }}>
                {d.succeeded > 0 && (
                  <div style={{ height: sH, width: barW, backgroundColor: barColors.succeeded }} className="rounded-t-sm" />
                )}
                {d.failed > 0 && (
                  <div style={{ height: fH, width: barW, backgroundColor: barColors.failed }} />
                )}
                {d.cancelled > 0 && (
                  <div style={{ height: cH, width: barW, backgroundColor: barColors.cancelled }} />
                )}
              </div>
            </div>
          );
        })}
      </div>
      {/* X axis labels - show every 5th */}
      <div className="flex">
        {data.map((d, i) => (
          <div key={d.date} className="text-center" style={{ width: barW + gap }}>
            {i % 5 === 0 && (
              <span className="text-[9px] text-[#999]">{d.date}</span>
            )}
          </div>
        ))}
      </div>
      {/* Legend */}
      <div className="flex gap-4 mt-1">
        {(["succeeded", "failed", "cancelled"] as const).map((key) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: barColors[key] }} />
            <span className="text-[11px] text-[#555] capitalize">{key}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Bar Stat ───────────────────────────────────────────────────────────────

function BarStat({
  label,
  value,
  ratio,
}: {
  label: string;
  value: string;
  ratio: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[12px] text-[#555] w-[36px] font-medium">
        {label}
      </span>
      <div className="flex-1 h-[14px] bg-[#f0f0f0] rounded overflow-hidden">
        <div
          className="h-full bg-[#5b9bd5] rounded"
          style={{ width: `${Math.min(ratio * 100, 100)}%` }}
        />
      </div>
      <span className="text-[12px] text-[#333] w-[70px] text-right font-mono">
        {value}
      </span>
    </div>
  );
}

// ─── Summary Data ───────────────────────────────────────────────────────────

// ─── Table Data ─────────────────────────────────────────────────────────────

interface PipelineRunRow {
  id: string;
  name: string;
  startedAt: string;
  completedAt: string;
  message: string;
  status: "Succeeded" | "Failed" | "Cancelled" | "Running" | "Others";
  duration: string;
}

const tableData: PipelineRunRow[] = [
  {
    id: "1",
    name: "auth-service-dev-deploy-pr-nrr8f-cleanup-policy",
    startedAt: "2025-07-18 오후 08:26",
    completedAt: "2025-07-18 오후 08:27",
    message: "All Steps have completed executing",
    status: "Succeeded",
    duration: "약 0분 5초",
  },
  {
    id: "2",
    name: "auth-service-dev-deploy-pr-nrr8f-cicd-tagpush",
    startedAt: "2025-07-18 오후 08:26",
    completedAt: "2025-07-18 오후 08:26",
    message: "All Steps have completed executing",
    status: "Succeeded",
    duration: "약 0분 37초",
  },
  {
    id: "3",
    name: "auth-service-dev-deploy-pr-nrr8f-argocd-appsync",
    startedAt: "2025-07-18 오후 08:26",
    completedAt: "2025-07-18 오후 08:27",
    message: "All Steps have completed executing",
    status: "Succeeded",
    duration: "약 0분 37초",
  },
  {
    id: "4",
    name: "auth-service-dev-deploy-pr-nrr8f-argocd-appsetup",
    startedAt: "2025-07-18 오후 08:25",
    completedAt: "2025-07-18 오후 08:26",
    message: "All Steps have completed executing",
    status: "Succeeded",
    duration: "약 0분 25초",
  },
  {
    id: "5",
    name: "auth-service-dev-deploy-pr-nrr8f-cicd-fetch",
    startedAt: "2025-07-18 오후 08:25",
    completedAt: "2025-07-18 오후 08:25",
    message: "All Steps have completed executing",
    status: "Succeeded",
    duration: "약 0분 6초",
  },
  {
    id: "6",
    name: "auth-service-dev-build-pr-q9a5u-polaris-audit",
    startedAt: "2025-07-15 오후 03:10",
    completedAt: "2025-07-15 오후 03:20",
    message: "\"step-polaris-audit\" exited with code 1",
    status: "Failed",
    duration: "약 10분 27초",
  },
];

const statusBadgeMap: Record<
  PipelineRunRow["status"],
  { variant: string; dotColor: string }
> = {
  Succeeded: { variant: "green-label", dotColor: "success" },
  Failed: { variant: "red-label", dotColor: "error" },
  Cancelled: { variant: "orange-label", dotColor: "warning" },
  Running: { variant: "blue-label", dotColor: "primary" },
  Others: { variant: "gray-label", dotColor: "info" },
};

const columns: DataTableColumn<PipelineRunRow>[] = [
  {
    id: "name",
    header: "실행이름",
    width: "380px",
    render: (row) => (
      <TextCell bold color="#111" className="px-2 truncate" linked>
        {row.name}
      </TextCell>
    ),
  },
  {
    id: "startedAt",
    header: "실행일시",
    width: "170px",
    render: (row) => <TextCell color="#333">{row.startedAt}</TextCell>,
  },
  {
    id: "completedAt",
    header: "완료일시",
    width: "170px",
    render: (row) => <TextCell color="#333">{row.completedAt}</TextCell>,
  },
  {
    id: "message",
    header: "메시지",
    width: "250px",
    render: (row) => (
      <TextCell color="#555" className="truncate">
        {row.message}
      </TextCell>
    ),
  },
  {
    id: "status",
    header: "상태",
    width: "110px",
    align: "center",
    render: (row) => {
      const cfg = statusBadgeMap[row.status];
      return (
        <Badge variant={cfg.variant as any} size="sm">
          <StatusDot color={cfg.dotColor} size="sm" className="mr-1" />
          {row.status}
        </Badge>
      );
    },
  },
  {
    id: "duration",
    header: "실행결과",
    width: "120px",
    align: "center",
    render: (row) => (
      <TextCell color="#555" className="font-mono text-[12px]">
        {row.duration}
      </TextCell>
    ),
  },
];

// ─── Slide ──────────────────────────────────────────────────────────────────

export default function Slide01PipelineStatsList() {
  return (
    <CcpDashboardLayout
      breadcrumbs={[
        { label: "CI/CD" },
        { label: "파이프라인 통계", isBold: true },
      ]}
      title="파이프라인 실행 현황"
      sideMenuItems={createSideMenuItems({ activeId: "cicd", activeLabel: "파이프라인 통계" })}
    >
      {/* ── Filter Bar ── */}
      <ContentSection>
        <div
          className="flex items-end gap-3 mb-2"
          data-annotation-id="1"
        >
          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-[#da1e28]">
              조회 시작일시*
            </span>
            <div className="flex items-center gap-1.5 border border-[#ddd] rounded px-3 py-[6px] bg-white text-[13px] text-[#333] min-w-[220px]">
              <Calendar className="w-3.5 h-3.5 text-[#888]" />
              2025-07-07 오후 05:55
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-[#da1e28]">
              조회 종료일시*
            </span>
            <div className="flex items-center gap-1.5 border border-[#ddd] rounded px-3 py-[6px] bg-white text-[13px] text-[#333] min-w-[220px]">
              <Calendar className="w-3.5 h-3.5 text-[#888]" />
              2025-08-07 오후 05:55
            </div>
          </div>
          <div className="ml-auto self-end">
            <Button variant="ghost" size="sm">
              <Image className="w-3.5 h-3.5 mr-1" />
              PNG
            </Button>
          </div>
        </div>
      </ContentSection>

      {/* ── Summary: Daily Bar Chart + Time Stats ── */}
      <ContentSection card>
        <div className="flex items-start gap-10 py-1">
          {/* Daily Bar Chart */}
          <div className="flex-1" data-annotation-id="2">
            <h4 className="text-[13px] font-semibold text-[#333] mb-3">
              일별 실행 현황
            </h4>
            <DailyBarChart data={dailyData} />
          </div>

          {/* Time Stats */}
          <div
            className="w-[280px] flex-shrink-0 space-y-2"
            data-annotation-id="3"
          >
            <h4 className="text-[13px] font-semibold text-[#333] mb-2">
              파이프라인 실행 시간 통계
            </h4>
            <BarStat label="Avg" value="00:03:56" ratio={0.18} />
            <BarStat label="Min" value="00:00:16" ratio={0.01} />
            <BarStat label="Max" value="00:22:45" ratio={0.65} />
            <BarStat label="Total" value="08:43:55" ratio={1.0} />
            <p className="text-[11px] text-[#0077ff] mt-2">
              Last Runtime at 2026-03-10 오전 10:13
            </p>
          </div>
        </div>
      </ContentSection>

      {/* ── Result Table ── */}
      <ContentSection>
        <div className="flex items-center justify-end mb-2 mt-1">
          <Button
            variant="secondary"
            size="sm"
            data-annotation-id="5"
          >
            <Download className="w-3.5 h-3.5 mr-1" />
            XLSX
          </Button>
        </div>

        <div data-annotation-id="4">
          <DataTable columns={columns} data={tableData} />
        </div>

        <Pagination
          currentPage={1}
          totalPages={14}
          visiblePages={[1, 2, 3, 4, 5]}
          itemsPerPage={10}
          itemsPerPageOptions={[10, 20, 50]}
          onItemsPerPageChange={() => {}}
          className="mt-3 pb-4"
        />
      </ContentSection>
    </CcpDashboardLayout>
  );
}
