import { cn } from "./cn";

interface TooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Tooltip({ children, className, ...props }: TooltipProps) {
  return (
    <div
      className={cn(
        "inline-flex flex-col items-start gap-1 px-2.5 py-1.5",
        "bg-[#1b2c3f] rounded-[0px_12px_12px_12px] shadow-[4px_4px_8px_#1b2c3f33]",
        className,
      )}
      role="tooltip"
      {...props}
    >
      <span className="font-medium text-white text-[11px] tracking-[-0.11px] leading-[14.3px]">
        {children}
      </span>
    </div>
  );
}
