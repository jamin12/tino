import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1 whitespace-nowrap cursor-pointer transition-colors font-bold text-[13px] leading-5 tracking-[-0.13px]",
  {
    variants: {
      variant: {
        primary: "bg-[#0077ff] text-white hover:bg-[#0066dd] rounded-sm",
        "primary-semi": "bg-[#0077ff80] text-white hover:bg-[#0077ff] rounded-sm",
        secondary:
          "bg-white text-[#014b9f] border-2 border-[#014b9f] rounded-[18px] hover:bg-[#014b9f] hover:text-white",
        danger:
          "bg-[#da1e28] text-white border border-[#da1e28] rounded-sm hover:bg-[#b81922]",
        ghost:
          "bg-[#f9f9f9] text-[#333333] border border-[#dddddd] rounded-sm hover:bg-[#f0f0f0]",
        icon: "bg-[#f9f9f9] border border-[#dddddd] rounded-sm hover:bg-[#f0f0f0]",
      },
      size: {
        sm: "h-7 px-2 py-1",
        md: "h-8 min-w-[60px] px-2 py-1.5",
        lg: "h-[34px] px-3 py-1.5",
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
}

export function Button({
  className,
  variant,
  size,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}
