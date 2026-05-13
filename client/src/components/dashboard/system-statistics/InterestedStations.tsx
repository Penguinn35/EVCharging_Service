"use client";

import { useEffect, useState } from "react";
import {
  getTotalDetailCountStatistics,
  TotalDetailCountStatistic,
} from "@/services/statisticsService";
import { FiCalendar, FiEye, FiStar } from "react-icons/fi";

type DateFilter = "day" | "week" | "month" | "custom";

const ITEMS_PER_PAGE = 10;

const formatDateForInput = (date: Date) => date.toISOString().split("T")[0];

const getDateRangeByFilter = (
  filter: DateFilter,
  customFromDate: string,
  customToDate: string,
) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (filter === "custom") {
    return {
      fromDate: customFromDate,
      toDate: customToDate,
    };
  }

  if (filter === "day") {
    const date = formatDateForInput(yesterday);
    return {
      fromDate: date,
      toDate: date,
    };
  }

  const fromDate = new Date(yesterday);
  fromDate.setDate(yesterday.getDate() - (filter === "week" ? 6 : 29));

  return {
    fromDate: formatDateForInput(fromDate),
    toDate: formatDateForInput(yesterday),
  };
};

export function InterestedStations() {
  const defaultDay = formatDateForInput(new Date(Date.now() - 86400000));

  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState<DateFilter>("day");
  const [customFromDate, setCustomFromDate] = useState(defaultDay);
  const [customToDate, setCustomToDate] = useState(defaultDay);
  const [stations, setStations] = useState<TotalDetailCountStatistic[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const topStations = stations.slice(0, 3);

  useEffect(() => {
    const fetchStatistics = async () => {
      const { fromDate, toDate } = getDateRangeByFilter(
        dateFilter,
        customFromDate,
        customToDate,
      );

      if (!fromDate || !toDate) {
        setStations([]);
        setTotalElements(0);
        setTotalPages(0);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await getTotalDetailCountStatistics({
          fromDate,
          toDate,
          page: currentPage - 1,
          size: ITEMS_PER_PAGE,
        });

        setStations(response.content);
        setTotalElements(response.totalElements);
        setTotalPages(response.totalPages);
      } catch {
        setError("Khong the tai thong ke muc do quan tam tram sac.");
        setStations([]);
        setTotalElements(0);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [currentPage, customFromDate, customToDate, dateFilter]);

  const startItem = totalElements === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = totalElements === 0 ? 0 : Math.min(currentPage * ITEMS_PER_PAGE, totalElements);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {topStations.map((station, index) => (
          <div
            key={station.stationId}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-3 gap-3">
              <div>
                <div className="text-sm font-semibold text-gray-500 uppercase">
                  #{index + 1}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mt-1">{station.stationName}</h3>
              </div>
              <div className="bg-green-100 rounded-lg p-2 shrink-0">
                <FiStar className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">{station.address}</p>
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-green-600">
                  {station.sumOfViewDetailCount}
                </span>
                <span className="text-sm text-gray-600">lượt quan tâm</span>
              </div>
            </div>
          </div>
        ))}

        {!loading && topStations.length === 0 && (
          <div className="md:col-span-3 rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
            Khong co du lieu top station trong khoang thoi gian da chon.
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Thống kê lượt xem chi tiết</h3>

          <div className="flex flex-wrap items-center gap-3">
            <FiCalendar className="w-5 h-5 text-gray-600" />
            <select
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value as DateFilter);
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
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="date"
                  value={customFromDate}
                  onChange={(e) => {
                    setCustomFromDate(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="date"
                  value={customToDate}
                  onChange={(e) => {
                    setCustomToDate(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Hạng</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tên trạm sạc</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Địa chỉ</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Quận</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Lượt xem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">
                    Dang tai du lieu...
                  </td>
                </tr>
              ) : stations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">
                    Khong co du lieu trong khoang thoi gian da chon.
                  </td>
                </tr>
              ) : (
                stations.map((station, index) => {
                  const rank = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;

                  return (
                    <tr key={station.stationId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-bold text-green-600">#{rank}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{station.stationName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{station.address}</td>
                      <td className="px-4 py-3 text-sm text-gray-600"></td>
                      <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
                        <span className="inline-flex items-center gap-2">
                          <FiEye className="w-4 h-4 text-green-600" />
                          {station.sumOfViewDetailCount}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 pt-4 border-t border-gray-200 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-gray-600">
            Showing {startItem} to {endItem} of {totalElements} stations
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || loading}
              className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  disabled={loading}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page
                      ? "bg-green-600 text-white"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  } disabled:opacity-50`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages || 1, prev + 1))}
              disabled={currentPage === totalPages || totalPages === 0 || loading}
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

