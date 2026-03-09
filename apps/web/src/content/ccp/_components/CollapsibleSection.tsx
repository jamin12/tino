import { ChevronDown } from "lucide-react";
import { cn } from "./cn";

interface CollapsibleSectionProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  variant?: "default" | "subtle";
}

export function CollapsibleSection({
  title,
  expanded,
  onToggle,
  children,
  variant = "default",
  className,
  ...props
}: CollapsibleSectionProps) {
  if (variant === "subtle") {
    return (
      <section className={cn("flex flex-col items-start gap-4 w-full", className)} {...props}>
        <button
          type="button"
          className="flex items-center gap-1.5"
          onClick={onToggle}
          aria-expanded={expanded}
        >
          <span className="text-[13px] font-medium text-[#333333] tracking-[-0.13px] leading-5">
            {title}
          </span>
          <ChevronDown
            className={cn(
              "w-3.5 h-3.5 text-[#999999] transition-transform",
              !expanded && "-rotate-90",
            )}
          />
        </button>
        {expanded && (
          <div className="flex flex-col items-start gap-4 w-full">
            {children}
          </div>
        )}
      </section>
    );
  }

  return (
    <section className={cn("flex flex-col items-start gap-3", className)} {...props}>
      <button
        type="button"
        className="flex items-center gap-3 w-full border-b border-[#ced3d9] pb-1"
        onClick={onToggle}
        aria-expanded={expanded}
      >
        <h2 className="font-bold text-[#3d3e40] text-base tracking-[-0.16px] leading-6 whitespace-nowrap">
          {title}
        </h2>
        <div
          className={cn(
            "flex items-center justify-center w-4 h-4 rounded-sm bg-[#8b8e91] shrink-0 transition-transform",
            !expanded && "-rotate-90",
          )}
        >
          <ChevronDown className="w-2 h-2 text-white" />
        </div>
      </button>
      {expanded && (
        <div className="flex flex-col items-start gap-3 px-5 py-4 w-full bg-white rounded-sm border border-[#f0f0f0] shadow-[0px_0px_8px_#00000014]">
          {children}
        </div>
      )}
    </section>
  );
}
