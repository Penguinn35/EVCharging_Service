import React from "react";
import { FaSearch } from "react-icons/fa";
import { getStationNearBy } from "@/services/stationService";
import { useMapStore } from "@/store/useMapStore";
const QuickSearch = () => {
  const center = useMapStore((s) => s.center);

  const quickSearch = async () => {
    const response = await getStationNearBy(center);
    console.log("station fetch: ", response);
    // console.log("center: ", center);
    
  };
  return (
    <div
      onClick={quickSearch}
      className="bg-white py-1 px-3 rounded-xl flex flex-row items-center shadow-md/30 cursor-pointer hover:bg-stone-100"
    >
      <FaSearch className="mr-2 text-green-600" />
      <p>Tìm nhanh khu vực này</p>
    </div>
  );
};

export default QuickSearch;
