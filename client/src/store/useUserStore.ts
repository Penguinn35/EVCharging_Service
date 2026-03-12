import { create } from "zustand";
import { Coordinate } from "@/models/shared";

interface User {
  email: string;
  name: string;
  accessToken: string;
  vehiclePlug: "Type 2" | "CCS2" | "Both";
  coordinate: Coordinate | null;
  savedStation: number[];
}

interface UserStore {
  user: User;
  updateUser: (data: Partial<User>) => void;
  saveStation: (stationId: number) => void;
  deleteStation: (stationId: number) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: {
    email: "",
    name: "",
    accessToken: "",
    vehiclePlug: "Both",
    coordinate: null,
    savedStation: [],
  },

  updateUser: (data) =>
    set((state) => ({
      user: { ...state.user, ...data },
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
        savedStation: state.user.savedStation.filter((id) => id !== stationId),
      },
    })),
}));