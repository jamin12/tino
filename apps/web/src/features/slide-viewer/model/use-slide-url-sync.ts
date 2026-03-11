import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router";
import { useSlideViewerStore } from "./store";

const SLIDE_PARAM = "slide";

/**
 * URL search params와 슬라이드 인덱스를 양방향 동기화한다.
 * - 마운트 시 ?slide=N 값을 읽어 store에 반영
 * - 슬라이드 변경 시 URL을 업데이트 (replace)
 */
export function useSlideUrlSync(totalSlides: number) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentSlideIndex, setSlideIndex } = useSlideViewerStore();
  const initialized = useRef(false);

  // 마운트 시 URL에서 슬라이드 인덱스 복원
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const param = searchParams.get(SLIDE_PARAM);
    if (param !== null) {
      const parsed = Number(param);
      if (!Number.isNaN(parsed) && parsed >= 0 && parsed < totalSlides) {
        setSlideIndex(parsed);
        return;
      }
    }
    // URL에 유효한 slide param이 없으면 0으로 초기화
    setSlideIndex(0);
  }, [totalSlides, searchParams, setSlideIndex]);

  // 슬라이드 변경 시 URL 업데이트
  useEffect(() => {
    if (!initialized.current) return;

    setSearchParams(
      (prev) => {
        if (currentSlideIndex === 0) {
          prev.delete(SLIDE_PARAM);
        } else {
          prev.set(SLIDE_PARAM, String(currentSlideIndex));
        }
        return prev;
      },
      { replace: true },
    );
  }, [currentSlideIndex, setSearchParams]);
}
