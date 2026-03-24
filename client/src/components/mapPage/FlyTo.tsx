"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { Coordinate } from "@/models/shared";
import { useMapStore } from "@/store/useMapStore";

export default function FlyTo() {
  const map = useMap();

  const coordinate = useMapStore((s) => s.flyTo);
  const trigger = useMapStore((s) => s.flyTrigger);

  useEffect(() => {
    if (!coordinate) return;

    map.flyTo([coordinate.latitude, coordinate.longitude], 15);
  }, [trigger]);

  return null;
}
