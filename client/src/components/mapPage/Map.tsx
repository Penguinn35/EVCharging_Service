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
// delete (L.Icon.Default.prototype as any)._getIconUrl; ???

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// const CustomMarker = ({ station }: { station: StationMarkerData }) => {
//   const [L, setLeaflet] = useState<any>(null);
//   const selectStation = useStationStore((state) => state.selectStation);
//   // const { clearRouting } = useRoutingStore();
//   const clearRouting = useRoutingStore((s) => s.clearRouting);

//   useEffect(() => {
//     import("leaflet").then((leaflet) => {
//       setLeaflet(leaflet);
//     });
//   }, []);

//   if (!L) {
//     return null;
//   }

//   const markerIcon = L.divIcon({
//     className: "custom-marker",
//     html: `
//       <div class="pin status-${station.status}">
//         <div class="pin-inner">
//           <span class="brand">${station.id}</span>
//         </div>
//       </div>
//     `,
//     iconSize: [42, 48],
//     iconAnchor: [21, 48],
//   });
//   return (
//     <Marker
//       position={[station.coordinate.latitude, station.coordinate.longitude]}
//       icon={markerIcon}
//       eventHandlers={{
//         click: () => {
//           selectStation(station);
//           clearRouting();
//         },
//       }}
//     ></Marker>
//   );
// };

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

  if (!L) return null;

  // 👇 random status
  const statuses = ["available", "busy", "full"] as const;
  const status = statuses[Math.floor(Math.random() * statuses.length)];

  // 👇 last 4 chars of id
  const shortId = station.id.slice(-4);

  const markerIcon = L.divIcon({
    className: "custom-marker",
    html: `
      <div class="pin status-${status}">
        <div class="pin-inner">
          <span class="brand">${shortId}</span>
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
          handleSelectStation(station.id);
          clearRouting();
        },
      }}
    />
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
    </MapContainer>
  );
}
