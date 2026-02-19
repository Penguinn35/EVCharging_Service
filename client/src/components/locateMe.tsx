"use client";

import { useUserStore } from "@/store/useUserStore";
import { useMapStore } from "@/store/useMapStore";
import { useState } from "react";

export default function LocateMe() {
  const coordinate = useUserStore((s) => s.user.coordinate);
  const setLocation = useUserStore((s) => s.setLocation);
  const setFlyTo = useMapStore((s) => s.setFlyTo);

  const [loading, setLoading] = useState(false);

  const handleLocate = () => {
    // already known → trigger fly
    if (coordinate) {
      setFlyTo(coordinate);
      return;
    }

    if (!navigator.geolocation) return;

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };

        setLocation(loc);
        setFlyTo(loc); // ← this triggers <FlyTo />

        setLoading(false);
      },
      () => setLoading(false),
      { enableHighAccuracy: true }
    );
  };

  return (
    <button className=" absolute bottom-16 right-8 z-1000 w-12 h-12 rounded-xl  cursor-pointer hover:border-green-500 hover:border-2   bg-white border-0 " onClick={handleLocate}>
      {loading ? "..." : "📍"}
    </button>
  );
}
