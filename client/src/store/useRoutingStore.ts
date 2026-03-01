import { create } from "zustand";

type Location = {
    latitude: number;
    longitude: number;
};

type RoutingData = {
    isOpen: boolean;
    location: Location | null;
    setRouting: (location: Location) => void;
    clearRouting: () => void;
};

export const useRoutingStore = create<RoutingData>((set) => ({
    isOpen: false,
    location: null,

    setRouting: (location) =>
        set({
            isOpen: true,
            location,
        }),

    clearRouting: () =>
        set({
            isOpen: false,
            location: null,
        }),
}));