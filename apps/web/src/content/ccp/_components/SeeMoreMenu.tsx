import { MoreHorizontal } from "lucide-react";
import { cn } from "./cn";

interface SeeMoreMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
}

interface SeeMoreMenuProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  items: SeeMoreMenuItem[];
  open?: boolean;
  onToggle?: () => void;
  onSelect?: (id: string) => void;
}

/** @deprecated ActionMenu를 사용하세요. viewport 경계 감지, pin, highlightedKeys 등 추가 기능을 지원합니다. */
export function SeeMoreMenu({
  items,
  open = false,
  onToggle,
  onSelect,
  className,
  ...props
}: SeeMoreMenuProps) {
  return (
    <div className={cn("relative inline-block", className)} {...props}>
      {/* Trigger */}
      <button
        type="button"
        className="flex items-center justify-center w-8 h-8 rounded hover:bg-[#f0f0f0] transition-colors"
        onClick={onToggle}
      >
        <MoreHorizontal className="w-5 h-5 text-[#666]" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full right-0 mt-1 w-[123px] bg-white rounded-lg shadow-[0_4px_16px_rgba(0,0,0,0.12)] border border-[#e0e0e0] py-1.5 z-50">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={cn(
                "flex items-center gap-2 w-full px-3 py-2 text-left text-[13px] font-medium leading-5 tracking-[-0.13px] transition-colors",
                item.active
                  ? "bg-[#1b2c3f] text-white rounded-md mx-1.5 !w-[calc(100%-12px)]"
                  : "text-[#333] hover:bg-[#f6f8fa]",
              )}
              onClick={() => onSelect?.(item.id)}
            >
              {item.icon && (
                <span className="w-4 h-4 shrink-0 flex items-center justify-center [&>svg]:w-4 [&>svg]:h-4">
                  {item.icon}
                </span>
              )}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export type { SeeMoreMenuItem };
