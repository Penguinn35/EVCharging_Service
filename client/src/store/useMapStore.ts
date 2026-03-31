// useMapStore.ts
import { create } from "zustand";
import { Coordinate } from "@/models/shared";

interface MapStore {
  center: Coordinate;
  flyTo: Coordinate | null;
  flyTrigger: number;
  setFlyTo: (c: Coordinate | null) => void;
   setCenter: (c: Coordinate) => void; 
}

export const useMapStore = create<MapStore>((set) => ({
  flyTo: null,
  center: { longitude: 0, latitude: 0 },
  flyTrigger: 0,
  setFlyTo: (c) => set((state) => ({
    flyTo: c,
    flyTrigger: state.flyTrigger + 1,
  })),
  setCenter: (c) => set({ center: c }),
}));
