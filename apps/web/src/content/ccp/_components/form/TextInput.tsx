import { cn } from "../cn";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  width?: string;
}

export function TextInput({
  width,
  className,
  disabled,
  ...props
}: TextInputProps) {
  return (
    <div
      className={cn(
        "inline-flex h-8 items-center gap-2.5 px-2 rounded-sm border border-[#dddddd]",
        disabled ? "bg-[#f5f5f5] opacity-50 cursor-not-allowed" : "bg-white",
        className,
      )}
      style={{ width }}
    >
      <input
        type="text"
        className={cn(
          "flex-1 min-w-0 text-[13px] font-normal tracking-[-0.13px] leading-5 placeholder:text-[#999999] bg-transparent border-none outline-none",
          disabled ? "text-[#999999] cursor-not-allowed" : "text-[#333333]",
        )}
        disabled={disabled}
        {...props}
      />
    </div>
  );
}
