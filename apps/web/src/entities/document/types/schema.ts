import { z } from "zod";

// Base element schema
const baseElementSchema = z.object({
  id: z.string(),
  type: z.string(),
  position: z.object({ x: z.number(), y: z.number() }).optional(),
  size: z.object({ width: z.number(), height: z.number() }).optional(),
});

// Text elements
const headingElementSchema = baseElementSchema.extend({
  type: z.literal("heading"),
  level: z.number().min(1).max(6),
  content: z.string(),
});

const textElementSchema = baseElementSchema.extend({
  type: z.literal("text"),
  content: z.string(),
});

const listElementSchema = baseElementSchema.extend({
  type: z.literal("list"),
  ordered: z.boolean().default(false),
  items: z.array(z.string()),
});

const calloutElementSchema = baseElementSchema.extend({
  type: z.literal("callout"),
  variant: z.enum(["info", "warning", "tip", "error"]).default("info"),
  title: z.string().optional(),
  content: z.string(),
});

const codeElementSchema = baseElementSchema.extend({
  type: z.literal("code"),
  language: z.string().default("typescript"),
  code: z.string(),
});

const tableElementSchema = baseElementSchema.extend({
  type: z.literal("table"),
  headers: z.array(z.string()),
  rows: z.array(z.array(z.string())),
});

const quoteElementSchema = baseElementSchema.extend({
  type: z.literal("quote"),
  content: z.string(),
  author: z.string().optional(),
});

// Diagram elements
const flowchartNodeSchema = z.object({
  id: z.string(),
  label: z.string(),
  shape: z
    .enum(["rectangle", "diamond", "circle", "parallelogram"])
    .default("rectangle"),
  color: z.string().optional(),
  position: z.object({ x: z.number(), y: z.number() }),
});

const flowchartEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  label: z.string().optional(),
  type: z.enum(["default", "step", "smoothstep"]).default("default"),
});

const flowchartElementSchema = baseElementSchema.extend({
  type: z.literal("flowchart"),
  nodes: z.array(flowchartNodeSchema),
  edges: z.array(flowchartEdgeSchema),
});

interface MindmapNodeInput {
  id: string;
  label: string;
  children?: MindmapNodeInput[];
}

const mindmapNodeSchema: z.ZodType<MindmapNodeInput> = z.lazy(() =>
  z.object({
    id: z.string(),
    label: z.string(),
    children: z.array(mindmapNodeSchema).optional(),
  }),
);

const mindmapElementSchema = baseElementSchema.extend({
  type: z.literal("mindmap"),
  root: mindmapNodeSchema,
});

// Structure elements
const dividerElementSchema = baseElementSchema.extend({
  type: z.literal("divider"),
});

const spacerElementSchema = baseElementSchema.extend({
  type: z.literal("spacer"),
  height: z.number().default(24),
});

const imageElementSchema = baseElementSchema.extend({
  type: z.literal("image"),
  src: z.string().optional(),
  alt: z.string().default(""),
  placeholder: z.string().optional(),
});

// Union of all element types
const slideElementSchema = z.discriminatedUnion("type", [
  headingElementSchema,
  textElementSchema,
  listElementSchema,
  calloutElementSchema,
  codeElementSchema,
  tableElementSchema,
  quoteElementSchema,
  flowchartElementSchema,
  mindmapElementSchema,
  dividerElementSchema,
  spacerElementSchema,
  imageElementSchema,
]);

// Slide schema
const slideSchema = z.object({
  id: z.string(),
  title: z.string(),
  elements: z.array(slideElementSchema),
  notes: z.string().optional(),
  layout: z.enum(["default", "two-column", "full-width"]).default("default"),
  backgroundColor: z.string().optional(),
});

// Document metadata
const documentMetadataSchema = z.object({
  createdAt: z.number(),
  updatedAt: z.number(),
  version: z.number().default(1),
  tags: z.array(z.string()).default([]),
  aiModel: z.string().optional(),
  originalPrompt: z.string().optional(),
});

// Full document schema
const tinoDocumentSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  slides: z.array(slideSchema),
  metadata: documentMetadataSchema,
});

// Export schemas
export {
  tinoDocumentSchema,
  slideSchema,
  slideElementSchema,
  headingElementSchema,
  textElementSchema,
  listElementSchema,
  calloutElementSchema,
  codeElementSchema,
  tableElementSchema,
  quoteElementSchema,
  flowchartElementSchema,
  mindmapElementSchema,
  dividerElementSchema,
  spacerElementSchema,
  imageElementSchema,
  flowchartNodeSchema,
  flowchartEdgeSchema,
  mindmapNodeSchema,
  documentMetadataSchema,
};

// Export inferred types
export type TinoDocument = z.infer<typeof tinoDocumentSchema>;
export type Slide = z.infer<typeof slideSchema>;
export type SlideElement = z.infer<typeof slideElementSchema>;
export type HeadingElement = z.infer<typeof headingElementSchema>;
export type TextElement = z.infer<typeof textElementSchema>;
export type ListElement = z.infer<typeof listElementSchema>;
export type CalloutElement = z.infer<typeof calloutElementSchema>;
export type CodeElement = z.infer<typeof codeElementSchema>;
export type TableElement = z.infer<typeof tableElementSchema>;
export type QuoteElement = z.infer<typeof quoteElementSchema>;
export type FlowchartElement = z.infer<typeof flowchartElementSchema>;
export type FlowchartNode = z.infer<typeof flowchartNodeSchema>;
export type FlowchartEdge = z.infer<typeof flowchartEdgeSchema>;
export type MindmapElement = z.infer<typeof mindmapElementSchema>;
export type MindmapNode = z.infer<typeof mindmapNodeSchema>;
export type DividerElement = z.infer<typeof dividerElementSchema>;
export type SpacerElement = z.infer<typeof spacerElementSchema>;
export type ImageElement = z.infer<typeof imageElementSchema>;
export type DocumentMetadata = z.infer<typeof documentMetadataSchema>;
