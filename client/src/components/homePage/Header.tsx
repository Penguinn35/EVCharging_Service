"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FiZap, FiMenu, FiX, FiLayout, FiLogOut, FiUser } from "react-icons/fi";
import { useAuthModalStore } from "@/store/useAuthModalStore";
import { useUserStore } from "@/store/useUserStore";
import { useEnterpriseStore } from "@/store/useEnterpriseStore";
import { useRouter } from "next/navigation";

export function Header() {
  const [open, setOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const openLogin = useAuthModalStore((state) => state.openLogin);
  const openRegister = useAuthModalStore((state) => state.openRegister);
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);
  const clearEnterprise = useEnterpriseStore((state) => state.clearEnterprise);
  const canAccessDashboard = user.role === "BUSINESS" || user.role === "ADMIN";
  const dashboardHref =
    user.role === "ADMIN" ? "/dashboard/admin-enterprises" : "/dashboard";
  const isLoggedIn = user.isLogedin;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsProfileOpen(false);
    setOpen(false);
    clearUser();
    clearEnterprise();
    router.push("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-green-500"
        >
          <FiZap className="h-6 w-6" />
          EVStation
        </Link>

        <div className="hidden items-center gap-4 md:flex">
          {isLoggedIn ? (
            <>
              {canAccessDashboard && (
                <Link
                  href={dashboardHref}
                  className="inline-flex items-center gap-2 rounded-full border border-green-200 px-4 py-2 text-sm font-semibold text-green-700 transition hover:border-green-300 hover:bg-green-50"
                >
                  <FiLayout className="h-4 w-4" />
                  Dashboard
                </Link>
              )}

              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700"
                >
                  <FiUser className="h-4 w-4" />
                  <span className="max-w-32 truncate">{user.userName || "Profile"}</span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 top-12 w-56 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
                    <div className="border-b border-gray-100 px-4 py-3">
                      <p className="text-sm font-semibold text-gray-900">
                        {user.userName || "Người dùng"}
                      </p>
                      <p className="truncate text-xs text-gray-500">{user.email}</p>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                      <FiLogOut className="h-4 w-4" />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button onClick={openLogin}>Đăng nhập</button>
              <button onClick={openRegister}>Đăng ký</button>
            </>
          )}
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden">
          {open ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="flex flex-col gap-3 px-4 pb-4 md:hidden">
          {isLoggedIn ? (
            <>
              {canAccessDashboard && (
                <Link
                  href={dashboardHref}
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-2 rounded-xl border border-green-200 px-4 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-50"
                >
                  <FiLayout className="h-4 w-4" />
                  Dashboard
                </Link>
              )}

              <button
                onClick={() => setIsProfileOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700"
              >
                <FiUser className="h-4 w-4" />
                {user.userName || "Profile"}
              </button>

              {isProfileOpen && (
                <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
                  <div className="border-b border-gray-100 px-4 py-3">
                    <p className="text-sm font-semibold text-gray-900">
                      {user.userName || "Người dùng"}
                    </p>
                    <p className="truncate text-xs text-gray-500">{user.email}</p>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    <FiLogOut className="h-4 w-4" />
                    Đăng xuất
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  openLogin();
                  setOpen(false);
                }}
              >
                Đăng nhập
              </button>

              <button
                onClick={() => {
                  openRegister();
                  setOpen(false);
                }}
              >
                Đăng ký
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
