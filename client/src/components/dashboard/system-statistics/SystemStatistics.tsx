"use client";

import { useState } from "react";
import { InterestedStations } from "./InterestedStations";
import { RatingsViewer } from "./RatingsViewer";
import { SavedStationsView } from "./SavedStationsView";
import { FiTrendingUp, FiStar, FiBookmark } from "react-icons/fi";

type StatisticsTab = "interested" | "ratings" | "saved";

export function SystemStatistics() {
  const [activeTab, setActiveTab] = useState<StatisticsTab>("interested");

  const tabs = [
    {
      id: "interested" as StatisticsTab,
      label: "User Interest",
      icon: FiTrendingUp,
      description: "Top interested stations and brand comparison",
    },
    {
      id: "ratings" as StatisticsTab,
      label: "Ratings & Reviews",
      icon: FiStar,
      description: "User ratings and feedback by score",
    },
    {
      id: "saved" as StatisticsTab,
      label: "My Saved Stations",
      icon: FiBookmark,
      description: "Your bookmarked stations and preferences",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">System Statistics</h2>
        <p className="text-gray-600 mt-1">
          Insights on user engagement, ratings, and preferences
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-start gap-3 p-4 rounded-lg border-2 transition-all text-left ${
                isActive
                  ? "bg-green-50 border-green-600"
                  : "bg-white border-gray-200 hover:border-green-300"
              }`}
            >
              <div className={`p-2 rounded-lg ${isActive ? "bg-green-600" : "bg-gray-100"}`}>
                <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-600"}`} />
              </div>
              <div>
                <div className={`font-semibold ${isActive ? "text-green-900" : "text-gray-900"}`}>
                  {tab.label}
                </div>
                <div className="text-xs text-gray-600 mt-1">{tab.description}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {activeTab === "interested" && <InterestedStations />}
        {activeTab === "ratings" && <RatingsViewer />}
        {activeTab === "saved" && <SavedStationsView />}
      </div>
    </div>
  );
}
