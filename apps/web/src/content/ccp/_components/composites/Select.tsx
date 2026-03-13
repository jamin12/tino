import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../cn";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  options: SelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  minWidth?: string;
}

export function Select({
  label,
  options,
  value: controlledValue,
  onValueChange,
  minWidth = "150px",
  className,
  ...props
}: SelectProps) {
  const [internalValue, setInternalValue] = useState(controlledValue ?? options[0]?.value ?? "");
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  const displayLabel = options.find((o) => o.value === currentValue)?.label ?? label ?? options[0]?.label ?? "";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

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
        {displayLabel}
      </span>
      <select
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        value={currentValue}
        onChange={handleChange}
        aria-label={label ?? displayLabel}
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
