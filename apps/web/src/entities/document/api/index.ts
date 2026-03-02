import type { ComponentType } from "react";
import type { DocumentMeta, DiscoveredDocument } from "../types";

// Eagerly import all meta.ts files from content directories
const metaModules = import.meta.glob<{ default: DocumentMeta }>(
  "/src/content/*/meta.ts",
  { eager: true }
);

// Lazily import all Slide*.tsx files
const slideModules = import.meta.glob<{ default: ComponentType }>(
  "/src/content/*/Slide*.tsx"
);

function getSlugFromPath(path: string): string {
  // "/src/content/example-project-overview/meta.ts" → "example-project-overview"
  const parts = path.split("/");
  return parts[parts.length - 2];
}

function countSlides(slug: string): number {
  return Object.keys(slideModules).filter((path) =>
    path.startsWith(`/src/content/${slug}/Slide`)
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
    .sort((a, b) => new Date(b.meta.createdAt).getTime() - new Date(a.meta.createdAt).getTime());
}

export async function getDocument(
  slug: string
): Promise<{ meta: DocumentMeta; slides: ComponentType[] } | undefined> {
  const metaPath = `/src/content/${slug}/meta.ts`;
  const metaMod = metaModules[metaPath];
  if (!metaMod) return undefined;

  // Collect and sort slide paths for this slug
  const slidePaths = Object.keys(slideModules)
    .filter((path) => path.startsWith(`/src/content/${slug}/Slide`))
    .sort();

  // Load all slides in parallel
  const slides = await Promise.all(
    slidePaths.map(async (path) => {
      const mod = await slideModules[path]();
      return mod.default;
    })
  );

  return {
    meta: metaMod.default,
    slides,
  };
}
