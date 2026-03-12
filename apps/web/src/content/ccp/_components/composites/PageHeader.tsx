import type { ReactNode } from "react";
import { Breadcrumb } from "./Breadcrumb";
import { cn } from "../cn";

interface BreadcrumbItem {
  label: string;
  isBold?: boolean;
}

interface PageHeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  breadcrumbs: BreadcrumbItem[];
  title: ReactNode;
  actions?: ReactNode;
}

export function PageHeader({
  breadcrumbs,
  title,
  actions,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <header
      data-name="PageHeader"
      className={cn(
        "flex flex-col items-start gap-2 px-8 py-5 bg-white border-b border-neutral-200",
        className,
      )}
      {...props}
    >
      <Breadcrumb items={breadcrumbs} />
      <div className="flex items-center gap-2 w-full">
        <h1 className="flex-1 font-bold text-[#111111] text-xl tracking-[-0.20px] leading-7">
          {title}
        </h1>
        {actions && (
          <div className="flex items-center gap-4">{actions}</div>
        )}
      </div>
    </header>
  );
}
