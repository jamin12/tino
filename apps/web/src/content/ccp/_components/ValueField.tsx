import { type ReactNode } from "react";
import { cn } from "./cn";

interface ValueFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** 멀티라인 콘텐츠용 높은 컨테이너 */
  tall?: boolean;
  /** 자동 너비 (flex-1 대신 내용에 맞춤) */
  auto?: boolean;
}

export function ValueField({
  children,
  tall,
  auto,
  className,
  ...props
}: ValueFieldProps) {
  return (
    <div
      className={cn(
        "bg-white rounded flex items-center gap-2 px-3 min-w-0",
        auto ? "flex-none" : "flex-1",
        tall ? "min-h-[52px] py-2 items-start" : "h-8",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
