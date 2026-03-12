import type { ReactNode } from "react";
import { cn } from "./cn";

interface ListDetailLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 메인 리스트 영역 */
  children: ReactNode;
  /** 상세 패널 영역 (오른쪽 오버레이) */
  detail: ReactNode;
  /** 상세 패널 너비 (기본 480px) */
  detailWidth?: string;
}

export function ListDetailLayout({
  children,
  detail,
  detailWidth = "480px",
  className,
  ...props
}: ListDetailLayoutProps) {
  return (
    <div className={cn("relative h-full", className)} {...props}>
      <div className="h-full overflow-hidden">{children}</div>
      <div
        data-name="DetailPanel"
        style={{ width: detailWidth }}
        className="absolute top-0 right-0 h-full border-l border-neutral-200 shadow-[-4px_0_12px_rgba(0,0,0,0.08)]"
      >
        {detail}
      </div>
    </div>
  );
}
