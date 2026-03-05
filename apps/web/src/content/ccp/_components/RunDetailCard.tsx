import type { ReactNode } from "react";
import { Badge } from "./Badge";

interface InfoItem {
  icon: ReactNode;
  label: string;
  value: string;
  linked?: boolean;
}

interface RunDetailCardProps {
  title: string;
  badge?: {
    label: string;
    variant: "primary" | "success" | "error" | "warning" | "info" | "neutral";
  };
  subtitle?: string;
  subtitleValue?: string;
  actions?: ReactNode;
  infoItems?: InfoItem[];
}

export function RunDetailCard({
  title,
  badge,
  subtitle,
  subtitleValue,
  actions,
  infoItems,
}: RunDetailCardProps) {
  return (
    <div className="flex-1 bg-white rounded-lg shadow-[0px_0px_8px_#00000014] p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-xl font-bold text-[#111111] tracking-[-0.2px]">
              {title}
            </h2>
            {badge && <Badge variant={badge.variant}>{badge.label}</Badge>}
          </div>
          {subtitle && (
            <p className="text-[#555555] text-sm tracking-[-0.14px]">
              {subtitle}:{" "}
              <span className="font-semibold text-[#111111]">
                {subtitleValue}
              </span>
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2">{actions}</div>
        )}
      </div>

      {infoItems && infoItems.length > 0 && (
        <div className="flex items-center gap-8 py-4 px-6 bg-[#f4f6f8] rounded-md border border-[#e0e0e0]">
          {infoItems.map((item, idx) => (
            <div key={item.label} className="contents">
              {idx > 0 && <div className="w-[1px] h-8 bg-[#d0d0d0]" />}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <span className="w-4 h-4 text-[#555555] flex items-center justify-center">
                    {item.icon}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-[#555555] mb-0.5">{item.label}</p>
                  <p
                    className={`text-sm font-medium ${
                      item.linked
                        ? "text-[#0077ff] hover:underline cursor-pointer"
                        : "text-[#111111]"
                    }`}
                  >
                    {item.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
