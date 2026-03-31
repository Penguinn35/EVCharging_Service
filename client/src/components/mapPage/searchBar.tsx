import React from "react";
import { useSearch } from "@/hooks/useSearch";
import { AiOutlineClose } from "react-icons/ai";
import { searchStation, getStationById } from "@/services/stationService";

type SearchResult = {
  id: string;
  name: string;
  address: string;
};

// fetch function for useSearch
async function fetchSearchResults(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];
  const data = await searchStation(query);
  return data.slice(0, 5); // limit to 5 results
}

const SearchBar = () => {
  const { searchTerm, setSearchTerm, results, isSearching } = useSearch(
    fetchSearchResults,
    500, // debounce 500ms
  );

  const clearSearch = () => {
    setSearchTerm("");
  };

  const handleSelect = async (item: SearchResult) => {
    console.log("Selected:", item);
    const response = await getStationById(item.id);
    console.log("get station: ", response);
    clearSearch();
    
  };

  return (
    <div className="relative">
      <div className="relative cursor-alias">
        <input
          type="text"
          placeholder="Tìm kiếm trạc sạc theo tên, khu vực,..."
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

      {/* Loading */}
      {isSearching && (
        <p className="absolute top-12 left-0 text-gray-500">Searching...</p>
      )}

      {/* Results */}
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
