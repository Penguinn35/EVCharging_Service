"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type * as Leaflet from "leaflet";
import { FiCalendar, FiInfo, FiLayers } from "react-icons/fi";
import { PiTargetBold } from "react-icons/pi";
import { HeatmapDateRangeModal, type HeatmapDateRange } from "@/components/dashboard/heatmap/HeatmapDateRangeModal";
import { HeatmapHotspotResultPanel } from "@/components/dashboard/heatmap/HeatmapHotspotResultPanel";
import {
  getBusinessStationHitfullCount,
  getBusinessStationHitfullCountGeneral,
  getBusinessSuggestionHotspots,
  getBusinessSuggestionHotspotsGeneral,
  getBusinessUsersLocationsHotspots,
  type BusinessHitfullHotspotItem,
  type BusinessSuggestionHotspotItem,
  type BusinessUserLocationHotspotItem,
} from "@/services/statisticsService";

type LayerFilter = "all" | "recommendation" | "location" | "full";
type DataLayer = Exclude<LayerFilter, "all">;

type DisplayPoint = {
  lat: number;
  long: number;
  sourceLayer: DataLayer;
  dateKey?: string;
  description?: string;
  stationName?: string;
};

type AreaSelection = {
  center: { lat: number; lng: number };
  radiusMeters: number;
};

type ResultPanelKind = "suggestion" | "full";

const MIN_RADIUS_METERS = 30;
const MIN_DRAG_PX = 5;
const DEFAULT_MAP_CENTER: [number, number] = [10.814889, 106.697906];
const TODAY_DATE = new Date().toISOString().slice(0, 10);
const DEFAULT_FROM_DATE = (() => {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  return oneMonthAgo.toISOString().slice(0, 10);
})();

const SOURCE_LABELS: Record<DataLayer, string> = {
  recommendation: "Gợi ý từ người dùng",
  location: "Vị trí khi cần sạc",
  full: "Khu vực quá tải",
};

const HEAT_GRADIENTS: Record<LayerFilter, Record<number, string>> = {
  all: {
    0.2: "#60a5fa",
    0.6: "#2563eb",
    1: "#1e3a8a",
  },
  recommendation: {
    0.2: "#86efac",
    0.6: "#22c55e",
    1: "#166534",
  },
  location: {
    0.2: "#93c5fd",
    0.6: "#3b82f6",
    1: "#1d4ed8",
  },
  full: {
    0.2: "#fca5a5",
    0.6: "#ef4444",
    1: "#7f1d1d",
  },
};

const HEAT_OPTIONS = {
  radius: 45,
  blur: 32,
  max: 1,
  minOpacity: 0.15,
  gradient: HEAT_GRADIENTS.all,
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
type HeatLayerLike = Leaflet.Layer & {
  setLatLngs: (latlngs: Array<[number, number, number]>) => void;
  setOptions: (options: unknown) => void;
};
type LeafletHeatFactory = {
  heatLayer?: (latlngs: Array<[number, number, number]>, options?: unknown) => HeatLayerLike;
};

async function loadLeafletWithHeat(): Promise<LeafletWithHeat> {
  const leafletModule = await import("leaflet");
  const L = (leafletModule as { default: LeafletWithHeat }).default ?? (leafletModule as LeafletWithHeat);

  if (typeof window !== "undefined") {
    (window as Window & { L?: LeafletWithHeat }).L = L;
  }

  await import("leaflet.heat");

  return L;
}

function normalizeDateKey(value?: string): string | undefined {
  if (!value) return undefined;
  const normalized = value.slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(normalized) ? normalized : undefined;
}

function toHeatPoints(points: DisplayPoint[]): [number, number, number][] {
  return points.map((point) => [point.lat, point.long, 1]);
}

function extractCoordinate(rawPoint: unknown): { latitude: number; longitude: number } | null {
  if (!rawPoint || typeof rawPoint !== "object") return null;
  const value = rawPoint as Record<string, unknown>;

  if (typeof value.longitude === "number" && typeof value.latitude === "number") {
    return {
      longitude: value.longitude,
      latitude: value.latitude,
    };
  }

  for (const nestedKey of ["location", "position", "coordinate"]) {
    const nestedValue = value[nestedKey];
    if (!nestedValue || typeof nestedValue !== "object") continue;

    const nestedObject = nestedValue as Record<string, unknown>;
    if (typeof nestedObject.longitude === "number" && typeof nestedObject.latitude === "number") {
      return {
        longitude: nestedObject.longitude,
        latitude: nestedObject.latitude,
      };
    }
  }

  return null;
}

function mapSuggestionPoints(rawItems: BusinessSuggestionHotspotItem[]): DisplayPoint[] {
  return rawItems
    .map((item): DisplayPoint | null => {
      const coordinate = extractCoordinate(item);
      if (!coordinate) return null;

      return {
        lat: coordinate.latitude,
        long: coordinate.longitude,
        sourceLayer: "recommendation" as const,
        dateKey: normalizeDateKey(item.timestamp),
        description: item.description,
      };
    })
    .filter((point): point is DisplayPoint => point !== null);
}

function mapLocationPoints(rawItems: BusinessUserLocationHotspotItem[]): DisplayPoint[] {
  return rawItems
    .map((item): DisplayPoint | null => {
      const coordinate = extractCoordinate(item);
      if (!coordinate) return null;

      return {
        lat: coordinate.latitude,
        long: coordinate.longitude,
        sourceLayer: "location" as const,
        dateKey: normalizeDateKey(item.timestamp),
      };
    })
    .filter((point): point is DisplayPoint => point !== null);
}

function mapHitfullPoints(rawItems: BusinessHitfullHotspotItem[]): DisplayPoint[] {
  return rawItems
    .map((item): DisplayPoint | null => {
      const coordinate = extractCoordinate(item);
      if (!coordinate) return null;

      return {
        lat: coordinate.latitude,
        long: coordinate.longitude,
        sourceLayer: "full" as const,
        dateKey: normalizeDateKey(item.date),
        stationName: item.stationName,
      };
    })
    .filter((point): point is DisplayPoint => point !== null);
}

function findNearestPoint(
  map: Leaflet.Map,
  latlng: Leaflet.LatLng,
  points: DisplayPoint[],
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

export function HighDemandHeatmapV2() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Leaflet.Map | null>(null);
  const heatLayerRef = useRef<HeatLayerLike | null>(null);
  const selectionLayerRef = useRef<Leaflet.LayerGroup | null>(null);
  const previewCircleRef = useRef<Leaflet.Circle | null>(null);
  const trackedMarkerRef = useRef<Leaflet.CircleMarker | null>(null);
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
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const layersButtonRef = useRef<HTMLButtonElement>(null);
  const timeButtonRef = useRef<HTMLButtonElement>(null);
  const targetButtonRef = useRef<HTMLButtonElement>(null);
  const layersPanelRef = useRef<HTMLDivElement>(null);
  const timePanelRef = useRef<HTMLDivElement>(null);

  const [selectedPoint, setSelectedPoint] = useState<DisplayPoint | null>(null);
  const [activeLayer, setActiveLayer] = useState<LayerFilter>("all");
  const [customStartDate, setCustomStartDate] = useState(DEFAULT_FROM_DATE);
  const [customEndDate, setCustomEndDate] = useState(TODAY_DATE);
  const [appliedCustomRange, setAppliedCustomRange] = useState<{ start: string; end: string }>({
    start: DEFAULT_FROM_DATE,
    end: TODAY_DATE,
  });

  const [showLayerFilters, setShowLayerFilters] = useState(true);
  const [showTimeFilters, setShowTimeFilters] = useState(false);

  const [recommendationPoints, setRecommendationPoints] = useState<DisplayPoint[]>([]);
  const [locationPoints, setLocationPoints] = useState<DisplayPoint[]>([]);
  const [fullPoints, setFullPoints] = useState<DisplayPoint[]>([]);
  const [suggestionRawItems, setSuggestionRawItems] = useState<BusinessSuggestionHotspotItem[]>([]);
  const [hitfullRawItems, setHitfullRawItems] = useState<BusinessHitfullHotspotItem[]>([]);
  const [resultPanelKind, setResultPanelKind] = useState<ResultPanelKind | null>(null);
  const [trackedCoordinate, setTrackedCoordinate] = useState<{ lat: number; lng: number } | null>(null);

  isTargetModeActiveRef.current = isTargetModeActive;
  const canUseTargetMode = activeLayer === "recommendation" || activeLayer === "full";

  const fetchDataByLayer = useCallback(async (layer: LayerFilter, range: { start: string; end: string }) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const dateRangeParams = {
        fromDate: range.start,
        toDate: range.end,
      };

      if (layer === "all") {
        const [suggestions, hitfull, locations] = await Promise.all([
          getBusinessSuggestionHotspotsGeneral(dateRangeParams),
          getBusinessStationHitfullCountGeneral(dateRangeParams),
          getBusinessUsersLocationsHotspots(dateRangeParams),
        ]);

        setRecommendationPoints(mapSuggestionPoints(suggestions));
        setFullPoints(mapHitfullPoints(hitfull));
        setLocationPoints(mapLocationPoints(locations));
        setSuggestionRawItems(suggestions);
        setHitfullRawItems(hitfull);
        setResultPanelKind(null);
        return;
      }

      if (layer === "recommendation") {
        const suggestions = await getBusinessSuggestionHotspotsGeneral(dateRangeParams);
        setRecommendationPoints(mapSuggestionPoints(suggestions));
        setSuggestionRawItems(suggestions);
        setResultPanelKind(null);
        return;
      }

      if (layer === "location") {
        const locations = await getBusinessUsersLocationsHotspots(dateRangeParams);
        setLocationPoints(mapLocationPoints(locations));
        setResultPanelKind(null);
        return;
      }

      const hitfull = await getBusinessStationHitfullCountGeneral(dateRangeParams);
      setFullPoints(mapHitfullPoints(hitfull));
      setHitfullRawItems(hitfull);
      setResultPanelKind(null);
    } catch {
      setErrorMessage("Không thể tải dữ liệu heatmap. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const filteredPoints = useMemo(() => {
    const basePoints =
      activeLayer === "all"
        ? [...recommendationPoints, ...locationPoints, ...fullPoints]
        : activeLayer === "recommendation"
          ? recommendationPoints
          : activeLayer === "location"
            ? locationPoints
            : fullPoints;

    return basePoints.filter((point) => {
      if (!point.dateKey) return true;
      return point.dateKey >= appliedCustomRange.start && point.dateKey <= appliedCustomRange.end;
    });
  }, [
    activeLayer,
    appliedCustomRange.end,
    appliedCustomRange.start,
    fullPoints,
    locationPoints,
    recommendationPoints,
  ]);

  filteredPointsRef.current = filteredPoints;
  const currentGradient = HEAT_GRADIENTS[activeLayer];

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
    if (!canUseTargetMode) return;

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

  const handleApplyAreaQuery = async (range: HeatmapDateRange) => {
    if (!pendingSelection || !canUseTargetMode) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (activeLayer === "recommendation") {
        const data = await getBusinessSuggestionHotspots({
          longitude: pendingSelection.center.lng,
          latitude: pendingSelection.center.lat,
          radius: pendingSelection.radiusMeters,
          fromDate: range.from,
          toDate: range.to,
        });
        setRecommendationPoints(mapSuggestionPoints(data));
        setSuggestionRawItems(data);
        setResultPanelKind("suggestion");
      } else if (activeLayer === "full") {
        const data = await getBusinessStationHitfullCount({
          longitude: pendingSelection.center.lng,
          latitude: pendingSelection.center.lat,
          radius: pendingSelection.radiusMeters,
          fromDate: range.from,
          toDate: range.to,
        });
        setFullPoints(mapHitfullPoints(data));
        setHitfullRawItems(data);
        setResultPanelKind("full");
      }
    } catch {
      setErrorMessage("Không thể tải dữ liệu theo vùng đã chọn.");
    } finally {
      setIsLoading(false);
      resetAreaSelection();
      setIsTargetModeActive(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initMap = async () => {
      if (!mapContainer.current || mapRef.current) return;

      const L = await loadLeafletWithHeat();

      if (!isMounted || !mapContainer.current || mapRef.current) return;

      const heatLayerFactory = (L as LeafletWithHeat & LeafletHeatFactory).heatLayer;
      if (typeof heatLayerFactory !== "function") {
        console.error("leaflet.heat failed to register L.heatLayer");
        return;
      }

      leafletRef.current = L;
      mapRef.current = L.map(mapContainer.current, {
        zoomControl: false,
      }).setView(DEFAULT_MAP_CENTER, 14);

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

      heatLayerRef.current = heatLayerFactory([], HEAT_OPTIONS).addTo(mapRef.current) as HeatLayerLike;
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
      trackedMarkerRef.current = null;
      leafletRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapReady || !heatLayerRef.current) return;
    heatLayerRef.current.setOptions({ ...HEAT_OPTIONS, gradient: currentGradient });
    heatLayerRef.current.setLatLngs(toHeatPoints(filteredPoints));
  }, [currentGradient, filteredPoints, mapReady]);

  useEffect(() => {
    const map = mapRef.current;
    const L = leafletRef.current;
    if (!map || !L || !mapReady) return;

    if (trackedMarkerRef.current) {
      trackedMarkerRef.current.remove();
      trackedMarkerRef.current = null;
    }

    if (!trackedCoordinate) return;

    trackedMarkerRef.current = L.circleMarker([trackedCoordinate.lat, trackedCoordinate.lng], {
      radius: 10,
      color: "#15803d",
      fillColor: "#22c55e",
      fillOpacity: 0.9,
      weight: 3,
    }).addTo(map);

    map.flyTo([trackedCoordinate.lat, trackedCoordinate.lng], Math.max(map.getZoom(), 15), {
      duration: 0.9,
    });
  }, [mapReady, trackedCoordinate]);

  useEffect(() => {
    setSelectedPoint(null);
  }, [filteredPoints, activeLayer]);

  useEffect(() => {
    void fetchDataByLayer(activeLayer, appliedCustomRange);
  }, [activeLayer, appliedCustomRange, fetchDataByLayer]);

  useEffect(() => {
    if (canUseTargetMode) return;
    setIsTargetModeActive(false);
    resetAreaSelection();
  }, [canUseTargetMode, resetAreaSelection]);

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
    <div className="h-full w-full overflow-hidden flex">
      <div className={`${resultPanelKind ? "w-2/3" : "w-full"} relative h-full bg-gray-100 overflow-hidden`}>
        <div ref={mapContainer} className="absolute inset-0" />

        <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-3">
          <button
            ref={targetButtonRef}
            type="button"
            onClick={handleToggleTargetMode}
            disabled={!canUseTargetMode}
            className={`h-11 w-11 rounded-xl border shadow-md flex items-center justify-center transition-colors ${
              isTargetModeActive
                ? "bg-green-50 border-green-500 ring-2 ring-green-500 text-green-700"
                : canUseTargetMode
                  ? "bg-white/95 border-gray-200 text-gray-700 hover:bg-white"
                  : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
            }`}
            title={
              canUseTargetMode
                ? "Chọn vùng trên bản đồ"
                : "Chỉ áp dụng cho lớp gợi ý và quá tải"
            }
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
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(event) => setCustomStartDate(event.target.value)}
                  className="px-2 py-2 rounded border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(event) => setCustomEndDate(event.target.value)}
                  className="px-2 py-2 rounded border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
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
            </div>
          </div>
        )}

        <div className="absolute bottom-4 left-4 z-[1000] rounded-xl bg-white/90 backdrop-blur border border-gray-200 shadow-md px-3 py-2 min-w-[200px]">
          <div className="text-[11px] font-semibold text-gray-700 mb-1.5">Mật độ (leaflet.heat)</div>
          <div
            className="h-2.5 w-full rounded-full"
            style={{
              background:
                activeLayer === "all"
                  ? "linear-gradient(to right, #60a5fa, #2563eb, #1e3a8a)"
                  : activeLayer === "recommendation"
                    ? "linear-gradient(to right, #86efac, #22c55e, #166534)"
                    : activeLayer === "location"
                      ? "linear-gradient(to right, #93c5fd, #3b82f6, #1d4ed8)"
                      : "linear-gradient(to right, #fca5a5, #ef4444, #7f1d1d)",
            }}
          />
          <div className="flex justify-between text-[10px] text-gray-500 mt-0.5">
            <span>Thấp</span>
            <span>Cao</span>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-200 text-[10px] text-gray-600 space-y-0.5">
            <p>Màu hiện tại: {activeLayer === "all" ? "Tất cả dữ liệu" : SOURCE_LABELS[activeLayer]}</p>
            <p className="text-gray-500">
              {isTargetModeActive
                ? "Giữ chuột trái và kéo để chọn vùng tròn"
                : canUseTargetMode
                  ? "Nhấp vùng nhiệt để xem chi tiết điểm"
                  : "Lớp này chỉ dùng API tổng quát"}
            </p>
          </div>
        </div>

        <div className="absolute top-4 right-4 z-[1000] rounded-xl bg-white/90 backdrop-blur border border-gray-200 shadow-md px-3 py-2 text-[11px] text-gray-700">
          Đang hiển thị: <span className="font-semibold text-gray-900">{filteredPoints.length}</span> điểm
          {isLoading ? <span className="ml-2 text-gray-500">• Đang tải...</span> : null}
        </div>

        {errorMessage ? (
          <div className="absolute top-16 right-4 z-[1000] rounded-xl bg-red-50 border border-red-200 shadow-md px-3 py-2 text-[11px] text-red-700">
            {errorMessage}
          </div>
        ) : null}

        {selectedPoint && !isTargetModeActive && (
          <div className="absolute bottom-4 right-4 z-[1000] max-w-xs bg-white/95 backdrop-blur border border-blue-100 rounded-xl shadow-md p-3 flex items-start gap-2">
            <FiInfo className="w-4 h-4 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-gray-900">{SOURCE_LABELS[selectedPoint.sourceLayer]}</p>
              {selectedPoint.stationName ? (
                <p className="text-xs text-gray-600 mt-0.5">Trạm: {selectedPoint.stationName}</p>
              ) : null}
              {selectedPoint.dateKey ? (
                <p className="text-xs text-gray-600 mt-0.5">Ngày: {selectedPoint.dateKey}</p>
              ) : null}
              {selectedPoint.description ? (
                <p className="text-xs text-gray-600 mt-0.5">Mô tả: {selectedPoint.description}</p>
              ) : null}
              <p className="text-xs text-gray-600 mt-0.5">
                Tọa độ: {selectedPoint.lat}, {selectedPoint.long}
              </p>
            </div>
          </div>
        )}
      </div>

      {resultPanelKind ? (
        <HeatmapHotspotResultPanel
          kind={resultPanelKind}
          hitfullItems={hitfullRawItems}
          suggestionItems={suggestionRawItems}
          onSelectCoordinate={(coordinate) => {
            setTrackedCoordinate({
              lat: coordinate.latitude,
              lng: coordinate.longitude,
            });
          }}
        />
      ) : null}

      <HeatmapDateRangeModal
        open={isDateModalOpen}
        onClose={handleCancelDateModal}
        onApply={handleApplyAreaQuery}
        defaultFrom={appliedCustomRange.start}
        defaultTo={appliedCustomRange.end}
      />
    </div>
  );
}
