export interface DocumentMeta {
  title: string;
  description?: string;
  createdAt: string; // ISO date string
  tags?: string[];
}

export interface DiscoveredDocument {
  slug: string;
  meta: DocumentMeta;
  slideCount: number;
}
