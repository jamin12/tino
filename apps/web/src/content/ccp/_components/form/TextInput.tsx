import { cn } from "../cn";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  width?: string;
}

export function TextInput({
  width,
  className,
  ...props
}: TextInputProps) {
  return (
    <div
      className={cn(
        "inline-flex h-8 items-center gap-2.5 px-2 bg-white rounded-sm border border-[#dddddd]",
        className,
      )}
      style={{ width }}
    >
      <input
        type="text"
        className="flex-1 min-w-0 text-[13px] font-normal tracking-[-0.13px] leading-5 text-[#333333] placeholder:text-[#999999] bg-transparent border-none outline-none"
        {...props}
      />
    </div>
  );
}
