import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Badge } from "../primitives/Badge";

interface InfoItem {
  icon: ReactNode;
  label: string;
  value: string;
  linked?: boolean;
  badge?: {
    label: string;
    variant: "primary" | "success" | "error" | "warning" | "info" | "neutral";
  };
}

interface RunDetailCardProps {
  title?: string;
  badge?: {
    label: string;
    variant: "primary" | "success" | "error" | "warning" | "info" | "neutral";
  };
  subtitle?: string;
  subtitleValue?: string;
  actions?: ReactNode;
  infoItems?: InfoItem[];
  showBack?: boolean;
  columns?: number;
}

export function RunDetailCard({
  title,
  badge,
  subtitle,
  subtitleValue,
  actions,
  infoItems,
  showBack,
  columns,
}: RunDetailCardProps) {
  const hasHeader = title || subtitle || actions || showBack;

  return (
    <div className="flex-1 rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
      {hasHeader && (
        <div className="flex justify-between items-center px-6 py-4 bg-[#f8fafc] border-b border-[#e2e8f0]">
          <div className="flex items-center gap-3">
            {showBack && (
              <button
                type="button"
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#e2e8f0] bg-white hover:bg-[#f1f5f9] text-[#64748b] hover:text-[#0f172a] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            {title && (
              <h2 className="text-[15px] font-bold text-[#0f172a] tracking-[-0.2px] font-mono">
                {title}
              </h2>
            )}
            {badge && <Badge variant={badge.variant}>{badge.label}</Badge>}
          </div>
          {actions && (
            <div className="flex items-center gap-2">{actions}</div>
          )}
        </div>
      )}

      {infoItems && infoItems.length > 0 && (() => {
        const cols = columns ?? infoItems.length;
        return (
        <div
          className="grid gap-0"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {infoItems.map((item, idx) => {
            const col = idx % cols;
            const row = Math.floor(idx / cols);
            return (
            <div
              key={item.label}
              className={`flex items-center gap-3.5 px-5 py-4 bg-white ${
                col > 0 ? "border-l border-[#e2e8f0]" : ""
              } ${row > 0 ? "border-t border-[#e2e8f0]" : ""}`}
            >
              <div className="w-10 h-10 rounded-xl bg-[#f1f5f9] flex items-center justify-center border border-[#dde3ea]">
                <span className="w-[18px] h-[18px] text-[#475569] flex items-center justify-center">
                  {item.icon}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-[#94a3b8] font-semibold uppercase tracking-wider mb-1">{item.label}</p>
                {item.badge ? (
                  <Badge variant={item.badge.variant}>{item.badge.label}</Badge>
                ) : (
                  <p
                    className={`text-[13px] font-semibold truncate ${
                      item.linked
                        ? "text-[#0077ff] hover:underline cursor-pointer"
                        : "text-[#1e293b]"
                    }`}
                  >
                    {item.value}
                  </p>
                )}
              </div>
            </div>
            );
          })}
        </div>
        );
      })()}
    </div>
  );
}
