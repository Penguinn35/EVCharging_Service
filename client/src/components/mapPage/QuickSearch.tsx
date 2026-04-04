import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { getStationNearBy } from "@/services/stationService";
import { useMapStore } from "@/store/useMapStore";
import { useStationStore } from "@/store/useStationStore";
import { StationMarkerData } from "@/type/station";
import { toast } from "react-toastify";

const QuickSearch = () => {
  const center = useMapStore((s) => s.center);
  const setStationMarkers = useStationStore((s) => s.setStationMarkers);

  const [loading, setLoading] = useState(false);

  const quickSearch = async () => {
    if (loading) return; // prevent spam click

    setLoading(true);
    try {
      const response = await getStationNearBy(center);

      const mapped: StationMarkerData[] = response.map((item: any) => ({
        id: item.id,
        name: item.name,
        manufacturer: item.id.slice(-2),
        coordinate: {
          latitude: item.position.latitude,
          longitude: item.position.longitude,
        },
        status: item.status,
      }));

      setStationMarkers(mapped);

      if (mapped.length === 0) {
        toast.info("No stations found nearby");
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        toast.error("Cannot find any nearby stations");
        setStationMarkers([]);
      } else {
        toast.error("Something went wrong while fetching stations");
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={quickSearch}
      className="bg-white py-1 px-3 rounded-xl flex flex-row items-center shadow-md/30 cursor-pointer hover:bg-stone-100"
    >
      {loading ? (
  <AiOutlineLoading3Quarters className="mr-2 text-green-600 animate-spin" />
) : (
  <FaSearch className="mr-2 text-green-600" />
)}
      <p>Tìm nhanh khu vực này</p>{" "}
    </div>
  );
};

export default QuickSearch;
