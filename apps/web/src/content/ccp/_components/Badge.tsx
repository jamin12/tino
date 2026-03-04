import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./cn";

const badgeVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium text-[13px] leading-5 tracking-[-0.13px]",
  {
    variants: {
      variant: {
        success: "bg-[#009d3214] text-[#009d32] border border-[#009d321e]",
        error: "bg-[#da1e2814] text-[#da1e28] border border-[#da1e281e]",
        warning: "bg-[#dea60014] text-[#dea600] border border-[#dea6001e]",
        info: "bg-[#6366f114] text-[#6366f1] border border-[#6366f11e]",
        primary: "bg-[#0077ff14] text-[#0077ff] border border-[#0077ff1e]",
        neutral: "bg-[#f0f0f0] text-[#5e5e5e] border border-[#0077ff1e]",
        on: "bg-[#00ba06] text-white",
        off: "bg-[#555555] text-white",
        outline: "bg-transparent text-black border border-[#060606]",
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
}

export function Badge({
  className,
  variant,
  size,
  children,
  ...props
}: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {children}
    </span>
  );
}
