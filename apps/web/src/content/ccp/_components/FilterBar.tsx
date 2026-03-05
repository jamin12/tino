import type { ReactNode } from "react";
import { cn } from "./cn";

interface FilterBarProps {
  children: ReactNode;
  className?: string;
}

export function FilterBar({ children, className }: FilterBarProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-1 mb-3",
        className,
      )}
    >
      {children}
    </div>
  );
}
