import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "../cn";

/* ─── ItemGroup ─────────────────────────────────────────────────────────────
 * 레이블 + 테두리가 있는 목록. 삭제 확인 대상 목록 등에 사용.
 * ────────────────────────────────────────────────────────────────────────── */

interface ItemGroupProps extends ComponentPropsWithoutRef<"div"> {
  label?: string;
  children: ReactNode;
}

export function ItemGroup({ label, children, className, ...props }: ItemGroupProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)} {...props}>
      {label && (
        <span className="font-bold text-[13px] leading-5 tracking-[-0.13px] text-[#333333] mb-1">
          {label}
        </span>
      )}
      <div className="border border-[#e8e8e8] rounded-md overflow-hidden divide-y divide-[#f0f0f0]">
        {children}
      </div>
    </div>
  );
}

/* ─── ItemGroupRow ──────────────────────────────────────────────────────── */

interface ItemGroupRowProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
}

export function ItemGroupRow({ children, className, ...props }: ItemGroupRowProps) {
  return (
    <div
      className={cn("flex items-center gap-3 px-4 py-2.5", className)}
      {...props}
    >
      {children}
    </div>
  );
}
