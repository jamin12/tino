import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./cn";

const badgeVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium text-[13px] leading-5 tracking-[-0.13px]",
  {
    variants: {
      variant: {
        // ─── 기존 semantic variants ─────────────────────────────────────
        success: "bg-[#009d3214] text-[#009d32] border border-[#009d321e]",
        error: "bg-[#da1e2814] text-[#da1e28] border border-[#da1e281e]",
        warning: "bg-[#dea60014] text-[#dea600] border border-[#dea6001e]",
        info: "bg-[#6366f114] text-[#6366f1] border border-[#6366f11e]",
        primary: "bg-[#0077ff14] text-[#0077ff] border border-[#0077ff1e]",
        neutral: "bg-[#f0f0f0] text-[#5e5e5e] border border-[#0077ff1e]",
        on: "bg-[#00ba06] text-white",
        off: "bg-[#555555] text-white",
        outline: "bg-transparent text-black border border-[#060606]",

        // ─── fe-ccp color × style variants ──────────────────────────────
        // solid: 채워진 배경
        "blue-solid": "bg-[#0077ff] text-white border border-[#0077ff]",
        "red-solid": "bg-[#da1e28] text-white border border-[#da1e28]",
        "green-solid": "bg-[#009d32] text-white border border-[#009d32]",
        "gray-solid": "bg-[#888888] text-white border border-[#888888]",
        "yellow-solid": "bg-[#dea600] text-white border border-[#dea600]",
        "orange-solid": "bg-[#f57c00] text-white border border-[#f57c00]",

        // outline: 투명 배경 + 색상 테두리
        "blue-outline":
          "bg-transparent text-[#0077ff] border border-[#0077ff]",
        "red-outline":
          "bg-transparent text-[#da1e28] border border-[#da1e28]",
        "green-outline":
          "bg-transparent text-[#009d32] border border-[#009d32]",
        "gray-outline":
          "bg-transparent text-[#888888] border border-[#888888]",
        "yellow-outline":
          "bg-transparent text-[#dea600] border border-[#dea600]",
        "orange-outline":
          "bg-transparent text-[#f57c00] border border-[#f57c00]",

        // label: 연한 배경 + 테두리
        "blue-label":
          "bg-[#0077ff14] text-[#333] border border-[#0077ff30] text-xs font-normal",
        "red-label":
          "bg-[#da1e2814] text-[#333] border border-[#da1e2830] text-xs font-normal",
        "green-label":
          "bg-[#009d3214] text-[#333] border border-[#009d3230] text-xs font-normal",
        "gray-label":
          "bg-[#88888814] text-[#333] border border-[#88888830] text-xs font-normal",
        "yellow-label":
          "bg-[#dea60014] text-[#333] border border-[#dea60030] text-xs font-normal",
        "orange-label":
          "bg-[#f57c0014] text-[#333] border border-[#f57c0030] text-xs font-normal",
      },
      size: {
        sm: "px-1.5 py-0.5 rounded-sm",
        md: "px-3 py-0.5 rounded",
      },
    },
    defaultVariants: {
      variant: "neutral",
      size: "md",
    },
  },
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
  onDelete?: () => void;
}

export function Badge({
  className,
  variant,
  size,
  children,
  onDelete,
  ...props
}: BadgeProps) {
  if (onDelete) {
    return (
      <span className={cn("relative inline-flex group", className)}>
        <span
          className={cn(badgeVariants({ variant, size }))}
          {...props}
        >
          {children}
        </span>
        <button
          type="button"
          aria-label="삭제"
          className="absolute -right-1.5 -top-1.5 w-4 h-4 flex items-center justify-center bg-[#ffebee] border border-[#ef5350] rounded-full text-[#c62828] text-xs leading-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all cursor-pointer p-0 hover:bg-[#ef5350] hover:text-white"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          ×
        </button>
      </span>
    );
  }

  return (
    <span
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </span>
  );
}
