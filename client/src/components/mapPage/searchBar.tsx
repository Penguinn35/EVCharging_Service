import React from "react";
import { useSearch } from "@/hooks/useSearch";
import { AiOutlineClose } from "react-icons/ai";
import { searchStation, getStationById } from "@/services/stationService";
import { useStationStore } from "@/store/useStationStore";
import { useMapStore } from "@/store/useMapStore";
import { StationMarkerData } from "@/type/station";
import { toast } from "react-toastify";

type SearchResult = {
  id: string;
  name: string;
  address: string;
};

async function fetchSearchResults(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];
  const data = await searchStation(query);
  return data.slice(0, 5);
}

const SearchBar = () => {
  const selectStation = useStationStore((state) => state.selectStation);
  const stationMarkers = useStationStore((state) => state.stationMarkers);
  const setStationMarkers = useStationStore((state) => state.setStationMarkers);
  const setFlyTo = useMapStore((state) => state.setFlyTo);

  const { searchTerm, setSearchTerm, results, isSearching } = useSearch(
    fetchSearchResults,
    500,
  );

  const clearSearch = () => {
    setSearchTerm("");
  };

  const handleSelect = async (item: SearchResult) => {
    try {
      const station = await getStationById(item.id);

      selectStation(station);
      setFlyTo(station.position);

      const marker: StationMarkerData = {
        id: station.id,
        name: station.name,
        manufacturer: station.manufacturer,
        position: station.position,
        status: String(station.status),
      };

      const hasMarker = stationMarkers.some(
        (stationMarker) => stationMarker.id === marker.id,
      );

      if (!hasMarker) {
        setStationMarkers([...stationMarkers, marker]);
      }

      clearSearch();
    } catch (error) {
      console.error(error);
      toast.error("Không lấy được thông tin trạm");
    }
  };

  return (
    <div className="relative">
      <div className="relative cursor-alias">
        <input
          type="text"
          placeholder="Tìm trạm theo tên, địa chỉ,..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-white rounded-xl focus:outline-0 h-10 sm:w-xs px-4 py-3 border border-green-600 pr-10 w-full"
        />

        {searchTerm && (
          <AiOutlineClose
            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer hover:text-gray-700"
            onClick={clearSearch}
          />
        )}
      </div>

      {isSearching && (
        <p className="absolute top-12 left-0 text-gray-500">Searching...</p>
      )}

      {results && results.length > 0 && (
        <ul className="absolute top-12 left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50">
          {results.map((result) => (
            <li
              key={result.id}
              onClick={() => handleSelect(result)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              <p className="font-semibold text-sm text-gray-900">
                {result.name}
              </p>
              <p className="text-xs text-gray-500">{result.address}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
