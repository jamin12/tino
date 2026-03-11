import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useDocument } from "@entities/document";
import {
  useSlideViewerStore,
  useSlideNavigation,
  useSlideUrlSync,
} from "@features/slide-viewer";

export function PresentPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: document } = useDocument(slug!);
  const { currentSlideIndex } = useSlideViewerStore();
  const totalSlides = document?.slides.length ?? 0;

  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useSlideNavigation({
    totalSlides,
    onEscape: () => navigate(`/document/${slug}`),
  });
  useSlideUrlSync(totalSlides);

  const updateScale = useCallback(() => {
    const container = containerRef.current;
    const wrapper = wrapperRef.current;
    if (!container || !wrapper) return;

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
    requestAnimationFrame(() => requestAnimationFrame(updateScale));
  }, [currentSlideIndex, updateScale]);

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
      <div ref={containerRef} className="relative flex-1 overflow-hidden">
        <div
          ref={wrapperRef}
          className="absolute left-1/2 top-1/2"
          style={{
            transform: `translate(-50%, -50%) scale(${scale})`,
            transformOrigin: "center center",
          }}
        >
          <div className="rounded-lg bg-white shadow-2xl">
            <CurrentSlide />
          </div>
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
