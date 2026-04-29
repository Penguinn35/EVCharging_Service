import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Coordinate } from "@/models/shared";
import { StationSavedList } from "@/type/user";
import {
  saveStation as saveStationApi,
  deleteSavedStation as deleteSavedStationApi,
} from "@/services/stationService";

interface User {
  isLogedin: boolean;
  email: string;
  name: string;
  address: string;
  accessToken: string;
  vehiclePlug: "Type 2" | "CCS2" | "Both";
  coordinate: Coordinate | null;
  savedStation: StationSavedList[];
}

interface UserStore {
  user: User;
  updateUser: (data: Partial<User>) => void;
  clearUser: () => void;
  saveStation: (stationId: string) => Promise<boolean>;
  deleteStation: (stationId: string) => Promise<boolean>;
}

const defaultUser: User = {
  isLogedin: false,
  email: "",
  name: "",
  address: "",
  accessToken: "",
  vehiclePlug: "Both",
  coordinate: null,
  savedStation: [],
};

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: defaultUser,

      updateUser: (data) =>
        set((state) => ({
          user: { ...state.user, ...data },
        })),

      clearUser: () =>
        set((state) => ({
          user: {
            ...defaultUser,
            vehiclePlug: state.user.vehiclePlug,
            coordinate: state.user.coordinate,
          },
        })),

      saveStation: async (stationId) => {
        const { user } = get();

        try {
          const success = await saveStationApi(stationId);
          if (!success) return false;

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
      name: "user-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
