export interface SlideViewerState {
  currentSlideIndex: number;
  setSlideIndex: (index: number) => void;
  nextSlide: (totalSlides: number) => void;
  prevSlide: () => void;
}
