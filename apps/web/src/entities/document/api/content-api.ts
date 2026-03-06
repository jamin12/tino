import type { ComponentType } from "react";
import type {
  DocumentMeta,
  DiscoveredDocument,
  SlideMeta,
  SlideWithMeta,
} from "../types";

// Eagerly import all meta.ts files from content directories
const metaModules = import.meta.glob<{ default: DocumentMeta }>(
  "/src/content/*/meta.ts",
  { eager: true },
);

// Lazily import all Slide*.tsx files (includes optional slideMeta named export)
const slideModules = import.meta.glob<{
  default: ComponentType;
  slideMeta?: SlideMeta;
}>("/src/content/**/Slide*.tsx");

function getSlugFromPath(path: string): string {
  // "/src/content/example-project-overview/meta.ts" → "example-project-overview"
  // "/src/content/ccp/cicd/storage/SlideXxx.tsx" → "ccp"
  const contentPrefix = "/src/content/";
  const rest = path.slice(contentPrefix.length); // "ccp/cicd/storage/SlideXxx.tsx"
  return rest.split("/")[0];
}

function countSlides(slug: string): number {
  const prefix = `/src/content/${slug}/`;
  return Object.keys(slideModules).filter((path) =>
    path.startsWith(prefix),
  ).length;
}

export function getDocuments(): DiscoveredDocument[] {
  return Object.entries(metaModules)
    .filter(([path]) => !path.includes("/_template/"))
    .map(([path, mod]) => {
      const slug = getSlugFromPath(path);
      return {
        slug,
        meta: mod.default,
        slideCount: countSlides(slug),
      };
    })
    .sort(
      (a, b) =>
        new Date(b.meta.createdAt).getTime() -
        new Date(a.meta.createdAt).getTime(),
    );
}

export async function getDocument(
  slug: string,
): Promise<{ meta: DocumentMeta; slides: SlideWithMeta[] } | undefined> {
  const metaPath = `/src/content/${slug}/meta.ts`;
  const metaMod = metaModules[metaPath];
  if (!metaMod) return undefined;

  // Collect and sort slide paths for this slug
  const prefix = `/src/content/${slug}/`;
  const slidePaths = Object.keys(slideModules)
    .filter((path) => path.startsWith(prefix))
    .sort();

  // Load all slides in parallel (component + optional slideMeta)
  const slides: SlideWithMeta[] = await Promise.all(
    slidePaths.map(async (path) => {
      const mod = await slideModules[path]();
      return {
        component: mod.default,
        meta: mod.slideMeta ?? {},
      };
    }),
  );

  return {
    meta: metaMod.default,
    slides,
  };
}
