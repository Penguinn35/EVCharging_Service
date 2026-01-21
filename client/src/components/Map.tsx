"use client";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import "../components/map.css";
import { sampleStations } from "@/sampleData/stations";
import { ChargingStation } from "@/models/station";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useStationStore } from "@/store/useStationStore";

type Position = {
  lat: number;
  lng: number;
};
delete (L.Icon.Default.prototype as any)._getIconUrl;
function FlyToUser({ position }: { position: Position }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo([position.lat, position.lng], 15);
  }, [position, map]);

  return null;
}
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function Recenter({ position }: { position: Position }) {
  const map = useMap();

  useEffect(() => {
    map.setView([position.lat, position.lng]);
  }, [position, map]);

  return null;
}

const CustomMarker = ({ station }: { station: ChargingStation }) => {
  const [L, setLeaflet] = useState<any>(null);
  const selectStation = useStationStore((state) => state.selectStation);

  useEffect(() => {
    import("leaflet").then((leaflet) => {
      setLeaflet(leaflet);
    });
  }, []);

  if (!L) {
    return null;
  }

  const markerIcon = L.divIcon({
    className: "custom-marker",
    html: `
      <div class="pin status-${station.status}">
        <div class="pin-inner">
          <span class="brand">${station.operatorId}</span>
        </div>
      </div>
    `,
    iconSize: [42, 48],
    iconAnchor: [21, 48],
  });

  return (
    <Marker 
    position={[station.latitude, station.longtitude]}
    icon={markerIcon}
    eventHandlers={
      {click: () => {
        selectStation(station);
      }}
    }
    >
      
    </Marker>
  );
};



export default function Map() {
  const [position, setPosition] = useState<Position | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        console.error(err);
      },
      { enableHighAccuracy: true }
    );
  }, []);


  return (
    <MapContainer
      center={[10.814889, 106.697906]}
      zoom={13}
      zoomControl={false}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {position && (
        <>
          <Marker position={[position.lat, position.lng]}>
            <Popup>You are here</Popup>
          </Marker>
          <FlyToUser position={position} />
        </>
      )}
      {sampleStations.map((station) => (
        <CustomMarker key={station.id} station={station} />
      ))}

    </MapContainer>
  );
}
