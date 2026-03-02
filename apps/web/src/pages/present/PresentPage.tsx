import { useParams, useNavigate } from "react-router";
import { useDocument } from "@entities/document";
import { useSlideViewerStore } from "@features/slide-viewer";
import { useEffect, useCallback } from "react";

export function PresentPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: document } = useDocument(slug!);
  const { currentSlideIndex, nextSlide, prevSlide, setSlideIndex } =
    useSlideViewerStore();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!document) return;
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        nextSlide(document.slides.length);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevSlide();
      } else if (e.key === "Escape") {
        navigate(`/document/${slug}`);
      }
    },
    [document, nextSlide, prevSlide, navigate, slug]
  );

  useEffect(() => {
    setSlideIndex(0);
  }, [setSlideIndex]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!document) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  const CurrentSlide = document.slides[currentSlideIndex];
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
        <span className="text-xs">
          ESC to exit · Arrow keys to navigate
        </span>
      </div>
    </div>
  );
}
