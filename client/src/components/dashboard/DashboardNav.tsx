"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiBarChart, FiBriefcase, FiLayers, FiMap, FiUser } from "react-icons/fi";
import { useUserStore } from "@/store/useUserStore";
import { IoMdArrowRoundBack } from "react-icons/io";

const businessTabs = [
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

const adminTabs = [
  {
    href: "/dashboard/admin-enterprises",
    label: "Quản lý doanh nghiệp",
    icon: FiBriefcase,
  },
];

export function DashboardNav() {
  const pathname = usePathname();
  const user = useUserStore((state) => state.user);
  const isEnterpriseProfileActive = pathname === "/dashboard/enterpriseProfile";
  const tabs = user.role === "ADMIN" ? adminTabs : businessTabs;

  return (
    <header className="shrink-0 border-b border-gray-200 bg-white">
      <div className="mx-auto flex w-full  items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="min-w-0 flex-1 overflow-x-auto scrollbar-thin">
          
          <div className="flex min-w-max items-center gap-1">
            <div className=" border-1 border-green-200 mr-2 w-10 h-10 bg-white rounded-xl flex items-center justify-center hover:bg-green-100 hover:text-xl cursor-pointer">
              <Link href="/">
                <IoMdArrowRoundBack />
              </Link>
            </div>
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

        {user.role !== "ADMIN" && (
          <Link
            href="/dashboard/enterpriseProfile"
            className={`inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors ${
              isEnterpriseProfileActive
                ? "bg-green-600 text-white"
                : "border border-gray-200 text-gray-700 hover:border-green-200 hover:bg-green-50 hover:text-green-700"
            }`}
          >
            <FiUser className="h-4 w-4" />
            <span className="max-w-32 truncate">{user.userName || "Profile"}</span>
          </Link>
        )}
      </div>
    </header>
  );
}
