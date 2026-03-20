import { useState, useCallback, useMemo } from "react";
import { useParams, Link } from "react-router";
import { useDocument, buildScreenLinkMap } from "@entities/document";
import { useSlideViewerStore } from "@features/slide-viewer";
import { SlidePresenter } from "@widgets/slide-presenter";
import { ScreenGraphViewer } from "@widgets/screen-graph-viewer";

type ViewMode = "slides" | "graph";

export function DocumentPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: document, isLoading } = useDocument(slug!);
  const [viewMode, setViewMode] = useState<ViewMode>("slides");

  const currentSlideIndex = useSlideViewerStore((s) => s.currentSlideIndex);
  const setSlideIndex = useSlideViewerStore((s) => s.setSlideIndex);

  const linkMap = useMemo(
    () => (document?.slides ? buildScreenLinkMap(document.slides) : undefined),
    [document?.slides],
  );

  const focusScreenId = document?.slides[currentSlideIndex]?.meta.screenId;

  // 전체 모드에서 노드 클릭 → 슬라이드로 이동
  const handleGraphNodeClick = useCallback(
    (screenId: string) => {
      if (!document?.slides) return;
      const idx = document.slides.findIndex(
        (s) => s.meta.screenId === screenId,
      );
      if (idx >= 0) {
        setSlideIndex(idx);
        setViewMode("slides");
      }
    },
    [document?.slides, setSlideIndex],
  );

  // Focus 모드에서 노드 클릭 → 슬라이드 인덱스만 동기화 (뷰 전환 없음)
  const handleFocusChange = useCallback(
    (screenId: string) => {
      if (!document?.slides) return;
      const idx = document.slides.findIndex(
        (s) => s.meta.screenId === screenId,
      );
      if (idx >= 0) setSlideIndex(idx);
    },
    [document?.slides, setSlideIndex],
  );

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <div className="text-lg text-gray-500">Document not found</div>
        <Link to="/" className="mt-4 text-sm text-blue-600 hover:underline">
          Back to documents
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-gray-900">
            {document.meta.title}
          </h1>

          {/* View mode toggle */}
          <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-0.5">
            <button
              onClick={() => setViewMode("slides")}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                viewMode === "slides"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Slides
            </button>
            <button
              onClick={() => setViewMode("graph")}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                viewMode === "graph"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Screen Map
            </button>
          </div>
        </div>
        <Link
          to={`/document/${slug}/present${currentSlideIndex > 0 ? `?slide=${currentSlideIndex}` : ""}`}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          Present
        </Link>
      </div>

      {/* Content — SlidePresenter는 항상 마운트 유지 (store 동기화 보존) */}
      <div className="flex-1 overflow-hidden relative">
        <div className={viewMode === "slides" ? "h-full" : "hidden"}>
          <SlidePresenter slides={document.slides} docs={document.docs} />
        </div>
        {viewMode === "graph" && (
          <div className="absolute inset-0">
            <ScreenGraphViewer
              linkMap={linkMap}
              focusScreenId={focusScreenId}
              onNodeClick={handleGraphNodeClick}
              onFocusChange={handleFocusChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
