"use client";

import { useUserStore } from "@/store/useUserStore";
import { useMapStore } from "@/store/useMapStore";
import { useState } from "react";

export default function LocateMe() {
  const updateUser = useUserStore((s) => s.updateUser);
  const setFlyTo = useMapStore((s) => s.setFlyTo);

  const [loading, setLoading] = useState(false);

  const handleLocate = () => {
    if (!navigator.geolocation) return;

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };

        updateUser({ coordinate: loc });
        setFlyTo(loc);

        setLoading(false);
      },
      (err) => {
        console.error(err);
        setLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <button
      className="absolute bottom-16 right-8 z-1000 w-12 h-12 rounded-xl cursor-pointer hover:border-green-500 hover:border-2 bg-white border-0"
      onClick={handleLocate}
    >
      {loading ? "..." : "📍"}
    </button>
  );
}