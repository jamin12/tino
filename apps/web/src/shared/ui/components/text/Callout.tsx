import type { CalloutElement } from "@entities/document";

type Props = Pick<CalloutElement, "variant" | "title" | "content">;

const variantStyles = {
  info: "border-blue-200 bg-blue-50 text-blue-800",
  warning: "border-yellow-200 bg-yellow-50 text-yellow-800",
  tip: "border-green-200 bg-green-50 text-green-800",
  error: "border-red-200 bg-red-50 text-red-800",
};

const variantIcons = {
  info: "ℹ️",
  warning: "⚠️",
  tip: "💡",
  error: "❌",
};

export function Callout({ variant = "info", title, content }: Props) {
  return (
    <div className={`rounded-lg border p-4 ${variantStyles[variant]}`}>
      <div className="flex items-start gap-2">
        <span className="text-lg">{variantIcons[variant]}</span>
        <div>
          {title && <p className="font-semibold">{title}</p>}
          <p className={title ? "mt-1" : ""}>{content}</p>
        </div>
      </div>
    </div>
  );
}
