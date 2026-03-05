import type { LucideIcon } from "lucide-react";
import { cn } from "./cn";

interface ContextMenuItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  href?: string;
  onClick?: () => void;
  textColor?: string;
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

export function ContextMenu({ items, className, ...props }: ContextMenuProps) {
  return (
    <nav
      className={cn(
        "flex flex-col w-[120px] items-start py-1 bg-white rounded-lg border border-[#bac0c6]",
        "shadow-[4px_4px_4px_#0000001a]",
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
              className="w-full px-3 py-0.5"
              role="separator"
            >
              <div className="w-full h-px bg-[#e0e0e0]" />
            </div>
          );
        }

        const Icon = entry.icon;
        const content = (
          <>
            {Icon && (
              <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            )}
            <span
              className={cn(
                "flex-1 text-[13px] font-medium leading-5 tracking-[-0.13px] whitespace-nowrap",
                entry.textColor ?? "text-[#333333]",
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
              className="flex h-7 items-center gap-1.5 px-3 w-full hover:bg-gray-50 focus:bg-gray-100 focus:outline-none"
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
            className="flex h-7 items-center gap-1.5 px-3 w-full hover:bg-gray-50 focus:bg-gray-100 focus:outline-none text-left"
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
