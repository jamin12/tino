import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "../cn";

interface FieldGroupProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  gap?: "sm" | "md" | "lg";
}

const gapMap = {
  sm: "gap-1",
  md: "gap-1.5",
  lg: "gap-3",
};

export function FieldGroup({
  children,
  gap = "md",
  className,
  ...props
}: FieldGroupProps) {
  return (
    <div className={cn("flex flex-col", gapMap[gap], className)} {...props}>
      {children}
    </div>
  );
}
