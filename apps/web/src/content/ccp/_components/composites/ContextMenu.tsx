import type { ReactNode } from "react";
import { cn } from "../cn";

interface ContextMenuItem {
  id: string;
  label: string;
  icon?: ReactNode;
  href?: string;
  onClick?: () => void;
  textColor?: string;
  highlighted?: boolean;
}

interface ContextMenuDivider {
  id: string;
  type: "divider";
}

type ContextMenuEntry = ContextMenuItem | ContextMenuDivider;

function isDivider(entry: ContextMenuEntry): entry is ContextMenuDivider {
  return "type" in entry && entry.type === "divider";
}

interface ContextMenuProps extends React.HTMLAttributes<HTMLElement> {
  items: ContextMenuEntry[];
}

/** @deprecated ActionMenu를 사용하세요. viewport 경계 감지, pin, highlightedKeys 등 추가 기능을 지원합니다. */
export function ContextMenu({ items, className, ...props }: ContextMenuProps) {
  return (
    <nav
      className={cn(
        "flex flex-col w-[120px] items-start py-[5px] bg-white rounded-[8px] border border-[#d9dce0]",
        "shadow-[0_4px_12px_rgba(0,0,0,0.12)]",
        className,
      )}
      role="menu"
      {...props}
    >
      {items.map((entry) => {
        if (isDivider(entry)) {
          return (
            <div
              key={entry.id}
              className="w-full px-[10px] py-[3px]"
              role="separator"
            >
              <div className="w-full h-px bg-[#e5e7eb]" />
            </div>
          );
        }

        const itemClass = cn(
          "flex h-[34px] items-center gap-[8px] px-[14px] w-full text-left",
          entry.highlighted
            ? "bg-[#eef4ff]"
            : "hover:bg-[#f5f6f8] focus:bg-[#eef0f3]",
          "focus:outline-none",
        );

        const content = (
          <>
            {entry.icon && (
              <span
                className="shrink-0 flex items-center justify-center w-[16px] h-[16px]"
                aria-hidden="true"
              >
                {entry.icon}
              </span>
            )}
            <span
              className={cn(
                "flex-1 text-[13px] font-medium leading-[20px] tracking-[-0.13px] whitespace-nowrap",
                entry.textColor ?? "text-[#393c40]",
              )}
            >
              {entry.label}
            </span>
          </>
        );

        if (entry.href) {
          return (
            <a
              key={entry.id}
              className={itemClass}
              href={entry.href}
              role="menuitem"
            >
              {content}
            </a>
          );
        }

        return (
          <button
            key={entry.id}
            type="button"
            className={itemClass}
            role="menuitem"
            onClick={entry.onClick}
          >
            {content}
          </button>
        );
      })}
    </nav>
  );
}

export type { ContextMenuEntry, ContextMenuItem, ContextMenuDivider };
