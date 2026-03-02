import { create } from "zustand";

interface SlideViewerState {
  currentSlideIndex: number;
  setSlideIndex: (index: number) => void;
  nextSlide: (totalSlides: number) => void;
  prevSlide: () => void;
}

export const useSlideViewerStore = create<SlideViewerState>((set) => ({
  currentSlideIndex: 0,
  setSlideIndex: (index) => set({ currentSlideIndex: index }),
  nextSlide: (totalSlides) =>
    set((state) => ({
      currentSlideIndex: Math.min(state.currentSlideIndex + 1, totalSlides - 1),
    })),
  prevSlide: () =>
    set((state) => ({
      currentSlideIndex: Math.max(state.currentSlideIndex - 1, 0),
    })),
}));
