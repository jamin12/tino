import { ChevronDown } from "lucide-react";
import { cn } from "./cn";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  options: SelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  minWidth?: string;
}

export function Select({
  label,
  options,
  value,
  onValueChange,
  minWidth = "150px",
  className,
  ...props
}: SelectProps) {
  return (
    <div
      className={cn(
        "relative inline-flex h-8 items-center gap-2.5 px-2 py-1.5 bg-white rounded-sm border border-[#dddddd]",
        className,
      )}
      style={{ minWidth }}
      {...props}
    >
      <span className="flex-1 text-[13px] font-normal tracking-[-0.13px] leading-5 text-[#333333]">
        {label}
      </span>
      <select
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        value={value}
        onChange={(e) => onValueChange?.(e.target.value)}
        aria-label={label}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="w-4 h-4 text-[#555555] pointer-events-none" />
    </div>
  );
}
