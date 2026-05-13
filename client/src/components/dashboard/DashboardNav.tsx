"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiLayers, FiBarChart, FiMap } from "react-icons/fi";

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

  return (
    <div className="bg-white border-b border-gray-200 shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto scrollbar-thin">
        <div className="flex gap-1 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname === tab.href;

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  isActive
                    ? "border-green-600 text-green-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

