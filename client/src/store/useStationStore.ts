import { create } from "zustand";
import { ChargingStation, ChargingPoint, Connector } from "@/models/station";


type StationState = {
  stations: ChargingStation[];
  selectedStation: ChargingStation | null;
  routeTo: ChargingStation | null;
  // actions
  setStations: (stations: ChargingStation[]) => void;
  addStation: (station: ChargingStation) => void;
  updateStation: (station: ChargingStation) => void;
  selectStation: (station: ChargingStation | null) => void;
  setRouteTo: (s: ChargingStation | null) => void;
};

export const useStationStore = create<StationState>((set) => ({
  stations: [],
  selectedStation: null,
  routeTo: null,
  setStations: (stations) => set({ stations }),

  addStation: (station) =>
    set((state) => ({
      stations: [...state.stations, station],
    })),

  updateStation: (updatedStation) =>
    set((state) => ({
      stations: state.stations.map((s) =>
        s.id === updatedStation.id ? updatedStation : s
      ),
      selectedStation:
        state.selectedStation?.id === updatedStation.id
          ? updatedStation
          : state.selectedStation,
    })),

  selectStation: (station) => set({ selectedStation: station }),
  setRouteTo: (s) => set({ routeTo: s }),
}));