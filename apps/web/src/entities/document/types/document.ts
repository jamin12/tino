export interface DocumentMeta {
  title: string;
  description?: string;
  createdAt: string; // ISO date string
  tags?: string[];
}

export interface SlideAnnotation {
  id: number;
  label: string;
  description: string;
  x: number; // px from left of slide content
  y: number; // px from top of slide content
}

export interface SlideMeta {
  title?: string;
  section?: string;
  annotations?: SlideAnnotation[];
}

export interface SlideWithMeta {
  component: React.ComponentType;
  meta: SlideMeta;
}

export interface DiscoveredDocument {
  slug: string;
  meta: DocumentMeta;
  slideCount: number;
}
