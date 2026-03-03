import { useEffect, useCallback } from "react";
import { useSlideViewerStore } from "./index";

interface UseSlideNavigationOptions {
  totalSlides: number;
  onEscape?: () => void;
}

export function useSlideNavigation({
  totalSlides,
  onEscape,
}: UseSlideNavigationOptions) {
  const { nextSlide, prevSlide } = useSlideViewerStore();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't navigate if totalSlides is 0
      if (totalSlides === 0) return;

      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        nextSlide(totalSlides);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevSlide();
      } else if (e.key === "Escape" && onEscape) {
        e.preventDefault();
        onEscape();
      }
    },
    [nextSlide, prevSlide, totalSlides, onEscape],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}
