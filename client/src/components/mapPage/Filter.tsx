import React, { useEffect, useRef, useState } from "react";
import { BiFilterAlt } from "react-icons/bi";

import { useStationStore } from "@/store/useStationStore";

const TAT_CA = "Tất cả";
const HANG_OPTIONS = [TAT_CA, "V-Green", "Dat Bike", "EBOOST"];
const TRANG_THAI_OPTIONS = [TAT_CA, "Còn trống", "Hết chỗ"];
const LOAI_CONG_OPTIONS = [TAT_CA, "CCS 2", "Type 2"];

type FilterField = "status" | "operatorId" | "connectorType";
type FilterState = Record<FilterField, Set<string>>;

const createInitialFilters = (): FilterState => ({
  status: new Set([TAT_CA]),
  operatorId: new Set([TAT_CA]),
  connectorType: new Set([TAT_CA]),
});

const Filter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<FilterState>(
    createInitialFilters,
  );

  const setSelectedManufacturers = useStationStore(
    (state) => state.setSelectedManufacturers,
  );
  const filterRef = useRef<HTMLDivElement>(null);

  const toggleFilter = () => {
    setIsOpen((prev) => !prev);
  };

  const handleTagClick = (field: FilterField, value: string) => {
    setSelectedFilters((prev) => {
      const updatedSet = new Set(prev[field]);

      if (value === TAT_CA) {
        return { ...prev, [field]: new Set([TAT_CA]) };
      }

      updatedSet.delete(TAT_CA);

      if (updatedSet.has(value)) {
        updatedSet.delete(value);
      } else {
        updatedSet.add(value);
      }

      if (updatedSet.size === 0) {
        updatedSet.add(TAT_CA);
      }

      return { ...prev, [field]: updatedSet };
    });
  };

  const applyFilters = () => {
    const selectedManufacturers = selectedFilters.operatorId.has(TAT_CA)
      ? []
      : Array.from(selectedFilters.operatorId);

    setSelectedManufacturers(selectedManufacturers);
    setIsOpen(false);
  };

  const renderTags = (field: FilterField, options: string[]) => {
    return (
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <span
            key={option}
            className={`rounded-full border px-3 py-1 text-sm cursor-pointer ${
              selectedFilters[field].has(option)
                ? "border-green-600 bg-green-600 text-white"
                : "border-gray-300 bg-white text-gray-700"
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
        className="mx-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-white"
        onClick={toggleFilter}
      >
        <BiFilterAlt className="text-2xl text-green-600 hover:text-green-400" />
      </div>

      {isOpen && (
        <div className="absolute top-12 left-0 z-50 w-64 rounded-lg border border-gray-300 bg-white p-4 shadow-lg">
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Trạng thái
            </label>
            {renderTags("status", TRANG_THAI_OPTIONS)}
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Hãng
            </label>
            {renderTags("operatorId", HANG_OPTIONS)}
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Loại cổng
            </label>
            {renderTags("connectorType", LOAI_CONG_OPTIONS)}
          </div>

          <button
            className="w-full cursor-pointer rounded-lg bg-green-600 py-2 text-white hover:bg-green-500"
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
