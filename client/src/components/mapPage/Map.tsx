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
import StationRouteLayer from "./StationRouteLayer";
import FlyTo from "@/components/mapPage/FlyTo";
import { MapCenterTracker } from "./MapCenterTracker";
import { StationMarkerData } from "@/type/station";
import {
  getEnterpriseLogos,
  getStationById,
  type EnterpriseLogo,
} from "@/services/stationService";
import { toast } from "react-toastify";
import { useMapStore } from "@/store/useMapStore";
import "maplibre-gl";
import "@maplibre/maplibre-gl-leaflet";
import "maplibre-gl/dist/maplibre-gl.css"; // <-- THÊM DÒNG NÀY
import { createLayerComponent } from "@react-leaflet/core";

type LeafletModule = typeof import("leaflet");

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const VectorTileLayer = createLayerComponent(
  (props: { url: string; attribution: string }, context) => {
    const layer = L.maplibreGL({
      style: props.url,
    });
    return { instance: layer, context };
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (layer: any, props, prevProps) => {
    if (props.url !== prevProps.url) {
      layer.getMaplibreMap().setStyle(props.url);
    }
  }
);

const LOGO_VARIANTS = {
  "Dat Bike": { src: "/CPOLogo/datbike.png", alt: "Dat Bike" },
  EBOOST: { src: "/CPOLogo/eboost.png", alt: "EBOOST" },
  "V-Green": { src: "/CPOLogo/vgreen.png", alt: "V-Green" },
} as const;

const DEFAULT_MARKER_LOGO = LOGO_VARIANTS["V-Green"];

const getMarkerLogoByManufacturer = (
  manufacturer: string,
  logoUrlMap: Record<string, string>,
) => {
  const dynamicLogoUrl = logoUrlMap[manufacturer];
  if (dynamicLogoUrl) {
    return {
      src: dynamicLogoUrl,
      alt: manufacturer,
    };
  }

  return (
    LOGO_VARIANTS[manufacturer as keyof typeof LOGO_VARIANTS] ??
    DEFAULT_MARKER_LOGO
  );
};

const CustomMarker = ({
  station,
  logoUrlMap,
}: {
  station: StationMarkerData;
  logoUrlMap: Record<string, string>;
}) => {
  const [leaflet, setLeaflet] = useState<LeafletModule | null>(null);
  const selectStation = useStationStore((state) => state.selectStation);
  const clearRouting = useRoutingStore((state) => state.clearRouting);
  const [loading, setLoading] = useState(false);

  const handleSelectStation = async (stationId: string) => {
    try {
      setLoading(true);
      const data = await getStationById(stationId);
      selectStation(data);
    } catch (err) {
      toast.error("Không có dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    import("leaflet").then((leaflet) => {
      setLeaflet(leaflet);
    });
  }, []);

  const markerLogo = getMarkerLogoByManufacturer(station.manufacturer, logoUrlMap);

  if (!leaflet) return null;

  const markerIcon = leaflet.divIcon({
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
      position={[station.position.latitude, station.position.longitude]}
      icon={markerIcon}
      eventHandlers={{
        click: () => {
          void handleSelectStation(station.id);
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
        <div className="rounded-full border border-gray-200 bg-white/95 px-3 py-1 text-[11px] font-semibold text-gray-700 shadow-md">
          Di chuyển bản đồ để chọn vị trí
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
  const stationMarkerDatas = useStationStore((state) => state.stationMarkers);
  const updateUser = useUserStore((state) => state.updateUser);
  const coordinate = useUserStore((state) => state.user.coordinate);
  const isOpen = useRoutingStore((state) => state.isOpen);
  const location = useRoutingStore((state) => state.location);
  const [logoUrlMap, setLogoUrlMap] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!navigator.geolocation) return;

    const syncCoordinate = (pos: GeolocationPosition) => {
      updateUser({
        coordinate: {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        },
      });
    };

    navigator.geolocation.getCurrentPosition(syncCoordinate, (error) => {
      console.error("Failed to get current location", error);
    });

    const watchId = navigator.geolocation.watchPosition(
      syncCoordinate,
      (error) => {
        console.error("Failed to watch current location", error);
      },
      { enableHighAccuracy: true },
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [updateUser]);

  useEffect(() => {
    const loadEnterpriseLogos = async () => {
      try {
        const logos = await getEnterpriseLogos();
        const nextLogoMap = logos.reduce<Record<string, string>>(
          (acc, item: EnterpriseLogo) => {
            const normalizedLogo = item.logoUrl?.trim();
            if (!normalizedLogo) return acc;
            acc[item.companyName] = normalizedLogo;
            return acc;
          },
          {},
        );
        setLogoUrlMap(nextLogoMap);
      } catch {
        // Keep fallback marker logos if public logo API fails.
      }
    };

    void loadEnterpriseLogos();
  }, []);

  return (
    <div className="relative h-screen w-full">
      <MapContainer
        center={[10.814889, 106.697906]}
        zoom={16}
        zoomControl={false}
        style={{ height: "100vh", width: "100%" }}
      >
        {/* <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url={`https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`}
        /> */}

        <VectorTileLayer
          attribution='&copy; <a href="https://www.maptiler.com/">MapTiler</a>'
          url={`https://api.maptiler.com/maps/019e4cec-4547-7b64-8228-f21b61a69d49/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`}
        />
        {coordinate && (
          <Marker position={[coordinate.latitude, coordinate.longitude]}>
            <Popup>Vị trí hiện tại của bạn</Popup>
          </Marker>
        )}

        <FlyTo />
        <MapCenterTracker />
        {stationMarkerDatas.map((station) => (
          <CustomMarker key={station.id} station={station} logoUrlMap={logoUrlMap} />
        ))}

        {/*
        {coordinate && isOpen && (
          <RoutingMachine
            from={[coordinate.latitude, coordinate.longitude]}
            to={[location?.latitude || 0, location?.longitude || 0]}
          />
        )}
        */}

        {coordinate && isOpen && location && (
          <StationRouteLayer origin={coordinate} destination={location} />
        )}
        <SuggestionCenterMarker />
      </MapContainer>
    </div>
  );
}

