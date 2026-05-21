"use client";

import { useEffect, useMemo, useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { toast } from "react-toastify";

import { calculateRouteDistanceInMeters } from "@/lib/routeDistance";
import { getStationRoute, StationRouteGeoJson } from "@/services/stationService";
import { useRoutingStore } from "@/store/useRoutingStore";
import { Coordinate } from "@/type/share";

type Props = {
  origin: Coordinate;
  destination: Coordinate & {
    stationId: string;
  };
};

const routeStyle: L.PathOptions = {
  color: "#16a34a",
  weight: 5,
  opacity: 0.9,
};

const prependOriginToRoute = (
  route: StationRouteGeoJson,
  origin: Coordinate,
): StationRouteGeoJson => {
  if (route.coordinates.length === 0) {
    return {
      ...route,
      coordinates: [[[origin.longitude, origin.latitude]]],
    };
  }

  const [firstSegment = [], ...restSegments] = route.coordinates;
  const updatedFirstSegment = [
    [origin.longitude, origin.latitude],
    ...firstSegment,
  ];

  return {
    ...route,
    coordinates: [updatedFirstSegment, ...restSegments],
  };
};

const toLatLngs = (route: StationRouteGeoJson): L.LatLngExpression[][] =>
  route.coordinates.map((segment) =>
    segment.map(([longitude, latitude]) => [latitude, longitude]),
  );

export default function StationRouteLayer({ origin, destination }: Props) {
  const map = useMap();
  const setRoutingDistance = useRoutingStore(
    (state) => state.setRoutingDistance,
  );
  const setRoutingLoading = useRoutingStore(
    (state) => state.setRoutingLoading,
  );
  const [route, setRoute] = useState<StationRouteGeoJson | null>(null);

  const latLngs = useMemo(() => {
    if (!route) {
      return [];
    }

    return toLatLngs(route);
  }, [route]);

  useEffect(() => {
    let isMounted = true;

    const loadRoute = async () => {
      setRoutingLoading(true);
      setRoutingDistance(null);

      try {
        const data = await getStationRoute({
          longitude: origin.longitude,
          latitude: origin.latitude,
          stationId: destination.stationId,
        });
        const routeWithOrigin = data;
        const distanceInKilometers =
          calculateRouteDistanceInMeters(routeWithOrigin) / 1000;

        if (isMounted) {
          setRoute(routeWithOrigin);
          setRoutingDistance(distanceInKilometers);
        }
      } catch (error) {
        console.error("Không thể tải lộ trình đến trạm sạc", error);
        toast.error("Không thể tải lộ trình đến trạm sạc.");
        if (isMounted) {
          setRoute(null);
          setRoutingDistance(null);
        }
      } finally {
        if (isMounted) {
          setRoutingLoading(false);
        }
      }
    };

    void loadRoute();

    return () => {
      isMounted = false;
      setRoutingLoading(false);
    };
  }, [
    destination.stationId,
    origin.latitude,
    origin.longitude,
    setRoutingDistance,
    setRoutingLoading,
  ]);

  useEffect(() => {
    if (!map || latLngs.length === 0) {
      return;
    }

    const routeLayer = L.polyline(latLngs, routeStyle).addTo(map);
    map.fitBounds(routeLayer.getBounds(), { padding: [32, 32] });

    return () => {
      map.removeLayer(routeLayer);
    };
  }, [latLngs, map]);

  return null;
}
