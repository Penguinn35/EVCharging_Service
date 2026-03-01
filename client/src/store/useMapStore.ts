// useMapStore.ts
import { create } from "zustand";
import { Coordinate } from "@/models/shared";

interface MapStore {
  flyTo: Coordinate | null;
  flyTrigger: number;
  setFlyTo: (c: Coordinate | null) => void;
}

export const useMapStore = create<MapStore>((set) => ({
  flyTo: null,
  flyTrigger: 0,
  setFlyTo: (c) => set((state) => ({
    flyTo: c,
    flyTrigger: state.flyTrigger + 1,
  })),
}));
