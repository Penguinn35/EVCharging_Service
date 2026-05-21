import { create } from "zustand";

type RoutingLocation = {
  stationId: string;
  latitude: number;
  longitude: number;
};

type RoutingData = {
  isOpen: boolean;
  isLoading: boolean;
  distanceInKilometers: number | null;
  location: RoutingLocation | null;
  setRouting: (location: RoutingLocation) => void;
  setRoutingDistance: (distanceInKilometers: number | null) => void;
  setRoutingLoading: (isLoading: boolean) => void;
  clearRouting: () => void;
};

export const useRoutingStore = create<RoutingData>((set) => ({
  isOpen: false,
  isLoading: false,
  distanceInKilometers: null,
  location: null,

  setRouting: (location) =>
    set({
      isOpen: true,
      isLoading: false,
      distanceInKilometers: null,
      location,
    }),

  setRoutingDistance: (distanceInKilometers) =>
    set({
      distanceInKilometers,
    }),

  setRoutingLoading: (isLoading) =>
    set({
      isLoading,
    }),

  clearRouting: () =>
    set({
      isOpen: false,
      isLoading: false,
      distanceInKilometers: null,
      location: null,
    }),
}));
