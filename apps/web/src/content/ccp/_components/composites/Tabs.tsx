import { cn } from "../cn";

interface TabItem {
  id: string;
  label: string;
  count?: number;
  /** true 이면 이 탭 앞에 세로 구분선(|)을 렌더링합니다. */
  dividerBefore?: boolean;
}

interface TabsProps extends React.HTMLAttributes<HTMLElement> {
  items: TabItem[];
  activeId: string;
  onTabChange?: (id: string) => void;
  /** "underline" = 기존 밑줄 탭, "pill" = 세그먼트 컨트롤 스타일 */
  variant?: "underline" | "pill";
}

export function Tabs({
  items,
  activeId,
  onTabChange,
  className,
  variant = "underline",
  ...props
}: TabsProps) {
  if (variant === "pill") {
    return (
      <nav
        className={cn(
          "inline-flex items-center gap-0.5 rounded-lg bg-[#f0f0f0] p-1",
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
                "inline-flex items-center justify-center rounded-md px-4 py-1.5 text-[13px] tracking-[-0.13px] leading-5 whitespace-nowrap transition-all",
                isActive
                  ? "bg-white font-semibold text-[#333333] shadow-sm"
                  : "font-normal text-[#888888] hover:text-[#555555]",
              )}
              onClick={() => onTabChange?.(tab.id)}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={cn(
                    "ml-1.5 inline-flex h-[18px] min-w-[18px] px-1 rounded-full items-center justify-center text-[11px] font-bold",
                    isActive
                      ? "bg-[#333333] text-white"
                      : "bg-[#ccc] text-white",
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    );
  }

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
          <span key={tab.id} className="contents">
          {tab.dividerBefore && (
            <span
              className="self-center text-[13px] text-[#ccc] select-none"
              aria-hidden="true"
            >
              |
            </span>
          )}
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
          </span>
        );
      })}
    </nav>
  );
}
