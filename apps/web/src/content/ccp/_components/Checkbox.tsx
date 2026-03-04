import { cn } from "./cn";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Checkbox({ className, label, id, ...props }: CheckboxProps) {
  return (
    <div className="flex items-center gap-1.5">
      <input
        type="checkbox"
        id={id}
        className={cn(
          "w-[18px] h-[18px] rounded-sm border border-[#dddddd] bg-white cursor-pointer accent-[#0077ff]",
          className,
        )}
        {...props}
      />
      {label && (
        <label
          htmlFor={id}
          className="text-[13px] font-medium leading-5 tracking-[-0.13px] text-[#333333] cursor-pointer"
        >
          {label}
        </label>
      )}
    </div>
  );
}
