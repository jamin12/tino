import type { ComponentType } from "react";
import type { SlideElement } from "@entities/document";
import {
  Heading,
  Paragraph,
  BulletList,
  Callout,
  CodeBlock,
  DataTable,
  Quote,
} from "@shared/ui/components/text";
import { Flowchart, MindMap } from "@shared/ui/components/diagram";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ElementRendererMap = Record<string, ComponentType<any>>;

const elementRenderers: ElementRendererMap = {
  heading: Heading,
  text: Paragraph,
  list: BulletList,
  callout: Callout,
  code: CodeBlock,
  table: DataTable,
  quote: Quote,
  flowchart: Flowchart,
  mindmap: MindMap,
};

export function getElementRenderer(
  type: SlideElement["type"],
): ComponentType<Record<string, unknown>> | null {
  return elementRenderers[type] ?? null;
}
