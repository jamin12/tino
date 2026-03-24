import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { AlertTriangle, Info, XCircle } from "lucide-react";
import { cn } from "../cn";

const variants = {
  warning: {
    bg: "bg-[#fff8e1]",
    border: "border-[#ffe082]",
    iconColor: "text-[#f59e0b]",
    textColor: "#92400e",
    Icon: AlertTriangle,
  },
  error: {
    bg: "bg-[#fef2f2]",
    border: "border-[#fecaca]",
    iconColor: "text-[#da1e28]",
    textColor: "#991b1b",
    Icon: XCircle,
  },
  info: {
    bg: "bg-[#eff6ff]",
    border: "border-[#bfdbfe]",
    iconColor: "text-[#3b82f6]",
    textColor: "#1e40af",
    Icon: Info,
  },
} as const;

interface AlertBannerProps extends ComponentPropsWithoutRef<"div"> {
  variant?: keyof typeof variants;
  title: string;
  children?: ReactNode;
}

export function AlertBanner({
  variant = "warning",
  title,
  children,
  className,
  ...props
}: AlertBannerProps) {
  const v = variants[variant];

  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 px-4 py-3 border rounded-md",
        v.bg,
        v.border,
        className,
      )}
      {...props}
    >
      <div className="flex items-start gap-2">
        <v.Icon className={cn("w-4 h-4 shrink-0 mt-0.5", v.iconColor)} />
        <div className="flex flex-col gap-1">
          <span
            className="font-bold text-[13px] leading-5 tracking-[-0.13px]"
            style={{ color: v.textColor }}
          >
            {title}
          </span>
          {children && (
            <span
              className="text-[12px] leading-[18px] tracking-[-0.12px] break-all"
              style={{ color: v.textColor }}
            >
              {children}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
