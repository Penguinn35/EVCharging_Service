"use client";
import dynamic from "next/dynamic";
import { getChargingStations } from "@/services/stationService";
import { useEffect } from "react";
import SearchBar from "@/components/searchBar";
import { Saira } from "next/font/google";
import Filter from "@/components/Filter";
import QuickSearch from "@/components/QuickSearch";
import { useStationStore } from "@/store/useStationStore";
import StationDetail from "@/components/StationDetail";

const sairaFont = Saira({
  subsets: ["vietnamese"],
  weight: "400",
});
const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

export default function HomePage() {
  const selectedStation = useStationStore((state) => state.selectedStation);
  const selectStation = useStationStore((state) => state.selectStation);
  const setRouteTo = useStationStore((state) => state.setRouteTo);
  const handleRouting = () => {
    if (!selectedStation) return;
    setRouteTo(selectedStation);
  };
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
        </div>
        {selectedStation && (
          <StationDetail
            station={selectedStation}
            onClose={() => selectStation(null)}
            handleRouting={() => handleRouting()}
          />
        )}
        <Map />
      </div>
    </>
  );
}
