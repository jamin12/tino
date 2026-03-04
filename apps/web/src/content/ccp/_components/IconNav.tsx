import { type ReactNode } from "react";
import { cn } from "./cn";

interface IconNavItem {
  id: string;
  icon: ReactNode;
  label: string;
}

interface IconNavProps extends React.HTMLAttributes<HTMLElement> {
  items: IconNavItem[];
  activeId: string;
  onItemChange?: (id: string) => void;
}

export function IconNav({
  items,
  activeId,
  onItemChange,
  className,
  ...props
}: IconNavProps) {
  return (
    <nav
      className={cn(
        "flex flex-col w-16 bg-white border-r border-neutral-200 shrink-0",
        className,
      )}
      role="tablist"
      aria-orientation="vertical"
      {...props}
    >
      <div className="flex flex-col items-center gap-1.5 px-2.5 py-5">
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={cn(
                "flex flex-col items-center justify-center w-11 py-2 rounded-full transition-colors",
                isActive
                  ? "bg-[#1b2c3f] text-white"
                  : "text-black opacity-50 hover:opacity-75",
              )}
              onClick={() => onItemChange?.(item.id)}
            >
              <span className="w-6 h-6 flex items-center justify-center">
                {item.icon}
              </span>
              <span className="text-[10px] font-bold leading-[14px] tracking-[-0.10px] text-center whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export type { IconNavItem };
