import {
  ChevronDown,
  Upload,
  TerminalSquare,
} from "lucide-react";
import { ChevronDown, Upload, ChevronRight } from "lucide-react";
import { cn } from "../cn";

interface NavSelector {
  label: string;
  value: string;
  icon: React.ReactNode;
}

interface GlobalNavProps extends React.HTMLAttributes<HTMLElement> {
  selectors: NavSelector[];
  userName?: string;
  actionButton?: {
    label: string;
    onClick?: () => void;
  };
  /** Web terminal toggle state */
  terminalOpen?: boolean;
  /** Web terminal toggle callback */
  onTerminalToggle?: () => void;
}

export function GlobalNav({
  selectors,
  userName,
  actionButton,
  terminalOpen,
  onTerminalToggle,
  className,
  ...props
}: GlobalNavProps) {
  return (
    <nav
      data-name="GlobalNav"
      className={cn(
        "flex justify-between h-[60px] bg-white border-b border-neutral-200 shadow-[0px_1px_5px_#6b77ac33]",
        className,
      )}
      role="navigation"
      aria-label="Global navigation"
      {...props}
    >
      {/* Left: Selectors */}
      <div className="flex items-start h-[60px]">
        {selectors.map((sel, index) => (
          <button
            key={index}
            type="button"
            className="flex w-[240px] h-[60px] items-center gap-2 px-3 bg-white border-r border-neutral-200 hover:bg-gray-50 transition-colors cursor-pointer"
            aria-label={`${sel.label}: ${sel.value}`}
          >
            <span className="w-[18px] h-[18px] shrink-0 flex items-center justify-center text-[#555555]">
              {sel.icon}
            </span>
            <div className="flex flex-col items-start justify-center gap-0.5 flex-1 min-w-0">
              <span className="text-xs font-normal leading-[18px] tracking-[-0.12px] text-[#6d6f72] truncate">
                {sel.label}
              </span>
              <span className="text-sm font-bold leading-5 tracking-[-0.14px] text-[#222222] truncate">
                {sel.value}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-[#555555] shrink-0" />
          </button>
        ))}
      </div>

      {/* Right: Terminal + Action + User */}
      <div className="flex items-center gap-2.5 pr-8">
        {/* Web Terminal toggle */}
        {onTerminalToggle && (
          <div className="relative group/terminal">
            <button
              type="button"
              onClick={onTerminalToggle}
              className={cn(
                "flex items-center justify-center w-[34px] h-[34px] rounded-md border transition-all duration-200 cursor-pointer",
                terminalOpen
                  ? "bg-[#1b2c3f] border-[#1b2c3f] text-[#4fc3f7] shadow-[0_1px_6px_rgba(27,44,63,0.4)]"
                  : "bg-white border-[#d5d9df] text-[#555] hover:border-[#1b2c3f] hover:bg-[#1b2c3f] hover:text-[#4fc3f7] hover:shadow-[0_1px_6px_rgba(27,44,63,0.3)]",
              )}
              aria-label="Kubectl 셸 열기"
            >
              <TerminalSquare className="w-[16px] h-[16px]" strokeWidth={2.2} />
            </button>
            {/* Tooltip */}
            <span className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-2.5 z-50 hidden group-hover/terminal:flex items-center gap-1.5 px-3 py-1.5 bg-[#1b2c3f] rounded-md shadow-lg whitespace-nowrap">
              <span className="text-white text-[11px] font-medium">Kubectl 셸</span>
              <kbd className="text-[10px] text-[#7eacc7] bg-[#263a4f] px-1.5 py-0.5 rounded font-mono">Ctrl+`</kbd>
            </span>
          </div>
        )}

        {actionButton && (
          <button
            type="button"
            className="flex items-center gap-1 px-2.5 py-1.5 bg-white rounded-[18px] border-2 border-[#014b9f] hover:bg-[#014b9f] hover:text-white transition-colors cursor-pointer group"
            onClick={actionButton.onClick}
          >
            <span className="font-semibold text-[#014b9f] group-hover:text-white text-[13px] tracking-[-0.13px] leading-5 whitespace-nowrap">
              {actionButton.label}
            </span>
            <Upload className="w-3 h-3 text-[#014b9f] group-hover:text-white" />
          </button>
        )}

        {userName && (
          <div className="flex items-center gap-2">
            <span className="font-normal text-[#222222] text-[13px] tracking-[-0.13px] leading-5 whitespace-nowrap">
              {userName}
            </span>
            <ChevronDown className="w-4 h-4 text-[#555555]" />
          </div>
        )}
      </div>
    </nav>
  );
}

export type { NavSelector, GlobalNavProps };
