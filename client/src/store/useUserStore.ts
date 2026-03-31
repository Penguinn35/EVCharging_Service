import { create } from "zustand";
import { Coordinate } from "@/models/shared";
import { StationSavedList } from "@/type/user";
interface User {
  id: string,
  email: string;
  name: string;
  accessToken: string;
  vehiclePlug: "Type 2" | "CCS2" | "Both";
  coordinate: Coordinate | null;
  savedStation: StationSavedList[];
}

interface UserStore {
  user: User;
  updateUser: (data: Partial<User>) => void;
  saveStation: (stationId: string) => void;
  deleteStation: (stationId: string) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: {
    id: "",
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
        
      },
    })),

  deleteStation: (stationId) =>
    set((state) => ({
      user: {
        ...state.user,
       
      },
    })),
}));