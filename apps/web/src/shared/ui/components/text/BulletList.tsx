import type { ListElement } from "@entities/document";

type Props = Pick<ListElement, "ordered" | "items">;

export function BulletList({ ordered, items }: Props) {
  const Tag = ordered ? "ol" : "ul";

  return (
    <Tag className={`space-y-1.5 pl-6 text-gray-700 ${ordered ? "list-decimal" : "list-disc"}`}>
      {items.map((item, index) => (
        <li key={index} className="leading-relaxed">
          {item}
        </li>
      ))}
    </Tag>
  );
}
