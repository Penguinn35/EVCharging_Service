"use client";

import { useState, useMemo } from "react";
import { ratings } from "@/lib/data/ratings";
import { stations } from "@/lib/data/stations";
import { FiStar, FiFilter, FiCalendar } from "react-icons/fi";

const ITEMS_PER_PAGE = 5;

export function RatingsViewer() {
  const [selectedRating, setSelectedRating] = useState<1 | 2 | 3 | 4 | 5 | 0>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState<"day" | "week" | "month" | "custom">("week");

  const filteredRatings = useMemo(() => {
    if (selectedRating === 0) {
      return ratings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return ratings
      .filter((r) => r.point === selectedRating)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [selectedRating]);

  const totalPages = Math.ceil(filteredRatings.length / ITEMS_PER_PAGE);
  const paginatedRatings = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredRatings.slice(startIndex, endIndex);
  }, [filteredRatings, currentPage]);

  const getRatingCounts = () => {
    const counts: Record<1 | 2 | 3 | 4 | 5, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };
    ratings.forEach((r) => {
      counts[r.point]++;
    });
    return counts;
  };

  const ratingCounts = getRatingCounts();
  const totalRatings = ratings.length;
  const averageRating = (
    ratings.reduce((sum, r) => sum + r.point, 0) / totalRatings
  ).toFixed(1);

  const getStationName = (stationId: string) => {
    return stations.find((s) => s.id === stationId)?.name || "Unknown Station";
  };

  const getRatingColor = (point: number) => {
    if (point >= 4) return "text-green-600 bg-green-50";
    if (point === 3) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getRatingBgColor = (point: number) => {
    if (point >= 4) return "bg-green-100";
    if (point === 3) return "bg-yellow-100";
    return "bg-red-100";
  };

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 font-medium">Total Ratings</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">{totalRatings}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 font-medium">Average Rating</div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-green-600">{averageRating}</span>
            <span className="text-sm text-gray-600">/5</span>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 font-medium">Ratings by Score</div>
          <div className="mt-2 space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-green-600 font-semibold">⭐⭐⭐⭐⭐:</span>
              <span className="text-gray-700">{ratingCounts[5]}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-600 font-semibold">⭐⭐⭐:</span>
              <span className="text-gray-700">{ratingCounts[3]}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-3 mb-4">
          <FiFilter className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filter by Rating</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedRating(0)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedRating === 0
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All Ratings ({totalRatings})
          </button>
          {[5, 4, 3, 2, 1].map((point) => (
            <button
              key={point}
              onClick={() => setSelectedRating(point as 1 | 2 | 3 | 4 | 5)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedRating === point
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {point} Star ({ratingCounts[point as 1 | 2 | 3 | 4 | 5]})
            </button>
          ))}
        </div>
      </div>

      {/* Date Filter and Ratings List */}
      <div className="space-y-4">
        {/* Date Filter */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiCalendar className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filter by Date:</span>
          </div>
          <div className="flex items-center gap-3">
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

        {/* Ratings List */}
        <div className="space-y-3">
          {paginatedRatings.map((rating) => (
          <div key={rating.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="font-semibold text-gray-900">{getStationName(rating.stationId)}</div>
                <div className="text-sm text-gray-600">User #{rating.userId}</div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-bold ${getRatingColor(rating.point)}`}>
                {rating.point} ⭐
              </div>
            </div>
            <p className="text-gray-700 text-sm mb-3">{rating.description}</p>
            <div className="text-xs text-gray-500">
              {new Date(rating.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>
        ))}
          {paginatedRatings.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No ratings found for the selected filter.
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredRatings.length > 0 && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredRatings.length)} of{" "}
              {filteredRatings.length} ratings
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
        )}
      </div>
    </div>
  );
}
