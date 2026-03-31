import { useMap } from "react-leaflet";
import { useEffect } from "react";
import { useMapStore } from "@/store/useMapStore";

export const MapCenterTracker = () => {
  const map = useMap();
  const setCenter = useMapStore((s) => s.setCenter);

  useEffect(() => {
    const updateCenter = () => {
      const c = map.getCenter();

      setCenter({
        latitude: c.lat,
        longitude: c.lng,
      });
    };

    updateCenter(); // initial

    map.on("moveend", updateCenter);

    return () => {
      map.off("moveend", updateCenter);
    };
  }, [map]);

  return null;
};
