import type { ReactNode } from "react";

interface SplitPanelProps {
  left: ReactNode;
  leftWidth?: string;
  right: ReactNode;
  height?: string;
  gap?: string;
}

export function SplitPanel({
  left,
  leftWidth = "300px",
  right,
  height = "400px",
  gap = "20px",
}: SplitPanelProps) {
  return (
    <div className="flex" style={{ height, gap }}>
      <div style={{ width: leftWidth }} className="shrink-0">
        {left}
      </div>
      <div className="flex-1 min-w-0">{right}</div>
    </div>
  );
}
