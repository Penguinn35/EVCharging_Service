import { create } from "zustand";

import { StationDetail, StationMarkerData } from "@/type/station";

type StationState = {
  stations: StationDetail[];
  stationMarkers: StationMarkerData[];
  allStationMarkers: StationMarkerData[];
  selectedManufacturers: string[];
  selectedStation: StationDetail | null;
  routeTo: StationDetail | null;
  // actions
  setStations: (stations: StationDetail[]) => void;
  setStationMarkers: (stationMarkers: StationMarkerData[]) => void;
  setSelectedManufacturers: (manufacturers: string[]) => void;
  addStation: (station: StationDetail) => void;
  updateStation: (station: StationDetail) => void;
  selectStation: (station: StationDetail | null) => void;
  setRouteTo: (s: StationDetail | null) => void;
};

const filterStationMarkersByManufacturers = (
  stationMarkers: StationMarkerData[],
  manufacturers: string[],
) => {
  if (manufacturers.length === 0) {
    return stationMarkers;
  }

  const manufacturerSet = new Set(manufacturers);
  return stationMarkers.filter((station) => manufacturerSet.has(station.manufacturer));
};

export const useStationStore = create<StationState>((set) => ({
  stations: [],
  stationMarkers: [],
  allStationMarkers: [],
  selectedManufacturers: [],
  selectedStation: null,
  routeTo: null,
  setStations: (stations) => set({ stations }),
  setStationMarkers: (stationMarkers) =>
    set((state) => ({
      allStationMarkers: stationMarkers,
      stationMarkers: filterStationMarkersByManufacturers(
        stationMarkers,
        state.selectedManufacturers,
      ),
    })),
  setSelectedManufacturers: (manufacturers) =>
    set((state) => ({
      selectedManufacturers: manufacturers,
      stationMarkers: filterStationMarkersByManufacturers(
        state.allStationMarkers,
        manufacturers,
      ),
    })),
  addStation: (station) =>
    set((state) => ({
      stations: [...state.stations, station],
    })),

  updateStation: (updatedStation) =>
    set((state) => ({
      stations: state.stations.map((s) =>
        s.id === updatedStation.id ? updatedStation : s,
      ),
      selectedStation:
        state.selectedStation?.id === updatedStation.id
          ? updatedStation
          : state.selectedStation,
    })),

  selectStation: (station) => set({ selectedStation: station }),
  setRouteTo: (s) => set({ routeTo: s }),
}));
