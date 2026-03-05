import type { ReactNode } from "react";
import { cn } from "./cn";

interface CardProps {
  children: ReactNode;
  header?: ReactNode;
  padding?: string;
  className?: string;
}

export function Card({
  children,
  header,
  padding = "p-6",
  className,
}: CardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-lg shadow-[0px_0px_8px_#00000014] overflow-hidden",
        !header && padding,
        className,
      )}
    >
      {header}
      {header ? <div className={padding}>{children}</div> : children}
    </div>
  );
}
