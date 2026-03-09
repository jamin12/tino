import { Button } from "./Button";
import { cn } from "./cn";

interface FormAction {
  label: string;
  variant?: "ghost" | "primary" | "blue-solid" | "blue-border";
}

interface FormActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  actions?: FormAction[];
}

const defaultActions: FormAction[] = [
  { label: "취소", variant: "ghost" },
  { label: "임시저장", variant: "ghost" },
  { label: "검증", variant: "blue-solid" },
  { label: "생성", variant: "primary" },
];

export function FormActions({
  actions = defaultActions,
  className,
  ...props
}: FormActionsProps) {
  return (
    <div
      className={cn("flex items-center justify-center gap-2 py-4", className)}
      {...props}
    >
      {actions.map((action) => (
        <Button key={action.label} variant={action.variant} size="md">
          {action.label}
        </Button>
      ))}
    </div>
  );
}
