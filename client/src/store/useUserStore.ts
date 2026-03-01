import {create} from "zustand";
import { Coordinate } from "@/models/shared";


interface User {
  email: string;
  name: string;
  vehiclePlug: "Type 2" | "CCS2" | "Both";
  coordinate: Coordinate|null;
  savedStation: number[];
}

interface UserStore {
  user: User;
  setUser: (user: User) => void;
  setLocation: (coordinate: Coordinate) => void;
  saveStation: (stationId: number) => void;
  deleteStation: (stationId: number) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: {
    email: "example@example.com",
    name: "John Doe",
    vehiclePlug: "Both",
    coordinate:null,
    savedStation: [],
  },
  setUser: (user) => set({ user }),
  setLocation: (coordinate) => set((state) => ({
    user: {
        ...state.user,
        coordinate,
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