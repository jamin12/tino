import { cn } from "../cn";

interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  color?: string;
}

export function Divider({ className, color, ...props }: DividerProps) {
  return (
    <hr
      className={cn("w-full h-px border-0", className)}
      style={{ backgroundColor: color ?? "#e0e0e0" }}
      {...props}
    />
  );
}
