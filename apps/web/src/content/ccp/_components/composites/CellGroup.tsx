import { Badge } from "../primitives/Badge";

interface CellGroupProps {
  text: string;
  linked?: boolean;
  badge?: string;
  badgeVariant?: "primary" | "success" | "error" | "warning" | "info" | "neutral";
}

export function CellGroup({
  text,
  linked,
  badge,
  badgeVariant = "primary",
}: CellGroupProps) {
  return (
    <div className="flex items-center gap-1.5 px-4">
      <span
        className={`text-sm font-medium tracking-[-0.14px] leading-5 whitespace-nowrap ${
          linked ? "text-[#0077ff]" : "text-[#333333]"
        }`}
      >
        {text}
      </span>
      {badge && <Badge variant={badgeVariant}>{badge}</Badge>}
    </div>
  );
}
