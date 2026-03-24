import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "../cn";

interface ModalProps extends Omit<ComponentPropsWithoutRef<"div">, "title"> {
  /** 모달 제목 */
  title: string;
  /** 제목 왼쪽 아이콘 */
  titleIcon?: ReactNode;
  /** 제목 오른쪽 추가 요소 (예: Badge) */
  titleExtra?: ReactNode;
  /** 본문 콘텐츠 */
  children: ReactNode;
  /** 하단 액션 버튼 영역 */
  footer?: ReactNode;
  /** 다이얼로그 너비 (기본: 520px) */
  width?: string;
}

export function Modal({
  title,
  titleIcon,
  titleExtra,
  children,
  footer,
  width = "520px",
  className,
  ...props
}: ModalProps) {
  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/40"
      {...props}
    >
      <div
        className={cn(
          "bg-white rounded-lg shadow-[0px_4px_24px_#00000033] flex flex-col",
          className,
        )}
        style={{ width }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-6 pt-5 pb-3">
          {titleIcon}
          <span className="font-bold text-[16px] leading-6 tracking-[-0.16px] text-[#111111]">
            {title}
          </span>
          {titleExtra}
        </div>

        {/* Body */}
        <div className="px-6 pb-4 flex flex-col gap-4">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#f0f0f0]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
