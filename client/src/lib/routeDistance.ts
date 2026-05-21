import { StationRouteGeoJson } from "@/services/stationService";

const EARTH_RADIUS_IN_METERS = 6371000;

const toRadians = (value: number) => (value * Math.PI) / 180;

const calculateSegmentDistanceInMeters = (
  start: [number, number],
  end: [number, number],
): number => {
  const [startLongitude, startLatitude] = start;
  const [endLongitude, endLatitude] = end;

  const deltaLatitude = toRadians(endLatitude - startLatitude);
  const deltaLongitude = toRadians(endLongitude - startLongitude);

  const a =
    Math.sin(deltaLatitude / 2) * Math.sin(deltaLatitude / 2) +
    Math.cos(toRadians(startLatitude)) *
      Math.cos(toRadians(endLatitude)) *
      Math.sin(deltaLongitude / 2) *
      Math.sin(deltaLongitude / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_IN_METERS * c;
};

export const calculateRouteDistanceInMeters = (
  route: StationRouteGeoJson,
): number =>
  route.coordinates.reduce((totalDistance, segment) => {
    if (segment.length < 2) {
      return totalDistance;
    }

    let segmentDistance = 0;

    for (let index = 1; index < segment.length; index += 1) {
      segmentDistance += calculateSegmentDistanceInMeters(
        segment[index - 1] as [number, number],
        segment[index] as [number, number],
      );
    }

    return totalDistance + segmentDistance;
  }, 0);
