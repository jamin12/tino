import { type ReactNode } from "react";
import { Maximize2 } from "lucide-react";
import { cn } from "../cn";
import { StatusDot } from "../primitives/StatusDot";
import { IconNav, type IconNavItem } from "./IconNav";
import { Button } from "../primitives/Button";

interface ResourceDetailPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 리소스 이름 */
  title: string;
  /** 상태 점 색상 */
  statusColor?: string;
  /** 헤더 우측 뱃지 영역 */
  statusBadges?: ReactNode;
  /** 좌측 아이콘 네비게이션 항목 */
  iconNavItems: IconNavItem[];
  /** 활성 아이콘 네비게이션 ID */
  activeIconNavId: string;
  /** 아이콘 네비게이션 변경 핸들러 */
  onIconNavChange?: (id: string) => void;
  children: ReactNode;
}

export function ResourceDetailPanel({
  title,
  statusColor,
  statusBadges,
  iconNavItems,
  activeIconNavId,
  onIconNavChange,
  children,
  className,
  ...props
}: ResourceDetailPanelProps) {
  return (
    <div
      data-name="ResourceDetailPanel"
      className={cn("flex flex-col h-full bg-white", className)}
      {...props}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-5 h-[52px] shrink-0 border-b border-neutral-200">
        {statusColor && <StatusDot color={statusColor} size="md" />}
        <span className="flex-1 text-[15px] font-bold text-[#111] truncate leading-5">
          {title}
        </span>
        {statusBadges}
        <Button variant="icon" size="icon" aria-label="확대">
          <Maximize2 className="w-4 h-4 text-[#555]" />
        </Button>
      </div>

      {/* Body: IconNav + Content */}
      <div className="flex flex-1 min-h-0">
        <IconNav
          items={iconNavItems}
          activeId={activeIconNavId}
          onItemChange={onIconNavChange}
        />
        <div className="flex-1 min-w-0 overflow-auto bg-[#eef0f2]">
          {children}
        </div>
      </div>
    </div>
  );
}
