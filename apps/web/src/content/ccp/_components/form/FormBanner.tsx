import { Info, X } from "lucide-react";
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
        "relative flex overflow-hidden rounded-lg h-[118px]",
        className,
      )}
      {...props}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[#f3f5fa]" />

      {/* Left accent bar */}
      <div className="relative w-[6px] shrink-0 bg-gradient-to-b from-[#7fa3c0] to-[#9bb6cb]" />

      {/* Content */}
      <div className="relative flex flex-col justify-center gap-1.5 px-5 py-4 flex-1 min-w-0">
        {/* Title */}
        <div className="flex items-center gap-1.5">
          <Info className="w-4 h-4 text-[#1c274c] shrink-0" />
          <span className="font-bold text-[16px] leading-6 text-[#1c274c] tracking-[-0.16px]">
            {title}
          </span>
        </div>

        {/* Lines */}
        <div className="flex flex-col">
          {lines.map((line, i) => (
            <div key={i} className="flex items-start gap-1.5">
              <span className="text-[#1c274c] text-[13px] leading-5 shrink-0">·</span>
              <span className="text-[13px] leading-5 text-[#333] tracking-[-0.13px]">
                {line}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Close button */}
      <button
        type="button"
        className="absolute top-3 right-3 w-5 h-5 flex items-center justify-center rounded-full bg-[#1b2c3f] hover:bg-[#2a3d52]"
        aria-label="닫기"
      >
        <X className="w-3 h-3 text-white" />
      </button>
    </div>
  );
}
