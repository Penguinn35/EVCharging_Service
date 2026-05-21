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
      label: "Người dùng quan tâm",
      icon: FiTrendingUp,
      description: "Các trạm có mức độ quan tâm cao",
    },
    {
      id: "ratings" as StatisticsTab,
      label: "Đánh giá",
      icon: FiStar,
      description: "Xếp hạng và phản hồi của người dùng",
    },
    // {
    //   id: "saved" as StatisticsTab,
    //   label: "Lượt lưu trạm",
    //   icon: FiBookmark,
    //   description: "Các trạm được lưu lại nhiều",
    // },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Thống kê hệ thống</h2>
        <p className="text-gray-600 mt-1">
          Thông tin chi tiết về mức độ tương tác, xếp hạng và sở thích của người dùng

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
