import { create } from "zustand";

import { StationDetail } from "@/type/station";
import { StationMarkerData } from "@/type/station";

type StationState = {
  stations: StationDetail[];
  stationMarkers: StationMarkerData[];
  selectedStation: StationDetail | null;
  routeTo: StationDetail | null;
  // actions
  setStations: (stations: StationDetail[]) => void;
  setStationMarkers:(stationMarkers: StationMarkerData[]) => void;
  addStation: (station: StationDetail) => void;
  updateStation: (station: StationDetail) => void;
  selectStation: (station: StationDetail | null) => void;
  setRouteTo: (s: StationDetail | null) => void;
};

export const useStationStore = create<StationState>((set) => ({
  stations: [],
  stationMarkers: [],
  selectedStation: null,
  routeTo: null,
  setStations: (stations) => set({ stations }),
  setStationMarkers: (stationMarkers) => set({stationMarkers}),
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