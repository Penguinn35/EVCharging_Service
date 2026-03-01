"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { heatmapData, formatHeatmapForLeaflet } from "@/lib/data/heatmap";
import { FiInfo, FiCalendar } from "react-icons/fi";

// Custom heatmap plugin for Leaflet (simple implementation)
// const HeatmapLayer = require("leaflet-heatmap");

export function HighDemandHeatmap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<(typeof heatmapData)[0] | null>(null);
  const [activeLayer, setActiveLayer] = useState<"all" | "recommendation" | "location" | "full">("all");
  const [dateFilter, setDateFilter] = useState<"day" | "week" | "month" | "custom">("week");
  const [showApplyButton, setShowApplyButton] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainer.current).setView([40.7128, -74.006], 11);

      // Add OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapRef.current);

      // Add heatmap data as circle markers with intensity-based styling
      // Color code by type
      const colorMap = {
        user_recommendation: "#22c55e",    // Green
        user_location: "#3b82f6",          // Blue
        full_status: "#ef4444",            // Red
      };

      heatmapData.forEach((point) => {
        // Filter by active layer
        if (activeLayer !== "all" && point.type !== activeLayer) {
          return;
        }

        const radius = point.intensity / 20;
        const opacity = point.intensity / 100;
        const color = colorMap[point.type];

        const circle = L.circle([point.lat, point.lng], {
          color: color,
          fillColor: color,
          fillOpacity: opacity * 0.6,
          weight: 2,
          radius: radius * 400,
        }).addTo(mapRef.current!);

        // Add popup on circle click
        const typeLabel = {
          user_recommendation: "User Recommendation",
          user_location: "User Starting Location",
          full_status: "Station Full Status",
        }[point.type];

        circle.bindPopup(
          `<div class="text-sm font-semibold">${point.label}</div><div class="text-xs text-gray-600">Type: ${typeLabel}</div><div class="text-xs text-gray-600">Intensity: ${point.intensity}%</div>`
        );

        // Add hover effect
        circle.on("mouseover", () => {
          setSelectedPoint(point);
        });
        circle.on("mouseout", () => {
          setSelectedPoint(null);
        });
      });
    }

    return () => {
      // Cleanup is not needed as we're keeping the map persistent
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">High Demand Hotspots</h2>
          <p className="text-gray-600 mt-1">
            Interactive map showing user recommendations, starting locations, and station full status
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
        {/* Layer Filter */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-medium text-gray-700">Display Layers:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveLayer("all")}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                activeLayer === "all"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveLayer("recommendation")}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                activeLayer === "recommendation"
                  ? "bg-green-600 text-white"
                  : "bg-green-100 text-green-700 hover:bg-green-200"
              }`}
            >
              User Recommendations
            </button>
            <button
              onClick={() => setActiveLayer("location")}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                activeLayer === "location"
                  ? "bg-blue-600 text-white"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
              }`}
            >
              User Locations
            </button>
            <button
              onClick={() => setActiveLayer("full")}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                activeLayer === "full"
                  ? "bg-red-600 text-white"
                  : "bg-red-100 text-red-700 hover:bg-red-200"
              }`}
            >
              Full Status
            </button>
          </div>
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-3 flex-wrap pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2 text-gray-700">
            <FiCalendar className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium">Filter by Time:</span>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={dateFilter}
              onChange={(e) => {
                const value = e.target.value as typeof dateFilter;
                setDateFilter(value);
                if (value === "custom") {
                  setShowApplyButton(true);
                } else {
                  setShowApplyButton(false);
                }
              }}
              className="px-3 py-1 rounded-lg border border-gray-300 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="day">Last 24 Hours</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="custom">Custom Range</option>
            </select>

            {dateFilter === "custom" && (
              <>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    className="px-2 py-1 rounded border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <span className="text-gray-500 text-xs">to</span>
                  <input
                    type="date"
                    className="px-2 py-1 rounded border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                {showApplyButton && (
                  <button className="px-4 py-1 rounded-lg bg-green-600 text-white text-xs font-medium hover:bg-green-700 transition-colors">
                    Apply
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Info Box */}
      {selectedPoint && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <FiInfo className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-blue-900">{selectedPoint.label}</div>
            <div className="text-sm text-blue-700 mt-1">
              Type: {selectedPoint.type === "user_recommendation" ? "User Recommendation" : selectedPoint.type === "user_location" ? "User Starting Location" : "Station Full Status"}
            </div>
            <div className="text-sm text-blue-700">Intensity: {selectedPoint.intensity}%</div>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div className="rounded-lg overflow-hidden border border-gray-200 h-96" ref={mapContainer} />

      {/* Legend and Top Locations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Legend */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Heatmap Layers</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-600" />
              <span className="text-sm text-gray-700">User Recommendations</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-600" />
              <span className="text-sm text-gray-700">User Starting Locations</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-600" />
              <span className="text-sm text-gray-700">Station Full Status</span>
            </div>
          </div>
        </div>

        {/* Top Demand Locations */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Top 5 Demand Locations</h3>
          <div className="space-y-2">
            {[...heatmapData]
              .sort((a, b) => b.intensity - a.intensity)
              .slice(0, 5)
              .map((point, index) => (
                <div
                  key={point.label}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-green-600">#{index + 1}</span>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{point.label}</div>
                      <div className="text-xs text-gray-600">Type: {point.type === "user_recommendation" ? "Recommendation" : point.type === "user_location" ? "Location" : "Full"}</div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-gray-700">{point.intensity}%</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
