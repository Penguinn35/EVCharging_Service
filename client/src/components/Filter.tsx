import React, { useState, useRef, useEffect } from "react";
import { BiFilterAlt } from "react-icons/bi";

const Filter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    status: new Set<string>(),
    operatorId: new Set<string>(),
    connectorType: new Set<string>(),
  });

  const filterRef = useRef<HTMLDivElement>(null);

  const toggleFilter = () => {
    setIsOpen(!isOpen);
  };

  const handleTagClick = (
    field: "status" | "operatorId" | "connectorType",
    value: string
  ) => {
    setSelectedFilters((prev) => {
      const updatedSet = new Set(prev[field]);
      if (value === "All") {
        updatedSet.clear();
        updatedSet.add("All");
      } else {
        if (updatedSet.has("All")) {
          updatedSet.delete("All");
        }
        if (updatedSet.has(value)) {
          updatedSet.delete(value);
        } else {
          updatedSet.add(value);
        }
      }
      return { ...prev, [field]: updatedSet };
    });
  };

  const applyFilters = () => {
    console.log("Applied Filters:", {
      status: Array.from(selectedFilters.status),
      operatorId: Array.from(selectedFilters.operatorId),
      connectorType: Array.from(selectedFilters.connectorType),
    });
  };

  const statuses = ["All", "Full", "Busy", "Good"];
  const operatorIds = ["All", "Operator 1", "Operator 2", "Operator 3"];
  const connectorTypes = ["All", "Type 1", "Type 2", "CCS", "CHAdeMO"];

  const renderTags = (
    field: "status" | "operatorId" | "connectorType",
    options: string[]
  ) => {
    return (
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <span
            key={option}
            className={`px-3 py-1 rounded-full cursor-pointer text-sm border ${
              selectedFilters[field].has(option)
                ? "bg-green-600 text-white border-green-600"
                : "bg-white text-gray-700 border-gray-300"
            }`}
            onClick={() => handleTagClick(field, option)}
          >
            {option}
          </span>
        ))}
      </div>
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={filterRef}>
      <div
        className="bg-white w-10 h-10 flex items-center justify-center rounded-xl mx-2 cursor-pointer"
        onClick={toggleFilter}
      >
        <BiFilterAlt className="text-2xl text-green-600 hover:text-green-400" />
      </div>

      {isOpen && (
        <div className="absolute top-12 left-0 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-50 w-64">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái
            </label>
            {renderTags("status", statuses)}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hãng
            </label>
            {renderTags("operatorId", operatorIds)}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loại cổng
            </label>
            {renderTags("connectorType", connectorTypes)}
          </div>

          <button
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-500  cursor-pointer"
            onClick={applyFilters}
          >
            Áp dụng
          </button>
        </div>
      )}
    </div>
  );
};

export default Filter;
