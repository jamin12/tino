import type { ComponentType } from "react";
import type {
  DocumentMeta,
  DiscoveredDocument,
  DocFile,
  SlideMeta,
  SlideWithMeta,
  ScreenLinkMap,
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

// Lazily import all docs/*.md files as raw text
const docModules = import.meta.glob<string>("/src/content/**/docs/*.md", {
  query: "?raw",
  import: "default",
});

function getSlugFromPath(path: string): string {
  // "/src/content/example-project-overview/meta.ts" → "example-project-overview"
  // "/src/content/ccp/cicd/storage/SlideXxx.tsx" → "ccp"
  const contentPrefix = "/src/content/";
  const rest = path.slice(contentPrefix.length); // "ccp/cicd/storage/SlideXxx.tsx"
  return rest.split("/")[0];
}

/** slug 이후의 상대 폴더 경로를 추출 (예: "ccp/namespace/workspace/Slide01.tsx" → "namespace/workspace/") */
function getFolderFromPath(path: string, slug: string): string {
  const prefix = `/src/content/${slug}/`;
  const rest = path.slice(prefix.length); // "namespace/workspace/Slide01.tsx"
  const lastSlash = rest.lastIndexOf("/");
  return lastSlash >= 0 ? rest.slice(0, lastSlash + 1) : "";
}

/** docs 파일의 상위 폴더 경로를 추출 (docs/ 디렉토리의 부모, 예: "namespace/workspace/docs/xxx.md" → "namespace/workspace/") */
function getDocFolderFromPath(path: string, slug: string): string {
  const prefix = `/src/content/${slug}/`;
  const rest = path.slice(prefix.length); // "namespace/workspace/docs/xxx.md"
  const docsIdx = rest.indexOf("/docs/");
  return docsIdx >= 0 ? rest.slice(0, docsIdx + 1) : "";
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
): Promise<{ meta: DocumentMeta; slides: SlideWithMeta[]; docs: DocFile[] } | undefined> {
  const metaPath = `/src/content/${slug}/meta.ts`;
  const metaMod = metaModules[metaPath];
  if (!metaMod) return undefined;

  // Collect and sort slide paths for this slug
  const prefix = `/src/content/${slug}/`;
  const slidePaths = Object.keys(slideModules)
    .filter((path) => path.startsWith(prefix))
    .sort();

  // Collect doc paths for this slug
  const docPaths = Object.keys(docModules)
    .filter((path) => path.startsWith(prefix))
    .sort();

  // Load all slides and docs in parallel
  const [slides, docs] = await Promise.all([
    Promise.all(
      slidePaths.map(async (path) => {
        const mod = await slideModules[path]();
        return {
          component: mod.default,
          meta: mod.slideMeta ?? {},
          folder: getFolderFromPath(path, slug),
        };
      }),
    ),
    Promise.all(
      docPaths.map(async (path) => {
        const content = await docModules[path]();
        // Extract filename without extension from path
        const fileName = path.split("/").pop()?.replace(/\.md$/, "") ?? "untitled";
        return { name: fileName, content, folder: getDocFolderFromPath(path, slug) } as DocFile;
      }),
    ),
  ]);

  return {
    meta: metaMod.default,
    slides,
    docs,
  };
}

/** 슬라이드 배열에서 화면 연결 맵을 생성 (outgoing + incoming 역추적) */
export function buildScreenLinkMap(slides: SlideWithMeta[]): ScreenLinkMap {
  const map: ScreenLinkMap = {};

  // 1) 모든 screenId를 가진 슬라이드로 노드 초기화
  for (const slide of slides) {
    const { screenId, title, section, links } = slide.meta;
    if (!screenId) continue;
    map[screenId] = {
      screenId,
      title,
      section,
      outgoing: links ?? [],
      incoming: [],
    };
  }

  // 2) outgoing 링크를 순회하며 incoming(역방향) 자동 생성
  for (const [fromId, node] of Object.entries(map)) {
    for (const link of node.outgoing) {
      const target = map[link.targetScreenId];
      if (!target) continue;
      target.incoming.push({
        fromScreenId: fromId,
        type: link.type,
        label: link.label,
      });
    }
  }

  return map;
}
