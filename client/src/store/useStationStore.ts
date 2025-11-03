import { create } from "zustand";
import { ChargingPoint } from "@/types/Station";
import { getStationPoints } from "@/services/stationService";

interface StationState {
  points: ChargingPoint[];
  loading: boolean;
  error: string | null;
  fetchPoints: (stationId: number) => Promise<void>;
}

export const useStationStore = create<StationState>((set) => ({
  points: [],
  loading: false,
  error: null,

  fetchPoints: async (stationId) => {
    set({ loading: true, error: null });
    try {
      const data = await getStationPoints(stationId);
      set({ points: data, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },
}));
