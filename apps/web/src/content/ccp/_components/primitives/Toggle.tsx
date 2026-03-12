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
      className={cn("inline-flex items-center gap-1.5", className)}
      onClick={() => onChange?.(!checked)}
      {...props}
    >
      {label && (
        <span
          className={cn(
            "text-[13px] font-medium leading-5 tracking-[-0.13px]",
            checked ? "text-[#0077ff]" : "text-[#9ca3af]",
          )}
        >
          {label}
        </span>
      )}
      <div
        className={cn(
          "relative w-[34px] h-[20px] rounded-full transition-colors",
          checked ? "bg-[#0077ff]" : "bg-[#d1d5db]",
        )}
      >
        <div
          className={cn(
            "absolute top-[2px] w-4 h-4 rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-[16px]" : "translate-x-[2px]",
          )}
        />
      </div>
    </button>
  );
}
