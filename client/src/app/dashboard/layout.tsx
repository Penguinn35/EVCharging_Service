"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { DashboardNav } from "@/components/dashboard/DashboardNav";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isHeatmapPage = pathname === "/dashboard/high-demand-heatmap";

  return (
    <div className="h-screen bg-gray-50 overflow-hidden flex flex-col">
      <DashboardNav />
      <main
        className={
          isHeatmapPage
            ? "flex-1 min-h-0 overflow-hidden"
            : "flex-1 min-h-0 overflow-y-auto max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8"
        }
      >
        {children}
      </main>
    </div>
  );
}
