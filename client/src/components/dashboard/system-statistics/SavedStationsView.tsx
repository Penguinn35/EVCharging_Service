"use client";

import { useState, useMemo } from "react";
import { stations } from "@/lib/data/stations";
import { stationSaveStats } from "@/lib/data/user-preferences";
import { FiBookmark, FiZap, FiCalendar } from "react-icons/fi";

const ITEMS_PER_PAGE = 5;

export function SavedStationsView() {
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState<"day" | "week" | "month" | "custom">("week");

  // Get top 5 saved stations
  const topSavedStations = [...stationSaveStats]
    .sort((a, b) => b.totalUsersSaved - a.totalUsersSaved)
    .slice(0, 5);

  // Calculate statistics
  const totalUsersSaved = stationSaveStats.reduce((sum, s) => sum + s.totalUsersSaved, 0);
  const type2Preference = stationSaveStats.reduce((sum, s) => sum + s.type2Users, 0);
  const css2Preference = stationSaveStats.reduce((sum, s) => sum + s.css2Users, 0);
  const bothPreference = stationSaveStats.reduce((sum, s) => sum + s.bothUsers, 0);

  // Pagination for all saved stations table
  const allSavedStationsSorted = useMemo(() => {
    return [...stationSaveStats].sort((a, b) => b.totalUsersSaved - a.totalUsersSaved);
  }, []);

  const totalPages = Math.ceil(allSavedStationsSorted.length / ITEMS_PER_PAGE);
  const paginatedStations = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return allSavedStationsSorted.slice(startIndex, endIndex);
  }, [allSavedStationsSorted, currentPage]);

  const getStationData = (stationId: string) => {
    return stations.find((s) => s.id === stationId);
  };

  const statusColors: Record<string, string> = {
    AVAILABLE: "bg-green-100 text-green-700",
    BUSY: "bg-yellow-100 text-yellow-700",
    FULL: "bg-orange-100 text-orange-700",
    OFF: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <FiBookmark className="w-5 h-5 text-green-600" />
            <div className="text-sm text-gray-600 font-medium">Total Users Saves</div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mt-2">{totalUsersSaved}</div>
          <p className="text-xs text-gray-600 mt-2">across {stationSaveStats.length} stations</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <FiZap className="w-5 h-5 text-blue-600" />
            <div className="text-sm text-gray-600 font-medium">Type 2 Preference</div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mt-2">{type2Preference}</div>
          <p className="text-xs text-gray-600 mt-2">{((type2Preference / totalUsersSaved) * 100).toFixed(1)}% of users</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <FiZap className="w-5 h-5 text-purple-600" />
            <div className="text-sm text-gray-600 font-medium">CCS2 Preference</div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mt-2">{css2Preference}</div>
          <p className="text-xs text-gray-600 mt-2">{((css2Preference / totalUsersSaved) * 100).toFixed(1)}% of users</p>
        </div>
      </div>

      {/* Top 5 Saved Stations */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <FiBookmark className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Top 5 Saved Stations</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topSavedStations.map((saved, index) => {
            const station = getStationData(saved.stationId);
            if (!station) return null;

            return (
              <div
                key={saved.stationId}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase">Rank #{index + 1}</div>
                    <h4 className="text-base font-bold text-gray-900 mt-1">{station.name}</h4>
                  </div>
                  <div className="bg-green-100 rounded-lg p-2">
                    <FiBookmark className="w-4 h-4 text-green-600" />
                  </div>
                </div>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="text-gray-600">
                    <span className="font-medium text-gray-900">{saved.totalUsersSaved}</span> users saved
                  </div>
                  <div className="text-gray-600">
                    📍 {station.district}
                  </div>
                  <div className="pt-2 border-t border-gray-200 mt-2 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type 2:</span>
                      <span className="font-semibold text-gray-900">{saved.type2Users}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">CCS2:</span>
                      <span className="font-semibold text-gray-900">{saved.css2Users}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Both:</span>
                      <span className="font-semibold text-gray-900">{saved.bothUsers}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${statusColors[station.status]}`}>
                    {station.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* All Saved Stations with Pagination */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">All Stations - User Save Rankings</h3>

          {/* Date Filter */}
          <div className="flex items-center gap-3">
            <FiCalendar className="w-5 h-5 text-gray-600" />
            <select
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value as typeof dateFilter);
                setCurrentPage(1);
              }}
              className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="day">Last 24 Hours</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="custom">Custom Range</option>
            </select>
            {dateFilter === "custom" && (
              <div className="flex items-center gap-2 ml-2">
                <input
                  type="date"
                  className="px-2 py-1 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="date"
                  className="px-2 py-1 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Rank</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Station Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">District</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Total Saves</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Type 2</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">CCS2</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Both</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedStations.map((saved, index) => {
                const station = getStationData(saved.stationId);
                if (!station) return null;

                const rank = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;

                return (
                  <tr key={saved.stationId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-bold text-green-600">#{rank}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{station.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{station.district}</td>
                    <td className="px-4 py-3 text-sm font-bold text-gray-900 text-center">
                      {saved.totalUsersSaved}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 text-center">{saved.type2Users}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 text-center">{saved.css2Users}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 text-center">{saved.bothUsers}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, allSavedStationsSorted.length)} of{" "}
            {allSavedStationsSorted.length} stations
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page
                      ? "bg-green-600 text-white"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
