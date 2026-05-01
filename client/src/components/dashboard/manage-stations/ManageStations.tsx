"use client";

import { useEffect, useState } from "react";
import {
  getBusinessStations,
  toggleBusinessStationStatus,
  type BusinessStationListResponse,
  type BusinessStationSummary,
} from "@/services/enterpriseService";
import { StationsTable } from "./StationsTable";
import { FiRefreshCw } from "react-icons/fi";

type StationStatusLabel = "AVAILABLE" | "BUSY" | "FULL" | "OFF";

type ManageStationRow = {
  id: string;
  name: string;
  address: string;
  district: string;
  status: StationStatusLabel;
  availablePoints: number;
  totalPoints: number;
};

const DEFAULT_PAGE_SIZE = 5;

const mapStatusToLabel = (status: number): StationStatusLabel => {
  switch (status) {
    case 1:
      return "AVAILABLE";
    case 2:
      return "BUSY";
    case 3:
      return "FULL";
    default:
      return "OFF";
  }
};

const getNextStatus = (status: StationStatusLabel): StationStatusLabel => {
  return status === "OFF" ? "AVAILABLE" : "OFF";
};

const mapStationsForTable = (
  stations: BusinessStationSummary[],
): ManageStationRow[] => {
  return stations.map((station) => ({
    id: station.id,
    name: station.name,
    address: station.address,
    district: station.district ?? "Unknown",
    status: mapStatusToLabel(station.status),
    availablePoints: station.points ?? 0,
    totalPoints: station.points ?? 0,
  }));
};

export function ManageStations() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stations, setStations] = useState<ManageStationRow[]>([]);
  const [pagination, setPagination] = useState<BusinessStationListResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [district, setDistrict] = useState("");
  const [appliedKeyword, setAppliedKeyword] = useState("");
  const [appliedDistrict, setAppliedDistrict] = useState("");
  const [togglingStationIds, setTogglingStationIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStations = async (
    page = 1,
    nextKeyword = appliedKeyword,
    nextDistrict = appliedDistrict,
  ) => {
    setIsRefreshing(true);
    setError(null);

    try {
      const response = await getBusinessStations({
        page,
        size: DEFAULT_PAGE_SIZE,
        ...(nextKeyword.trim() ? { keyword: nextKeyword.trim() } : {}),
        ...(nextDistrict ? { district: nextDistrict } : {}),
      });
      setStations(mapStationsForTable(response.content));
      setPagination(response);
      setCurrentPage(response.number);
    } catch {
      setError("Failed to load stations.");
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadStations(1, "", "");
  }, []);

  const handleApplyFilters = () => {
    setAppliedKeyword(keyword);
    setAppliedDistrict(district);
    void loadStations(1, keyword, district);
  };

  const handleToggleStationStatus = async (stationId: string) => {
    setTogglingStationIds((prev) => [...prev, stationId]);
    setError(null);

    try {
      const isSuccess = await toggleBusinessStationStatus(stationId);
      if (!isSuccess) {
        throw new Error("Toggle failed");
      }

      setStations((prev) =>
        prev.map((station) =>
          station.id === stationId
            ? {
                ...station,
                status: getNextStatus(station.status),
              }
            : station,
        ),
      );
    } catch {
      setError("Failed to toggle station status.");
    } finally {
      setTogglingStationIds((prev) => prev.filter((id) => id !== stationId));
    }
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
            onClick={() => void loadStations(currentPage)}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <FiRefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : isLoading ? (
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-8 text-center text-sm text-gray-500">
          Loading stations...
        </div>
      ) : (
        <StationsTable
          stations={stations}
          currentPage={currentPage}
          totalPages={pagination?.totalPages ?? 0}
          totalElements={pagination?.totalElements ?? 0}
          pageSize={pagination?.size ?? DEFAULT_PAGE_SIZE}
          keyword={keyword}
          district={district}
          onKeywordChange={setKeyword}
          onDistrictChange={setDistrict}
          onApply={handleApplyFilters}
          onPageChange={(page) => void loadStations(page)}
          onToggleStationStatus={(stationId) => void handleToggleStationStatus(stationId)}
          togglingStationIds={togglingStationIds}
          isPageLoading={isRefreshing}
        />
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Status Legend:</strong> Green = Available, Yellow = Busy, Orange = Full, Gray = Offline
        </p>
      </div>
    </div>
  );
}
