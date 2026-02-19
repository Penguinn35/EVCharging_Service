"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { Coordinate } from "@/models/shared";

export default function FlyTo({
  coordinate,
  trigger,
}: {
  coordinate: Coordinate;
  trigger: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (!coordinate) return;

    map.flyTo(
      [coordinate.latitude, coordinate.longitude],
      15
    );
  }, [trigger]); // 👈 event dependency

  return null;
}
