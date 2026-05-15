import { create } from "zustand";

type AuthModalType = "login" | "register" | null;

type AuthModalStore = {
  modalType: AuthModalType;
  openLogin: () => void;
  openRegister: () => void;
  closeModal: () => void;
};

export const useAuthModalStore = create<AuthModalStore>((set) => ({
  modalType: null,
  openLogin: () => set({ modalType: "login" }),
  openRegister: () => set({ modalType: "register" }),
  closeModal: () => set({ modalType: null }),
}));
