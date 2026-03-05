import { CheckCircle2, RefreshCw, CircleDashed } from "lucide-react";
import type { PipelineStage } from "./PipelineGraph";

interface TaskListPanelProps {
  title: string;
  stages: PipelineStage[];
  activeStageId?: string;
}

const statusIcons = {
  success: <CheckCircle2 className="w-4 h-4 text-[#00b30e]" />,
  running: <RefreshCw className="w-4 h-4 text-[#0077ff] animate-spin" />,
  pending: <CircleDashed className="w-4 h-4 text-[#aaaaaa]" />,
  failed: <CheckCircle2 className="w-4 h-4 text-[#da1e28]" />,
};

export function TaskListPanel({ title, stages, activeStageId }: TaskListPanelProps) {
  const resolvedActiveId =
    activeStageId ?? stages.find((s) => s.status === "running")?.id;

  return (
    <div className="h-full border border-[#e0e0e0] rounded-lg flex flex-col bg-white">
      <div className="px-4 py-3 border-b border-[#e0e0e0] bg-[#f9fafb] font-semibold text-sm text-[#111111]">
        {title}
      </div>
      <div className="flex-1 overflow-auto py-2">
        {stages.map((stage) => {
          const isActive = stage.id === resolvedActiveId;
          return (
            <div
              key={stage.id}
              className={`px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-[#f4f6f8] ${
                isActive
                  ? "bg-[#e5f1ff] border-l-4 border-[#0077ff]"
                  : "border-l-4 border-transparent"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {statusIcons[stage.status]}
                <span
                  className={`text-sm font-medium tracking-tight ${
                    stage.status === "pending"
                      ? "text-[#888888]"
                      : "text-[#333333]"
                  }`}
                >
                  {stage.name}
                </span>
              </div>
              <span className="text-xs text-[#888888]">{stage.duration}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
