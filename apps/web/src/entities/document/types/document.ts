export interface DocumentMeta {
  title: string;
  description?: string;
  createdAt: string; // ISO date string
  tags?: string[];
}

export interface SlideMeta {
  title?: string;
  section?: string;
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
