"use client";
import React, { useState, useRef, useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";
import { useStationStore } from "@/store/useStationStore";
import { useRoutingStore } from "@/store/useRoutingStore";
import { getStationById } from "@/services/stationService";
import { useMapStore } from "@/store/useMapStore";
import FlyTo from "@/app/(public)/Map/FlyTo";
// React Icons imports
import {
  IoClose,
  IoMailOutline,
  IoFlash,
  IoLocationOutline,
  IoTrashOutline,
  IoPersonCircleOutline,
} from "react-icons/io5";
import { MdOutlineElectricalServices, MdLogout } from "react-icons/md";

const UserProfile = () => {
  const { user, setUser, deleteStation } = useUserStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { selectStation, selectedStation } = useStationStore();
  const { clearRouting } = useRoutingStore();
  const setFlyTo = useMapStore((s) => s.setFlyTo);
  // Ref to handle clicking outside to close
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePlugChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUser({
      ...user,
      vehiclePlug: e.target.value as "Type 2" | "CCS2" | "Both",
    });
  };
  const handleSelectSavedStation = async (stationId: number) => {
    const station = await getStationById(stationId);
    if (station !== null) {
      selectStation(station);
      setFlyTo(station.coordinate);
      
    }
  };

  const handleDeleteStation = (stationId: number) => {
    deleteStation(stationId);
    if (stationId === selectedStation?.id) {
      selectStation(null);
      clearRouting();
    }
  };

  return (
    <div className="absolute top-4 right-4 z-[1000]" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsProfileOpen((prev) => !prev)}
        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all border-2 cursor-pointer
          ${isProfileOpen ? "bg-green-600 border-white scale-110" : "bg-white border-green-500 text-green-600 hover:bg-green-50"}`}
      >
        {isProfileOpen ? (
          <IoClose size={24} className="text-white" />
        ) : (
          <span className="text-lg font-bold uppercase ">
            {user.name.charAt(0)}
          </span>
        )}
      </button>

      {/* Profile Card */}
      {isProfileOpen && (
        <div className="absolute top-14 right-0 w-80 bg-white shadow-2xl rounded-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="p-5 border-b border-gray-50 bg-gradient-to-r from-blue-50 to-transparent">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg text-green-600">
                <IoPersonCircleOutline size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 leading-tight">
                  {user.name}
                </h3>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                  <IoMailOutline /> {user.email}
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 space-y-6">
            {/* Plug Type Selector */}
            <section>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3  flex items-center gap-2">
                <IoFlash className="text-yellow-500" /> Cấu hình sạc
              </label>
              <div className="relative">
                <select
                  value={user.vehiclePlug}
                  onChange={handlePlugChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm appearance-none focus:ring-2 focus:ring-green-500 outline-none cursor-pointer transition-all"
                >
                  <option value="Type 2">Type 2 (AC)</option>
                  <option value="CCS2">CCS2 (DC Fast)</option>
                  <option value="Both">Combo (Type 2 + CCS2)</option>
                </select>
                <div className="absolute right-3 top-3 pointer-events-none text-gray-400">
                  <MdOutlineElectricalServices size={18} />
                </div>
              </div>
            </section>

            {/* Saved Stations */}
            <section>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3  flex items-center gap-2">
                <IoLocationOutline className="text-red-500" /> Trạm yêu thích
              </label>

              {user.savedStation.length === 0 ? (
                <div className="text-center py-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-100">
                  <p className="text-xs text-gray-400 italic">
                    Danh sách trống
                  </p>
                </div>
              ) : (
                <ul className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {user.savedStation.map((station) => (
                    <li
                      key={station}
                      onClick={() => handleSelectSavedStation(station)}
                      className="flex items-center justify-between cursor-pointer text-sm bg-white border border-gray-100 rounded-xl p-3 hover:shadow-md hover:border-blue-100 transition-all group"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-400" />
                        <span className="font-medium text-gray-700">
                          Trạm #{station}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteStation(station)}
                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Gỡ bỏ"
                      >
                        <IoTrashOutline size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-center">
            <button
              onClick={() => setIsProfileOpen(false)}
              className="flex flex-row gap-2  justify-center text-xs font-semibold text-green-600 hover:text-green-800 uppercase tracking-tighter"
            >
              <MdLogout className=" text-xl" />
              <p className="my-auto">Đăng xuất</p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
