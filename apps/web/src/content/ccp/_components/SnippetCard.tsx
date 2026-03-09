import { cn } from "./cn";

interface SnippetCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  variant?: "blue" | "red" | "neutral";
}

const borderColorMap = {
  blue: "border-[#0077ff]",
  red: "border-[#da1e28]",
  neutral: "border-[#e5e7eb]",
};

const titleColorMap = {
  blue: "text-[#0077ff]",
  red: "text-[#da1e28]",
  neutral: "text-[#333333]",
};

const bgMap = {
  blue: "bg-[#0077ff08]",
  red: "bg-[#da1e2808]",
  neutral: "bg-white",
};

export function SnippetCard({
  title,
  description,
  variant = "neutral",
  className,
  ...props
}: SnippetCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 p-4 rounded-lg border cursor-pointer hover:shadow-sm transition-shadow",
        borderColorMap[variant],
        bgMap[variant],
        className,
      )}
      {...props}
    >
      <span className={cn("text-sm font-bold leading-5", titleColorMap[variant])}>
        {title}
      </span>
      <span className="text-xs leading-4 text-[#666666]">{description}</span>
    </div>
  );
}
