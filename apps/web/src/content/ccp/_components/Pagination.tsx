import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "./cn";

interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  currentPage: number;
  totalPages: number;
  visiblePages?: number[];
  itemsPerPage?: number;
  itemsPerPageOptions?: number[];
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (count: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  visiblePages = [1, 2, 3, 4, 5],
  itemsPerPage = 5,
  itemsPerPageOptions = [5, 10, 20, 50],
  onPageChange,
  onItemsPerPageChange,
  className,
  ...props
}: PaginationProps) {
  return (
    <nav
      className={cn("flex items-center justify-center gap-2", className)}
      aria-label="Pagination"
      {...props}
    >
      <button
        type="button"
        className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 disabled:opacity-40"
        onClick={() => onPageChange?.(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4 text-[#555555]" />
      </button>

      <div className="inline-flex items-center gap-1" role="list">
        {visiblePages.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            className={cn(
              "flex w-7 h-7 items-center justify-center rounded text-sm tracking-[-0.14px] leading-5",
              currentPage === pageNumber
                ? "bg-[#0077ff] font-bold text-white"
                : "font-medium text-[#555555] hover:bg-gray-100",
            )}
            onClick={() => onPageChange?.(pageNumber)}
            aria-label={`Page ${pageNumber}`}
            aria-current={currentPage === pageNumber ? "page" : undefined}
            role="listitem"
          >
            {pageNumber}
          </button>
        ))}

        {totalPages > visiblePages.length && (
          <>
            <div
              className="flex w-7 h-7 items-center justify-center font-medium text-[#555555] text-sm"
              aria-hidden="true"
              role="listitem"
            >
              &middot; &middot; &middot;
            </div>
            <button
              type="button"
              className={cn(
                "flex w-7 h-7 items-center justify-center rounded text-sm tracking-[-0.14px] leading-5 font-medium text-[#555555] hover:bg-gray-100",
              )}
              onClick={() => onPageChange?.(totalPages)}
              aria-label={`Page ${totalPages}`}
              role="listitem"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      <button
        type="button"
        className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 disabled:opacity-40"
        onClick={() => onPageChange?.(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4 text-[#555555]" />
      </button>

      {onItemsPerPageChange && (
        <div className="ml-auto">
          <div className="relative w-[62px] h-8 bg-white rounded-sm border border-[#dddddd]">
            <select
              className="absolute inset-0 w-full h-full px-2 text-[13px] font-normal text-[#333333] tracking-[-0.13px] leading-5 bg-transparent border-none appearance-none cursor-pointer"
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              aria-label="Items per page"
            >
              {itemsPerPageOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <ChevronRight className="absolute right-1.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555555] rotate-90 pointer-events-none" />
          </div>
        </div>
      )}
    </nav>
  );
}
