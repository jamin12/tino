import { cn } from "../cn";

interface StatusCardProps extends React.HTMLAttributes<HTMLElement> {
  label: string;
  count: number;
  color: string;
  unit?: string;
}

export function StatusCard({
  label,
  count,
  color,
  unit = "개",
  className,
  ...props
}: StatusCardProps) {
  return (
    <article
      className={cn(
        "flex flex-col w-[280px] h-20 items-end justify-end gap-1 px-5 py-2.5",
        "bg-neutral-50 rounded border border-[#edeff1] shadow-[2px_2px_8px_#0000000d]",
        className,
      )}
      {...props}
    >
      <header className="flex items-center gap-2 w-full">
        <div
          className="w-3 h-3 rounded-full shrink-0"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        />
        <h3
          className="font-bold text-sm tracking-[-0.14px] leading-[18.2px] whitespace-nowrap"
          style={{ color }}
        >
          {label}
        </h3>
      </header>
      <div className="inline-flex items-baseline gap-0.5">
        <span className="font-bold text-[#222222] text-2xl tracking-[-0.24px] leading-9">
          {count}
        </span>
        <span className="font-medium text-[#333333] text-[13px] tracking-[-0.13px] leading-5">
          {unit}
        </span>
      </div>
    </article>
  );
}
