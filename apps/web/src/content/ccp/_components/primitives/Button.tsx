import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "../cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1 whitespace-nowrap cursor-pointer transition-colors font-bold text-[13px] leading-5 tracking-[-0.13px]",
  {
    variants: {
      variant: {
        // ─── 기존 tino variants ─────────────────────────────────────────
        primary: "bg-[#0077ff] text-white hover:bg-[#0066dd] rounded-sm",
        "primary-semi":
          "bg-[#0077ff80] text-white hover:bg-[#0077ff] rounded-sm",
        secondary:
          "bg-white text-[#014b9f] border-2 border-[#014b9f] rounded-[18px] hover:bg-[#014b9f] hover:text-white",
        danger:
          "bg-[#da1e28] text-white border border-[#da1e28] rounded-sm hover:bg-[#b81922]",
        ghost:
          "bg-[#f9f9f9] text-[#333333] border border-[#dddddd] rounded-sm hover:bg-[#f0f0f0]",
        icon: "bg-[#f9f9f9] border border-[#dddddd] rounded-sm hover:bg-[#f0f0f0]",

        // ─── fe-ccp color × style variants ──────────────────────────────
        // solid variants
        "blue-solid":
          "bg-[#0077ff] text-white border border-[#0077ff] rounded-sm hover:bg-[#005fcc] active:opacity-80",
        "red-solid":
          "bg-[#da1e28] text-white border border-[#da1e28] rounded-sm hover:bg-[#b81922] active:opacity-80",
        "green-solid":
          "bg-[#009d32] text-white border border-[#009d32] rounded-sm hover:bg-[#007d28] active:opacity-80",
        "navy-solid":
          "bg-[#1b2c3f] text-white border border-[#1b2c3f] rounded-sm hover:bg-[#0f1a28] active:opacity-80",
        "gray-solid":
          "bg-[#888888] text-white border border-[#888888] rounded-sm hover:bg-[#666666] active:opacity-80",

        // border variants
        "blue-border":
          "bg-white text-[#0077ff] border border-[#0077ff] rounded-sm hover:bg-[#0077ff15]",
        "red-border":
          "bg-white text-[#da1e28] border border-[#da1e28] rounded-sm hover:bg-[#da1e2815]",
        "green-border":
          "bg-white text-[#009d32] border border-[#009d32] rounded-sm hover:bg-[#009d3215]",
        "navy-border":
          "bg-white text-[#1b2c3f] border border-[#1b2c3f] rounded-sm hover:bg-[#1b2c3f15]",
        "gray-border":
          "bg-white text-[#888888] border border-[#888888] rounded-sm hover:bg-[#88888815]",
      },
      size: {
        xsmall: "h-6 px-2 py-0.5 text-xs",
        sm: "h-7 px-2 py-1",
        md: "h-8 min-w-[60px] px-2 py-1.5",
        lg: "h-[34px] px-3 py-1.5",
        xlarge: "h-[34px] px-4 py-1.5 text-sm",
        icon: "w-8 h-8 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  isLoading?: boolean;
  isDisabled?: boolean;
}

export function Button({
  className,
  variant,
  size,
  children,
  isLoading = false,
  isDisabled,
  disabled,
  ...props
}: ButtonProps) {
  const isButtonDisabled = isDisabled || disabled || isLoading;

  return (
    <button
      className={cn(
        buttonVariants({ variant, size }),
        isButtonDisabled && "cursor-not-allowed opacity-60",
        className,
      )}
      type="button"
      disabled={isButtonDisabled}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center justify-center gap-2 relative">
          {children}
          <Loader2 className="w-4 h-4 animate-spin" />
        </span>
      ) : (
        children
      )}
    </button>
  );
}
