"use client";

import { useState } from "react";
import { stations } from "@/lib/data/stations";
import { StationsTable } from "./StationsTable";
import { FiPlus, FiRefreshCw } from "react-icons/fi";

export function ManageStations() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Stations</h2>
          <p className="text-gray-600 mt-1">
            View and control charging station status
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors ${
              isRefreshing ? "animate-spin" : ""
            }`}
          >
            <FiRefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
          
        </div>
      </div>

      <StationsTable stations={stations} />

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Status Legend:</strong> Green = Available, Yellow = Busy, Orange = Full, Gray = Offline
        </p>
      </div>
    </div>
  );
}
