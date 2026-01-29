import {create} from "zustand";

type Location = {
  long: number;
  lat: number;
};

interface User {
  email: string;
  name: string;
  vehiclePlug: "Type 2" | "CCS2" | "Both";
  location: Location|null;
  savedStation: number[];
}

interface UserStore {
  user: User;
  setUser: (user: User) => void;
  setLocation: (location: Location) => void;
  saveStation: (stationId: number) => void;
  deleteStation: (stationId: number) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: {
    email: "example@example.com",
    name: "John Doe",
    vehiclePlug: "Both",
    location:null,
    savedStation: [],
  },
  setUser: (user) => set({ user }),
  setLocation: (location) => set((state) => ({
    user: {
        ...state.user,
        location,
    }
  })),
  saveStation: (stationId) =>
  set((state) => ({
    user: {
      ...state.user,
      savedStation: state.user.savedStation.includes(stationId)
        ? state.user.savedStation
        : [...state.user.savedStation, stationId],
    },
  })),
  deleteStation: (stationId) =>
  set((state) => ({
    user: {
      ...state.user,
      savedStation: state.user.savedStation.filter(
        (id) => id !== stationId
      ),
    },
  })),

}));