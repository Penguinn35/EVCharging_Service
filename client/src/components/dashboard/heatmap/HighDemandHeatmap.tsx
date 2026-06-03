"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type * as Leaflet from "leaflet";
import { heatmapData, type HeatmapCoordinatePoint, type HeatmapDateKey, type HeatmapLayerKey } from "@/lib/data/heatmap";
import { FiCalendar, FiInfo, FiLayers } from "react-icons/fi";
import { PiTargetBold } from "react-icons/pi";
import { HeatmapDateRangeModal, type HeatmapDateRange } from "@/components/dashboard/heatmap/HeatmapDateRangeModal";

type LayerFilter = "all" | "recommendation" | "location" | "full";
type DateFilter = "day" | "week" | "month" | "custom";
type DataLayer = Exclude<LayerFilter, "all">;

type DisplayPoint = HeatmapCoordinatePoint & {
  layer: DataLayer;
  date: HeatmapDateKey;
};

type AreaSelection = {
  center: { lat: number; lng: number };
  radiusMeters: number;
};

const MOCK_MIN_DATE = "2026-05-19";
const MOCK_MAX_DATE = "2026-05-21";
const MIN_RADIUS_METERS = 30;
const MIN_DRAG_PX = 5;

const DATE_FILTER_MAP: Record<Exclude<DateFilter, "custom">, HeatmapDateKey[]> = {
  day: ["2026-05-21"],
  week: ["2026-05-19", "2026-05-20", "2026-05-21"],
  month: ["2026-05-19", "2026-05-20", "2026-05-21"],
};

const LAYER_LABELS: Record<DataLayer, string> = {
  recommendation: "Gợi ý từ người dùng",
  location: "Vị trí khi cần sạc",
  full: "Khu vực quá tải",
};

const LAYER_DATA_KEYS: Record<DataLayer, HeatmapLayerKey> = {
  recommendation: "recommendation",
  location: "location",
  full: "full",
};

const DEFAULT_HEAT_GRADIENT: Record<number, string> = {
  0.25: "#7e22ce",
  0.4: "blue",
  0.6: "cyan",
  0.65: "lime",
  0.8: "yellow",
  1: "red",
};

const HEAT_INTENSITY: Record<DataLayer, number> = {
  recommendation: 0.35,
  location: 0.55,
  full: 0.85,
};

const HEAT_OPTIONS = {
  radius: 45,
  blur: 32,
  max: 1,
  minOpacity: 0.15,
  gradient: DEFAULT_HEAT_GRADIENT,
} as const;

const SELECTION_CIRCLE_STYLE = {
  color: "#16a34a",
  fillColor: "#22c55e",
  fillOpacity: 0.15,
  weight: 2,
  opacity: 0.8,
} as const;

const CLICK_NEAREST_PX = 28;

type LeafletWithHeat = typeof import("leaflet");

async function loadLeafletWithHeat(): Promise<LeafletWithHeat> {
  const leafletModule = await import("leaflet");
  const L = (leafletModule as { default: LeafletWithHeat }).default ?? (leafletModule as LeafletWithHeat);

  if (typeof window !== "undefined") {
    (window as Window & { L?: LeafletWithHeat }).L = L;
  }

  await import("leaflet.heat");

  return L;
}

function toHeatPoints(points: DisplayPoint[]): [number, number, number][] {
  return points.map((p) => [p.lat, p.long, HEAT_INTENSITY[p.layer]]);
}

function findNearestPoint(
  map: Leaflet.Map,
  latlng: Leaflet.LatLng,
  points: DisplayPoint[]
): DisplayPoint | null {
  const clickPoint = map.latLngToContainerPoint(latlng);
  let nearest: DisplayPoint | null = null;
  let minDistance = CLICK_NEAREST_PX;

  for (const point of points) {
    const pointPx = map.latLngToContainerPoint([point.lat, point.long]);
    const distance = clickPoint.distanceTo(pointPx);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = point;
    }
  }

  return nearest;
}

export function HighDemandHeatmap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Leaflet.Map | null>(null);
  const heatLayerRef = useRef<Leaflet.HeatLayer | null>(null);
  const selectionLayerRef = useRef<Leaflet.LayerGroup | null>(null);
  const previewCircleRef = useRef<Leaflet.Circle | null>(null);
  const leafletRef = useRef<LeafletWithHeat | null>(null);
  const filteredPointsRef = useRef<DisplayPoint[]>([]);
  const isTargetModeActiveRef = useRef(false);
  const drawStateRef = useRef<{ isDrawing: boolean; startLatLng: Leaflet.LatLng | null }>({
    isDrawing: false,
    startLatLng: null,
  });

  const [mapReady, setMapReady] = useState(false);
  const [isTargetModeActive, setIsTargetModeActive] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [pendingSelection, setPendingSelection] = useState<AreaSelection | null>(null);

  const layersButtonRef = useRef<HTMLButtonElement>(null);
  const timeButtonRef = useRef<HTMLButtonElement>(null);
  const targetButtonRef = useRef<HTMLButtonElement>(null);
  const layersPanelRef = useRef<HTMLDivElement>(null);
  const timePanelRef = useRef<HTMLDivElement>(null);

  const [selectedPoint, setSelectedPoint] = useState<DisplayPoint | null>(null);
  const [activeLayer, setActiveLayer] = useState<LayerFilter>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("week");
  const [showApplyButton, setShowApplyButton] = useState(false);
  const [customStartDate, setCustomStartDate] = useState(MOCK_MIN_DATE);
  const [customEndDate, setCustomEndDate] = useState(MOCK_MAX_DATE);
  const [appliedCustomRange, setAppliedCustomRange] = useState<{ start: string; end: string }>({
    start: MOCK_MIN_DATE,
    end: MOCK_MAX_DATE,
  });

  const [showLayerFilters, setShowLayerFilters] = useState(true);
  const [showTimeFilters, setShowTimeFilters] = useState(false);

  isTargetModeActiveRef.current = isTargetModeActive;

  const availableDates = useMemo(() => ["2026-05-19", "2026-05-20", "2026-05-21"] as HeatmapDateKey[], []);

  const filteredPoints = useMemo(() => {
    const datesToShow: HeatmapDateKey[] =
      dateFilter === "custom"
        ? availableDates.filter((date) => date >= appliedCustomRange.start && date <= appliedCustomRange.end)
        : DATE_FILTER_MAP[dateFilter];

    const layersToShow: DataLayer[] =
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

  filteredPointsRef.current = filteredPoints;

  const clearSelectionCircle = useCallback(() => {
    previewCircleRef.current = null;
    selectionLayerRef.current?.clearLayers();
  }, []);

  const resetAreaSelection = useCallback(() => {
    clearSelectionCircle();
    setPendingSelection(null);
    setIsDateModalOpen(false);
    drawStateRef.current = { isDrawing: false, startLatLng: null };
    mapRef.current?.dragging.enable();
  }, [clearSelectionCircle]);

  const handleToggleTargetMode = () => {
    setIsTargetModeActive((prev) => {
      if (prev) {
        resetAreaSelection();
      } else {
        setSelectedPoint(null);
        setShowLayerFilters(false);
        setShowTimeFilters(false);
      }
      return !prev;
    });
  };

  const handleCancelDateModal = () => {
    resetAreaSelection();
  };

  const handleApplyAreaQuery = (range: HeatmapDateRange) => {
    if (!pendingSelection) return;

    console.log({
      center: pendingSelection.center,
      radiusMeters: pendingSelection.radiusMeters,
      dateRange: range,
    });

    resetAreaSelection();
    setIsTargetModeActive(false);
  };

  useEffect(() => {
    let isMounted = true;

    const initMap = async () => {
      if (!mapContainer.current || mapRef.current) return;

      const L = await loadLeafletWithHeat();

      if (!isMounted || !mapContainer.current || mapRef.current) return;

      if (typeof L.heatLayer !== "function") {
        console.error("leaflet.heat failed to register L.heatLayer");
        return;
      }

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

      heatLayerRef.current = L.heatLayer([], HEAT_OPTIONS).addTo(mapRef.current);
      selectionLayerRef.current = L.layerGroup().addTo(mapRef.current);

      mapRef.current.on("click", (event) => {
        if (isTargetModeActiveRef.current || drawStateRef.current.isDrawing) return;
        const nearest = findNearestPoint(mapRef.current!, event.latlng, filteredPointsRef.current);
        setSelectedPoint(nearest);
      });

      setMapReady(true);
    };

    void initMap();

    return () => {
      isMounted = false;
      setMapReady(false);
      mapRef.current?.remove();
      mapRef.current = null;
      heatLayerRef.current = null;
      selectionLayerRef.current = null;
      previewCircleRef.current = null;
      leafletRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapReady || !heatLayerRef.current) return;
    heatLayerRef.current.setLatLngs(toHeatPoints(filteredPoints));
  }, [filteredPoints, mapReady]);

  useEffect(() => {
    setSelectedPoint(null);
  }, [filteredPoints, activeLayer, dateFilter]);

  useEffect(() => {
    const map = mapRef.current;
    const L = leafletRef.current;
    const selectionLayer = selectionLayerRef.current;

    if (!map || !L || !selectionLayer || !mapReady) return;

    if (!isTargetModeActive) {
      map.getContainer().style.cursor = "";
      return;
    }

    map.getContainer().style.cursor = "crosshair";

    const onMouseDown = (event: Leaflet.LeafletMouseEvent) => {
      if (!isTargetModeActiveRef.current || isDateModalOpen) return;

      if (event.originalEvent) {
        L.DomEvent.stopPropagation(event.originalEvent);
        L.DomEvent.preventDefault(event.originalEvent);
      }

      clearSelectionCircle();
      drawStateRef.current = { isDrawing: true, startLatLng: event.latlng };
      map.dragging.disable();

      previewCircleRef.current = L.circle(event.latlng, {
        radius: 1,
        ...SELECTION_CIRCLE_STYLE,
      }).addTo(selectionLayer);
    };

    const onMouseMove = (event: Leaflet.LeafletMouseEvent) => {
      const { isDrawing, startLatLng } = drawStateRef.current;
      if (!isDrawing || !startLatLng || !previewCircleRef.current) return;

      const radiusMeters = startLatLng.distanceTo(event.latlng);
      previewCircleRef.current.setRadius(radiusMeters);
    };

    const onMouseUp = (event: Leaflet.LeafletMouseEvent) => {
      const { isDrawing, startLatLng } = drawStateRef.current;
      if (!isDrawing || !startLatLng) return;

      map.dragging.enable();
      drawStateRef.current = { isDrawing: false, startLatLng: null };

      const radiusMeters = startLatLng.distanceTo(event.latlng);
      const startPx = map.latLngToContainerPoint(startLatLng);
      const endPx = map.latLngToContainerPoint(event.latlng);
      const dragPx = startPx.distanceTo(endPx);

      if (dragPx < MIN_DRAG_PX || radiusMeters < MIN_RADIUS_METERS) {
        clearSelectionCircle();
        return;
      }

      setPendingSelection({
        center: { lat: startLatLng.lat, lng: startLatLng.lng },
        radiusMeters,
      });
      setIsDateModalOpen(true);
    };

    map.on("mousedown", onMouseDown);
    map.on("mousemove", onMouseMove);
    map.on("mouseup", onMouseUp);

    return () => {
      map.off("mousedown", onMouseDown);
      map.off("mousemove", onMouseMove);
      map.off("mouseup", onMouseUp);
      map.getContainer().style.cursor = "";
      if (drawStateRef.current.isDrawing) {
        map.dragging.enable();
        drawStateRef.current = { isDrawing: false, startLatLng: null };
      }
    };
  }, [mapReady, isTargetModeActive, isDateModalOpen, clearSelectionCircle]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;

      const clickedLayersButton = layersButtonRef.current?.contains(target);
      const clickedLayersPanel = layersPanelRef.current?.contains(target);
      const clickedTimeButton = timeButtonRef.current?.contains(target);
      const clickedTimePanel = timePanelRef.current?.contains(target);
      const clickedTargetButton = targetButtonRef.current?.contains(target);

      if (!clickedLayersButton && !clickedLayersPanel) {
        setShowLayerFilters(false);
      }

      if (!clickedTimeButton && !clickedTimePanel) {
        setShowTimeFilters(false);
      }

      if (clickedTargetButton) return;
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
            ref={targetButtonRef}
            type="button"
            onClick={handleToggleTargetMode}
            className={`h-11 w-11 rounded-xl border shadow-md flex items-center justify-center transition-colors ${
              isTargetModeActive
                ? "bg-green-50 border-green-500 ring-2 ring-green-500 text-green-700"
                : "bg-white/95 border-gray-200 text-gray-700 hover:bg-white"
            }`}
            title="Chọn vùng trên bản đồ"
          >
            <PiTargetBold className="h-5 w-5" />
          </button>

          <button
            ref={layersButtonRef}
            type="button"
            onClick={() => setShowLayerFilters((prev) => !prev)}
            className="h-11 w-11 rounded-xl bg-white/95 border border-gray-200 shadow-md flex items-center justify-center text-gray-700 hover:bg-white"
            title="Bộ lọc lớp hiển thị"
          >
            <FiLayers className="h-5 w-5" />
          </button>

          <button
            ref={timeButtonRef}
            type="button"
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
                    min={MOCK_MIN_DATE}
                    max={MOCK_MAX_DATE}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="px-2 py-2 rounded border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="date"
                    value={customEndDate}
                    min={MOCK_MIN_DATE}
                    max={MOCK_MAX_DATE}
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

        <div className="absolute bottom-4 left-4 z-[1000] rounded-xl bg-white/90 backdrop-blur border border-gray-200 shadow-md px-3 py-2 min-w-[200px]">
          <div className="text-[11px] font-semibold text-gray-700 mb-1.5">Mật độ (leaflet.heat)</div>
          <div
            className="h-2.5 w-full rounded-full"
            style={{
              background: "linear-gradient(to right, #7e22ce, blue, cyan, lime, yellow, red)",
            }}
          />
          <div className="flex justify-between text-[10px] text-gray-500 mt-0.5">
            <span>Thấp</span>
            <span>Cao</span>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-200 text-[10px] text-gray-600 space-y-0.5">
            <p>Cường độ điểm: Gợi ý 0.35 · Vị trí 0.55 · Quá tải 0.85</p>
            <p className="text-gray-500">
              {isTargetModeActive
                ? "Giữ chuột trái và kéo để chọn vùng tròn"
                : "Nhấp vùng nhiệt để xem chi tiết điểm"}
            </p>
          </div>
        </div>

        <div className="absolute top-4 right-4 z-[1000] rounded-xl bg-white/90 backdrop-blur border border-gray-200 shadow-md px-3 py-2 text-[11px] text-gray-700">
          Đang hiển thị: <span className="font-semibold text-gray-900">{filteredPoints.length}</span> điểm
        </div>

        {selectedPoint && !isTargetModeActive && (
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

      <HeatmapDateRangeModal
        open={isDateModalOpen}
        onClose={handleCancelDateModal}
        onApply={handleApplyAreaQuery}
        defaultFrom={MOCK_MIN_DATE}
        defaultTo={MOCK_MAX_DATE}
        minDate={MOCK_MIN_DATE}
        maxDate={MOCK_MAX_DATE}
      />
    </div>
  );
}
