import type { HeadingElement } from "@entities/document";

type Props = Pick<HeadingElement, "level" | "content">;

const headingTags = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
  5: "h5",
  6: "h6",
} as const;

const sizes: Record<number, string> = {
  1: "text-4xl font-bold",
  2: "text-3xl font-bold",
  3: "text-2xl font-semibold",
  4: "text-xl font-semibold",
  5: "text-lg font-medium",
  6: "text-base font-medium",
};

export function Heading({ level, content }: Props) {
  const Tag = headingTags[level as keyof typeof headingTags] ?? "h3";

  return (
    <Tag className={`${sizes[level] ?? sizes[3]} text-gray-900`}>
      {content}
    </Tag>
  );
}
