import { CheckCircle2, Activity, Box } from "lucide-react";

interface PipelineStage {
  id: string;
  name: string;
  status: "success" | "running" | "pending" | "failed";
  duration: string;
}

interface PipelineGraphProps {
  stages: PipelineStage[];
}

function getProgressWidth(stages: PipelineStage[]): string {
  const lastActiveIdx = stages.reduce(
    (acc, s, i) => (s.status === "success" || s.status === "running" ? i : acc),
    0,
  );
  const pct = Math.round(((lastActiveIdx + 0.5) / stages.length) * 100);
  return `${pct}%`;
}

export function PipelineGraph({ stages }: PipelineGraphProps) {
  return (
    <div className="relative mb-10 py-8 px-12 bg-[#fafbfc] rounded-lg border border-[#e2e8f0] flex items-center justify-between">
      {/* Background Line */}
      <div className="absolute top-[50%] left-16 right-16 h-1 bg-[#e2e8f0] -translate-y-[50%] z-0" />
      {/* Progress Line */}
      <div
        className="absolute top-[50%] left-16 h-1 bg-[#0077ff] -translate-y-[50%] z-0 transition-all"
        style={{ width: getProgressWidth(stages) }}
      />

      {stages.map((stage) => (
        <div
          key={stage.id}
          className="relative z-10 flex flex-col items-center gap-3"
        >
          {/* Node */}
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center border-4 ${
              stage.status === "success"
                ? "bg-white border-[#00b30e]"
                : stage.status === "running"
                  ? "bg-[#0077ff] border-[#c0dfff] shadow-[0_0_0_4px_#e5f1ff]"
                  : "bg-white border-[#e0e0e0]"
            }`}
          >
            {stage.status === "success" && (
              <CheckCircle2 className="w-6 h-6 text-[#00b30e]" />
            )}
            {stage.status === "running" && (
              <Activity className="w-6 h-6 text-white animate-pulse" />
            )}
            {stage.status === "pending" && (
              <Box className="w-5 h-5 text-[#aaaaaa]" />
            )}
          </div>

          {/* Label */}
          <div className="text-center">
            <p
              className={`text-sm font-bold tracking-[-0.14px] ${
                stage.status === "pending"
                  ? "text-[#888888]"
                  : "text-[#111111]"
              }`}
            >
              {stage.name}
            </p>
            <p className="text-xs text-[#555555] mt-0.5">{stage.duration}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export type { PipelineStage };
