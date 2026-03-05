import { useParams, useNavigate } from "react-router";
import { useDocument } from "@entities/document";
import {
  useSlideViewerStore,
  useSlideNavigation,
} from "@features/slide-viewer";
import { useEffect } from "react";

export function PresentPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: document } = useDocument(slug!);
  const { currentSlideIndex, setSlideIndex } = useSlideViewerStore();

  useSlideNavigation({
    totalSlides: document?.slides.length ?? 0,
    onEscape: () => navigate(`/document/${slug}`),
  });

  useEffect(() => {
    setSlideIndex(0);
  }, [setSlideIndex]);

  if (!document) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  const CurrentSlide = document.slides[currentSlideIndex]?.component;
  if (!CurrentSlide) return null;

  return (
    <div className="flex h-screen flex-col bg-black">
      {/* Slide */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="aspect-video w-full max-w-6xl rounded-lg bg-white p-16 shadow-2xl">
          <CurrentSlide />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-center gap-4 py-4 text-white/60">
        <span className="text-sm">
          {currentSlideIndex + 1} / {document.slides.length}
        </span>
        <span className="text-xs">ESC to exit · Arrow keys to navigate</span>
      </div>
    </div>
  );
}
