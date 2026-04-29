"use client";

import { useUserStore } from "@/store/useUserStore";
import { useMapStore } from "@/store/useMapStore";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaLocationCrosshairs } from "react-icons/fa6";

export default function LocateMe() {
  const updateUser = useUserStore((s) => s.updateUser);
  const userLocation = useUserStore((state) => state.user.coordinate);
  const setFlyTo = useMapStore((s) => s.setFlyTo);

  const [loading, setLoading] = useState(false);

  const handleLocate = () => {
    if (!navigator.geolocation) return;

    setLoading(true);

    if (
      userLocation !== null &&
      userLocation.latitude * userLocation.longitude !== 0
    ) {
      setFlyTo(userLocation);
      setLoading(false);
      console.log("ucer location: ", userLocation);

      return;
    }
    console.log("start new nav");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };

        updateUser({ coordinate: loc });
        console.log("ucer location: ", loc);

        setFlyTo(loc);

        setLoading(false);
      },
      (err) => {
        console.error(err);
        setLoading(false);
      },
      { enableHighAccuracy: true },
    );
  };

  return (
    <button
      className="absolute  bottom-16 right-8 z-1000 w-12 h-12 rounded-xl cursor-pointer hover:border-green-500 hover:border-2 bg-white border-0"
      onClick={handleLocate}
    >
      {loading ? (
        <AiOutlineLoading3Quarters className="text-green-500 text-2xl animate-spin mx-auto" />
      ) : (
        <FaLocationCrosshairs className="text-green-500 text-2xl  mx-auto hover:text-green-600 cursor-pointer" />
      )}
    </button>
  );
}
