"use client";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import "../components/map.css";
import { sampleStations } from "@/sampleData/stations";
import { ChargingStation } from "@/models/station";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useStationStore } from "@/store/useStationStore";
import { useUserStore } from "@/store/useUserStore";
import { useRoutingStore } from "@/store/useRoutingStore";
import RoutingMachine from "./RoutingMachine";
import FlyTo from "@/app/(public)/Map/FlyTo";
import { useMapStore } from "@/store/useMapStore";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const CustomMarker = ({ station }: { station: ChargingStation }) => {
  const [L, setLeaflet] = useState<any>(null);
  const selectStation = useStationStore((state) => state.selectStation);
  // const { clearRouting } = useRoutingStore();
  const clearRouting = useRoutingStore((s) => s.clearRouting);

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
      position={[station.coordinate.latitude, station.coordinate.longitude]}
      icon={markerIcon}
      eventHandlers={{
        click: () => {
          selectStation(station);
          clearRouting();
        },
      }}
    ></Marker>
  );
};

export default function Map() {
  console.log("Map render");

  const coordinate = useUserStore((state) => state.user.coordinate);
  const setLocation = useUserStore((state) => state.setLocation);

  const isOpen = useRoutingStore((s) => s.isOpen);
  const location = useRoutingStore((s) => s.location);
  const flyCoordinate = useMapStore((s) => s.flyTo);
const flyTrigger = useMapStore(s => s.flyTrigger);
  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      (err) => {
        console.error(err);
      },
      { enableHighAccuracy: true },
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
      {coordinate && (
        <>
          <Marker position={[coordinate.latitude, coordinate.longitude]}>
            <Popup>You are here</Popup>
          </Marker>
          {/* <FlyTo coordinate={coordinate}/> */}
        </>
      )}
      {flyCoordinate && <FlyTo coordinate={flyCoordinate} trigger={flyTrigger} />}

      {sampleStations.map((station) => (
        <CustomMarker key={station.id} station={station} />
      ))}

      {coordinate && isOpen && (
        <RoutingMachine
          from={[coordinate.latitude, coordinate.longitude]}
          to={[location?.latitude || 0, location?.longitude || 0]}
        />
      )}
    </MapContainer>
  );
}
