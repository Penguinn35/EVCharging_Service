"use client";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import "../mapPage/map.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useStationStore } from "@/store/useStationStore";
import { useUserStore } from "@/store/useUserStore";
import { useRoutingStore } from "@/store/useRoutingStore";
import RoutingMachine from "./RoutingMachine";
import FlyTo from "@/components/mapPage/FlyTo";
import { MapCenterTracker } from "./MapCenterTracker";
import { StationMarkerData } from "@/type/station";
import { getStationById } from "@/services/stationService";
import { toast } from "react-toastify";
import { useMapStore } from "@/store/useMapStore";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const LOGO_VARIANTS = [
  { src: "/CPOLogo/datbike.png", alt: "Dat Bike", weight: 15 },
  { src: "/CPOLogo/eboost.png", alt: "eBoost", weight: 35 },
  { src: "/CPOLogo/vgreen.png", alt: "V-Green", weight: 50 },
];

const getRandomMarkerLogo = () => {
  const pick = Math.random() * 100;

  if (pick < 50) return LOGO_VARIANTS[0];
  if (pick < 80) return LOGO_VARIANTS[1];
  return LOGO_VARIANTS[2];
};

const CustomMarker = ({ station }: { station: StationMarkerData }) => {
  const [L, setLeaflet] = useState<any>(null);
  const selectStation = useStationStore((state) => state.selectStation);
  const clearRouting = useRoutingStore((s) => s.clearRouting);
  const [loading, setLoading] = useState(false);

  const handleSelectStation = async (stationId: string) => {
    try {
      setLoading(true);
      const data = await getStationById(stationId);
      selectStation(data);
    } catch (err: any) {
      toast.error(err?.message || "Failed to fetch station");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    import("leaflet").then((leaflet) => {
      setLeaflet(leaflet);
    });
  }, []);

  const [markerLogo] = useState(() => getRandomMarkerLogo());

  if (!L) return null;

  const markerIcon = L.divIcon({
    className: "custom-marker",
    html: `
      <div class="marker-shell">
        <div class="marker-outer-ring">
          <div class="marker-inner-circle">
            <img class="marker-logo" src="${markerLogo.src}" alt="${markerLogo.alt}" />
          </div>
        </div>
      </div>
    `,
    iconSize: [52, 52],
    iconAnchor: [26, 26],
  });

  return (
    <Marker
      position={[station.coordinate.latitude, station.coordinate.longitude]}
      icon={markerIcon}
      eventHandlers={{
        click: () => {
          handleSelectStation(station.id);
          clearRouting();
        },
      }}
    />
  );
};

const SuggestionCenterMarker = () => {
  const isSuggestionPicking = useMapStore((state) => state.isSuggestionPicking);

  if (!isSuggestionPicking) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-[700] flex items-center justify-center">
      <div className="relative -translate-y-5 flex flex-col items-center">
        <div className="rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold text-gray-700 shadow-md border border-gray-200">
          Di chuyen ban do de chon vi tri
        </div>
        <div className="relative mt-2 h-10 w-10">
          <div className="absolute left-1/2 top-0 h-10 w-10 -translate-x-1/2 rounded-full border-4 border-white bg-red-500 shadow-xl" />
          <div className="absolute left-1/2 top-7 h-5 w-5 -translate-x-1/2 rotate-45 rounded-sm bg-red-500 shadow-lg" />
          <div className="absolute left-1/2 top-3 h-3 w-3 -translate-x-1/2 rounded-full bg-white" />
        </div>
      </div>
    </div>
  );
};

export default function Map() {
  console.log("Map render");
  const stationMarkerDatas = useStationStore((state) => state.stationMarkers);

  const coordinate = useUserStore((state) => state.user.coordinate);
  const isOpen = useRoutingStore((s) => s.isOpen);
  const location = useRoutingStore((s) => s.location);

  return (
    <MapContainer
      center={[10.814889, 106.697906]}
      zoom={10}
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
        </>
      )}

      <FlyTo />
      <MapCenterTracker />
      {stationMarkerDatas.map((station) => (
        <CustomMarker key={station.id} station={station} />
      ))}

      {coordinate && isOpen && (
        <RoutingMachine
          from={[coordinate.latitude, coordinate.longitude]}
          to={[location?.latitude || 0, location?.longitude || 0]}
        />
      )}
      <SuggestionCenterMarker />
    </MapContainer>
  );
}


