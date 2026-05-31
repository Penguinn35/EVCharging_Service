"use client";

import Link from "next/link";
import {
  ChangeEvent,
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  TooltipItem,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import {
  FiArrowLeft,
  FiChevronLeft,
  FiChevronRight,
  FiEdit2,
  FiImage,
  FiLoader,
  FiMapPin,
  FiMessageSquare,
  FiStar,
  FiTrash2,
  FiUpload,
  FiZap,
} from "react-icons/fi";
import {
  getRating,
  getRatingStatistics,
  getStationById,
  type StationRating,
  type StationRatingResponse,
  type StationRatingStatistic,
} from "@/services/stationService";
import {
  deleteBusinessStationImage,
  updateBusinessStationImage,
  uploadBusinessStationImage,
} from "@/services/enterpriseService";
import {
  getStationDetailCountStatistics,
  type StationDetailCountStatistic,
} from "@/services/statisticsService";
import type { StationDetail as StationDetailType } from "@/type/station";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface StationDetailProps {
  stationId: string;
  backHref: string;
}

type StationStatusLabel = "AVAILABLE" | "BUSY" | "FULL" | "OFF";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=1200&h=600&fit=crop";
const DEFAULT_RATING_PAGE_SIZE = 10;

const handleImageError = (event: SyntheticEvent<HTMLImageElement, Event>) => {
  if (event.currentTarget.src === FALLBACK_IMAGE) {
    event.currentTarget.onerror = null;
    event.currentTarget.src =
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 600'%3E%3Crect width='1200' height='600' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%236b7280' font-family='Arial, sans-serif' font-size='42'%3EImage unavailable%3C/text%3E%3C/svg%3E";
    return;
  }

  event.currentTarget.src = FALLBACK_IMAGE;
};

const mapStationStatus = (status: number): StationStatusLabel => {
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

const statusColors: Record<StationStatusLabel, string> = {
  AVAILABLE: "bg-green-100 text-green-700",
  BUSY: "bg-yellow-100 text-yellow-700",
  FULL: "bg-orange-100 text-orange-700",
  OFF: "bg-gray-100 text-gray-700",
};

const connectorTypeLabels: Record<number, string> = {
  0: "Type 1",
  1: "Type 2",
  2: "CCS2",
  3: "CHAdeMO",
};

const formatConnectorType = (type: number) =>
  connectorTypeLabels[type] ?? `Type ${type}`;
const formatPower = (value: number) => `${value} kW`;
const formatVoltage = (value: number) => `${value} V`;
const formatPrice = (value: number) => `$${value.toFixed(2)}`;
const formatApiDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};
const formatStatisticDateKey = (date: Date) =>
  formatApiDate(date).replaceAll("-", "");
const formatChartDateLabel = (date: Date) =>
  date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
  });
const formatRatingDate = (value: string) =>
  new Date(value).toLocaleString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
const renderStars = (count: number) =>
  Array.from({ length: Math.max(0, count) }, () => "?").join("");

export function StationDetail({ stationId, backHref }: StationDetailProps) {
  const [station, setStation] = useState<StationDetailType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingImageKey, setEditingImageKey] = useState<string | null>(null);
  const [deletingImageKey, setDeletingImageKey] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [ratingsPage, setRatingsPage] = useState(0);
  const [ratingsData, setRatingsData] = useState<StationRatingResponse | null>(
    null,
  );
  const [ratingStatistics, setRatingStatistics] = useState<
    StationRatingStatistic[]
  >([]);
  const [isRatingsLoading, setIsRatingsLoading] = useState(true);
  const [ratingsError, setRatingsError] = useState<string | null>(null);
  const [detailCountStatistics, setDetailCountStatistics] = useState<
    StationDetailCountStatistic[]
  >([]);
  const [isDetailCountLoading, setIsDetailCountLoading] = useState(true);
  const [detailCountError, setDetailCountError] = useState<string | null>(null);
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const replaceInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const loadStationDetail = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getStationById(stationId);
      setStation(response);
      setCurrentImageIndex((prev) => {
        const nextLength = response.images.length;
        if (nextLength === 0) {
          return 0;
        }
        return Math.min(prev, nextLength - 1);
      });
    } catch {
      setError("Failed to load station details.");
    } finally {
      setIsLoading(false);
    }
  }, [stationId]);

  const loadRatings = useCallback(async () => {
    console.log("in rating fetch");

    setIsRatingsLoading(true);
    setRatingsError(null);

    try {
      const [ratingsResponse, statisticsResponse] = await Promise.all([
        getRating({
          stationId,
          page: ratingsPage,
          size: DEFAULT_RATING_PAGE_SIZE,
        }),
        getRatingStatistics(stationId),
      ]);

      setRatingsData(ratingsResponse);
      setRatingStatistics(statisticsResponse);
    } catch {
      setRatingsError("Failed to load station ratings.");
    } finally {
      setIsRatingsLoading(false);
    }
  }, [ratingsPage, stationId]);

  const loadDetailCountStatistics = useCallback(async () => {
    const today = new Date();
    const fromDate = new Date(today);
    fromDate.setDate(today.getDate() - 29);

    setIsDetailCountLoading(true);
    setDetailCountError(null);

    try {
      const response = await getStationDetailCountStatistics(stationId, {
        fromDate: formatApiDate(fromDate),
        toDate: formatApiDate(today),
        page: 0,
        size: 30,
      });

      setDetailCountStatistics(response.content);
    } catch {
      setDetailCountError("Không thể tải thống kê lượt xem chi tiết.");
    } finally {
      setIsDetailCountLoading(false);
    }
  }, [stationId]);

  useEffect(() => {
    void loadStationDetail();
  }, [loadStationDetail]);

  useEffect(() => {
    void loadRatings();
  }, [loadRatings]);

  useEffect(() => {
    void loadDetailCountStatistics();
  }, [loadDetailCountStatistics]);

  useEffect(() => {
    setRatingsPage(0);
  }, [stationId]);

  const images = station?.images ?? [];
  const displayImage = images[currentImageIndex]?.url ?? FALLBACK_IMAGE;
  const statusLabel = station ? mapStationStatus(station.status) : "OFF";

  const connectorTypes = useMemo(() => {
    if (!station) {
      return [];
    }
    return Array.from(
      new Set(
        station.connectors.map((connector) =>
          formatConnectorType(connector.type),
        ),
      ),
    );
  }, [station]);

  const maxPowers = useMemo(() => {
    if (!station) {
      return [];
    }
    return Array.from(
      new Set(station.connectors.map((connector) => connector.maxPower)),
    );
  }, [station]);

  const availableConnectors =
    station?.connectors.filter((connector) => connector.available) ?? [];

  const ratingDistribution = useMemo(() => {
    const totals = new Map<number, number>(
      ratingStatistics.map((item) => [
        item.starPoint,
        item.totalNumberOfRating,
      ]),
    );

    return [5, 4, 3, 2, 1].map((starPoint) => ({
      starPoint,
      totalNumberOfRating: totals.get(starPoint) ?? 0,
    }));
  }, [ratingStatistics]);

  const totalRatings = useMemo(
    () =>
      ratingDistribution.reduce(
        (sum, item) => sum + item.totalNumberOfRating,
        0,
      ),
    [ratingDistribution],
  );

  const averageRating = useMemo(() => {
    if (totalRatings === 0) {
      return 0;
    }

    const weightedTotal = ratingDistribution.reduce(
      (sum, item) => sum + item.starPoint * item.totalNumberOfRating,
      0,
    );

    return weightedTotal / totalRatings;
  }, [ratingDistribution, totalRatings]);

  const detailCountChartData = useMemo(() => {
    const totalsByDate = new Map(
      detailCountStatistics.map((item) => [
        item.date,
        item.sumOfViewDetailCount,
      ]),
    );
    const today = new Date();
    const days = Array.from({ length: 30 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - 29 + index);
      return date;
    });

    return {
      labels: days.map(formatChartDateLabel),
      datasets: [
        {
          label: "Lượt xem chi tiết",
          data: days.map(
            (date) => totalsByDate.get(formatStatisticDateKey(date)) ?? 0,
          ),
          backgroundColor: "#16a34a",
          borderColor: "#15803d",
          borderWidth: 1,
          borderRadius: 6,
          maxBarThickness: 28,
        },
      ],
    };
  }, [detailCountStatistics]);

  const detailCountChartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "rgba(17, 24, 39, 0.92)",
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            label: (context: TooltipItem<"bar">) =>
              `${context.parsed.y} lượt xem`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { maxRotation: 45, minRotation: 45, font: { size: 11 } },
        },
        y: {
          beginAtZero: true,
          ticks: { precision: 0, font: { size: 11 } },
          grid: { color: "#f3f4f6" },
        },
      },
    }),
    [],
  );

  const showTemporaryMessage = (message: string) => {
    setActionMessage(message);
    window.setTimeout(() => {
      setActionMessage((current) => (current === message ? null : current));
    }, 2500);
  };

  const handleUploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !station) {
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const previousImageCount = station.images.length;
      const isSuccess = await uploadBusinessStationImage(station.id, file);
      if (!isSuccess) {
        throw new Error("Upload failed");
      }
      showTemporaryMessage("Image uploaded successfully.");
      await loadStationDetail();
      setCurrentImageIndex(previousImageCount);
    } catch {
      setError("Failed to upload image.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleReplaceImage = async (
    key: string,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file || !station) {
      return;
    }

    setEditingImageKey(key);
    setError(null);

    try {
      const isSuccess = await updateBusinessStationImage(station.id, key, file);
      if (!isSuccess) {
        throw new Error("Update failed");
      }
      showTemporaryMessage("Image updated successfully.");
      await loadStationDetail();
    } catch {
      setError("Failed to update image.");
    } finally {
      setEditingImageKey(null);
      event.target.value = "";
    }
  };

  const handleDeleteImage = async (key: string, index: number) => {
    setDeletingImageKey(key);
    setError(null);

    try {
      const isSuccess = await deleteBusinessStationImage(key);
      if (!isSuccess) {
        throw new Error("Delete failed");
      }
      showTemporaryMessage("Image deleted successfully.");
      await loadStationDetail();
      setCurrentImageIndex((prev) => Math.max(0, Math.min(prev, index - 1)));
      setIsImagePreviewOpen(false);
    } catch {
      setError("Failed to delete image.");
    } finally {
      setDeletingImageKey(null);
    }
  };

  const handlePreviousRatingsPage = () => {
    setRatingsPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextRatingsPage = () => {
    if (!ratingsData?.last) {
      setRatingsPage((prev) => prev + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-200"
        >
          <FiArrowLeft className="h-4 w-4" />
          Quay lại bảng trạm
        </Link>
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-16 text-center text-sm text-gray-500">
          Loading station details...
        </div>
      </div>
    );
  }

  if (error && !station) {
    return (
      <div className="space-y-6">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-200"
        >
          <FiArrowLeft className="h-4 w-4" />
          Quay lại bảng trạm
        </Link>
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-8 text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!station) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-200"
      >
        <FiArrowLeft className="h-4 w-4" />
        Quay lại bảng trạm
      </Link>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {actionMessage ? (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {actionMessage}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="relative h-80 bg-gray-100">
          <button
            type="button"
            onClick={() => images.length > 0 && setIsImagePreviewOpen(true)}
            className="block h-full w-full cursor-zoom-in"
          >
            <img
              src={displayImage}
              alt={station.name}
              className="h-full w-full object-cover"
              onError={handleImageError}
            />
          </button>

          {images.length > 1 ? (
            <>
              <button
                type="button"
                onClick={() =>
                  setCurrentImageIndex((prev) =>
                    prev === 0 ? images.length - 1 : prev - 1,
                  )
                }
                className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white transition hover:bg-black/60"
              >
                <FiChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setCurrentImageIndex((prev) =>
                    prev === images.length - 1 ? 0 : prev + 1,
                  )
                }
                className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white transition hover:bg-black/60"
              >
                <FiChevronRight className="h-5 w-5" />
              </button>
            </>
          ) : null}

          <div className="absolute bottom-4 right-4 rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white">
            {images.length === 0
              ? "No image"
              : `${currentImageIndex + 1} / ${images.length}`}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-gray-200 px-4 py-3">
          <input
            ref={uploadInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUploadImage}
          />
          <button
            type="button"
            onClick={() => uploadInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading ? (
              <FiLoader className="h-4 w-4 animate-spin" />
            ) : (
              <FiUpload className="h-4 w-4" />
            )}
            Thêm ảnh
          </button>

          {images.length > 0 ? (
            <>
              <button
                type="button"
                onClick={() =>
                  replaceInputRefs.current[
                    images[currentImageIndex].key
                  ]?.click()
                }
                disabled={editingImageKey === images[currentImageIndex].key}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {editingImageKey === images[currentImageIndex].key ? (
                  <FiLoader className="h-4 w-4 animate-spin" />
                ) : (
                  <FiEdit2 className="h-4 w-4" />
                )}
                Thay ảnh này
              </button>
              <button
                type="button"
                onClick={() =>
                  void handleDeleteImage(
                    images[currentImageIndex].key,
                    currentImageIndex,
                  )
                }
                disabled={deletingImageKey === images[currentImageIndex].key}
                className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingImageKey === images[currentImageIndex].key ? (
                  <FiLoader className="h-4 w-4 animate-spin" />
                ) : (
                  <FiTrash2 className="h-4 w-4" />
                )}
                Xóa ảnh
              </button>
            </>
          ) : null}
        </div>

        {images.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 border-t border-gray-200 px-4 py-4 sm:grid-cols-4 lg:grid-cols-6">
            {images.map((image, index) => (
              <div
                key={image.key}
                className={`group relative overflow-hidden rounded-lg border ${index === currentImageIndex ? "border-green-500 ring-2 ring-green-100" : "border-gray-200"}`}
              >
                <button
                  type="button"
                  onClick={() => setCurrentImageIndex(index)}
                  className="block h-24 w-full"
                >
                  <img
                    src={image.url}
                    alt={`${station.name} ${index + 1}`}
                    className="h-full w-full object-cover"
                    onError={handleImageError}
                  />
                </button>
                <input
                  ref={(element) => {
                    replaceInputRefs.current[image.key] = element;
                  }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) =>
                    void handleReplaceImage(image.key, event)
                  }
                />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/55 px-2 py-1 text-white opacity-0 transition group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => replaceInputRefs.current[image.key]?.click()}
                    className="inline-flex items-center gap-1 text-xs"
                  >
                    <FiEdit2 className="h-3 w-3" />
                    Sửa
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDeleteImage(image.key, index)}
                    className="inline-flex items-center gap-1 text-xs"
                  >
                    <FiTrash2 className="h-3 w-3" />
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-3 border-t border-gray-200 px-4 py-8 text-sm text-gray-500">
            <FiImage className="h-5 w-5" />
            Trạm này hiện chưa có ảnh.
          </div>
        )}
      </div>

      {isImagePreviewOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setIsImagePreviewOpen(false)}
        >
          <div
            className="relative max-h-[90vh] max-w-[90vw]"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={displayImage}
              alt={`${station.name} full preview`}
              className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
              onError={handleImageError}
            />
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">{station.name}</h1>
          <div className="flex items-center gap-2 text-gray-600">
            <FiMapPin className="h-4 w-4" />
            <span>{station.address}</span>
          </div>
          <div className="text-sm text-gray-500">
            Quản lý: {station.manufacturer}
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-600">Trạng thái</div>
          <span
            className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusColors[statusLabel]}`}
          >
            {statusLabel}
          </span>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-600">Quận</div>
          <div className="font-semibold text-gray-900">{station.district}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="mb-2 text-xs font-medium uppercase text-gray-600">
            Đầu sạc
          </div>
          <div className="text-2xl font-bold text-green-600">
            {station.connectors.length}
          </div>
          <div className="mt-1 text-xs text-gray-500">
            {availableConnectors.length} đang hoạt động
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="mb-2 text-xs font-medium uppercase text-gray-600">
            Tọa độ
          </div>
          <div className="break-all font-mono text-sm text-gray-900">
            {station.position.latitude.toFixed(4)},{" "}
            {station.position.longitude.toFixed(4)}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="mb-2 text-xs font-medium uppercase text-gray-600">
            Đầu sạc
          </div>
          <div className="space-y-1">
            {connectorTypes.length > 0 ? (
              connectorTypes.map((type) => (
                <div key={type} className="text-sm font-medium text-gray-900">
                  {type}
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500">Trống</div>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="mb-2 text-xs font-medium uppercase text-gray-600">
            Công suất
          </div>
          <div className="space-y-1">
            {maxPowers.length > 0 ? (
              maxPowers.map((power) => (
                <div key={power} className="text-sm font-medium text-gray-900">
                  {formatPower(power)}
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500">No data</div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Điểm sạc</h2>
        {station.connectors.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    Connector ID
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    Đầu sạc
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    Nguồn
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    Công suất
                  </th>
                  
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {station.connectors.map((connector) => (
                  <tr
                    key={connector.id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {connector.id}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {formatConnectorType(connector.type)}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {formatVoltage(connector.voltage)}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {formatPower(connector.maxPower)}
                    </td>
                   
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${connector.available ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
                      >
                        {connector.available ? "Available" : "Busy"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-sm text-gray-500">Không có dữ liệu.</div>
        )}
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center gap-2">
          <FiStar className="h-5 w-5 text-amber-500" />
          <h2 className="text-lg font-semibold text-gray-900">Đánh giá</h2>
        </div>

        {ratingsError ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {ratingsError}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="text-sm font-medium text-gray-600">
              Điểm trung bình
            </div>
            <div className="mt-2 flex items-end gap-2">
              <span className="text-3xl font-bold text-amber-500">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-sm text-gray-500">/ 5</span>
            </div>
            <div className="mt-1 text-sm text-gray-500">
              Tổng: {totalRatings}
            </div>

            <div className="mt-5 space-y-3">
              {ratingDistribution.map((item) => {
                const percentage =
                  totalRatings === 0
                    ? 0
                    : (item.totalNumberOfRating / totalRatings) * 100;

                return (
                  <div key={item.starPoint} className="space-y-1">
                    <div className="flex items-center justify-between text-sm text-gray-700">
                      <span>{item.starPoint} star</span>
                      <span>{item.totalNumberOfRating}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-amber-400 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            {isRatingsLoading ? (
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-8 text-sm text-gray-500">
                <FiLoader className="h-4 w-4 animate-spin" />
                Loading ratings...
              </div>
            ) : null}

            {!isRatingsLoading && (ratingsData?.content.length ?? 0) > 0 ? (
              <>
                <div className="space-y-3">
                  {ratingsData?.content.map((rating: StationRating) => (
                    <div
                      key={rating.id}
                      className="rounded-lg border border-gray-200 p-4"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-2">
                          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">
                            <FiStar className="h-4 w-4 fill-current" />
                            <span>{rating.point}/5</span>
                            <span className="text-amber-600">
                              {renderStars(rating.point)}
                            </span>
                          </div>
                          <p className="text-sm leading-6 text-gray-700">
                            {rating.comment || "No comment provided."}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <FiMessageSquare className="h-4 w-4" />
                          <span>{formatRatingDate(rating.timePosted)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-gray-600">
                    Showing page {(ratingsData?.number ?? 0) + 1} of{" "}
                    {ratingsData?.totalPages ?? 1}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePreviousRatingsPage}
                      disabled={
                        (ratingsData?.first ?? true) || isRatingsLoading
                      }
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={handleNextRatingsPage}
                      disabled={(ratingsData?.last ?? true) || isRatingsLoading}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            ) : null}

            {!isRatingsLoading &&
            !ratingsError &&
            (ratingsData?.content.length ?? 0) === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-300 px-4 py-10 text-center text-sm text-gray-500">
                Chưa có đánh giá.
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Lượt xem chi tiết
            </h2>
            <p className="text-sm text-gray-500">Thống kê 30 ngày gần nhất</p>
          </div>
        </div>

        {detailCountError ? (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {detailCountError}
          </div>
        ) : null}

        <div className="relative h-96 w-full">
          {isDetailCountLoading ? (
            <div className="flex h-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 text-sm text-gray-500">
              <FiLoader className="h-4 w-4 animate-spin" />
              Đang tải thống kê...
            </div>
          ) : (
            <Bar
              data={detailCountChartData}
              options={detailCountChartOptions}
            />
          )}
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center gap-2">
          <FiZap className="h-5 w-5 text-green-600" />
          <h2 className="text-lg font-semibold text-gray-900">Định vị</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="text-sm font-medium text-gray-600">Địa chỉ</div>
            <div className="mt-1 text-sm text-gray-900">{station.address}</div>
          </div>
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="text-sm font-medium text-gray-600">Tọa độ</div>
            <div className="mt-1 text-sm text-gray-900">
              {station.position.latitude}, {station.position.longitude}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
