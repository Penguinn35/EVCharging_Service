import { create } from "zustand";
import { persist } from "zustand/middleware";

import { BusinessProfile } from "@/services/enterpriseService";

interface EnterpriseStore {
  enterprise: BusinessProfile;
  updateEnterprise: (data: Partial<BusinessProfile>) => void;
  clearEnterprise: () => void;
}

const defaultEnterprise: BusinessProfile = {
  companyName: "",
  companyAddress: "",
  taxCode: "",
  logoUrl: null,
  managerFullName: "",
  managerEmail: "",
  managerAddress: "",
  serverUrl: null,
  token: null,
  isVerified: false,
};

export const useEnterpriseStore = create<EnterpriseStore>()(
  persist(
    (set) => ({
      enterprise: defaultEnterprise,

      updateEnterprise: (data) =>
        set((state) => ({
          enterprise: { ...state.enterprise, ...data },
        })),

      clearEnterprise: () =>
        set({
          enterprise: defaultEnterprise,
        }),
    }),
    {
      name: "enterprise-storage",
      partialize: (state) => ({ enterprise: state.enterprise }),
    },
  ),
);
