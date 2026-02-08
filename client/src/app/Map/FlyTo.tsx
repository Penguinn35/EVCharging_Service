"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { Coordinate } from "@/models/shared";

export default function FlyTo({ coordinate }: { coordinate: Coordinate }) {
  const map = useMap();

  useEffect(() => {
    if (!coordinate?.latitude || !coordinate?.longitude) return;

    map.flyTo([coordinate.latitude, coordinate.longitude], 15);
  }, [coordinate, map]);

  return null;
}
