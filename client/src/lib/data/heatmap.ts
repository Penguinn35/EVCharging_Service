export type HeatmapLayerKey = "recommendation" | "location" | "full";
export type HeatmapDateKey = "2026-05-19" | "2026-05-20" | "2026-05-21";

export interface HeatmapCoordinatePoint {
  lat: number;
  long: number;
}

export type HeatmapData = Record<HeatmapLayerKey, Record<HeatmapDateKey, HeatmapCoordinatePoint[]>>;

const CENTER_LAT = 10.814889;
const CENTER_LONG = 106.697906;
const DISTRIBUTION_RADIUS_KM = 15;
const LAT_KM_PER_DEGREE = 111.32;
const LONG_KM_PER_DEGREE = LAT_KM_PER_DEGREE * Math.cos((CENTER_LAT * Math.PI) / 180);

function createSeededRandom(seed: number) {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;

  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function generateClusteredPoints(seed: number, count: number): HeatmapCoordinatePoint[] {
  const random = createSeededRandom(seed);

  return Array.from({ length: count }, () => {
    const distanceKm = Math.sqrt(random()) * DISTRIBUTION_RADIUS_KM;
    const angle = random() * Math.PI * 2;

    const latOffset = (distanceKm * Math.cos(angle)) / LAT_KM_PER_DEGREE;
    const longOffset = (distanceKm * Math.sin(angle)) / LONG_KM_PER_DEGREE;

    return {
      lat: Number((CENTER_LAT + latOffset).toFixed(6)),
      long: Number((CENTER_LONG + longOffset).toFixed(6)),
    };
  });
}

export const heatmapData: HeatmapData = {
  recommendation: {
    "2026-05-19": generateClusteredPoints(101, 60),
    "2026-05-20": generateClusteredPoints(102, 70),
    "2026-05-21": generateClusteredPoints(103, 80),
  },
  location: {
    "2026-05-19": generateClusteredPoints(201, 55),
    "2026-05-20": generateClusteredPoints(202, 65),
    "2026-05-21": generateClusteredPoints(203, 75),
  },
  full: {
    "2026-05-19": generateClusteredPoints(301, 50),
    "2026-05-20": generateClusteredPoints(302, 60),
    "2026-05-21": generateClusteredPoints(303, 70),
  },
};
