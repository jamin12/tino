import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentType,
} from "react";
import {
  useSlideViewerStore,
  useSlideNavigation,
} from "@features/slide-viewer";
import { CopyToFigmaButton } from "@features/export-to-figma";

interface Props {
  slides: ComponentType[];
}

export function SlidePresenter({ slides }: Props) {
  const { currentSlideIndex, setSlideIndex, nextSlide, prevSlide } =
    useSlideViewerStore();

  const captureRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const CurrentSlide = slides[currentSlideIndex];

  useSlideNavigation({ totalSlides: slides.length });

  // Reset to first slide when slides change
  useEffect(() => {
    setSlideIndex(0);
  }, [slides, setSlideIndex]);

  const updateScale = useCallback(() => {
    const container = containerRef.current;
    const wrapper = wrapperRef.current;
    if (!container || !wrapper) return;

    // Reset to measure natural size
    wrapper.style.transform = "translate(-50%, -50%) scale(1)";

    const sw = wrapper.scrollWidth;
    const sh = wrapper.scrollHeight;
    const cw = container.clientWidth;
    const ch = container.clientHeight;

    if (sw > 0 && sh > 0) {
      const s = Math.min(cw / sw, ch / sh, 1);
      setScale(s);
      wrapper.style.transform = `translate(-50%, -50%) scale(${s})`;
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ro = new ResizeObserver(updateScale);
    ro.observe(container);
    return () => ro.disconnect();
  }, [updateScale]);

  useEffect(() => {
    requestAnimationFrame(updateScale);
  }, [currentSlideIndex, updateScale]);

  if (!CurrentSlide) return null;

  return (
    <div className="flex h-full">
      {/* Thumbnail sidebar */}
      <div className="flex w-24 flex-col gap-1.5 overflow-y-auto border-r border-gray-200 bg-gray-50 p-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setSlideIndex(index)}
            className={`rounded border px-2 py-1.5 text-left text-[10px] transition-colors ${
              index === currentSlideIndex
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
            }`}
          >
            <div className="font-medium">{index + 1}</div>
          </button>
        ))}
      </div>

      {/* Main slide area */}
      <div className="flex flex-1 flex-col relative">
        {/* Header tools */}
        <div className="absolute top-4 right-4 z-10">
          <CopyToFigmaButton
            targetRef={captureRef}
            onBeforeCapture={() => {
              if (wrapperRef.current) {
                wrapperRef.current.style.transform = "translate(-50%, -50%)";
              }
            }}
            onAfterCapture={() => {
              if (wrapperRef.current) {
                wrapperRef.current.style.transform = `translate(-50%, -50%) scale(${scale})`;
              }
            }}
          />
        </div>

        {/* Slide content */}
        <div className="flex-1 overflow-hidden bg-gray-100 p-4">
          <div ref={containerRef} className="relative h-full w-full">
            <div
              ref={wrapperRef}
              className="absolute left-1/2 top-1/2"
              style={{
                transform: `translate(-50%, -50%) scale(${scale})`,
                transformOrigin: "center center",
              }}
            >
              <div
                ref={captureRef}
                className="rounded-lg border border-gray-200 bg-white shadow-sm"
              >
                <CurrentSlide />
              </div>
            </div>
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
