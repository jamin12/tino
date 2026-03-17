import { cn } from "../cn";

interface ToggleProps extends Omit<React.HTMLAttributes<HTMLButtonElement>, "onChange"> {
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export function Toggle({
  label,
  checked = false,
  onChange,
  className,
  ...props
}: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={cn("inline-flex items-center gap-[4px]", className)}
      onClick={() => onChange?.(!checked)}
      {...props}
    >
      {label && (
        <span
          className={cn(
            "text-[13px] font-medium leading-5 tracking-[-0.13px]",
            checked ? "text-[#0077ff]" : "text-[#6d7073]",
          )}
        >
          {label}
        </span>
      )}
      <div
        className={cn(
          "relative w-[24px] h-[14px] rounded-[10px] transition-colors",
          checked ? "bg-[#0077ff]" : "bg-[#dddddd]",
        )}
      >
        <div
          className={cn(
            "absolute top-[2px] w-[10px] h-[10px] rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-[12px]" : "translate-x-[2px]",
          )}
        />
      </div>
    </button>
  );
}
