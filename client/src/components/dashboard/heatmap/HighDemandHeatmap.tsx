"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type * as Leaflet from "leaflet";
import { heatmapData, type HeatmapCoordinatePoint, type HeatmapDateKey, type HeatmapLayerKey } from "@/lib/data/heatmap";
import { FiCalendar, FiInfo, FiLayers } from "react-icons/fi";

type LayerFilter = "all" | "recommendation" | "location" | "full";
type DateFilter = "day" | "week" | "month" | "custom";

type DisplayPoint = HeatmapCoordinatePoint & {
  layer: Exclude<LayerFilter, "all">;
  date: HeatmapDateKey;
};

const DATE_FILTER_MAP: Record<Exclude<DateFilter, "custom">, HeatmapDateKey[]> = {
  day: ["2026-05-21"],
  week: ["2026-05-19", "2026-05-20", "2026-05-21"],
  month: ["2026-05-19", "2026-05-20", "2026-05-21"],
};

const LAYER_LABELS: Record<Exclude<LayerFilter, "all">, string> = {
  recommendation: "Gợi ý từ người dùng",
  location: "Vị trí khi cần sạc",
  full: "Khu vực quá tải",
};

const LAYER_DATA_KEYS: Record<Exclude<LayerFilter, "all">, HeatmapLayerKey> = {
  recommendation: "recommendation",
  location: "location",
  full: "full",
};

const LAYER_COLORS: Record<Exclude<LayerFilter, "all">, string> = {
  recommendation: "#22c55e",
  location: "#3b82f6",
  full: "#ef4444",
};

export function HighDemandHeatmap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Leaflet.Map | null>(null);
  const markerLayerRef = useRef<Leaflet.LayerGroup | null>(null);
  const leafletRef = useRef<typeof Leaflet | null>(null);

  const layersButtonRef = useRef<HTMLButtonElement>(null);
  const timeButtonRef = useRef<HTMLButtonElement>(null);
  const layersPanelRef = useRef<HTMLDivElement>(null);
  const timePanelRef = useRef<HTMLDivElement>(null);

  const [selectedPoint, setSelectedPoint] = useState<DisplayPoint | null>(null);
  const [activeLayer, setActiveLayer] = useState<LayerFilter>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("week");
  const [showApplyButton, setShowApplyButton] = useState(false);
  const [customStartDate, setCustomStartDate] = useState("2026-05-19");
  const [customEndDate, setCustomEndDate] = useState("2026-05-21");
  const [appliedCustomRange, setAppliedCustomRange] = useState<{ start: string; end: string }>({
    start: "2026-05-19",
    end: "2026-05-21",
  });

  const [showLayerFilters, setShowLayerFilters] = useState(true);
  const [showTimeFilters, setShowTimeFilters] = useState(false);

  const availableDates = useMemo(() => ["2026-05-19", "2026-05-20", "2026-05-21"] as HeatmapDateKey[], []);

  const filteredPoints = useMemo(() => {
    const datesToShow: HeatmapDateKey[] =
      dateFilter === "custom"
        ? availableDates.filter((date) => date >= appliedCustomRange.start && date <= appliedCustomRange.end)
        : DATE_FILTER_MAP[dateFilter];

    const layersToShow: Exclude<LayerFilter, "all">[] =
      activeLayer === "all" ? ["recommendation", "location", "full"] : [activeLayer];

    return layersToShow.flatMap((layer) => {
      const dataKey = LAYER_DATA_KEYS[layer];

      return datesToShow.flatMap((date) =>
        heatmapData[dataKey][date].map((point) => ({
          ...point,
          layer,
          date,
        }))
      );
    });
  }, [activeLayer, appliedCustomRange.end, appliedCustomRange.start, availableDates, dateFilter]);

  useEffect(() => {
    let isMounted = true;

    const initMap = async () => {
      if (!mapContainer.current || mapRef.current) return;

      const L = await import("leaflet");
      if (!isMounted || !mapContainer.current || mapRef.current) return;

      leafletRef.current = L;
      mapRef.current = L.map(mapContainer.current, {
        zoomControl: false,
      }).setView([10.814889, 106.697906], 14);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapRef.current);

      L.control
        .zoom({
          position: "bottomright",
        })
        .addTo(mapRef.current);

      markerLayerRef.current = L.layerGroup().addTo(mapRef.current);
    };

    void initMap();

    return () => {
      isMounted = false;
      mapRef.current?.remove();
      mapRef.current = null;
      markerLayerRef.current = null;
      leafletRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!markerLayerRef.current || !leafletRef.current) return;

    const L = leafletRef.current;
    const markerLayer = markerLayerRef.current;
    markerLayer.clearLayers();

    filteredPoints.forEach((point, index) => {
      const color = LAYER_COLORS[point.layer];
      const baseRadius = point.layer === "full" ? 950 : point.layer === "location" ? 800 : 700;
      const pulseRadius = baseRadius + (index % 5) * 120;
      const fillOpacity = point.layer === "full" ? 0.28 : point.layer === "location" ? 0.22 : 0.18;

      const circle = L.circle([point.lat, point.long], {
        color,
        fillColor: color,
        fillOpacity,
        opacity: 0.35,
        weight: 1,
        radius: pulseRadius,
      }).addTo(markerLayer);

      circle.bindPopup(
        `<div class="text-sm font-semibold">${LAYER_LABELS[point.layer]}</div><div class="text-xs text-gray-600">Ngày: ${point.date}</div><div class="text-xs text-gray-600">Tọa độ: ${point.lat}, ${point.long}</div>`
      );

      circle.on("mouseover", () => setSelectedPoint(point));
      circle.on("mouseout", () => setSelectedPoint(null));
    });
  }, [filteredPoints]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;

      const clickedLayersButton = layersButtonRef.current?.contains(target);
      const clickedLayersPanel = layersPanelRef.current?.contains(target);

      const clickedTimeButton = timeButtonRef.current?.contains(target);
      const clickedTimePanel = timePanelRef.current?.contains(target);

      if (!clickedLayersButton && !clickedLayersPanel) {
        setShowLayerFilters(false);
      }

      if (!clickedTimeButton && !clickedTimePanel) {
        setShowTimeFilters(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="relative h-full w-full bg-gray-100 overflow-hidden">
        <div ref={mapContainer} className="absolute inset-0" />

        <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-3">
          <button
            ref={layersButtonRef}
            onClick={() => setShowLayerFilters((prev) => !prev)}
            className="h-11 w-11 rounded-xl bg-white/95 border border-gray-200 shadow-md flex items-center justify-center text-gray-700 hover:bg-white"
            title="Bộ lọc lớp hiển thị"
          >
            <FiLayers className="h-5 w-5" />
          </button>

          <button
            ref={timeButtonRef}
            onClick={() => setShowTimeFilters((prev) => !prev)}
            className="h-11 w-11 rounded-xl bg-white/95 border border-gray-200 shadow-md flex items-center justify-center text-gray-700 hover:bg-white"
            title="Bộ lọc thời gian"
          >
            <FiCalendar className="h-5 w-5" />
          </button>
        </div>

        {showLayerFilters && (
          <div
            ref={layersPanelRef}
            className="absolute top-4 left-20 z-[1000] w-[290px] rounded-2xl bg-white/95 backdrop-blur border border-gray-200 shadow-lg p-4"
          >
            <p className="text-sm font-semibold text-gray-900 mb-3">Lớp hiển thị</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveLayer("all")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                  activeLayer === "all" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setActiveLayer("recommendation")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                  activeLayer === "recommendation"
                    ? "bg-green-600 text-white"
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                }`}
              >
                Gợi ý từ người dùng
              </button>
              <button
                onClick={() => setActiveLayer("location")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                  activeLayer === "location" ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                }`}
              >
                Vị trí khi cần
              </button>
              <button
                onClick={() => setActiveLayer("full")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                  activeLayer === "full" ? "bg-red-600 text-white" : "bg-red-100 text-red-700 hover:bg-red-200"
                }`}
              >
                Khu vực quá tải
              </button>
            </div>
          </div>
        )}

        {showTimeFilters && (
          <div
            ref={timePanelRef}
            className="absolute top-16 left-20 z-[1000] w-[320px] rounded-2xl bg-white/95 backdrop-blur border border-gray-200 shadow-lg p-4"
          >
            <p className="text-sm font-semibold text-gray-900 mb-3">Lọc theo thời gian</p>
            <select
              value={dateFilter}
              onChange={(e) => {
                const value = e.target.value as DateFilter;
                setDateFilter(value);
                setShowApplyButton(value === "custom");
              }}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="day">Ngày 21/05/2026</option>
              <option value="week">Từ 19 - 21/05/2026</option>
              <option value="month">Toàn bộ dữ liệu hiện có</option>
              <option value="custom">Tùy chỉnh khoảng ngày</option>
            </select>

            {dateFilter === "custom" && (
              <div className="mt-3 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={customStartDate}
                    min="2026-05-19"
                    max="2026-05-21"
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="px-2 py-2 rounded border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="date"
                    value={customEndDate}
                    min="2026-05-19"
                    max="2026-05-21"
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="px-2 py-2 rounded border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                {showApplyButton && (
                  <button
                    onClick={() => {
                      const start = customStartDate <= customEndDate ? customStartDate : customEndDate;
                      const end = customEndDate >= customStartDate ? customEndDate : customStartDate;
                      setAppliedCustomRange({ start, end });
                    }}
                    className="w-full px-4 py-2 rounded-lg bg-green-600 text-white text-xs font-medium hover:bg-green-700 transition-colors"
                  >
                    Áp dụng
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        <div className="absolute bottom-4 left-4 z-[1000] rounded-xl bg-white/90 backdrop-blur border border-gray-200 shadow-md px-3 py-2">
          <div className="text-[11px] font-semibold text-gray-700 mb-1">Chú thích lớp dữ liệu</div>
          <div className="flex items-center gap-3 text-[11px] text-gray-700">
            <span className="flex items-center gap-1"><i className="inline-block h-2.5 w-2.5 rounded-full bg-green-600" /> Gợi ý</span>
            <span className="flex items-center gap-1"><i className="inline-block h-2.5 w-2.5 rounded-full bg-blue-600" /> Vị trí</span>
            <span className="flex items-center gap-1"><i className="inline-block h-2.5 w-2.5 rounded-full bg-red-600" /> Quá tải</span>
          </div>
        </div>

        <div className="absolute top-4 right-4 z-[1000] rounded-xl bg-white/90 backdrop-blur border border-gray-200 shadow-md px-3 py-2 text-[11px] text-gray-700">
          Đang hiển thị: <span className="font-semibold text-gray-900">{filteredPoints.length}</span> điểm
        </div>

        {selectedPoint && (
          <div className="absolute bottom-4 right-4 z-[1000] max-w-xs bg-white/95 backdrop-blur border border-blue-100 rounded-xl shadow-md p-3 flex items-start gap-2">
            <FiInfo className="w-4 h-4 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-gray-900">{LAYER_LABELS[selectedPoint.layer]}</p>
              <p className="text-xs text-gray-600 mt-0.5">Ngày: {selectedPoint.date}</p>
              <p className="text-xs text-gray-600 mt-0.5">
                Tọa độ: {selectedPoint.lat}, {selectedPoint.long}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
