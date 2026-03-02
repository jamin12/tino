import type { TextElement } from "@entities/document";
import ReactMarkdown from "react-markdown";

type Props = Pick<TextElement, "content">;

export function Paragraph({ content }: Props) {
  return (
    <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
