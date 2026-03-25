'use client'

import { useState } from "react";
// import { LoginFormContent } from "@/components/LoginFormContent";
import LoginFormContent from "./LoginFormContent";
import { FiZap, FiMenu, FiX } from "react-icons/fi";
import RegisterFormContent from "./RegisterFormContent ";
import { Modal } from "@/components/Modal";
import Link from "next/link";

export function Header() {
  const [open, setOpen] = useState(false);
  const [modalType, setModalType] = useState<"login" | "register" | null>(null);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
           {/* Logo */}
        <Link href="/" className=" text-green-500 flex items-center gap-2 font-bold text-xl text-primary">
          <FiZap className="w-6 h-6 h-10" />
          EVStation
        </Link>

          {/* Desktop */}
          <div className="hidden md:flex gap-4">
            <button onClick={() => setModalType("login")}>Đăng nhập</button>
            <button onClick={() => setModalType("register")}>Đăng kí</button>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)} className="md:hidden">
           {open ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </nav>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden px-4 pb-4 flex flex-col gap-3">
            <button
              onClick={() => {
                setModalType("login");
                setOpen(false);
              }}
            >
              Đăng nhập
            </button>

            <button
              onClick={() => {
                setModalType("register");
                setOpen(false);
              }}
            >
              Đăng kí
            </button>
          </div>
        )}
      </header>

      {/* Modal */}
      <Modal open={modalType !== null} onClose={() => setModalType(null)}>
        {modalType === "login" && <LoginFormContent />}
        {modalType === "register" && <RegisterFormContent />}
      </Modal>
    </>
  );
}
