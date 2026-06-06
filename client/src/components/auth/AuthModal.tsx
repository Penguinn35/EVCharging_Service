"use client";

import { Modal } from "@/components/Modal";
import LoginFormContent from "@/components/homePage/LoginFormContent";
import RegisterFormContent from "@/components/homePage/RegisterFormContent ";
import { useAuthModalStore } from "@/store/useAuthModalStore";

export default function AuthModal() {
  const { modalType, closeModal, openLogin, openRegister } = useAuthModalStore();

  return (
    <Modal
      open={modalType !== null}
      onClose={closeModal}
      panelClassName={modalType === "register" ? "max-w-2xl" : ""}
    >
      {modalType === "login" && (
        <LoginFormContent
          closeModal={closeModal}
          switchToRegister={openRegister}
        />
      )}

      {modalType === "register" && (
        <RegisterFormContent
          closeModal={closeModal}
          switchToLogin={openLogin}
        />
      )}
    </Modal>
  );
}
