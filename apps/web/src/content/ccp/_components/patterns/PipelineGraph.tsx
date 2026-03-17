import { CheckCircle2, Activity, Box, XCircle, ChevronRight } from "lucide-react";

interface PipelineStage {
  id: string;
  name: string;
  status: "success" | "running" | "pending" | "failed";
  duration: string;
}

interface PipelineGraphProps {
  stages: PipelineStage[];
}

const statusConfig = {
  success: {
    bg: "bg-[#ecfdf5]",
    border: "border-[#10b981]",
    ring: "",
    iconColor: "text-[#10b981]",
    labelColor: "text-[#0f172a]",
    lineColor: "bg-[#10b981]",
  },
  running: {
    bg: "bg-[#0077ff]",
    border: "border-[#93c5fd]",
    ring: "ring-4 ring-[#dbeafe]",
    iconColor: "text-white",
    labelColor: "text-[#0f172a]",
    lineColor: "bg-[#0077ff]",
  },
  failed: {
    bg: "bg-[#fef2f2]",
    border: "border-[#ef4444]",
    ring: "ring-4 ring-[#fee2e2]",
    iconColor: "text-[#ef4444]",
    labelColor: "text-[#0f172a]",
    lineColor: "bg-[#ef4444]",
  },
  pending: {
    bg: "bg-[#f8fafc]",
    border: "border-[#cbd5e1]",
    ring: "",
    iconColor: "text-[#94a3b8]",
    labelColor: "text-[#94a3b8]",
    lineColor: "bg-[#e2e8f0]",
  },
};

const statusIcon = {
  success: <CheckCircle2 className="w-5 h-5" />,
  running: <Activity className="w-5 h-5 animate-pulse" />,
  failed: <XCircle className="w-5 h-5" />,
  pending: <Box className="w-4.5 h-4.5" />,
};

export function PipelineGraph({ stages }: PipelineGraphProps) {
  return (
    <div className="py-6 px-8 bg-[#f8fafc] rounded-xl border border-[#e2e8f0] shadow-sm">
      <div className="flex items-center justify-between">
        {stages.map((stage, idx) => {
          const cfg = statusConfig[stage.status];
          const isLast = idx === stages.length - 1;
          return (
            <div key={stage.id} className="flex items-center flex-1 last:flex-none">
              {/* Node + Label */}
              <div className="flex flex-col items-center gap-2.5">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 ${cfg.bg} ${cfg.border} ${cfg.ring} transition-all`}
                >
                  <span className={cfg.iconColor}>{statusIcon[stage.status]}</span>
                </div>
                <div className="text-center">
                  <p className={`text-[12px] font-semibold tracking-[-0.1px] font-mono ${cfg.labelColor}`}>
                    {stage.name}
                  </p>
                  <p className="text-[11px] text-[#64748b] mt-0.5 font-medium">{stage.duration}</p>
                </div>
              </div>

              {/* Connector */}
              {!isLast && (
                <div className="flex-1 flex items-center justify-center mx-3 -mt-8">
                  <div className={`flex-1 h-[2px] rounded-full ${
                    stage.status === "success" || stage.status === "running"
                      ? "bg-[#10b981]"
                      : stage.status === "failed"
                        ? "bg-[#ef4444]"
                        : "bg-[#e2e8f0]"
                  }`} />
                  <ChevronRight className={`w-3.5 h-3.5 -ml-0.5 flex-shrink-0 ${
                    stage.status === "success" || stage.status === "running"
                      ? "text-[#10b981]"
                      : stage.status === "failed"
                        ? "text-[#ef4444]"
                        : "text-[#cbd5e1]"
                  }`} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export type { PipelineStage };
