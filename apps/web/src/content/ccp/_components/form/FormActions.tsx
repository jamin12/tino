import type { ReactNode } from "react";
import { Button } from "../primitives/Button";
import { cn } from "../cn";

interface FormAction {
  label: string;
  variant?: "ghost" | "primary" | "blue-solid" | "blue-border" | "gray-solid";
  annotationId?: number;
}

interface FormActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  actions?: FormAction[];
  left?: ReactNode;
}

const defaultActions: FormAction[] = [
  { label: "취소", variant: "gray-solid" },
  { label: "임시저장", variant: "ghost" },
  { label: "검증", variant: "blue-solid" },
  { label: "생성", variant: "primary" },
];

export function FormActions({
  actions = defaultActions,
  left,
  className,
  ...props
}: FormActionsProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-t border-[#e5e7eb] mt-6 pt-4",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-3">
        {left ?? (
          <>
            <Button variant="primary" size="md">
              불러오기
            </Button>
            <span className="text-[13px] text-[#666666] tracking-[-0.13px] leading-5">
              이전에 작성한 임시저장된 설정이 있습니다.
            </span>
          </>
        )}
      </div>
      <div className="flex items-center gap-2">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant={action.variant}
            size="md"
            {...(action.annotationId != null ? { "data-annotation-id": String(action.annotationId) } : {})}
          >
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
