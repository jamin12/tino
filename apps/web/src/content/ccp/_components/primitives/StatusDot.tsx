import { cn } from "../cn";
import { colors } from "../tokens";

type StatusDotColor = "success" | "error" | "warning" | "info" | "teal" | "primary";

const colorMap: Record<StatusDotColor, string> = {
  success: colors.success.DEFAULT,
  error: colors.error.DEFAULT,
  warning: colors.warning.DEFAULT,
  info: colors.info.DEFAULT,
  teal: colors.teal.DEFAULT,
  primary: colors.primary.DEFAULT,
};

interface StatusDotProps extends React.HTMLAttributes<HTMLDivElement> {
  color: StatusDotColor | string;
  size?: "sm" | "md";
  label?: string;
  labelClassName?: string;
}

export function StatusDot({
  color,
  size = "md",
  label,
  labelClassName,
  className,
  ...props
}: StatusDotProps) {
  const resolvedColor = color in colorMap ? colorMap[color as StatusDotColor] : color;
  const dotSize = size === "sm" ? "w-2 h-2" : "w-3 h-3";

  return (
    <div className={cn("inline-flex items-center gap-2", className)} {...props}>
      <div
        className={cn("rounded-full shrink-0", dotSize)}
        style={{ backgroundColor: resolvedColor }}
        role="status"
        aria-label={label ?? color}
      />
      {label && (
        <span
          className={cn(
            "font-semibold text-sm leading-[18.2px] tracking-[-0.14px] whitespace-nowrap",
            labelClassName,
          )}
          style={{ color: resolvedColor }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
