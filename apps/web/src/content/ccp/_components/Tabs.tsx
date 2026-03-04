import { cn } from "./cn";

interface TabItem {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps extends React.HTMLAttributes<HTMLElement> {
  items: TabItem[];
  activeId: string;
  onTabChange?: (id: string) => void;
}

export function Tabs({
  items,
  activeId,
  onTabChange,
  className,
  ...props
}: TabsProps) {
  return (
    <nav
      className={cn(
        "flex items-center gap-5 border-b border-neutral-200",
        className,
      )}
      role="tablist"
      {...props}
    >
      {items.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={isActive}
            className={cn(
              "inline-flex items-start gap-1.5 px-0 py-2",
              isActive && "border-b-2 border-[#0077ff]",
            )}
            onClick={() => onTabChange?.(tab.id)}
          >
            <span
              className={cn(
                "text-[13px] text-center tracking-[-0.13px] leading-5 whitespace-nowrap",
                isActive
                  ? "font-semibold text-[#0077ff]"
                  : "font-normal text-[#333333]",
              )}
            >
              {tab.label}
            </span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  "inline-flex h-[22px] px-2 rounded-[20px] items-center justify-center",
                  isActive ? "bg-[#0077ff]" : "bg-[#999999]",
                )}
              >
                <span className="font-bold text-white text-sm text-center tracking-[-0.14px] leading-5 whitespace-nowrap">
                  {tab.count}
                </span>
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
