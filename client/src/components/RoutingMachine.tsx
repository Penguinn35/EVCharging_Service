"use client";

import { useEffect } from "react";
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
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(from[0], from[1]),
        L.latLng(to[0], to[1]),
      ],
      router: L.Routing.graphHopper(api)
    }).addTo(map);

    return () => {
      map.removeControl(routingControl);
    };
  }, [ from, to]);

  return null;

}
