"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../components/map.css"
const position: [number, number] = [21.0285, 105.8542]; // Hanoi

const markerIcon = L.divIcon({
  className: "custom-marker",
  html: `
    <div class="pin status-active">
      <div class="pin-inner">
        <span class="brand">EV</span>
      </div>
    </div>
  `,
  iconSize: [42, 48],
  iconAnchor: [21, 48], // important: bottom tip
});

export default function Map() {
  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={position} icon={markerIcon}>
        <Popup>EV Station</Popup>
      </Marker>
    </MapContainer>
  );
}
