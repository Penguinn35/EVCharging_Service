import React, {
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Connector } from "@/type/station";
import { StationDetail as StationDetailType } from "@/type/station";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { FaRegStar } from "react-icons/fa";
import { TfiWrite } from "react-icons/tfi";
import { FaRoute } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import {
  FiChevronLeft,
  FiChevronRight,
  FiLoader,
  FiMessageSquare,
} from "react-icons/fi";
import { useRoutingStore } from "@/store/useRoutingStore";
import { useUserStore } from "@/store/useUserStore";
import {
  getRating,
  getRatingStatistics,
  getStationById,
  StationRating,
  StationRatingResponse,
  StationRatingStatistic,
} from "@/services/stationService";
import { useAuthModalStore } from "@/store/useAuthModalStore";
import { StationSaved } from "@/type/user";
import RatingModal from "./RatingModal";
import { useStationStore } from "@/store/useStationStore";

type StationDetailProps = {
  station: StationDetailType;
  onClose: () => void;
  distance?: number;
};

type GroupedConnector = {
  maxPower: number;
  voltage: number;
  type: number;
  count: number;
};

const DEFAULT_RATING_PAGE_SIZE = 5;
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=1200&h=600&fit=crop";

const statusColor = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-gray-100 text-gray-600",
  maintenance: "bg-orange-100 text-orange-700",
};

const typeMap: Record<number, string> = {
  0: "CCS2",
  1: "Type 2",
};

const formatRatingDate = (value: string) =>
  new Date(value).toLocaleString("vi-VN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const renderStars = (count: number) =>
  Array.from({ length: Math.max(0, count) }, () => "★").join("");

const handleImageError = (event: SyntheticEvent<HTMLImageElement, Event>) => {
  if (event.currentTarget.src === FALLBACK_IMAGE) {
    event.currentTarget.onerror = null;
    event.currentTarget.src =
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 600'%3E%3Crect width='1200' height='600' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%236b7280' font-family='Arial, sans-serif' font-size='42'%3EImage unavailable%3C/text%3E%3C/svg%3E";
    return;
  }

  event.currentTarget.src = FALLBACK_IMAGE;
};

const StationDetail = ({ station, onClose, distance }: StationDetailProps) => {
  const routingDistanceInKilometers = useRoutingStore(
    (state) => state.distanceInKilometers,
  );
  const isSaved = useUserStore((state) =>
    state.user.savedStation.some((s) => s.id === station.id),
  );
  const isUserLoggedIn = useUserStore((state) => state.user.isLogedin);
  const updateStation = useStationStore((state) => state.updateStation);
  const { setRouting } = useRoutingStore();
  const { saveStation, deleteStation } = useUserStore();
  const [openRating, setOpenRating] = useState(false);
  const [ratingsPage, setRatingsPage] = useState(0);
  const [ratingsData, setRatingsData] = useState<StationRatingResponse | null>(
    null,
  );
  const [ratingStatistics, setRatingStatistics] = useState<
    StationRatingStatistic[]
  >([]);
  const [isRatingsLoading, setIsRatingsLoading] = useState(true);
  const [ratingsError, setRatingsError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const toggleSave = () => {
    const newStation: StationSaved = {
      id: station.id,
      name: station.name,
      address: station.address,
      position: station.position,
    };
    isSaved ? deleteStation(station.id) : saveStation(newStation);
  };

  const groupConnectors = (
    connectors: Connector[],
    available: boolean,
  ): GroupedConnector[] => {
    return Object.values(
      connectors
        .filter((c) => c.available === available)
        .sort((a, b) => b.maxPower - a.maxPower)
        .reduce<Record<string, GroupedConnector>>((acc, curr) => {
          const key = `${curr.maxPower}-${curr.available}`;

          if (!acc[key]) {
            acc[key] = {
              maxPower: curr.maxPower,
              voltage: curr.voltage,
              type: curr.type,
              count: 1,
            };
          } else {
            acc[key].count += 1;
          }

          return acc;
        }, {}),
    );
  };

  const loadRatings = useCallback(async () => {
    setIsRatingsLoading(true);
    setRatingsError(null);

    try {
      const [ratingsResponse, statisticsResponse] = await Promise.all([
        getRating({
          stationId: station.id,
          page: ratingsPage,
          size: DEFAULT_RATING_PAGE_SIZE,
        }),
        getRatingStatistics(station.id),
      ]);

      setRatingsData(ratingsResponse);
      setRatingStatistics(statisticsResponse);
    } catch {
      setRatingsError("Không thể tải đánh giá của trạm sạc.");
    } finally {
      setIsRatingsLoading(false);
    }
  }, [ratingsPage, station.id]);

  const refreshRatings = useCallback(async () => {
    setRatingsPage(0);

    try {
      const [ratingsResponse, statisticsResponse] = await Promise.all([
        getRating({
          stationId: station.id,
          page: 0,
          size: DEFAULT_RATING_PAGE_SIZE,
        }),
        getRatingStatistics(station.id),
      ]);

      const latestStation = await getStationById(station.id);

      setRatingsData(ratingsResponse);
      setRatingStatistics(statisticsResponse);
      updateStation(latestStation);
    } catch {
      setRatingsError("Không thể tải đánh giá của trạm sạc.");
      throw new Error("Không thể tải đánh giá của trạm sạc.");
    }
  }, [station, updateStation]);

  useEffect(() => {
    setRatingsPage(0);
  }, [station.id]);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [station.id]);

  useEffect(() => {
    void loadRatings();
  }, [loadRatings]);

  const availableGroups = groupConnectors(station.connectors, true);
  const busyGroups = groupConnectors(station.connectors, false);

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

  const images = useMemo(
    () => (station.images ?? []).filter((image) => Boolean(image?.url)),
    [station.images],
  );
  const safeImageIndex =
    images.length === 0 ? 0 : currentImageIndex % images.length;
  const displayImage = images[safeImageIndex]?.url ?? FALLBACK_IMAGE;

  const handlePreviousImage = () => {
    if (images.length <= 1) {
      return;
    }

    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    if (images.length <= 1) {
      return;
    }

    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handlePreviousRatingsPage = () => {
    setRatingsPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextRatingsPage = () => {
    if (!ratingsData?.last) {
      setRatingsPage((prev) => prev + 1);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 z-[1000] flex h-[86%] w-sm flex-col rounded-tr-xl bg-white shadow-xl">
      <div className="flex items-start justify-between border-b border-gray-400 px-4 py-3">
        <div>
          <h2 className="text-lg font-semibold">{station.name}</h2>
          <p className="text-sm text-gray-500">{station.address}</p>
          {(routingDistanceInKilometers ?? distance) != null && (
            <p className="text-sm text-gray-500">
              Khoảng cách: {(routingDistanceInKilometers ?? distance)?.toFixed(2)} km
            </p>
          )}
        </div>

        <button
          onClick={onClose}
          className="cursor-pointer text-gray-500 hover:text-black"
        >
          ×
        </button>
      </div>

      <div className="overflow-y-auto pr-1 [scrollbar-color:#22c55e_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-green-500">
        <div className="relative h-56 bg-gray-100">
          {images.length === 0 ? (
            <div className="flex h-full w-full items-center justify-center text-base font-medium text-gray-500">
              Không có ảnh
            </div>
          ) : (
            <>
              <img
                src={displayImage}
                alt={station.name}
                className="h-full w-full object-cover"
                onError={handleImageError}
                loading="lazy"
                decoding="async"
              />

              {images.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={handlePreviousImage}
                    className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white transition hover:bg-black/60"
                    aria-label="Ảnh trước"
                  >
                    <FiChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white transition hover:bg-black/60"
                    aria-label="Ảnh tiếp theo"
                  >
                    <FiChevronRight className="h-5 w-5" />
                  </button>
                </>
              ) : null}

              <div className="absolute bottom-3 right-3 rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white">
                {safeImageIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>
        <div className="flex flex-row place-content-between p-2">
          <p>Trạm sạc: {station.manufacturer}</p>
          <p className="text-sm text-gray-500">44 km</p>
        </div>

        <div className="flex-1 space-y-3 px-4">
          <div className="mb-0 flex items-center gap-3 py-3">
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                statusColor.active ?? "bg-gray-100 text-gray-600"
              }`}
            >
              CÓ SẴN
            </span>

            <span className="text-sm text-gray-600">
              {station.connectors.filter((c) => c.available).length} điểm sạc
            </span>
          </div>

          {availableGroups.map((group, index: number) => (
            <div
              key={index}
              className="flex flex-row items-center rounded-2xl p-3 shadow-md/30 shadow-green-500"
            >
              <BsFillLightningChargeFill className="mr-[8px] text-green-500" />

              <div className="w-full space-y-2">
                <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {typeMap[group.type] || group.type} · {group.maxPower} kW
                      × {group.count}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="mb-0 flex items-center gap-3 py-3">
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                statusColor.maintenance ?? "bg-gray-100 text-gray-600"
              }`}
            >
              ĐANG BẬN
            </span>
            <span className="text-sm text-gray-600">
              {station.connectors.filter((c) => !c.available).length} điểm sạc
            </span>
          </div>
        </div>

        {busyGroups.map((group, index: number) => (
          <div
            key={index}
            className="flex flex-row items-center rounded-2xl p-3 shadow-md/30 shadow-gray-400"
          >
            <BsFillLightningChargeFill className="mr-[8px] text-gray-500" />

            <div className="w-full space-y-2">
              <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm">
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {typeMap[group.type] || group.type} · {group.maxPower} kW ×{" "}
                    {group.count}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="px-4 py-3">
          <h3 className="text-md font-semibold">Tổng quan sử dụng</h3>
        </div>

        <div className="px-4 py-3">
          <h3 className="mb-3 text-md font-semibold">Đánh giá và nhận xét</h3>

          {ratingsError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {ratingsError}
            </div>
          ) : null}

          <div className="flex gap-6">
            <div className="flex min-w-24 flex-col items-center">
              <p className="text-3xl font-bold">{averageRating.toFixed(1)}</p>
              <p className="text-sm text-gray-500">{totalRatings} đánh giá</p>
            </div>

            <div className="flex-1 space-y-2">
              {ratingDistribution.map((item) => {
                const percentage =
                  totalRatings === 0
                    ? 0
                    : (item.totalNumberOfRating / totalRatings) * 100;

                return (
                  <div key={item.starPoint} className="flex items-center gap-2">
                    <span className="w-4 text-sm">{item.starPoint}</span>
                    <div className="h-2 flex-1 rounded bg-gray-200">
                      <div
                        className="h-2 rounded bg-green-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-6 text-xs text-gray-500">
                      {item.totalNumberOfRating}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {isRatingsLoading ? (
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-6 text-sm text-gray-500">
                <FiLoader className="h-4 w-4 animate-spin" />
                Đang tải đánh giá...
              </div>
            ) : null}

            {!isRatingsLoading &&
            !ratingsError &&
            (ratingsData?.content.length ?? 0) === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-300 px-4 py-6 text-center text-sm text-gray-500">
                Chưa có đánh giá nào.
              </div>
            ) : null}

            {!isRatingsLoading && (ratingsData?.content.length ?? 0) > 0 ? (
              <>
                {ratingsData?.content.map((rating: StationRating) => (
                  <div
                    key={rating.id}
                    className="rounded-lg border border-gray-200 p-4"
                  >
                    <div className="flex flex-col gap-3">
                      <div className="inline-flex w-fit items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">
                        <FaStar className="text-amber-500" />
                        <span>{rating.point}/5</span>
                        <span className="text-amber-600">
                          {renderStars(rating.point)}
                        </span>
                      </div>
                      <p className="text-sm leading-6 text-gray-700">
                        {rating.comment || "Người dùng không để lại bình luận."}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <FiMessageSquare className="h-4 w-4" />
                        <span>{formatRatingDate(rating.timePosted)}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {(ratingsData?.totalPages ?? 0) > 1 ? (
                  <div className="flex items-center justify-between border-t border-gray-200 pt-3 text-sm">
                    <span className="text-gray-600">
                      Trang {(ratingsData?.number ?? 0) + 1} /{" "}
                      {ratingsData?.totalPages ?? 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handlePreviousRatingsPage}
                        disabled={ratingsData?.first ?? true}
                        className="rounded-lg border border-gray-300 px-3 py-1.5 text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Trước
                      </button>
                      <button
                        type="button"
                        onClick={handleNextRatingsPage}
                        disabled={ratingsData?.last ?? true}
                        className="rounded-lg border border-gray-300 px-3 py-1.5 text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Sau
                      </button>
                    </div>
                  </div>
                ) : null}
              </>
            ) : null}
          </div>
        </div>
      </div>

      {openRating && (
        <RatingModal
          onClose={() => {
            setOpenRating(false);
          }}
          onSuccess={refreshRatings}
        />
      )}

      <div className="flex place-content-around border-t border-green-400 px-4 py-3">
        <div
          onClick={() => {
            if (!isUserLoggedIn) {
              useAuthModalStore.getState().openLogin();
            } else {
              setOpenRating(true);
            }
          }}
          className="flex cursor-pointer flex-col items-center gap-2 text-green-600 hover:text-green-700"
        >
          <TfiWrite className="text-xl" />
          <p>Đánh giá</p>
        </div>
        <div
          onClick={toggleSave}
          className="flex cursor-pointer flex-col items-center gap-2 text-green-600"
        >
          {!isSaved ? (
            <>
              <FaRegStar className="text-xl hover:text-green-700" />
              <p>Lưu</p>
            </>
          ) : (
            <>
              <FaStar className="text-xl text-yellow-400 hover:text-yellow-600" />
              <p className="text-yellow-400 hover:text-yellow-600">Đã lưu</p>
            </>
          )}
        </div>
        <div
          onClick={() =>
            setRouting({
              stationId: station.id,
              latitude: station.position.latitude,
              longitude: station.position.longitude,
            })
          }
          className="flex cursor-pointer flex-col items-center gap-2 text-green-600 hover:text-green-700"
        >
          <FaRoute className="text-xl" />
          <p>Dẫn đường</p>
        </div>
      </div>
    </div>
  );
};

export default StationDetail;




