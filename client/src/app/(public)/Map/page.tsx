"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import SearchBar from "@/components/mapPage/searchBar";
import Filter from "@/components/mapPage/Filter";
import QuickSearch from "@/components/mapPage/QuickSearch";
import { useStationStore } from "@/store/useStationStore";
import { useRoutingStore } from "@/store/useRoutingStore";
import StationDetail from "@/components/mapPage/StationDetail";
import UserProfile from "@/components/mapPage/UserProfile";
import LocateMe from "@/components/mapPage/locateMe";
import QuickSuggest from "@/components/mapPage/QuickSuggest";
import StationSuggestionButton from "@/components/mapPage/StationSuggestionButton";
import Link from "next/link";

const Map = dynamic(() => import("@/components/mapPage/Map"), {
  ssr: false,
});

export default function Page() {
  const [distance, setDistance] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [mobileSheetMode, setMobileSheetMode] = useState<"expanded" | "collapsed">(
    "expanded",
  );
  const selectedStation = useStationStore((state) => state.selectedStation);
  const selectStation = useStationStore((state) => state.selectStation);
  const clearRouting = useRoutingStore((state) => state.clearRouting);
  const shouldShowFloatingButtons =
    !isMobile || !selectedStation || mobileSheetMode === "collapsed";
  const collapsedSheetHeight = Math.max(150, Math.floor(viewportHeight * 0.25));
  const floatingBaseBottom =
    isMobile && selectedStation && mobileSheetMode === "collapsed"
      ? collapsedSheetHeight + 15
      : null;
  const collapsedLocateStyle =
    floatingBaseBottom == null ? undefined : { bottom: `${floatingBaseBottom}px` };
  const collapsedQuickSuggestStyle =
    floatingBaseBottom == null
      ? undefined
      : { bottom: `${floatingBaseBottom + 56}px` };
  const collapsedSuggestionStyle =
    floatingBaseBottom == null
      ? undefined
      : { bottom: `${floatingBaseBottom + 112}px` };

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const media = window.matchMedia("(max-width: 767px)");
    const handleChange = () => {
      setIsMobile(media.matches);
      setViewportHeight(window.innerHeight);
    };

    handleChange();
    media.addEventListener("change", handleChange);
    window.addEventListener("resize", handleChange);

    return () => {
      media.removeEventListener("change", handleChange);
      window.removeEventListener("resize", handleChange);
    };
  }, []);

  return (
    <>
      <div className="relative">
        <div className="absolute top-4 left-0 w-full z-1000 flex flex-col items-center">
          <div className="w-full flex justify-start pl-4">
            <div className="mr-2 w-10 h-10 bg-white rounded-xl flex items-center justify-center hover:bg-green-100 hover:text-xl cursor-pointer">
              <Link href="/">
                <IoMdArrowRoundBack />
              </Link>
            </div>
            <SearchBar />
            <Filter />
          </div>
          <div className="mt-4">
            <QuickSearch />
          </div>
          <UserProfile />
        </div>
        {selectedStation && (
          <StationDetail
            station={selectedStation}
            distance={distance || undefined}
            onSheetModeChange={setMobileSheetMode}
            onClose={() => {
              selectStation(null);
              clearRouting();
              setMobileSheetMode("expanded");
            }}
          />
        )}
        {shouldShowFloatingButtons ? (
          <>
            <QuickSuggest style={collapsedQuickSuggestStyle} />
            <LocateMe style={collapsedLocateStyle} />
            <StationSuggestionButton style={collapsedSuggestionStyle} />
          </>
        ) : null}
        <Map />
      </div>
    </>
  );
}
