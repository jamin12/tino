import type { SlideElement } from "@entities/document";
import { getElementRenderer } from "@entities/element";

interface Props {
  element: SlideElement;
}

function FallbackElement({ type }: { type: string }) {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-400">
      Unsupported element: {type}
    </div>
  );
}

export function ElementRenderer({ element }: Props) {
  const Renderer = getElementRenderer(element.type);

  if (!Renderer) {
    return <FallbackElement type={element.type} />;
  }

  return <Renderer {...element} />;
}
