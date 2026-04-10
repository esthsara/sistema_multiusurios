import { create } from "zustand";

interface UIState {
  globalLoading: boolean;
  loadingText?: string;
  setGlobalLoading: (isLoading: boolean, text?: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  globalLoading: false,
  loadingText: undefined,
  setGlobalLoading: (isLoading, text) =>
    set({ globalLoading: isLoading, loadingText: text }),
}));
