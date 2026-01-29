"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import SearchBar from "@/components/searchBar";
import { Saira } from "next/font/google";
import Filter from "@/components/Filter";
import QuickSearch from "@/components/QuickSearch";
import { useStationStore } from "@/store/useStationStore";
import StationDetail from "@/components/StationDetail";
import { useUserStore } from "@/store/useUserStore";

const sairaFont = Saira({
  subsets: ["vietnamese"],
  weight: "400",
});
const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

export default function HomePage() {
  const [distance, setDistance] = useState<number | null>(null); // Updated type to number | null
  const selectedStation = useStationStore((state) => state.selectedStation);
  const selectStation = useStationStore((state) => state.selectStation);
  const { user } = useUserStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
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
          <div className="absolute top-4 right-4">
            <div
              className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center cursor-pointer"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              {user.name[0]}
            </div>
            {isProfileOpen && (
              <div className="absolute top-12 right-0 bg-white shadow-lg p-4 rounded-lg">
                <p>
                  <strong>Name:</strong> {user.name}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Plug Type:</strong> {user.vehiclePlug}
                </p>
                <button
                  className="mt-2 text-sm text-blue-500 underline"
                  onClick={() => setIsProfileOpen(false)}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>

        {selectedStation && (
          <StationDetail
            station={selectedStation}
            distance={distance || undefined} // Ensure distance is undefined if null
            onClose={() => selectStation(null)}
          />
        )}
        <Map />
      </div>
    </>
  );
}
