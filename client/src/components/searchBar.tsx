import React from "react";
import { useSearch } from "@/hooks/useSearch";
import { AiOutlineClose } from "react-icons/ai"; // Import the clear icon

async function fetchSearchResults(query: string) {
  // Simulate an API call
  return new Promise<string[]>((resolve) => {
    setTimeout(() => {
      resolve([
        `Result for "${query}" 1`,
        `Result for "${query}" 2`,
        `Result for "${query}" 3`,
      ]);
    }, 500);
  });
}

const SearchBar = () => {
  const { searchTerm, setSearchTerm, results, isSearching } = useSearch(
    fetchSearchResults,
    500
  );

  const clearSearch = () => {
    setSearchTerm(""); // Clear the input value
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          placeholder="Tìm kiếm trạc sạc theo tên, khu vực,..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-white rounded-xl focus:outline-0 h-10 sm:w-xs px-4 py-3 border border-green-600 pr-10"
        />
        {/* Clear Icon */}
        {searchTerm && (
          <AiOutlineClose
            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer hover:text-gray-700"
            onClick={clearSearch}
          />
        )}
      </div>

      {/* Dropdown for search results */}
      {isSearching && <p className="absolute top-12 left-0 text-gray-500">Searching...</p>}
      {results && results.length > 0 && (
        <ul className="absolute top-12 left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50">
          {results.map((result, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {result}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
