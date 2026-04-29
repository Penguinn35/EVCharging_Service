"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { heatmapData } from "@/lib/data/heatmap";
import { FiCalendar, FiInfo, FiLayers } from "react-icons/fi";

type LayerFilter = "all" | "recommendation" | "location" | "full";
type DateFilter = "day" | "week" | "month" | "custom";

export function HighDemandHeatmap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerLayerRef = useRef<L.LayerGroup | null>(null);

  const layersButtonRef = useRef<HTMLButtonElement>(null);
  const timeButtonRef = useRef<HTMLButtonElement>(null);
  const layersPanelRef = useRef<HTMLDivElement>(null);
  const timePanelRef = useRef<HTMLDivElement>(null);

  const [selectedPoint, setSelectedPoint] = useState<(typeof heatmapData)[0] | null>(null);
  const [activeLayer, setActiveLayer] = useState<LayerFilter>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("week");
  const [showApplyButton, setShowApplyButton] = useState(false);

  const [showLayerFilters, setShowLayerFilters] = useState(true);
  const [showTimeFilters, setShowTimeFilters] = useState(false);

  const colorMap = {
    user_recommendation: "#22c55e",
    user_location: "#3b82f6",
    full_status: "#ef4444",
  } as const;

  const layerTypeMap = {
    recommendation: "user_recommendation",
    location: "user_location",
    full: "full_status",
  } as const;

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    mapRef.current = L.map(mapContainer.current, {
      zoomControl: false,
    }).setView([40.7128, -74.006], 11);

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

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      markerLayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!markerLayerRef.current) return;

    markerLayerRef.current.clearLayers();

    heatmapData.forEach((point) => {
      if (activeLayer !== "all" && point.type !== layerTypeMap[activeLayer]) {
        return;
      }

      const radius = point.intensity / 20;
      const opacity = point.intensity / 100;
      const color = colorMap[point.type];

      const circle = L.circle([point.lat, point.lng], {
        color,
        fillColor: color,
        fillOpacity: opacity * 0.6,
        weight: 2,
        radius: radius * 400,
      }).addTo(markerLayerRef.current!);

      const typeLabel = {
        user_recommendation: "User Recommendation",
        user_location: "User Starting Location",
        full_status: "Station Full Status",
      }[point.type];

      circle.bindPopup(
        `<div class="text-sm font-semibold">${point.label}</div><div class="text-xs text-gray-600">Type: ${typeLabel}</div><div class="text-xs text-gray-600">Intensity: ${point.intensity}%</div>`
      );

      circle.on("mouseover", () => setSelectedPoint(point));
      circle.on("mouseout", () => setSelectedPoint(null));
    });
  }, [activeLayer]);

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

        {/* Floating controls */}
        <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-3">
          <button
            ref={layersButtonRef}
            onClick={() => setShowLayerFilters((prev) => !prev)}
            className="h-11 w-11 rounded-xl bg-white/95 border border-gray-200 shadow-md flex items-center justify-center text-gray-700 hover:bg-white"
            title="Layer filters"
          >
            <FiLayers className="h-5 w-5" />
          </button>

          <button
            ref={timeButtonRef}
            onClick={() => setShowTimeFilters((prev) => !prev)}
            className="h-11 w-11 rounded-xl bg-white/95 border border-gray-200 shadow-md flex items-center justify-center text-gray-700 hover:bg-white"
            title="Time filters"
          >
            <FiCalendar className="h-5 w-5" />
          </button>
        </div>

        {/* Expandable filter panels */}
        {showLayerFilters && (
          <div
            ref={layersPanelRef}
            className="absolute top-4 left-20 z-[1000] w-[290px] rounded-2xl bg-white/95 backdrop-blur border border-gray-200 shadow-lg p-4"
          >
            <p className="text-sm font-semibold text-gray-900 mb-3">Display Layers</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveLayer("all")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                  activeLayer === "all" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveLayer("recommendation")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                  activeLayer === "recommendation"
                    ? "bg-green-600 text-white"
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                }`}
              >
                Recommendations
              </button>
              <button
                onClick={() => setActiveLayer("location")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                  activeLayer === "location" ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                }`}
              >
                User Locations
              </button>
              <button
                onClick={() => setActiveLayer("full")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                  activeLayer === "full" ? "bg-red-600 text-white" : "bg-red-100 text-red-700 hover:bg-red-200"
                }`}
              >
                Full Status
              </button>
            </div>
          </div>
        )}

        {showTimeFilters && (
          <div
            ref={timePanelRef}
            className="absolute top-16 left-20 z-[1000] w-[320px] rounded-2xl bg-white/95 backdrop-blur border border-gray-200 shadow-lg p-4"
          >
            <p className="text-sm font-semibold text-gray-900 mb-3">Filter by Time</p>
            <select
              value={dateFilter}
              onChange={(e) => {
                const value = e.target.value as DateFilter;
                setDateFilter(value);
                setShowApplyButton(value === "custom");
              }}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="day">Last 24 Hours</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="custom">Custom Range</option>
            </select>

            {dateFilter === "custom" && (
              <div className="mt-3 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    className="px-2 py-2 rounded border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="date"
                    className="px-2 py-2 rounded border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                {showApplyButton && (
                  <button className="w-full px-4 py-2 rounded-lg bg-green-600 text-white text-xs font-medium hover:bg-green-700 transition-colors">
                    Apply
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Minimal legend */}
        <div className="absolute bottom-4 left-4 z-[1000] rounded-xl bg-white/90 backdrop-blur border border-gray-200 shadow-md px-3 py-2">
          <div className="text-[11px] font-semibold text-gray-700 mb-1">Heatmap Layers</div>
          <div className="flex items-center gap-3 text-[11px] text-gray-700">
            <span className="flex items-center gap-1"><i className="inline-block h-2.5 w-2.5 rounded-full bg-green-600" /> Rec</span>
            <span className="flex items-center gap-1"><i className="inline-block h-2.5 w-2.5 rounded-full bg-blue-600" /> Loc</span>
            <span className="flex items-center gap-1"><i className="inline-block h-2.5 w-2.5 rounded-full bg-red-600" /> Full</span>
          </div>
        </div>

        {/* Hovered point information */}
        {selectedPoint && (
          <div className="absolute bottom-4 right-4 z-[1000] max-w-xs bg-white/95 backdrop-blur border border-blue-100 rounded-xl shadow-md p-3 flex items-start gap-2">
            <FiInfo className="w-4 h-4 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-gray-900">{selectedPoint.label}</p>
              <p className="text-xs text-gray-600 mt-0.5">
                {selectedPoint.type === "user_recommendation"
                  ? "User Recommendation"
                  : selectedPoint.type === "user_location"
                  ? "User Starting Location"
                  : "Station Full Status"}
              </p>
              <p className="text-xs text-blue-700 font-medium">Intensity: {selectedPoint.intensity}%</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
