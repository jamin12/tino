import { X } from "lucide-react";
import { cn } from "../cn";

interface FormBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  lines: string[];
}

export function FormBanner({
  title,
  lines,
  className,
  ...props
}: FormBannerProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col gap-1.5 px-5 py-4 bg-gradient-to-r from-[#1a365d] to-[#2d5fa0] rounded-lg text-white",
        className,
      )}
      {...props}
    >
      <span className="font-bold text-sm leading-5">{title}</span>
      {lines.map((line, i) => (
        <span
          key={i}
          className="text-xs leading-4 text-white/80"
        >
          {line}
        </span>
      ))}
      <button
        type="button"
        className="absolute top-3 right-3 w-5 h-5 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30"
        aria-label="닫기"
      >
        <X className="w-3 h-3 text-white" />
      </button>
    </div>
  );
}
