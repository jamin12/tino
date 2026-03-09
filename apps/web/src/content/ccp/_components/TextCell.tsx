import { cn } from "./cn";

interface TextCellProps {
  children: React.ReactNode;
  bold?: boolean;
  color?: string;
  linked?: boolean;
  wrap?: boolean;
  className?: string;
}

export function TextCell({
  children,
  bold,
  color = "#333333",
  linked,
  wrap,
  className,
}: TextCellProps) {
  return (
    <span
      className={cn(
        "text-sm tracking-[-0.14px] leading-5",
        wrap ? "break-all" : "whitespace-nowrap",
        bold ? "font-bold" : "font-medium",
        linked && "text-[#0077ff] hover:underline cursor-pointer",
        className,
      )}
      style={linked ? undefined : { color }}
    >
      {children}
    </span>
  );
}
