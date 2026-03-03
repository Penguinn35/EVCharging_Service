export type HeatmapPointType = "user_recommendation" | "user_location" | "full_status";

export interface HeatmapPoint {
  lat: number;
  lng: number;
  intensity: number;
  label: string;
  type: HeatmapPointType;
}

// Heatmap data with different point types
// User recommendations, user starting locations, and full status occurrences
export const heatmapData: HeatmapPoint[] = [
  {
    lat: 40.7128,
    lng: -74.006,
    intensity: 95,
    label: "Downtown Manhattan",
    type: "user_recommendation",
  },
  {
    lat: 40.7589,
    lng: -73.9851,
    intensity: 88,
    label: "Central Park Area",
    type: "user_location",
  },
  {
    lat: 40.7282,
    lng: -73.7949,
    intensity: 82,
    label: "Queens Industrial Zone",
    type: "full_status",
  },
  {
    lat: 40.758,
    lng: -73.9855,
    intensity: 90,
    label: "Times Square District",
    type: "user_recommendation",
  },
  {
    lat: 40.6895,
    lng: -74.0345,
    intensity: 75,
    label: "Brooklyn Heights",
    type: "user_location",
  },
  {
    lat: 40.7489,
    lng: -73.9680,
    intensity: 85,
    label: "Grand Central Area",
    type: "full_status",
  },
  {
    lat: 40.7505,
    lng: -73.9972,
    intensity: 78,
    label: "Herald Square",
    type: "user_recommendation",
  },
  {
    lat: 40.7549,
    lng: -73.9840,
    intensity: 92,
    label: "42nd Street Corridor",
    type: "user_location",
  },
  {
    lat: 40.7614,
    lng: -73.9776,
    intensity: 70,
    label: "Upper East Side",
    type: "full_status",
  },
  {
    lat: 40.7489,
    lng: -73.968,
    intensity: 86,
    label: "Midtown Business District",
    type: "user_recommendation",
  },
];

// Convert heatmap data to format suitable for Leaflet
export function formatHeatmapForLeaflet(): Array<[number, number, number]> {
  return heatmapData.map((point) => [point.lat, point.lng, point.intensity / 100]);
}
