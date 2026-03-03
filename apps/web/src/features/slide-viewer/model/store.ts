import { create } from "zustand";
import type { SlideViewerState } from "../types";

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
