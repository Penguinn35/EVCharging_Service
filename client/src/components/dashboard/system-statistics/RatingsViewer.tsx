"use client";

import { useEffect, useState } from "react";
import {
  getBusinessStationRatings,
  GetBusinessStationRatingsParams,
  BusinessStationRating,
} from "@/services/enterpriseService";
import { FiCalendar, FiFilter, FiStar } from "react-icons/fi";

type DateFilter = "day" | "week" | "month" | "custom";
type RatingFilter = 0 | 1 | 2 | 3 | 4 | 5;

type AppliedFilters = {
  selectedRating: RatingFilter;
  dateFilter: DateFilter;
  customFromDate: string;
  customToDate: string;
};

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

const getRatingParams = (selectedRating: RatingFilter) => {
  if (selectedRating === 0) {
    return {
      lowestPoint: 0,
      highestPoint: 5,
    };
  }

  return {
    lowestPoint: selectedRating,
    highestPoint: selectedRating,
  };
};

export function RatingsViewer() {
  const defaultDay = formatDateForInput(new Date(Date.now() - 86400000));

  const [selectedRating, setSelectedRating] = useState<RatingFilter>(0);
  const [dateFilter, setDateFilter] = useState<DateFilter>("week");
  const [customFromDate, setCustomFromDate] = useState(defaultDay);
  const [customToDate, setCustomToDate] = useState(defaultDay);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({
    selectedRating: 0,
    dateFilter: "week",
    customFromDate: defaultDay,
    customToDate: defaultDay,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [ratings, setRatings] = useState<BusinessStationRating[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRatings = async () => {
      const { fromDate, toDate } = getDateRangeByFilter(
        appliedFilters.dateFilter,
        appliedFilters.customFromDate,
        appliedFilters.customToDate,
      );

      if (!fromDate || !toDate) {
        setRatings([]);
        setTotalElements(0);
        setTotalPages(0);
        return;
      }

      const ratingParams = getRatingParams(appliedFilters.selectedRating);
      const params: GetBusinessStationRatingsParams = {
        fromDate,
        toDate,
        ...ratingParams,
        page: currentPage - 1,
        size: ITEMS_PER_PAGE,
      };

      setLoading(true);
      setError(null);

      try {
        const response = await getBusinessStationRatings(params);
        setRatings(response.content);
        setTotalElements(response.totalElements);
        setTotalPages(response.totalPages);
      } catch {
        setError("Khong the tai danh sach danh gia.");
        setRatings([]);
        setTotalElements(0);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [appliedFilters, currentPage]);

  const handleApplyFilters = () => {
    setCurrentPage(1);
    setAppliedFilters({
      selectedRating,
      dateFilter,
      customFromDate,
      customToDate,
    });
  };

  const startItem = totalElements === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = totalElements === 0 ? 0 : Math.min(currentPage * ITEMS_PER_PAGE, totalElements);

  const formatPostedDate = (value: string) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRatingColor = (point: number) => {
    if (point >= 4) return "text-green-600 bg-green-50";
    if (point === 3) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  return (
    <div className="space-y-6">
      {/* Rating Summary
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 font-medium">Total Ratings</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">...</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 font-medium">Average Rating</div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-green-600">...</span>
            <span className="text-sm text-gray-600">/5</span>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 font-medium">Ratings by Score</div>
        </div>
      </div>
      */}

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <FiFilter className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Ratings Filters</h3>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedRating(0)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedRating === 0
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All Ratings
              </button>
              {[5, 4, 3, 2, 1].map((point) => (
                <button
                  key={point}
                  onClick={() => setSelectedRating(point as RatingFilter)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedRating === point
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {point} Star
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <FiCalendar className="w-5 h-5 text-gray-600" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as DateFilter)}
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
                    onChange={(e) => setCustomFromDate(e.target.value)}
                    className="px-2 py-1 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="date"
                    value={customToDate}
                    onChange={(e) => setCustomToDate(e.target.value)}
                    className="px-2 py-1 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              )}
              <button
                onClick={handleApplyFilters}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="space-y-3">
          {loading ? (
            <div className="rounded-lg border border-gray-200 px-4 py-8 text-center text-sm text-gray-500">
              Dang tai du lieu...
            </div>
          ) : ratings.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 px-4 py-8 text-center text-sm text-gray-500">
              Khong co danh gia trong khoang thoi gian da chon.
            </div>
          ) : (
            ratings.map((rating) => (
              <div
                key={rating.id}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="font-semibold text-gray-900">Review #{rating.id.slice(0, 8)}</div>
                    <div className="text-xs text-gray-500 mt-1">{formatPostedDate(rating.timePosted)}</div>
                  </div>
                  <div
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${getRatingColor(rating.point)}`}
                  >
                    <FiStar className="w-4 h-4" />
                    {rating.point}
                  </div>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {rating.comment?.trim() ? rating.comment : "Khong co noi dung danh gia."}
                </p>
              </div>
            ))
          )}
        </div>

        <div className="flex flex-col gap-3 pt-4 border-t border-gray-200 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-gray-600">
            Showing {startItem} to {endItem} of {totalElements} ratings
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