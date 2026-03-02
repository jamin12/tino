import type { QuoteElement } from "@entities/document";

type Props = Pick<QuoteElement, "content" | "author">;

export function Quote({ content, author }: Props) {
  return (
    <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600">
      <p className="leading-relaxed">{content}</p>
      {author && (
        <footer className="mt-2 text-sm font-medium text-gray-500">
          — {author}
        </footer>
      )}
    </blockquote>
  );
}
