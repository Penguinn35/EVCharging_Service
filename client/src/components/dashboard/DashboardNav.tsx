"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiBarChart, FiLayers, FiLogOut, FiMap, FiUser } from "react-icons/fi";
import { useUserStore } from "@/store/useUserStore";
import { useEnterpriseStore } from "@/store/useEnterpriseStore";

const tabs = [
  {
    href: "/dashboard/manage-stations",
    label: "Quản lý trạm",
    icon: FiLayers,
  },
  {
    href: "/dashboard/system-statistics",
    label: "Thống kê hệ thống",
    icon: FiBarChart,
  },
  {
    href: "/dashboard/high-demand-heatmap",
    label: "Bản đồ nhiệt",
    icon: FiMap,
  },
];

export function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);
  const clearEnterprise = useEnterpriseStore((state) => state.clearEnterprise);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

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
    clearUser();
    clearEnterprise();
    router.push("/");
  };

  return (
    <header className="shrink-0 border-b border-gray-200 bg-white">
      <div className="mx-auto flex w-full  items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="min-w-0 flex-1 overflow-x-auto scrollbar-thin">
          <div className="flex min-w-max items-center gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = pathname === tab.href;

              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? "bg-green-600 text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="relative shrink-0" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700"
          >
            <FiUser className="h-4 w-4" />
            <span className="max-w-32 truncate">{user.name || "Profile"}</span>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 top-12 w-56 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
              <div className="border-b border-gray-100 px-4 py-3">
                <p className="text-sm font-semibold text-gray-900">
                  {user.name || "Business User"}
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
      </div>
    </header>
  );
}
