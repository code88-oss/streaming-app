// store/streamStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StreamState {
  streamKey: string;
  setStreamKey: (key: string) => void;
}

export const useStreamStore = create<StreamState>()(
  persist(
    (set) => ({
      streamKey: "",
      setStreamKey: (key) => set({ streamKey: key }),
    }),
    {
      name: "stream-storage", // key in localStorage
    }
  )
);
