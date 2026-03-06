"use client";

import { useState } from "react";
import { ManageStations } from "@/components/dashboard/manage-stations/ManageStations";
import { SystemStatistics } from "@/components/dashboard/system-statistics/SystemStatistics";
import { HighDemandHeatmap } from "@/components/dashboard/heatmap/HighDemandHeatmap";
import { FiLayers, FiBarChart, FiMap } from "react-icons/fi";

type TabType = "stations" | "statistics" | "heatmap";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>("stations");

  const tabs = [
    {
      id: "stations" as TabType,
      label: "Manage Stations",
      icon: FiLayers,
    },
    {
      id: "statistics" as TabType,
      label: "System Statistics",
      icon: FiBarChart,
    },
    {
      id: "heatmap" as TabType,
      label: "High Demand Spots",
      icon: FiMap,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {/* <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Charging Station Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Enterprise-wide charging infrastructure management system
              </p>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-600 animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">System Online</span>
            </div>
          </div>
        </div>
      </header> */}

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-green-600 text-green-600"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "stations" && <ManageStations />}
        {activeTab === "statistics" && <SystemStatistics />}
        {activeTab === "heatmap" && <HighDemandHeatmap />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-600">
            Charging Station Management System v1.0 | Last Updated: {new Date().toLocaleString()}
          </p>
        </div>
      </footer>
    </div>
  );
}
