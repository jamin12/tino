import { ChevronDown, Upload, ChevronRight } from "lucide-react";
import { cn } from "./cn";

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
}

export function GlobalNav({
  selectors,
  userName,
  actionButton,
  className,
  ...props
}: GlobalNavProps) {
  return (
    <nav
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

      {/* Right: Actions + User */}
      <div className="flex items-center gap-2.5 pr-8">
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
