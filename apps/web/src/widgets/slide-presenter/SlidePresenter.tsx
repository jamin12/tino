import { useEffect, type ComponentType } from "react";
import {
  useSlideViewerStore,
  useSlideNavigation,
} from "@features/slide-viewer";

interface Props {
  slides: ComponentType[];
}

export function SlidePresenter({ slides }: Props) {
  const { currentSlideIndex, setSlideIndex, nextSlide, prevSlide } =
    useSlideViewerStore();

  const CurrentSlide = slides[currentSlideIndex];

  useSlideNavigation({ totalSlides: slides.length });

  // Reset to first slide when slides change
  useEffect(() => {
    setSlideIndex(0);
  }, [slides, setSlideIndex]);

  if (!CurrentSlide) return null;

  return (
    <div className="flex h-full">
      {/* Thumbnail sidebar */}
      <div className="flex w-48 flex-col gap-2 overflow-y-auto border-r border-gray-200 bg-gray-50 p-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setSlideIndex(index)}
            className={`rounded-lg border p-2 text-left text-xs transition-colors ${
              index === currentSlideIndex
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
            }`}
          >
            <div className="font-medium">Slide {index + 1}</div>
          </button>
        ))}
      </div>

      {/* Main slide area */}
      <div className="flex flex-1 flex-col">
        {/* Slide content */}
        <div className="flex flex-1 items-center justify-center overflow-auto bg-gray-100 p-8">
          <div className="aspect-video w-full max-w-4xl rounded-lg border border-gray-200 bg-white p-12 shadow-sm">
            <CurrentSlide />
          </div>
        </div>

        {/* Navigation bar */}
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-3">
          <button
            onClick={prevSlide}
            disabled={currentSlideIndex === 0}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">
            {currentSlideIndex + 1} / {slides.length}
          </span>
          <button
            onClick={() => nextSlide(slides.length)}
            disabled={currentSlideIndex === slides.length - 1}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
