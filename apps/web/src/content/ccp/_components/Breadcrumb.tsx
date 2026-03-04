import { ChevronRight } from "lucide-react";
import { cn } from "./cn";

interface BreadcrumbItem {
  label: string;
  isBold?: boolean;
}

interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items, className, ...props }: BreadcrumbProps) {
  return (
    <nav
      className={cn("inline-flex items-center", className)}
      aria-label="Breadcrumb"
      {...props}
    >
      <ol className="inline-flex items-center gap-1">
        {items.map((item, index) => (
          <li key={index} className="inline-flex items-center gap-1">
            <span
              className={cn(
                "text-xs tracking-[-0.12px] leading-[18px] whitespace-nowrap text-[#555555]",
                item.isBold ? "font-bold" : "font-normal",
              )}
            >
              {item.label}
            </span>
            {index < items.length - 1 && (
              <ChevronRight
                className="w-4 h-4 text-[#555555]"
                aria-hidden="true"
              />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
