import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Coordinate } from "@/models/shared";
import { StationSavedList } from "@/type/user";
import {
  saveStation as saveStationApi,
  deleteSavedStation as deleteSavedStationApi,
} from "@/services/stationService";

interface User {
  id: string;
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
  saveStation: (stationId: string) => Promise<boolean>;
  deleteStation: (stationId: string) => Promise<boolean>;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
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

      saveStation: async (stationId) => {
        
        const { user } = get();

        try {
          const success = await saveStationApi( stationId);
          if (!success) return false;

          // prevent duplicate
          const exists = user.savedStation.some((s) => s.id === stationId);
          if (exists) return true;

          set((state) => ({
            user: {
              ...state.user,
              savedStation: [
                ...state.user.savedStation,
                { id: stationId } as StationSavedList,
              ],
            },
          }));

          return true;
        } catch (err) {
          console.error(err);
          return false;
        }
      },

      deleteStation: async (stationId) => {
        const { user } = get();

        try {
          const success = await deleteSavedStationApi(stationId);
          if (!success) return false;

          set((state) => ({
            user: {
              ...state.user,
              savedStation: state.user.savedStation.filter(
                (s) => s.id !== stationId
              ),
            },
          }));

          return true;
        } catch (err) {
          console.error(err);
          return false;
        }
      },
    }),
    {
      name: "user-storage", // Key for localStorage
      partialize: (state) => ({ user: state.user }), // Only persist the `user` object
    }
  )
);