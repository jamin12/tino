import { type ReactNode } from "react";
import { cn } from "./cn";
import { Checkbox } from "./Checkbox";

// ─── Types ──────────────────────────────────────────────────────────────────

interface DataTableColumn<T> {
  id: string;
  header: string;
  width?: string;
  align?: "left" | "center" | "right";
  render: (row: T) => ReactNode;
}

interface DataTableProps<T extends { id: string }> {
  columns: DataTableColumn<T>[];
  data: T[];
  selectedIds?: Set<string>;
  onSelectionChange?: (ids: Set<string>) => void;
  className?: string;
}

// ─── Component ──────────────────────────────────────────────────────────────

export function DataTable<T extends { id: string }>({
  columns,
  data,
  selectedIds,
  onSelectionChange,
  className,
}: DataTableProps<T>) {
  const selectable = !!onSelectionChange;
  const allSelected = data.length > 0 && selectedIds?.size === data.length;

  const toggleAll = () => {
    if (!onSelectionChange) return;
    if (allSelected) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(data.map((row) => row.id)));
    }
  };

  const toggleRow = (id: string) => {
    if (!onSelectionChange || !selectedIds) return;
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    onSelectionChange(next);
  };

  return (
    <div className={cn("flex flex-col items-start gap-2 w-full", className)}>
      {/* Header */}
      <header className="flex items-start w-full bg-[#e7edf3] rounded">
        {selectable && (
          <div className="flex w-10 h-9 items-center justify-center px-2 py-1">
            <Checkbox
              checked={allSelected}
              onChange={toggleAll}
              aria-label="모든 항목 선택"
            />
          </div>
        )}
        {columns.map((col) => (
          <div
            key={col.id}
            className="flex h-9 items-center justify-center gap-1.5 px-2 py-1"
            style={{ width: col.width, flex: col.width ? undefined : "1 1 0%" }}
          >
            <span className="font-bold text-[#333333] text-sm text-center tracking-[-0.14px] leading-5 whitespace-nowrap">
              {col.header}
            </span>
          </div>
        ))}
      </header>

      {/* Rows */}
      <div className="flex flex-col items-start gap-2 w-full">
        {data.map((row) => (
          <article
            key={row.id}
            className="flex items-center w-full bg-white rounded border border-[#dddddd]"
          >
            {selectable && (
              <div className="flex w-10 items-center justify-center px-2 py-3">
                <Checkbox
                  checked={selectedIds?.has(row.id) ?? false}
                  onChange={() => toggleRow(row.id)}
                  aria-label={`${row.id} 선택`}
                />
              </div>
            )}
            {columns.map((col) => (
              <div
                key={col.id}
                className={cn(
                  "flex items-center gap-1.5 px-2 py-3",
                  col.align === "center" && "justify-center",
                  col.align === "right" && "justify-end",
                )}
                style={{
                  width: col.width,
                  flex: col.width ? undefined : "1 1 0%",
                }}
              >
                {col.render(row)}
              </div>
            ))}
          </article>
        ))}
      </div>
    </div>
  );
}

export type { DataTableColumn, DataTableProps };
