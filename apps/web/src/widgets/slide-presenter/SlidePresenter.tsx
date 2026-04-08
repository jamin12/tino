import { useCallback, useEffect, useRef, useState, useMemo, forwardRef, type MouseEvent } from "react";
import { useSearchParams } from "react-router";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  useSlideViewerStore,
  useSlideNavigation,
  useSlideUrlSync,
} from "@features/slide-viewer";
import { CopyToFigmaButton } from "@features/export-to-figma";
import { domToFigmaSvg } from "@shared/lib";
import type { SlideWithMeta, SlideAnnotation, DocFile } from "@entities/document";

// ─── Component detection ────────────────────────────────────────────────────

const COMPONENT_SELECTORS = [
  "[data-name]",
  "[role='menu']",
  "[role='table']",
  "[role='tablist']",
  "section",
  "article",
  "nav",
  "header",
  "aside",
  "table",
  "form",
];

const SELECTOR = COMPONENT_SELECTORS.join(",");

function findNearestComponent(
  target: HTMLElement,
  boundary: HTMLElement,
): HTMLElement | null {
  let el: HTMLElement | null = target;
  while (el && el !== boundary) {
    if (el.matches(SELECTOR)) return el;
    el = el.parentElement;
  }
  return null;
}

function getComponentName(el: HTMLElement): string {
  return (
    el.getAttribute("data-name") ||
    el.getAttribute("aria-label") ||
    el.getAttribute("role") ||
    el.tagName.toLowerCase()
  );
}

// ─── Component ──────────────────────────────────────────────────────────────

interface Props {
  slides: SlideWithMeta[];
  docs?: DocFile[];
}

export function SlidePresenter({ slides, docs = [] }: Props) {
  const { currentSlideIndex, setSlideIndex, nextSlide, prevSlide } =
    useSlideViewerStore();

  const captureRef = useRef<HTMLDivElement>(null);
  const slideContentRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Ctrl 모드 상태
  const [ctrlHeld, setCtrlHeld] = useState(false);
  const [hoveredEl, setHoveredEl] = useState<HTMLElement | null>(null);
  const [selectedEl, setSelectedEl] = useState<HTMLElement | null>(null);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copying" | "copied" | "error">("idle");
  const [searchParams, setSearchParams] = useSearchParams();
  const showAnnotations = searchParams.get("spec") === "1";
  const setShowAnnotations = useCallback(
    (value: boolean | ((prev: boolean) => boolean)) => {
      setSearchParams(
        (prev) => {
          const next = typeof value === "function" ? value(prev.get("spec") === "1") : value;
          if (next) {
            prev.set("spec", "1");
          } else {
            prev.delete("spec");
          }
          return prev;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const currentSlide = slides[currentSlideIndex];
  const CurrentSlide = currentSlide?.component;
  const currentAnnotations = currentSlide?.meta.annotations;
  const currentMeta = currentSlide?.meta;
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 모든 섹션 목록 (순서 유지)
  const allSections = useMemo(() => {
    const seen = new Set<string>();
    for (const s of slides) {
      if (s.meta.section && !seen.has(s.meta.section)) seen.add(s.meta.section);
    }
    return seen;
  }, [slides]);

  // 기본: 모든 섹션 닫힘 (현재 슬라이드 섹션은 useEffect에서 열림)
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(() => new Set(allSections));
  const [docsOpen, setDocsOpen] = useState(false);


  const [activeDocIndex, setActiveDocIndex] = useState(0);

  // 현재 슬라이드 폴더에 해당하는 docs만 필터링
  const currentFolder = currentSlide?.folder ?? "";
  const filteredDocs = docs.filter((doc) => doc.folder === currentFolder);

  const handleCopyScreenId = useCallback(
    (e: MouseEvent, screenId: string) => {
      e.stopPropagation();
      navigator.clipboard.writeText(screenId).then(() => {
        setCopiedId(screenId);
        setTimeout(() => setCopiedId(null), 1500);
      });
    },
    [],
  );

  useSlideNavigation({ totalSlides: slides.length });
  useSlideUrlSync(slides.length);

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
    // Double rAF to ensure layout is settled after DOM changes (e.g. side panel toggle)
    requestAnimationFrame(() => requestAnimationFrame(updateScale));
  }, [currentSlideIndex, showAnnotations, docsOpen, updateScale]);

  // Ctrl key tracking
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "Control" || e.key === "Meta") setCtrlHeld(true);
    };
    const up = (e: KeyboardEvent) => {
      if (e.key === "Control" || e.key === "Meta") {
        setCtrlHeld(false);
        setHoveredEl(null);
      }
    };
    const blur = () => {
      setCtrlHeld(false);
      setHoveredEl(null);
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", blur);
    };
  }, []);

  // Clear selection on slide change & reset doc index, auto-expand current section (collapse others)
  useEffect(() => {
    setSelectedEl(null);
    setHoveredEl(null);
    setActiveDocIndex(0);

    const section = slides[currentSlideIndex]?.meta.section;
    if (section) {
      setCollapsedSections(() => {
        const next = new Set(allSections);
        next.delete(section);
        return next;
      });
    }
  }, [currentSlideIndex, slides, allSections]);

  // 슬라이드 높이에 맞춰 Spec 패널 max-height 직접 설정 (스크롤용)
  useEffect(() => {
    const slide = slideContentRef.current;
    const panel = panelRef.current;
    if (!slide || !panel) return;

    const sync = () => {
      panel.style.maxHeight = `${slide.offsetHeight}px`;
    };
    sync();

    const ro = new ResizeObserver(sync);
    ro.observe(slide);
    return () => ro.disconnect();
  }, [currentSlideIndex, showAnnotations]);

  // 현재 폴더에 docs가 없으면 drawer 자동 닫기
  useEffect(() => {
    if (filteredDocs.length === 0 && docsOpen) {
      setDocsOpen(false);
    }
  }, [filteredDocs.length, docsOpen]);

  // Hover detection with Ctrl
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ctrlHeld || !slideContentRef.current) {
        setHoveredEl(null);
        return;
      }
      const target = e.target as HTMLElement;
      const component = findNearestComponent(target, slideContentRef.current);
      setHoveredEl(component);
    },
    [ctrlHeld],
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredEl(null);
  }, []);

  // Click to select with Ctrl
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!ctrlHeld || !hoveredEl) return;
      e.preventDefault();
      e.stopPropagation();
      setSelectedEl(hoveredEl);
    },
    [ctrlHeld, hoveredEl],
  );

  // Copy selected component
  const restoreCopyState = useCallback(() => {
    if (wrapperRef.current) {
      wrapperRef.current.style.transform = `translate(-50%, -50%) scale(${scale})`;
    }
    if (panelRef.current && slideContentRef.current) {
      panelRef.current.style.maxHeight = `${slideContentRef.current.offsetHeight}px`;
      panelRef.current.style.overflow = "auto";
    }
  }, [scale]);

  const handleCopySelected = useCallback(async () => {
    if (!selectedEl) return;
    try {
      setCopyStatus("copying");

      // 복사 전: scale 리셋 + 패널 max-height 해제 (전체 내용 캡처)
      if (wrapperRef.current) {
        wrapperRef.current.style.transform = "translate(-50%, -50%)";
      }
      if (panelRef.current) {
        panelRef.current.style.maxHeight = "none";
        panelRef.current.style.overflow = "visible";
      }

      const name = getComponentName(selectedEl);
      const svgString = await domToFigmaSvg(selectedEl, name);

      restoreCopyState();

      if (!svgString) throw new Error("SVG extraction failed");
      await navigator.clipboard.writeText(svgString);

      setCopyStatus("copied");
      setTimeout(() => setCopyStatus("idle"), 2000);
    } catch (err) {
      restoreCopyState();
      console.error("Failed to copy component to Figma:", err);
      setCopyStatus("error");
      setTimeout(() => setCopyStatus("idle"), 2000);
    }
  }, [selectedEl, restoreCopyState]);

  // Deselect on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedEl(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Highlight overlay for hovered / selected element
  const highlightEl = selectedEl || hoveredEl;

  if (!CurrentSlide) return null;

  return (
    <div className="flex h-full">
      {/* Thumbnail sidebar */}
      <div className="flex w-28 flex-col gap-0.5 overflow-y-auto border-r border-gray-200 bg-gray-50 p-2">
        {(() => {
          const subColors = [
            { border: "border-blue-300", bg: "bg-blue-50/60", text: "text-blue-600" },
            { border: "border-amber-300", bg: "bg-amber-50/60", text: "text-amber-600" },
            { border: "border-emerald-300", bg: "bg-emerald-50/60", text: "text-emerald-600" },
            { border: "border-purple-300", bg: "bg-purple-50/60", text: "text-purple-600" },
          ];

          // 슬라이드를 렌더 그룹으로 묶기: section header / subSection 그룹 / 개별 슬라이드
          type RenderItem =
            | { type: "section-header"; section: string; index: number }
            | { type: "sub-group"; subSection: string; color: typeof subColors[number]; slides: { slide: SlideWithMeta; index: number }[] }
            | { type: "slide"; slide: SlideWithMeta; index: number };

          const items: RenderItem[] = [];
          let currentSubGroup: RenderItem & { type: "sub-group" } | null = null;
          const sectionSubCounter = new Map<string, string[]>();

          for (let i = 0; i < slides.length; i++) {
            const slide = slides[i];
            const section = slide.meta.section;
            const prevSection = i > 0 ? slides[i - 1].meta.section : undefined;
            const isNewSection = section && section !== prevSection;

            if (isNewSection) {
              if (currentSubGroup) { items.push(currentSubGroup); currentSubGroup = null; }
              items.push({ type: "section-header", section, index: i });
            }

            const subSection = slide.meta.subSection;
            if (subSection) {
              // 같은 서브그룹 계속
              if (currentSubGroup && currentSubGroup.subSection === subSection && !isNewSection) {
                currentSubGroup.slides.push({ slide, index: i });
              } else {
                // 이전 서브그룹 닫기
                if (currentSubGroup) { items.push(currentSubGroup); currentSubGroup = null; }
                // 색상 결정
                const sectionKey = section ?? "";
                if (!sectionSubCounter.has(sectionKey)) sectionSubCounter.set(sectionKey, []);
                const subs = sectionSubCounter.get(sectionKey)!;
                if (!subs.includes(subSection)) subs.push(subSection);
                const colorIdx = subs.indexOf(subSection) % subColors.length;
                currentSubGroup = { type: "sub-group", subSection, color: subColors[colorIdx], slides: [{ slide, index: i }] };
              }
            } else {
              if (currentSubGroup) { items.push(currentSubGroup); currentSubGroup = null; }
              items.push({ type: "slide", slide, index: i });
            }
          }
          if (currentSubGroup) items.push(currentSubGroup);

          return items.map((item, idx) => {
            if (item.type === "section-header") {
              const section = item.section;
              const isCollapsed = collapsedSections.has(section);
              return (
                <button
                  key={`sec-${idx}`}
                  type="button"
                  onClick={() =>
                    setCollapsedSections((prev) => {
                      const next = new Set(prev);
                      if (next.has(section)) next.delete(section);
                      else next.add(section);
                      return next;
                    })
                  }
                  className={`flex w-full items-center gap-1 px-1 py-1 text-[9px] font-semibold tracking-wide text-gray-400 uppercase cursor-pointer hover:text-gray-600 transition-colors ${item.index > 0 ? "mt-2 border-t border-gray-200 pt-2" : ""}`}
                >
                  <svg
                    className={`h-2.5 w-2.5 shrink-0 transition-transform ${isCollapsed ? "-rotate-90" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                  </svg>
                  <span className="truncate">{section}</span>
                </button>
              );
            }

            if (item.type === "sub-group") {
              const section = item.slides[0].slide.meta.section;
              const isCollapsed = section ? collapsedSections.has(section) : false;
              if (isCollapsed) return null;
              const { color } = item;
              return (
                <div key={`sub-${idx}`} className={`mt-1 rounded-md border ${color.border} ${color.bg} p-1 flex flex-col gap-0.5`}>
                  <div className="px-1 pb-0.5">
                    <span className={`text-[8px] font-bold ${color.text} tracking-wide`}>{item.subSection}</span>
                  </div>
                  {item.slides.map(({ slide, index }) => (
                    <button
                      key={index}
                      onClick={() => setSlideIndex(index)}
                      className={`w-full rounded border px-2 py-1.5 text-left text-[10px] transition-colors ${
                        index === currentSlideIndex
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {slide.meta.screenId && (
                        <div className="font-mono text-[8px] text-gray-400 mb-0.5">{slide.meta.screenId}</div>
                      )}
                      <div className="font-medium truncate">{slide.meta.title ?? index + 1}</div>
                    </button>
                  ))}
                </div>
              );
            }

            // type: "slide" (no subSection)
            const section = item.slide.meta.section;
            const isCollapsed = section ? collapsedSections.has(section) : false;
            if (isCollapsed) return null;
            return (
              <button
                key={`s-${idx}`}
                onClick={() => setSlideIndex(item.index)}
                className={`w-full rounded border px-2 py-1.5 text-left text-[10px] transition-colors ${
                  item.index === currentSlideIndex
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                {item.slide.meta.screenId && (
                  <div className="font-mono text-[8px] text-gray-400 mb-0.5">{item.slide.meta.screenId}</div>
                )}
                <div className="font-medium truncate">{item.slide.meta.title ?? item.index + 1}</div>
              </button>
            );
          });
        })()}
      </div>

      {/* Main slide area */}
      <div className="flex flex-1 flex-col relative">
        {/* Header tools */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          {/* Selected component info + copy button */}
          {selectedEl && (
            <div className="flex items-center gap-2 bg-white rounded-md border border-blue-300 shadow-sm px-3 py-1.5">
              <span className="text-xs text-blue-600 font-medium max-w-[150px] truncate">
                {getComponentName(selectedEl)}
              </span>
              <button
                type="button"
                onClick={handleCopySelected}
                disabled={copyStatus === "copying"}
                className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 cursor-pointer disabled:opacity-50"
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                {copyStatus === "copying"
                  ? "Copying..."
                  : copyStatus === "copied"
                    ? "Copied!"
                    : "Copy"}
              </button>
              <button
                type="button"
                onClick={() => setSelectedEl(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer text-sm leading-none"
              >
                ✕
              </button>
            </div>
          )}
          {currentAnnotations && currentAnnotations.length > 0 && (
            <button
              type="button"
              onClick={() => setShowAnnotations((v) => !v)}
              className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium shadow-sm transition-colors ${
                showAnnotations
                  ? "border-amber-400 bg-amber-50 text-amber-700"
                  : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              Spec
            </button>
          )}
          {filteredDocs.length > 0 && (
            <button
              type="button"
              onClick={() => setDocsOpen((v) => !v)}
              className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium shadow-sm transition-colors ${
                docsOpen
                  ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                  : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Docs
            </button>
          )}
          <CopyToFigmaButton
            targetRef={captureRef}
            title={slides[currentSlideIndex]?.meta.title}
            onBeforeCapture={() => {
              if (wrapperRef.current) {
                wrapperRef.current.style.transform = "translate(-50%, -50%)";
              }
              if (panelRef.current) {
                panelRef.current.style.maxHeight = "none";
                panelRef.current.style.overflow = "visible";
              }
            }}
            onAfterCapture={() => {
              if (wrapperRef.current) {
                wrapperRef.current.style.transform = `translate(-50%, -50%) scale(${scale})`;
              }
              if (panelRef.current && slideContentRef.current) {
                panelRef.current.style.maxHeight = `${slideContentRef.current.offsetHeight}px`;
                panelRef.current.style.overflow = "auto";
              }
            }}
          />
        </div>

        {/* Ctrl mode hint */}
        {ctrlHeld && !selectedEl && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-gray-800 text-white text-xs px-3 py-1.5 rounded-full shadow-lg pointer-events-none">
            클릭하여 컴포넌트 선택
          </div>
        )}

        {/* Slide content + annotation side panel + docs drawer */}
        <div className="flex flex-1 overflow-hidden">
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
                  className="flex"
                >
                  <div
                    ref={slideContentRef}
                    className="relative rounded-lg border border-gray-200 bg-white shadow-sm"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    onClick={handleClick}
                  >
                    {currentMeta?.screenId && (
                      <button
                        type="button"
                        onClick={(e) =>
                          handleCopyScreenId(e, currentMeta.screenId!)
                        }
                        className="absolute top-3 left-3 z-50 flex items-center gap-1.5 rounded bg-[#1b2c3f] px-2.5 py-1 shadow-md cursor-pointer hover:bg-[#263c54] active:scale-95 transition-all"
                        title="클릭하여 화면 ID 복사"
                      >
                        <span className="text-[11px] font-mono font-semibold text-white tracking-wide">
                          {copiedId === currentMeta.screenId
                            ? "Copied!"
                            : currentMeta.screenId}
                        </span>
                      </button>
                    )}
                    <CurrentSlide />
                    {showAnnotations && currentAnnotations && currentAnnotations.length > 0 && (
                      <AnnotationMarkers
                        annotations={currentAnnotations}
                        containerEl={slideContentRef.current}
                        scale={scale}
                      />
                    )}
                  </div>

                  {/* Annotation side panel (inside captureRef for Figma export) */}
                  {showAnnotations && currentAnnotations && currentAnnotations.length > 0 && (
                    <AnnotationSidePanel ref={panelRef} annotations={currentAnnotations} description={currentMeta?.description} />
                  )}
                </div>

                {/* Highlight overlay */}
                {highlightEl && slideContentRef.current && (
                  <HighlightOverlay
                    target={highlightEl}
                    container={slideContentRef.current}
                    isSelected={highlightEl === selectedEl}
                    name={getComponentName(highlightEl)}
                    scale={scale}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Docs drawer */}
          {docsOpen && filteredDocs.length > 0 && (
            <DocsDrawer
              docs={filteredDocs}
              activeIndex={activeDocIndex}
              onSelectDoc={setActiveDocIndex}
              onClose={() => setDocsOpen(false)}
            />
          )}
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
          <div className="flex flex-col items-center gap-0.5">
            {currentMeta?.screenId ? (
              <button
                type="button"
                onClick={(e) =>
                  handleCopyScreenId(e, currentMeta.screenId!)
                }
                className="inline-flex items-center gap-1.5 rounded bg-gray-100 px-2 py-0.5 font-mono text-xs font-semibold text-gray-700 hover:bg-gray-200 active:bg-gray-300 cursor-pointer transition-colors"
                title="클릭하여 화면 ID 복사"
              >
                {copiedId === currentMeta.screenId
                  ? "Copied!"
                  : currentMeta.screenId}
                {currentMeta.title && (
                  <span className="font-sans font-normal text-gray-400">
                    {currentMeta.title}
                  </span>
                )}
              </button>
            ) : currentMeta?.title ? (
              <span className="text-xs font-medium text-gray-500">
                {currentMeta.title}
              </span>
            ) : null}
            <span className="text-xs text-gray-400">
              {currentSlideIndex + 1} / {slides.length}
            </span>
          </div>
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

// ─── Highlight Overlay ──────────────────────────────────────────────────────

function HighlightOverlay({
  target,
  container,
  isSelected,
  name,
  scale,
}: {
  target: HTMLElement;
  container: HTMLElement;
  isSelected: boolean;
  name: string;
  scale: number;
}) {
  const targetRect = target.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  // getBoundingClientRect returns screen-space (post-scale) values,
  // but this overlay is inside the scaled wrapper, so divide by scale
  // to get correct un-scaled CSS positions.
  const x = (targetRect.left - containerRect.left) / scale;
  const y = (targetRect.top - containerRect.top) / scale;
  const w = targetRect.width / scale;
  const h = targetRect.height / scale;

  const borderColor = isSelected ? "border-blue-500" : "border-blue-400";
  const bgColor = isSelected ? "bg-blue-500/5" : "bg-blue-400/5";

  return (
    <div
      className={`absolute pointer-events-none border-2 ${borderColor} ${bgColor} rounded-sm transition-all duration-75`}
      style={{ left: x, top: y, width: w, height: h }}
    >
      {/* Label */}
      <div
        className={`absolute -top-5 left-0 px-1.5 py-0.5 text-[10px] font-medium text-white rounded-t-sm whitespace-nowrap ${
          isSelected ? "bg-blue-500" : "bg-blue-400"
        }`}
      >
        {name}
      </div>
    </div>
  );
}

// ─── Annotation Components ──────────────────────────────────────────────────

function AnnotationMarkers({
  annotations,
  containerEl,
  scale,
}: {
  annotations: SlideAnnotation[];
  containerEl: HTMLDivElement | null;
  scale: number;
}) {
  const [positions, setPositions] = useState<Map<number, { x: number; y: number }>>(new Map());

  useEffect(() => {
    if (!containerEl) return;

    const compute = () => {
      const containerRect = containerEl.getBoundingClientRect();
      const next = new Map<number, { x: number; y: number }>();

      for (const a of annotations) {
        const target = containerEl.querySelector<HTMLElement>(
          `[data-annotation-id="${a.id}"]`,
        );
        if (target) {
          const targetRect = target.getBoundingClientRect();
          // 타겟 요소의 우상단에서 왼쪽으로 오프셋하여 마커 배치 (스케일 보정)
          next.set(a.id, {
            x: (targetRect.right - containerRect.left) / scale - 25,
            y: (targetRect.top - containerRect.top) / scale + 5,
          });
        } else if (a.x != null && a.y != null) {
          // data-annotation-id가 없으면 명시적 x/y 폴백
          next.set(a.id, { x: a.x, y: a.y });
        }
      }

      setPositions(next);
    };

    // DOM 렌더링 완료 후 위치 계산
    requestAnimationFrame(compute);

    // 리사이즈 시 재계산
    const ro = new ResizeObserver(compute);
    ro.observe(containerEl);
    return () => ro.disconnect();
  }, [annotations, containerEl, scale]);

  return (
    <>
      {annotations.map((a) => {
        const pos = positions.get(a.id);
        if (!pos) return null;
        return (
          <div
            key={a.id}
            className="absolute pointer-events-none"
            style={{ left: pos.x, top: pos.y }}
          >
            <div className="relative -translate-x-1/2 -translate-y-1/2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-[11px] font-bold text-white shadow-md ring-2 ring-white">
                {a.id}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

/** description 텍스트를 파싱하여 ```코드블록```, `인라인코드`, !!!경고!!!, ???정보??? 를 React 요소로 변환 */
function renderDescription(text: string) {
  // 0) !!! 경고 블록 및 ??? 정보 블록 분리
  const blockParts = text.split(/(!!![\s\S]*?!!!|\?\?\?[\s\S]*?\?\?\?)/g);
  return blockParts.map((part, wi) => {
    if (part.startsWith("!!!") && part.endsWith("!!!")) {
      const inner = part.slice(3, -3).trim();
      return (
        <div key={`w${wi}`} className="mt-1.5 mb-1 px-3 py-2 bg-red-50 border border-red-200 rounded text-[13px] font-semibold text-red-600 leading-snug">
          {inner}
        </div>
      );
    }
    if (part.startsWith("???") && part.endsWith("???")) {
      const inner = part.slice(3, -3).trim();
      return (
        <div key={`i${wi}`} className="mt-1.5 mb-1 px-3 py-2 bg-blue-50 border border-blue-200 rounded text-[13px] text-blue-700 leading-snug">
          {inner}
        </div>
      );
    }
    return <span key={`w${wi}`}>{renderDescriptionInner(part)}</span>;
  });
}

function renderDescriptionInner(text: string) {
  // 1) ``` 코드블록 분리
  const parts = text.split(/(```[\s\S]*?```)/g);
  return parts.map((part, i) => {
    if (part.startsWith("```") && part.endsWith("```")) {
      const inner = part.slice(3, -3);
      // 첫 줄이 언어 힌트일 수 있으므로 제거
      const lines = inner.split("\n");
      const firstLine = lines[0]?.trim();
      const isLangHint = firstLine && !firstLine.includes(" ") && lines.length > 1;
      const code = isLangHint ? lines.slice(1).join("\n") : inner;
      return (
        <pre key={i} className="mt-1.5 mb-1 px-3 py-2 bg-gray-200/70 rounded text-[12px] font-mono text-gray-700 whitespace-pre-wrap break-all">
          {code.trim()}
        </pre>
      );
    }
    // 2) 인라인 `코드` 분리
    const inlineParts = part.split(/(`[^`]+`)/g);
    return (
      <span key={i}>
        {inlineParts.map((seg, j) => {
          if (seg.startsWith("`") && seg.endsWith("`")) {
            return (
              <code key={j} className="px-1 py-0.5 bg-gray-200/70 rounded text-[12px] font-mono text-gray-700">
                {seg.slice(1, -1)}
              </code>
            );
          }
          return seg;
        })}
      </span>
    );
  });
}

const AnnotationSidePanel = forwardRef<HTMLDivElement, { annotations: SlideAnnotation[]; description?: string }>(function AnnotationSidePanel({ annotations, description }, ref) {
  return (
    <div
      ref={ref}
      className="w-[480px] shrink-0 border-l border-gray-200 bg-gray-50 rounded-r-lg p-8 flex flex-col gap-6 overflow-y-auto"
    >
      <div className="text-[16px] font-bold text-gray-400 uppercase tracking-wide">Spec</div>
      {description && (
        <div className="text-[14px] text-gray-500 leading-snug whitespace-pre-line">{renderDescription(description)}</div>
      )}
      {annotations.map((a) => (
        <div key={a.id} className="flex gap-4 items-start">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500 text-[14px] font-bold text-white mt-0.5">
            {a.id}
          </span>
          <div className="min-w-0">
            <div className="text-[16px] font-semibold text-gray-800 leading-tight">{a.label}</div>
            <div className="text-[14px] text-gray-500 leading-snug mt-1 whitespace-pre-line">{renderDescription(a.description)}</div>
          </div>
        </div>
      ))}
    </div>
  );
});

// ─── Docs Drawer ─────────────────────────────────────────────────────────────

const remarkPlugins = [remarkGfm];

const mdComponents: Record<string, React.ComponentType<Record<string, unknown>>> = {
  h1: ({ children, ...props }: Record<string, unknown>) => (
    <h1 className="text-[20px] font-bold text-gray-900 pb-3 mb-5 border-b-2 border-gray-200 leading-tight" {...props}>
      {children as React.ReactNode}
    </h1>
  ),
  h2: ({ children, ...props }: Record<string, unknown>) => (
    <h2 className="text-[17px] font-bold text-gray-800 mt-8 mb-3 pb-2 border-b border-gray-100 leading-snug" {...props}>
      {children as React.ReactNode}
    </h2>
  ),
  h3: ({ children, ...props }: Record<string, unknown>) => (
    <h3 className="text-[15px] font-semibold text-gray-700 mt-6 mb-2 leading-snug" {...props}>
      {children as React.ReactNode}
    </h3>
  ),
  p: ({ children, ...props }: Record<string, unknown>) => (
    <p className="text-[14px] text-gray-600 leading-[1.75] mb-3" {...props}>
      {children as React.ReactNode}
    </p>
  ),
  strong: ({ children, ...props }: Record<string, unknown>) => (
    <strong className="font-semibold text-gray-800" {...props}>{children as React.ReactNode}</strong>
  ),
  blockquote: ({ children, ...props }: Record<string, unknown>) => (
    <blockquote className="border-l-[3px] border-emerald-300 bg-emerald-50/50 rounded-r-lg pl-4 pr-3 py-2.5 my-4 text-[13px] text-emerald-800 [&>p]:mb-0.5 [&>p]:text-[13px] [&>p]:text-emerald-800" {...props}>
      {children as React.ReactNode}
    </blockquote>
  ),
  hr: (props: Record<string, unknown>) => (
    <hr className="my-6 border-gray-200" {...props} />
  ),
  ul: ({ children, ...props }: Record<string, unknown>) => (
    <ul className="list-disc pl-5 my-2.5 space-y-1.5 text-[14px] text-gray-600 leading-relaxed marker:text-gray-400" {...props}>
      {children as React.ReactNode}
    </ul>
  ),
  ol: ({ children, ...props }: Record<string, unknown>) => (
    <ol className="list-decimal pl-5 my-2.5 space-y-1.5 text-[14px] text-gray-600 leading-relaxed marker:text-gray-500 marker:font-medium" {...props}>
      {children as React.ReactNode}
    </ol>
  ),
  li: ({ children, ...props }: Record<string, unknown>) => (
    <li className="pl-0.5 [&>p]:mb-0 [&>ul]:mt-1 [&>ol]:mt-1" {...props}>
      {children as React.ReactNode}
    </li>
  ),
  a: ({ children, ...props }: Record<string, unknown>) => (
    <a className="text-emerald-600 underline underline-offset-2 decoration-emerald-300 hover:text-emerald-700 hover:decoration-emerald-500 transition-colors" {...props}>
      {children as React.ReactNode}
    </a>
  ),
  code: ({ children, className, ...props }: Record<string, unknown>) => {
    const isBlock = typeof className === "string" && className.startsWith("language-");
    if (isBlock) {
      return (
        <code className={`block text-[13px] leading-relaxed ${className}`} {...props}>
          {children as React.ReactNode}
        </code>
      );
    }
    return (
      <code className="px-1.5 py-0.5 bg-gray-100 border border-gray-200/60 rounded text-[13px] font-mono text-gray-700 break-words" {...props}>
        {children as React.ReactNode}
      </code>
    );
  },
  pre: ({ children, ...props }: Record<string, unknown>) => (
    <pre className="my-4 rounded-lg border border-gray-200 bg-[#fafbfc] px-4 py-3.5 overflow-x-auto text-[13px] font-mono leading-[1.6] text-gray-700 [&>code]:block [&>code]:bg-transparent [&>code]:border-0 [&>code]:p-0" {...props}>
      {children as React.ReactNode}
    </pre>
  ),
  table: ({ children, ...props }: Record<string, unknown>) => (
    <div className="my-4 overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-[13px] border-collapse" {...props}>
        {children as React.ReactNode}
      </table>
    </div>
  ),
  thead: ({ children, ...props }: Record<string, unknown>) => (
    <thead className="bg-gray-50/80" {...props}>{children as React.ReactNode}</thead>
  ),
  th: ({ children, ...props }: Record<string, unknown>) => (
    <th className="px-3.5 py-2.5 text-left text-[12px] font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-200" {...props}>
      {children as React.ReactNode}
    </th>
  ),
  td: ({ children, ...props }: Record<string, unknown>) => (
    <td className="px-3.5 py-2.5 text-gray-600 border-b border-gray-100 align-top leading-relaxed" {...props}>
      {children as React.ReactNode}
    </td>
  ),
  tr: ({ children, ...props }: Record<string, unknown>) => (
    <tr className="hover:bg-gray-50/50 transition-colors" {...props}>{children as React.ReactNode}</tr>
  ),
};

function DocsDrawer({
  docs,
  activeIndex,
  onSelectDoc,
  onClose,
}: {
  docs: DocFile[];
  activeIndex: number;
  onSelectDoc: (index: number) => void;
  onClose: () => void;
}) {
  const activeDoc = docs[activeIndex];
  // TOC 추출 (h2, h3)
  const toc = useMemo(() => {
    if (!activeDoc) return [];
    const headingRe = /^(#{2,3})\s+(.+)$/gm;
    const entries: { level: number; text: string; id: string }[] = [];
    let match;
    while ((match = headingRe.exec(activeDoc.content)) !== null) {
      const text = match[2].replace(/[*`]/g, "").trim();
      const id = text.toLowerCase().replace(/[^\w가-힣]+/g, "-").replace(/(^-|-$)/g, "");
      entries.push({ level: match[1].length, text, id });
    }
    return entries;
  }, [activeDoc]);

  const [showToc, setShowToc] = useState(false);

  return (
    <div className="w-[520px] shrink-0 border-l border-gray-200 bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50">
            <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="text-[13px] font-semibold text-gray-800">기획 문서</span>
          {docs.length > 1 && (
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500">
              {activeIndex + 1}/{docs.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {toc.length > 0 && (
            <button
              type="button"
              onClick={() => setShowToc((v) => !v)}
              className={`rounded-md p-1.5 transition-colors ${showToc ? "bg-gray-100 text-gray-700" : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"}`}
              title="목차"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Doc tabs (when multiple docs) */}
      {docs.length > 1 && (
        <div className="flex gap-1 border-b border-gray-200 px-5 py-2 overflow-x-auto bg-gray-50/50">
          {docs.map((doc, i) => (
            <button
              key={doc.name}
              type="button"
              onClick={() => onSelectDoc(i)}
              className={`shrink-0 rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors ${
                i === activeIndex
                  ? "bg-white text-gray-800 shadow-sm border border-gray-200"
                  : "text-gray-500 hover:bg-white/60 hover:text-gray-700"
              }`}
            >
              {doc.name}
            </button>
          ))}
        </div>
      )}

      {/* TOC */}
      {showToc && toc.length > 0 && (
        <div className="border-b border-gray-200 bg-gray-50/70 px-5 py-3 max-h-[200px] overflow-y-auto">
          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">목차</div>
          <nav className="space-y-0.5">
            {toc.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  const el = e.currentTarget.closest(".flex.flex-col")?.querySelector(`[id="${item.id}"]`);
                  el?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={`block text-[12px] text-gray-500 hover:text-gray-800 transition-colors truncate ${
                  item.level === 3 ? "pl-4" : ""
                }`}
              >
                {item.text}
              </a>
            ))}
          </nav>
        </div>
      )}

      {/* Markdown content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {activeDoc && (
          <ReactMarkdown
            remarkPlugins={remarkPlugins}
            components={mdComponents}
          >
            {activeDoc.content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}
