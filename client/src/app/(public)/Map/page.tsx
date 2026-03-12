"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import SearchBar from "@/components/searchBar";
import Filter from "@/components/Filter";
import QuickSearch from "@/components/QuickSearch";
import { useStationStore } from "@/store/useStationStore";
import { useRoutingStore } from "@/store/useRoutingStore";
import StationDetail from "@/components/StationDetail";
import UserProfile from "@/components/UserProfile";
import LocateMe from "@/components/locateMe";



const Map = dynamic(() => import("@/components/Map"), {
  ssr: false, 
});

export default function Page() {
  const [distance, setDistance] = useState<number | null>(null); 
  const selectedStation = useStationStore((state) => state.selectedStation);
  const selectStation = useStationStore((state) => state.selectStation);
  const clearRouting = useRoutingStore((state) => state.clearRouting);
  return (
    <>
      <div className={`relative `}>
        <div className="absolute top-4 left-0 w-full z-1000 flex flex-col items-center">
          <div className="w-full flex justify-start pl-4">
            <div className=" mr-2 w-10 h-10 bg-white rounded-xl flex items-center justify-center hover:bg-green-100 hover:text-xl cursor-pointer ">
              <IoMdArrowRoundBack/>
            </div>
            <SearchBar />
            <Filter />
          </div>
          <div className="mt-4">
            <QuickSearch />
          </div>
          <UserProfile />
        </div>
          <LocateMe />

        {selectedStation && (
          <StationDetail
            station={selectedStation}
            distance={distance || undefined}
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
