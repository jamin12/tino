import type { ReactNode } from "react";
import { cn } from "./cn";

interface ContentSectionProps {
  children: ReactNode;
  card?: boolean;
  relative?: boolean;
  spacing?: "sm" | "md" | "lg";
  className?: string;
}

const spacingMap = {
  sm: "mt-3",
  md: "mt-5",
  lg: "mt-8",
};

export function ContentSection({
  children,
  card,
  relative,
  spacing = "md",
  className,
}: ContentSectionProps) {
  return (
    <div
      className={cn(
        "mx-8",
        spacingMap[spacing],
        relative && "relative",
        className,
      )}
    >
      {card ? (
        <div className="bg-white rounded-lg shadow-[0px_0px_8px_#00000014] p-5">
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
}
