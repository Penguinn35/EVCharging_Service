"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BusinessStationRating,
  BusinessStationRatingStatistic,
  getBusinessStationRatings,
  GetBusinessStationRatingsParams,
} from "@/services/enterpriseService";
import { FiCalendar, FiFilter, FiStar } from "react-icons/fi";

type DateFilter = "day" | "week" | "month" | "custom";
type RatingPoint = 1 | 2 | 3 | 4 | 5;

type AppliedFilters = {
  lowestPoint: RatingPoint;
  highestPoint: RatingPoint;
  dateFilter: DateFilter;
  customFromDate: string;
  customToDate: string;
};

const ITEMS_PER_PAGE = 10;
const RATING_POINTS: RatingPoint[] = [1, 2, 3, 4, 5];

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

const getSelectedPointClass = (
  point: RatingPoint,
  lowestPoint: RatingPoint,
  highestPoint: RatingPoint,
) => {
  if (point < lowestPoint || point > highestPoint) {
    return "bg-gray-100 text-gray-700 hover:bg-gray-200";
  }

  if (point === lowestPoint || point === highestPoint) {
    return "bg-green-600 text-white";
  }

  return "bg-green-100 text-green-700 hover:bg-green-200";
};

export function RatingsViewer() {
  const defaultDay = formatDateForInput(new Date(Date.now() - 86400000));

  const [lowestPoint, setLowestPoint] = useState<RatingPoint>(1);
  const [highestPoint, setHighestPoint] = useState<RatingPoint>(5);
  const [dateFilter, setDateFilter] = useState<DateFilter>("week");
  const [customFromDate, setCustomFromDate] = useState(defaultDay);
  const [customToDate, setCustomToDate] = useState(defaultDay);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({
    lowestPoint: 1,
    highestPoint: 5,
    dateFilter: "week",
    customFromDate: defaultDay,
    customToDate: defaultDay,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [ratings, setRatings] = useState<BusinessStationRating[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalNumberOfRatings, setTotalNumberOfRatings] = useState(0);
  const [averagePoint, setAveragePoint] = useState(0);
  const [ratingStatistics, setRatingStatistics] = useState<BusinessStationRatingStatistic[]>([]);
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
        setTotalNumberOfRatings(0);
        setAveragePoint(0);
        setRatingStatistics([]);
        return;
      }

      const params: GetBusinessStationRatingsParams = {
        fromDate,
        toDate,
        lowestPoint: appliedFilters.lowestPoint,
        highestPoint: appliedFilters.highestPoint,
        page: currentPage - 1,
        size: ITEMS_PER_PAGE,
      };

      setLoading(true);
      setError(null);

      try {
        const response = await getBusinessStationRatings(params);
        setRatings(response.ratingResponses.content);
        setTotalElements(response.ratingResponses.totalElements);
        setTotalPages(response.ratingResponses.totalPages);
        setTotalNumberOfRatings(response.totalStatistics.totalNumberOfRatings);
        setAveragePoint(response.totalStatistics.averagePoint);
        setRatingStatistics(response.ratingStatistics);
      } catch {
        setError("Khong the tai danh sach danh gia.");
        setRatings([]);
        setTotalElements(0);
        setTotalPages(0);
        setTotalNumberOfRatings(0);
        setAveragePoint(0);
        setRatingStatistics([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [appliedFilters, currentPage]);

  const handleSelectPoint = (point: RatingPoint) => {
    if (point < lowestPoint) {
      setLowestPoint(point);
      return;
    }

    if (point > highestPoint) {
      setHighestPoint(point);
      return;
    }

    const distanceToLow = Math.abs(point - lowestPoint);
    const distanceToHigh = Math.abs(point - highestPoint);

    if (distanceToLow <= distanceToHigh) {
      setLowestPoint(point);
    } else {
      setHighestPoint(point);
    }
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    setAppliedFilters({
      lowestPoint,
      highestPoint,
      dateFilter,
      customFromDate,
      customToDate,
    });
  };

  const ratingStatisticsMap = useMemo(() => {
    return ratingStatistics.reduce<Record<number, number>>((acc, item) => {
      acc[item.starPoint] = item.totalNumberOfRating;
      return acc;
    }, {});
  }, [ratingStatistics]);

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
      <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <FiFilter className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Lọc theo</h3>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Khoảng điểm:</span>
              {RATING_POINTS.map((point) => (
                <button
                  key={point}
                  onClick={() => handleSelectPoint(point)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${getSelectedPointClass(point, lowestPoint, highestPoint)}`}
                >
                  {point} sao
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{lowestPoint} sao</span>
              <span>-</span>
              <span>{highestPoint} sao</span>
            </div>

            <div className="flex items-center gap-3">
              <FiCalendar className="h-5 w-5 text-gray-600" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as DateFilter)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
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
                    className="rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="date"
                    value={customToDate}
                    onChange={(e) => setCustomToDate(e.target.value)}
                    className="rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              )}
              <button
                onClick={handleApplyFilters}
                disabled={loading}
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
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

        <div>
          <h2 className="text-xl font-semibold text-gray-900">Rating Summary</h2>
          <p className="mt-1 text-sm text-gray-600">
            Tổng hợp số lượng, điểm trung bình và phân bố đánh giá theo từng mục sao.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="text-sm font-medium text-gray-600">Tong so danh gia</div>
            <div className="mt-2 text-3xl font-bold text-gray-900">{totalNumberOfRatings}</div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="text-sm font-medium text-gray-600">Diem trung binh</div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-green-600">{averagePoint.toFixed(1)}</span>
              <span className="text-sm text-gray-600">/5</span>
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="text-sm font-medium text-gray-600">Phân bố theo điểm</div>
            <div className="mt-3 space-y-2">
              {[5, 4, 3, 2, 1].map((point) => (
                <div key={point} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <FiStar className="h-4 w-4 text-amber-500" />
                    <span>{point} sao</span>
                  </div>
                  <span className="font-semibold text-gray-900">{ratingStatisticsMap[point] ?? 0}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="rounded-lg border border-gray-200 px-4 py-8 text-center text-sm text-gray-500">
              Dang tai du lieu...
            </div>
          ) : ratings?.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 px-4 py-8 text-center text-sm text-gray-500">
              Khong co danh gia trong khoang thoi gian da chon.
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 bg-white">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                        ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                        Comment
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                        Point
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {ratings.map((rating) => (
                      <tr key={rating.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 text-sm font-medium text-gray-900">
                          {rating.id.slice(0, 8)}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700">
                          <p className="whitespace-pre-wrap">
                            {rating.comment?.trim() ? rating.comment : "Khong co noi dung danh gia."}
                          </p>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700">
                          <div
                            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-bold ${getRatingColor(rating.point)}`}
                          >
                            <FiStar className="h-4 w-4" />
                            {rating.point}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500">
                          {formatPostedDate(rating.timePosted)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-gray-600">
            Showing {startItem} to {endItem} of {totalElements} ratings
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || loading}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
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
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
