"use client";

import { useState, useMemo } from "react";
import { Station, StationStatus } from "@/lib/data/stations";
import { FiPower, FiSearch, FiFilter } from "react-icons/fi";
import { StationDetail } from "./StationDetail";

interface StationsTableProps {
  stations: Station[];
}

const statusColors: Record<StationStatus, { bg: string; text: string; icon: string }> = {
  AVAILABLE: { bg: "bg-green-100", text: "text-green-700", icon: "✓" },
  BUSY: { bg: "bg-yellow-100", text: "text-yellow-700", icon: "⚡" },
  FULL: { bg: "bg-orange-100", text: "text-orange-700", icon: "🔴" },
  OFF: { bg: "bg-gray-100", text: "text-gray-700", icon: "✕" },
};

const ITEMS_PER_PAGE = 5;

export function StationsTable({ stations }: StationsTableProps) {
  const [stationData, setStationData] = useState(stations);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);

  // Get unique districts
  const districts = useMemo(() => {
    const uniqueDistricts = Array.from(new Set(stationData.map((s) => s.district)));
    return uniqueDistricts.sort();
  }, [stationData]);

  // Filter and search logic
  const filteredStations = useMemo(() => {
    return stationData.filter((station) => {
      const matchesSearch =
        station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        station.address.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDistrict =
        selectedDistrict === "" || station.district === selectedDistrict;
      return matchesSearch && matchesDistrict;
    });
  }, [stationData, searchQuery, selectedDistrict]);

  // Pagination logic
  const totalPages = Math.ceil(filteredStations.length / ITEMS_PER_PAGE);
  const paginatedStations = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredStations.slice(startIndex, endIndex);
  }, [filteredStations, currentPage]);

  const toggleStationStatus = (stationId: string) => {
    setStationData((prev) =>
      prev.map((station) =>
        station.id === stationId
          ? {
              ...station,
              status: station.status === "OFF" ? "AVAILABLE" : "OFF",
            }
          : station
      )
    );
  };

  // Reset to first page when filters change
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
    setCurrentPage(1);
  };

  // If a station is selected, show detail view
  if (selectedStation) {
    return <StationDetail station={selectedStation} onBack={() => setSelectedStation(null)} />;
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="space-y-4 bg-white rounded-lg border border-gray-200 p-4">
        {/* Search */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search stations by name or address..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
          />
        </div>

        {/* District Filter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-gray-700 font-medium">
            <FiFilter className="w-4 h-4" />
            <span>Filter by District:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleDistrictChange("")}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedDistrict === ""
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All Districts
            </button>
            {districts.map((district) => (
              <button
                key={district}
                onClick={() => handleDistrictChange(district)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedDistrict === district
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {district}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Station Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                District
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Points
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {paginatedStations.length > 0 ? (
              paginatedStations.map((station) => {
                const statusConfig = statusColors[station.status];
                return (
                  <tr
                    key={station.id}
                    onClick={() => setSelectedStation(station)}
                    className="hover:bg-green-50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {station.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {station.district}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {station.address}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.text}`}
                      >
                        <span>{statusConfig.icon}</span>
                        {station.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {station.availablePoints}/{station.totalPoints}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStationStatus(station.id)}
                        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          station.status === "OFF"
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        }`}
                      >
                        <FiPower className="w-4 h-4" />
                        {station.status === "OFF" ? "Enable" : "Disable"}
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No stations found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredStations.length > 0 && (
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-sm text-gray-600">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredStations.length)} of{" "}
            {filteredStations.length} stations
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
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
