import { type ReactNode } from "react";
import { cn } from "../cn";

interface InfoRowProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  labelWidth?: string;
  children: ReactNode;
}

export function InfoRow({
  label,
  labelWidth = "86px",
  children,
  className,
  ...props
}: InfoRowProps) {
  return (
    <div
      className={cn(
        "flex min-h-8 items-center gap-3 w-full rounded-md",
        className,
      )}
      {...props}
    >
      <div
        className="flex items-center gap-2.5 py-1.5 shrink-0"
        style={{ width: labelWidth }}
      >
        <span className="text-[13px] font-medium leading-5 tracking-[-0.13px] text-[#333333] whitespace-nowrap">
          {label}
        </span>
      </div>
      <div className="flex items-center gap-3 flex-1 min-w-0 flex-wrap">
        {children}
      </div>
    </div>
  );
}
