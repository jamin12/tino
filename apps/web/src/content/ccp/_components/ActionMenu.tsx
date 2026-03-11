import {
  useRef,
  useEffect,
  useCallback,
  useLayoutEffect,
  type ReactNode,
} from "react";
import { Pin, PinOff } from "lucide-react";
import { cn } from "./cn";

// ─── Types ──────────────────────────────────────────────────────────────────

interface ActionMenuItemConfig {
  key: string;
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  annotationId?: number;
}

interface ActionMenuDivider {
  type: "divider";
}

type ActionMenuEntry = ActionMenuItemConfig | ActionMenuDivider;

interface ActionMenuProps {
  items: ActionMenuEntry[];
  highlightedKeys?: string[];
  onClose?: () => void;
  minWidth?: number;
  anchorRef?: { current: HTMLElement | null };
  pinnable?: boolean;
  pinned?: boolean;
  onPinChange?: (pinned: boolean) => void;
  /** true이면 position: static (Overlay 등 외부에서 위치를 잡을 때) */
  static?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function isDivider(entry: ActionMenuEntry): entry is ActionMenuDivider {
  return "type" in entry && entry.type === "divider";
}

// ─── Component ──────────────────────────────────────────────────────────────

export function ActionMenu({
  items,
  highlightedKeys,
  onClose,
  minWidth = 120,
  anchorRef,
  pinnable,
  pinned,
  onPinChange,
  static: isStatic,
  style,
  className,
}: ActionMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // 뷰포트 경계 감지 및 위치 조정
  useLayoutEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;

    const menuRect = menu.getBoundingClientRect();
    const vh = window.innerHeight;
    const vw = window.innerWidth;
    const edgePadding = 8;

    let adjustX = 0;
    let adjustY = 0;

    const anchor = anchorRef?.current;

    if (anchor) {
      const anchorRect = anchor.getBoundingClientRect();
      const menuHeight = menuRect.height;
      const gap = 4;

      const belowTop = anchorRect.bottom + gap;
      const aboveTop = anchorRect.top - gap - menuHeight;

      const fitsBelow = belowTop + menuHeight <= vh - edgePadding;
      const fitsAbove = aboveTop >= edgePadding;

      if (fitsBelow) {
        adjustY = belowTop - menuRect.top;
      } else if (fitsAbove) {
        adjustY = aboveTop - menuRect.top;
      } else {
        const spaceBelow = vh - anchorRect.bottom;
        const spaceAbove = anchorRect.top;

        if (spaceBelow >= spaceAbove) {
          adjustY = belowTop - menuRect.top;
          const newBottom = menuRect.bottom + adjustY;
          if (newBottom > vh - edgePadding) {
            adjustY -= newBottom - (vh - edgePadding);
          }
        } else {
          adjustY = aboveTop - menuRect.top;
          const newTop = menuRect.top + adjustY;
          if (newTop < edgePadding) {
            adjustY += edgePadding - newTop;
          }
        }
      }
    } else {
      if (menuRect.bottom > vh - edgePadding) {
        adjustY = vh - edgePadding - menuRect.bottom;
      }
      if (menuRect.top + adjustY < edgePadding) {
        adjustY = edgePadding - menuRect.top;
      }
    }

    // 좌우 경계 보정
    if (menuRect.right > vw - edgePadding) {
      adjustX = vw - edgePadding - menuRect.right;
    }
    if (menuRect.left + adjustX < edgePadding) {
      adjustX = edgePadding - menuRect.left;
    }

    if (adjustX !== 0 || adjustY !== 0) {
      menu.style.transform = `translate(${adjustX}px, ${adjustY}px)`;
    }
  }, [anchorRef]);

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose?.();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleItemClick = useCallback(
    (item: ActionMenuItemConfig, e: React.MouseEvent) => {
      e.stopPropagation();
      if (item.disabled) return;
      item.onClick?.();
      onClose?.();
    },
    [onClose],
  );

  const handlePinClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onPinChange?.(!pinned);
    },
    [pinned, onPinChange],
  );

  const highlightedSet = highlightedKeys
    ? new Set(highlightedKeys)
    : undefined;

  return (
    <div
      ref={menuRef}
      role="menu"
      className={cn(
        isStatic ? "z-[9999]" : "absolute z-[9999]",
        "bg-white border border-[#d9dce0] rounded shadow-[0_2px_8px_rgba(0,0,0,0.15)] py-1",
        className,
      )}
      style={{ minWidth, ...style }}
    >
      {pinnable && (
        <div className="flex justify-end px-2 pt-1">
          <button
            type="button"
            className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-transparent hover:bg-[#f2f2f2] cursor-pointer border-none p-0"
            onClick={handlePinClick}
          >
            {pinned ? (
              <Pin className="w-4 h-4" />
            ) : (
              <PinOff className="w-4 h-4" />
            )}
          </button>
        </div>
      )}
      {items.map((entry, index) => {
        if (isDivider(entry)) {
          return (
            <div
              key={`divider-${index}`}
              className="h-px my-1 bg-[#e5e7eb]"
              role="separator"
            />
          );
        }

        const isHighlighted = highlightedSet?.has(entry.key);

        return (
          <button
            key={entry.key}
            type="button"
            role="menuitem"
            disabled={entry.disabled}
            {...(entry.annotationId != null && { "data-annotation-id": String(entry.annotationId) })}
            className={cn(
              "flex items-center gap-2 w-full px-3 py-1.5 border-none bg-transparent cursor-pointer text-left text-[13px] leading-5",
              isHighlighted ? "text-[#0077ff]" : "text-[#393c40]",
              "hover:bg-[#f5f6f8]",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
            onClick={(e) => handleItemClick(entry, e)}
          >
            {entry.icon && (
              <span className="shrink-0 flex items-center justify-center w-4 h-4">
                {entry.icon}
              </span>
            )}
            {entry.label}
          </button>
        );
      })}
    </div>
  );
}

export type { ActionMenuEntry, ActionMenuItemConfig, ActionMenuDivider, ActionMenuProps };
