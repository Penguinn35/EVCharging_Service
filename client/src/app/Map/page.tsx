"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import SearchBar from "@/components/searchBar";
import { Saira } from "next/font/google";
import Filter from "@/components/Filter";
import QuickSearch from "@/components/QuickSearch";
import { useStationStore } from "@/store/useStationStore";
import { useRoutingStore } from "@/store/useRoutingStore";
import StationDetail from "@/components/StationDetail";
import UserProfile from "@/components/UserProfile";

const sairaFont = Saira({
  subsets: ["vietnamese"],
  weight: "400",
});
const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

export default function Page() {
  const [distance, setDistance] = useState<number | null>(null); // Updated type to number | null
  const selectedStation = useStationStore((state) => state.selectedStation);
  const selectStation = useStationStore((state) => state.selectStation);
  const clearRouting = useRoutingStore((state) => state.clearRouting);
  return (
    <>
      <div className={`relative ${sairaFont.className}`}>
        <div className="absolute top-4 left-0 w-full z-1000 flex flex-col items-center">
          <div className="w-full flex justify-start pl-4">
            <SearchBar />
            <Filter />
          </div>
          <div className="mt-4">
            <QuickSearch />
          </div>
          {/* User Profile */}
          <UserProfile />
        </div>

        {selectedStation && (
          <StationDetail
            station={selectedStation}
            distance={distance || undefined} // Ensure distance is undefined if null
            onClose={() => {
              selectStation(null);
              clearRouting();
            }}
          />
        )}
        <Map />
      </div>
    </>
  );
}
