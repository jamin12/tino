import { useState } from "react";
import {
  X,
  Minus,
  Maximize2,
  Minimize2,
  ChevronUp,
  Server,
  ChevronDown,
  Circle,
} from "lucide-react";
import { cn } from "./cn";

interface TerminalTab {
  id: string;
  label: string;
  node: string;
  status: "connected" | "disconnected";
}

interface WebTerminalPanelProps {
  onClose: () => void;
  className?: string;
}

const defaultTabs: TerminalTab[] = [
  { id: "1", label: "node-01", node: "node-01.cluster-01", status: "connected" },
  { id: "2", label: "node-02", node: "node-02.cluster-01", status: "connected" },
];

const sampleOutput = `\x1b[32m$\x1b[0m kubectl get nodes -o wide
NAME       STATUS   ROLES           AGE   VERSION   INTERNAL-IP    OS-IMAGE
node-01    Ready    control-plane   42d   v1.28.4   10.0.0.11      Ubuntu 22.04.3 LTS
node-02    Ready    worker          42d   v1.28.4   10.0.0.12      Ubuntu 22.04.3 LTS
node-03    Ready    worker          42d   v1.28.4   10.0.0.13      Ubuntu 22.04.3 LTS

\x1b[32m$\x1b[0m kubectl get pods -n app-cicd
NAME                                 READY   STATUS    RESTARTS   AGE
build-pr-run-x7k2p-fetch-pod        1/1     Running   0          3m
maven-build-task-8hn4s               1/1     Running   0          1m

\x1b[32m$\x1b[0m `;

type PanelSize = "collapsed" | "normal" | "maximized";

export function WebTerminalPanel({ onClose, className }: WebTerminalPanelProps) {
  const [size, setSize] = useState<PanelSize>("normal");

  const isCollapsed = size === "collapsed";
  const isMaximized = size === "maximized";

  const handleToggleCollapse = () => {
    setSize((prev) => (prev === "collapsed" ? "normal" : "collapsed"));
  };

  const handleToggleMaximize = () => {
    setSize((prev) => (prev === "maximized" ? "normal" : "maximized"));
  };

  return (
    <div
      data-name="WebTerminalPanel"
      className={cn(
        "flex flex-col bg-[#1e1e2e] shadow-[0_-4px_20px_rgba(0,0,0,0.25)] transition-all duration-200 ease-in-out",
        isMaximized
          ? "absolute inset-0 z-50 border-0"
          : "border-t-2 border-[#014b9f]",
        className,
      )}
      style={isMaximized ? undefined : { height: isCollapsed ? 38 : 280 }}
    >
      {/* ─── Header ──────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between h-[38px] px-3 bg-[#181825] border-b border-[#313244] shrink-0 cursor-pointer select-none"
        onDoubleClick={handleToggleCollapse}
      >
        {/* Left: node tabs */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-0.5">
            {defaultTabs.map((tab, idx) => (
              <button
                key={tab.id}
                type="button"
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer",
                  idx === 0
                    ? "bg-[#313244] text-[#cdd6f4]"
                    : "text-[#6c7086] hover:text-[#a6adc8] hover:bg-[#28283d]",
                )}
              >
                <Circle
                  className={cn(
                    "w-2 h-2",
                    tab.status === "connected"
                      ? "fill-[#a6e3a1] text-[#a6e3a1]"
                      : "fill-[#f38ba8] text-[#f38ba8]",
                  )}
                />
                <Server className="w-3 h-3" />
                {tab.label}
              </button>
            ))}
            <button
              type="button"
              className="flex items-center gap-1 px-2 py-1 rounded text-[11px] text-[#6c7086] hover:text-[#a6adc8] hover:bg-[#28283d] transition-colors cursor-pointer"
            >
              + 노드 연결
            </button>
          </div>
        </div>

        {/* Right: cluster info + controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#28283d] text-[11px] text-[#a6adc8] hover:bg-[#313244] transition-colors cursor-pointer"
          >
            <Server className="w-3 h-3 text-[#89b4fa]" />
            Cluster-01
            <ChevronDown className="w-3 h-3" />
          </button>
          <div className="h-4 w-px bg-[#313244]" />

          {/* 접기/펼치기 */}
          <button
            type="button"
            onClick={handleToggleCollapse}
            className="p-1 rounded text-[#6c7086] hover:text-[#cdd6f4] hover:bg-[#313244] transition-colors cursor-pointer"
            aria-label={isCollapsed ? "펼치기" : "접기"}
            title={isCollapsed ? "펼치기" : "접기"}
          >
            {isCollapsed ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <Minus className="w-3.5 h-3.5" />
            )}
          </button>

          {/* 최대화/복원 */}
          <button
            type="button"
            onClick={handleToggleMaximize}
            className={cn(
              "p-1 rounded transition-colors cursor-pointer",
              isMaximized
                ? "text-[#89b4fa] hover:text-[#cdd6f4] hover:bg-[#313244]"
                : "text-[#6c7086] hover:text-[#cdd6f4] hover:bg-[#313244]",
            )}
            aria-label={isMaximized ? "복원" : "최대화"}
            title={isMaximized ? "복원" : "최대화"}
          >
            {isMaximized ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>

          {/* 닫기 */}
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-[#6c7086] hover:text-[#f38ba8] hover:bg-[#313244] transition-colors cursor-pointer"
            aria-label="닫기"
            title="닫기"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ─── Terminal body (hidden when collapsed) ─────────── */}
      {!isCollapsed && (
        <>
          <div className="flex-1 overflow-auto px-4 py-3 font-mono text-[13px] leading-[1.6] text-[#cdd6f4]">
            {sampleOutput.split("\n").map((line, i) => (
              <div key={i} className="whitespace-pre">
                {line.includes("\x1b[32m$\x1b[0m") ? (
                  <>
                    <span className="text-[#a6e3a1] font-bold select-none">$ </span>
                    <span className="text-[#cdd6f4]">
                      {line.replace(/\x1b\[\d+m/g, "").replace("$ ", "")}
                    </span>
                  </>
                ) : (
                  <span className="text-[#a6adc8]">{line}</span>
                )}
              </div>
            ))}
            {/* Blinking cursor */}
            <span className="inline-block w-[7px] h-[15px] bg-[#cdd6f4] animate-pulse" />
          </div>

          {/* ─── Status bar ──────────────────────────────────── */}
          <div className="flex items-center justify-between h-[26px] px-3 bg-[#181825] border-t border-[#313244] shrink-0">
            <div className="flex items-center gap-3 text-[10px] text-[#6c7086]">
              <span className="flex items-center gap-1">
                <Circle className="w-1.5 h-1.5 fill-[#a6e3a1] text-[#a6e3a1]" />
                연결됨
              </span>
              <span>node-01.cluster-01</span>
              <span>bash</span>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-[#6c7086]">
              <span>UTF-8</span>
              <span>Ctrl+` 토글</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
