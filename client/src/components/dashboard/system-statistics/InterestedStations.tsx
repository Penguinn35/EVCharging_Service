"use client";

import { useState, useMemo } from "react";
import { stations } from "@/lib/data/stations";
import { brandComparison } from "@/lib/data/user-preferences";
import { FiStar, FiTrendingUp, FiCalendar } from "react-icons/fi";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ITEMS_PER_PAGE = 5;

export function InterestedStations() {
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState<"day" | "week" | "month" | "custom">("week");

  // Get top 3 interested stations
  const topStations = [...stations]
    .sort((a, b) => b.interestedPoints - a.interestedPoints)
    .slice(0, 3);

  // Calculate total interest points
  const totalInterestPoints = stations.reduce((sum, s) => sum + s.interestedPoints, 0);

  // Pagination for all stations table
  const allStationsSorted = useMemo(() => {
    return [...stations].sort((a, b) => b.interestedPoints - a.interestedPoints);
  }, []);

  const totalPages = Math.ceil(allStationsSorted.length / ITEMS_PER_PAGE);
  const paginatedStations = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return allStationsSorted.slice(startIndex, endIndex);
  }, [allStationsSorted, currentPage]);

  // Chart data for brand comparison
  const chartData = {
    labels: brandComparison.map((b) => b.brandName),
    datasets: [
      {
        label: "Total Interest Points",
        data: brandComparison.map((b) => b.totalInterestPoints),
        borderColor: "#22c55e",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#22c55e",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Brand Interest Points Comparison",
        font: { size: 14, weight: "bold" as const },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Top 3 Interested Stations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {topStations.map((station, index) => (
          <div
            key={station.id}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-sm font-semibold text-gray-500 uppercase">
                  #{index + 1} Top Station
                </div>
                <h3 className="text-lg font-bold text-gray-900 mt-1">{station.name}</h3>
              </div>
              <div className="bg-green-100 rounded-lg p-2">
                <FiStar className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">{station.district}</p>
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-green-600">
                  {station.interestedPoints}
                </span>
                <span className="text-sm text-gray-600">interest points</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Overall Interest Points Card */}
      <div className="bg-gradient-to-br from-green-50 to-white rounded-lg border border-green-200 p-6">
        <div className="flex items-center gap-3 mb-2">
          <FiTrendingUp className="w-6 h-6 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Overall Brand Interest</h3>
        </div>
        <p className="text-4xl font-bold text-green-600 mt-4">{totalInterestPoints}</p>
        <p className="text-sm text-gray-600 mt-2">
          Total interest points across all {stations.length} charging stations
        </p>
      </div>

      {/* Brand Comparison Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div style={{ position: "relative", height: "300px" }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* All Stations with Pagination */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">All Stations Interest Ranking</h3>
          
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
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Interest Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedStations.map((station, index) => {
                const rank = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
                const statusColor = {
                  AVAILABLE: "bg-green-100 text-green-700",
                  BUSY: "bg-yellow-100 text-yellow-700",
                  FULL: "bg-orange-100 text-orange-700",
                  OFF: "bg-gray-100 text-gray-700",
                }[station.status];

                return (
                  <tr key={station.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-bold text-green-600">#{rank}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{station.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{station.district}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
                        {station.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
                      {station.interestedPoints}
                    </td>
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
            {Math.min(currentPage * ITEMS_PER_PAGE, allStationsSorted.length)} of{" "}
            {allStationsSorted.length} stations
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
