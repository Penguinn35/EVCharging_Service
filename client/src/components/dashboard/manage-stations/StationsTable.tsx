"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiPower, FiSearch, FiFilter } from "react-icons/fi";

type StationStatus = "AVAILABLE" | "BUSY" | "FULL" | "OFF";

type StationTableRow = {
  id: string;
  name: string;
  address: string;
  district: string;
  status: StationStatus;
  totalPoints: number;
  availablePoints: number;
};

interface StationsTableProps {
  stations: StationTableRow[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  keyword: string;
  district: string;
  onKeywordChange: (value: string) => void;
  onDistrictChange: (value: string) => void;
  onApply: () => void;
  onPageChange: (page: number) => void;
  onToggleStationStatus: (stationId: string) => void;
  togglingStationIds: string[];
  isPageLoading?: boolean;
}

const DISTRICTS = [
  "Quan 1",
  "Quan 2",
  "Quan 3",
  "Quan 4",
  "Quan 5",
  "Quan 6",
  "Quan 7",
];

const statusColors: Record<StationStatus, { bg: string; text: string; icon: string }> = {
  AVAILABLE: { bg: "bg-green-100", text: "text-green-700", icon: "OK" },
  BUSY: { bg: "bg-yellow-100", text: "text-yellow-700", icon: "!" },
  FULL: { bg: "bg-orange-100", text: "text-orange-700", icon: "*" },
  OFF: { bg: "bg-gray-100", text: "text-gray-700", icon: "X" },
};

export function StationsTable({
  stations,
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  keyword,
  district,
  onKeywordChange,
  onDistrictChange,
  onApply,
  onPageChange,
  onToggleStationStatus,
  togglingStationIds,
  isPageLoading = false,
}: StationsTableProps) {
  const router = useRouter();
  const [stationData, setStationData] = useState(stations);

  useEffect(() => {
    setStationData(stations);
  }, [stations]);

  const startItem = totalElements === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = totalElements === 0 ? 0 : startItem + stations.length - 1;

  return (
    <div className="space-y-4">
      <div className="space-y-4 bg-white rounded-lg border border-gray-200 p-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search stations by name or address..."
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
          />
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-gray-700 font-medium">
              <FiFilter className="w-4 h-4" />
              <span>Filter by District:</span>
            </div>
            <select
              value={district}
              onChange={(e) => onDistrictChange(e.target.value)}
              className="min-w-40 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">All Districts</option>
              {DISTRICTS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onApply}
            disabled={isPageLoading}
            className="inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Apply
          </button>
        </div>
      </div>

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
            {stationData.length > 0 ? (
              stationData.map((station) => {
                const statusConfig = statusColors[station.status];
                const isToggling = togglingStationIds.includes(station.id);

                return (
                  <tr
                    key={station.id}
                    onClick={() => router.push(`/dashboard/manage-stations/${encodeURIComponent(station.id)}`)}
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
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleStationStatus(station.id);
                        }}
                        disabled={isToggling}
                        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                          station.status === "OFF"
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        }`}
                      >
                        <FiPower className={`w-4 h-4 ${isToggling ? "animate-spin" : ""}`} />
                        {isToggling
                          ? "Updating..."
                          : station.status === "OFF"
                            ? "Enable"
                            : "Disable"}
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

      {totalElements > 0 && (
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-sm text-gray-600">
            Showing {startItem} to {endItem} of {totalElements} stations
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1 || isPageLoading}
              className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  disabled={isPageLoading}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page
                      ? "bg-green-600 text-white"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || isPageLoading}
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
