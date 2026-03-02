import type { CodeElement } from "@entities/document";

type Props = Pick<CodeElement, "language" | "code">;

export function CodeBlock({ language, code }: Props) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <div className="flex items-center justify-between bg-gray-100 px-4 py-2">
        <span className="text-xs font-medium text-gray-500">{language}</span>
      </div>
      <pre className="overflow-x-auto bg-gray-950 p-4">
        <code className="text-sm leading-relaxed text-gray-100">{code}</code>
      </pre>
    </div>
  );
}
