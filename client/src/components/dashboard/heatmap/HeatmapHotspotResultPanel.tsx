"use client";

import { useEffect, useMemo, useState } from "react";
import type { BusinessHitfullHotspotItem, BusinessSuggestionHotspotItem } from "@/services/statisticsService";

type PanelKind = "suggestion" | "full";

type Coordinate = {
  latitude: number;
  longitude: number;
};

type HeatmapHotspotResultPanelProps = {
  kind: PanelKind;
  hitfullItems: BusinessHitfullHotspotItem[];
  suggestionItems: BusinessSuggestionHotspotItem[];
  onSelectCoordinate: (coordinate: Coordinate) => void;
};

function getCoordinate(item: BusinessHitfullHotspotItem | BusinessSuggestionHotspotItem): Coordinate | null {
  if (item.location?.latitude != null && item.location.longitude != null) {
    return {
      latitude: item.location.latitude,
      longitude: item.location.longitude,
    };
  }

  if (item.latitude != null && item.longitude != null) {
    return {
      latitude: item.latitude,
      longitude: item.longitude,
    };
  }

  return null;
}

export function HeatmapHotspotResultPanel({
  kind,
  hitfullItems,
  suggestionItems,
  onSelectCoordinate,
}: HeatmapHotspotResultPanelProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGlobalIndex, setSelectedGlobalIndex] = useState<number | null>(null);

  const data = kind === "full" ? hitfullItems : suggestionItems;
  const pageSize = kind === "full" ? 5 : 10;
  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));

  useEffect(() => {
    setCurrentPage(1);
    setSelectedGlobalIndex(null);
  }, [kind, data.length]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const pagedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [currentPage, data, pageSize]);

  return (
    <aside className="h-full w-1/3 border-l border-gray-200 bg-white/95 backdrop-blur p-4 overflow-hidden flex flex-col">
      <div className="mb-3">
        <p className="text-sm font-semibold text-gray-900">
          {kind === "full" ? "Danh sách hitfull theo range date" : "Danh sách suggestion theo range date"}
        </p>
        <p className="text-xs text-gray-500 mt-1">Nhấn vào từng dòng để đặt marker xanh và theo dõi vị trí trên bản đồ.</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {pagedData.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-3 text-xs text-gray-500">
            Không có dữ liệu trong khoảng thời gian đã chọn.
          </div>
        ) : null}

        {kind === "full"
          ? (pagedData as BusinessHitfullHotspotItem[]).map((item, index) => {
              const globalIndex = (currentPage - 1) * pageSize + index;
              const coordinate = getCoordinate(item);
              const isSelected = selectedGlobalIndex === globalIndex;

              return (
                <button
                  type="button"
                  key={`${item.stationId}-${item.date ?? index}`}
                  disabled={!coordinate}
                  onClick={() => {
                    if (!coordinate) return;
                    setSelectedGlobalIndex(globalIndex);
                    onSelectCoordinate(coordinate);
                  }}
                  className={`w-full text-left rounded-xl border p-3 transition-colors ${
                    isSelected
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  } ${!coordinate ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  <p className="text-xs text-gray-700">
                    <span className="font-semibold">stationId:</span> {item.stationId}
                  </p>
                  <p className="text-xs text-gray-700 mt-1">
                    <span className="font-semibold">stationName:</span> {item.stationName}
                  </p>
                  <p className="text-xs text-gray-700 mt-1">
                    <span className="font-semibold">address:</span> {item.address}
                  </p>
                  <p className="text-xs text-gray-700 mt-1">
                    <span className="font-semibold">location:</span>{" "}
                    {coordinate
                      ? `{ longitude: ${coordinate.longitude}, latitude: ${coordinate.latitude} }`
                      : "Không có tọa độ"}
                  </p>
                  <p className="text-xs text-gray-700 mt-1">
                    <span className="font-semibold">hitfullCount:</span> {item.hitfullCount}
                  </p>
                  <p className="text-xs text-gray-700 mt-1">
                    <span className="font-semibold">date:</span> {item.date ?? "-"}
                  </p>
                </button>
              );
            })
          : (pagedData as BusinessSuggestionHotspotItem[]).map((item, index) => {
              const globalIndex = (currentPage - 1) * pageSize + index;
              const coordinate = getCoordinate(item);
              const isSelected = selectedGlobalIndex === globalIndex;

              return (
                <button
                  type="button"
                  key={`${item.timestamp ?? "no-time"}-${index}`}
                  disabled={!coordinate}
                  onClick={() => {
                    if (!coordinate) return;
                    setSelectedGlobalIndex(globalIndex);
                    onSelectCoordinate(coordinate);
                  }}
                  className={`w-full text-left rounded-xl border p-3 transition-colors ${
                    isSelected
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  } ${!coordinate ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  <p className="text-xs text-gray-700">
                    <span className="font-semibold">timestamp:</span> {item.timestamp ?? "-"}
                  </p>
                  <p className="text-xs text-gray-700 mt-1">
                    <span className="font-semibold">description:</span> {item.description ?? "-"}
                  </p>
                  <p className="text-xs text-gray-700 mt-1">
                    <span className="font-semibold">location:</span>{" "}
                    {coordinate
                      ? `{ longitude: ${coordinate.longitude}, latitude: ${coordinate.latitude} }`
                      : "Không có tọa độ"}
                  </p>
                </button>
              );
            })}
      </div>

      <div className="pt-3 mt-3 border-t border-gray-200 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage <= 1}
          className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Trang trước
        </button>
        <span className="text-xs text-gray-600">
          Trang {currentPage}/{totalPages}
        </span>
        <button
          type="button"
          onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={currentPage >= totalPages}
          className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Trang sau
        </button>
      </div>
    </aside>
  );
}
