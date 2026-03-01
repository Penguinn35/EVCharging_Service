"use client";

import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import "lrm-graphhopper";
const api = process.env.NEXT_PUBLIC_API_GRAPHHOPPER;

type Props = {
  from: [number, number];
  to: [number, number];
};

export default function RoutingMachine({ from, to }: Props) {
  console.log("RoutingMachine render");
  const map = useMap();
  // const hasRun = useRef(false);
  useEffect(() => {
    if (!map) return;
    // if (hasRun.current) return;
    // hasRun.current = true;

    const routingControl = L.Routing.control({
      waypoints: [L.latLng(from[0], from[1]), L.latLng(to[0], to[1])],
      router: L.Routing.graphHopper(api),
      show: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
    }).addTo(map);

    return () => {
      map.removeControl(routingControl);
    };
  }, [from, to]);

  return null;
}
