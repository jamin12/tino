import { type ReactNode } from "react";
import { cn } from "../cn";
import { Checkbox } from "../primitives/Checkbox";

// ─── Icons ───────────────────────────────────────────────────────────────────

function SortIcon({
  direction,
  active,
}: {
  direction?: "asc" | "desc";
  active?: boolean;
}) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="shrink-0"
    >
      <path
        d="M8 4L11 7H5L8 4Z"
        fill={active && direction === "asc" ? "#333333" : "#cccccc"}
      />
      <path
        d="M8 12L5 9H11L8 12Z"
        fill={active && direction === "desc" ? "#333333" : "#cccccc"}
      />
    </svg>
  );
}

function MoreButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#f0f0f0] shrink-0"
    >
      <svg width="12" height="3" viewBox="0 0 12 3" fill="none">
        <circle cx="1.5" cy="1.5" r="1.5" fill="#333333" />
        <circle cx="6" cy="1.5" r="1.5" fill="#333333" />
        <circle cx="10.5" cy="1.5" r="1.5" fill="#333333" />
      </svg>
    </button>
  );
}

function AccordionArrow({ expanded }: { expanded?: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={cn("transition-transform", expanded && "rotate-180")}
    >
      <path
        d="M6 8L10 12L14 8"
        stroke="#333333"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Types ──────────────────────────────────────────────────────────────────

interface DataTableColumn<T> {
  id: string;
  header: string;
  width?: string;
  fixed?: boolean;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  render: (row: T) => ReactNode;
}

interface DataTableProps<T extends { id: string }> {
  columns: DataTableColumn<T>[];
  data: T[];
  selectedIds?: Set<string>;
  onSelectionChange?: (ids: Set<string>) => void;
  sortColumn?: string;
  sortDirection?: "asc" | "desc";
  onSortChange?: (columnId: string, direction: "asc" | "desc") => void;
  variant?: "default" | "compact";
  expandedId?: string;
  onExpandChange?: (id: string | null) => void;
  onRowAction?: (id: string) => void;
  emptyMessage?: string;
  className?: string;
  [key: `data-${string}`]: string | undefined;
}

// ─── Compact Variant ────────────────────────────────────────────────────────

function CompactView<T extends { id: string }>({
  columns,
  data,
  selectedIds,
  selectable,
  toggleRow,
  expandedId,
  onExpandChange,
  onRowAction,
  emptyMessage,
}: {
  columns: DataTableColumn<T>[];
  data: T[];
  selectedIds?: Set<string>;
  selectable: boolean;
  toggleRow: (id: string) => void;
  expandedId?: string;
  onExpandChange?: (id: string | null) => void;
  onRowAction?: (id: string) => void;
  emptyMessage: string;
}) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[44px] bg-white rounded border border-[#dddddd]">
        <span className="text-sm text-[#999999]">{emptyMessage}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      {data.map((row) => {
        const isExpanded = expandedId === row.id;
        const isSelected = selectedIds?.has(row.id) ?? false;

        return (
          <article
            key={row.id}
            className={cn(
              "flex bg-white rounded border transition-colors",
              isSelected ? "border-[#0077ff]" : "border-[#dddddd]",
            )}
          >
            {selectable && (
              <div className="flex w-10 items-start px-3 pt-3 shrink-0">
                <Checkbox
                  checked={isSelected}
                  onChange={() => toggleRow(row.id)}
                  aria-label={`${row.id} 선택`}
                />
              </div>
            )}

            <div className="flex-1 min-w-0">
              {isExpanded ? (
                <div className="flex flex-col py-2">
                  {columns.map((col) => (
                    <div
                      key={col.id}
                      className="flex items-center min-h-[32px] px-2"
                    >
                      <span className="w-[120px] shrink-0 text-sm font-semibold text-[#333333] tracking-[-0.14px] leading-5">
                        {col.header}
                      </span>
                      <div className="flex-1 text-sm text-[#333333] tracking-[-0.14px] leading-5">
                        {col.render(row)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center h-10 px-2">
                  <span className="w-[120px] shrink-0 text-sm font-semibold text-[#333333] tracking-[-0.14px] leading-5">
                    {columns[0]?.header}
                  </span>
                  <div className="flex-1 text-sm text-[#333333] tracking-[-0.14px] leading-5">
                    {columns[0]?.render(row)}
                  </div>
                </div>
              )}
            </div>

            {isExpanded && onRowAction && (
              <div className="flex items-start p-2 shrink-0">
                <MoreButton onClick={() => onRowAction(row.id)} />
              </div>
            )}

            {onExpandChange && (
              <button
                type="button"
                className="flex w-10 items-center justify-center shrink-0"
                onClick={() => onExpandChange(isExpanded ? null : row.id)}
              >
                <AccordionArrow expanded={isExpanded} />
              </button>
            )}
          </article>
        );
      })}
    </div>
  );
}

// ─── Component ──────────────────────────────────────────────────────────────

export function DataTable<T extends { id: string }>({
  columns,
  data,
  selectedIds,
  onSelectionChange,
  sortColumn,
  sortDirection,
  onSortChange,
  variant = "default",
  expandedId,
  onExpandChange,
  onRowAction,
  emptyMessage = "데이터가 없습니다.",
  className,
  ...rest
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

  const handleSort = (colId: string) => {
    if (!onSortChange) return;
    const newDirection =
      sortColumn === colId && sortDirection === "asc" ? "desc" : "asc";
    onSortChange(colId, newDirection);
  };

  if (variant === "compact") {
    return (
      <div
        data-name="DataTable"
        className={cn("flex flex-col w-full", className)}
        {...rest}
      >
        <CompactView
          columns={columns}
          data={data}
          selectedIds={selectedIds}
          selectable={selectable}
          toggleRow={toggleRow}
          expandedId={expandedId}
          onExpandChange={onExpandChange}
          onRowAction={onRowAction}
          emptyMessage={emptyMessage}
        />
      </div>
    );
  }

  return (
    <div
      data-name="DataTable"
      className={cn("flex flex-col items-start gap-2 w-full", className)}
      {...rest}
    >
      {/* Header */}
      <header className="flex items-center w-full bg-[#e8eef3] rounded min-w-0">
        {selectable && (
          <div className="flex w-10 h-9 items-center justify-center shrink-0">
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
            className={cn(
              "flex h-9 items-center gap-1 px-2 min-w-0",
              col.align === "left"
                ? "justify-start"
                : col.align === "right"
                  ? "justify-end"
                  : "justify-center",
              col.sortable && "cursor-pointer select-none",
            )}
            style={{
              flex: col.fixed
                ? `0 0 ${col.width}`
                : col.width
                  ? `1 0 ${col.width}`
                  : "1 1 0%",
            }}
            onClick={col.sortable ? () => handleSort(col.id) : undefined}
          >
            <span className="font-bold text-[#333333] text-sm tracking-[-0.14px] leading-5 whitespace-nowrap">
              {col.header}
            </span>
            {col.sortable && (
              <SortIcon
                direction={sortDirection}
                active={sortColumn === col.id}
              />
            )}
          </div>
        ))}
      </header>

      {/* Rows */}
      <div className="flex flex-col items-start gap-2 w-full">
        {data.length === 0 ? (
          <div className="flex items-center justify-center w-full min-h-[44px] bg-white rounded border border-[#dddddd]">
            <span className="text-sm text-[#999999]">{emptyMessage}</span>
          </div>
        ) : (
          data.map((row) => {
            const isSelected = selectedIds?.has(row.id) ?? false;
            return (
              <article
                key={row.id}
                className={cn(
                  "flex items-center w-full min-h-[48px] rounded border transition-colors",
                  isSelected
                    ? "bg-[#e9f1ff] border-[#0077ff]"
                    : "bg-white border-[#dddddd] hover:border-[#0077ff]",
                )}
              >
                {selectable && (
                  <div className="flex w-10 items-center justify-center shrink-0">
                    <Checkbox
                      checked={isSelected}
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
                      col.align === "left"
                        ? "justify-start"
                        : col.align === "right"
                          ? "justify-end"
                          : "justify-center",
                    )}
                    style={{
                      flex: col.fixed
                        ? `0 0 ${col.width}`
                        : col.width
                          ? `1 0 ${col.width}`
                          : "1 1 0%",
                    }}
                  >
                    {col.render(row)}
                  </div>
                ))}
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}

export type { DataTableColumn, DataTableProps };
