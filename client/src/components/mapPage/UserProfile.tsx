"use client";
import React, { useState, useRef, useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";
import { useStationStore } from "@/store/useStationStore";
import { useRoutingStore } from "@/store/useRoutingStore";
import { getStationById } from "@/services/stationService";
import { getUserDetails } from "@/services/userService";
import { ApiError } from "@/lib/apiClient";
import { useMapStore } from "@/store/useMapStore";
import { useAuthModalStore } from "@/store/useAuthModalStore";
import { FiLayout, FiLogIn } from "react-icons/fi";
import { useRouter } from "next/navigation";
import {
  IoMailOutline,
  IoFlash,
  IoLocationOutline,
  IoTrashOutline,
  IoPersonCircleOutline,
} from "react-icons/io5";
import { MdOutlineElectricalServices, MdLogout } from "react-icons/md";
import { StationMarkerData } from "@/type/station";

const UserProfile = () => {
  const { user, updateUser, deleteStation, clearUser } = useUserStore();
  const isLoggedIn = useUserStore((state) => state.user.isLogedin);
  const openLogin = useAuthModalStore((state) => state.openLogin);
  const router = useRouter();
  const isBusinessUser = user.role === "BUSINESS";

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const { selectStation, selectedStation, stationMarkers, setStationMarkers } =
    useStationStore();
  const { clearRouting } = useRoutingStore();
  const setFlyTo = useMapStore((s) => s.setFlyTo);
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

  useEffect(() => {
    const shouldFetchUserDetails =
      isLoggedIn && (!user.userName?.trim() || !user.email?.trim());

    if (!shouldFetchUserDetails) return;

    let isMounted = true;

    const hydrateUserDetails = async () => {
      try {
        const userDetail = await getUserDetails();

        if (!isMounted) return;

        updateUser({
          fullName: userDetail.fullName,
          email: userDetail.email,
          address: userDetail.address ?? "",
          savedStation: userDetail.savedStationList ?? [],
        });
      } catch (err) {
        const error = err as ApiError;
        console.error("Failed to load user details:", error.message);

        if (!isMounted) return;
        clearUser();
      }
    };

    hydrateUserDetails();

    return () => {
      isMounted = false;
    };
  }, [isLoggedIn, user.fullName, user.email, updateUser, clearUser]);

  const handleLogout = () => {
    setIsProfileOpen(false);
    clearUser();
    router.push("/");
  };

  const handleGoToDashboard = () => {
    setIsProfileOpen(false);
    router.push("/dashboard");
  };

  const handlePlugChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateUser({
      vehiclePlug: e.target.value as "Type 2" | "CCS2" | "Both",
    });
  };

  const handleSelectSavedStation = async (stationId: string) => {
    const station = await getStationById(stationId);
    if (station !== null) {
      selectStation(station);
      clearRouting();
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
    }
  };

  const handleDeleteStation = (event: React.MouseEvent, stationId: string) => {
    event.stopPropagation();
    deleteStation(stationId);
    if (stationId === selectedStation?.id) {
      selectStation(null);
      clearRouting();
    }
  };

  return (
    <div className="mr-2 ml-auto z-[1000]" ref={dropdownRef}>
      <button
        onClick={() => {
          if (!isLoggedIn) {
            openLogin();
          } else {
            setIsProfileOpen((prev) => !prev);
          }
        }}
        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all border-2 cursor-pointer
      ${
        isLoggedIn
          ? isProfileOpen
            ? "bg-green-600 border-white scale-110"
            : "bg-white border-green-500 text-green-600 hover:bg-green-50"
          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
      }`}
      >
        {isLoggedIn ? (
          <IoPersonCircleOutline
            size={26}
            className={isProfileOpen ? "text-white" : "text-green-600"}
          />
        ) : (
          <FiLogIn size={22} />
        )}
      </button>

      {isLoggedIn && isProfileOpen && (
        <div className="absolute top-14 right-2 w-80 bg-white shadow-2xl rounded-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-5 border-b border-gray-50 bg-gradient-to-r from-blue-50 to-transparent">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg text-green-600">
                <IoPersonCircleOutline size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 leading-tight">{user.fullName}</h3>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                  <IoMailOutline /> {user.email}
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 space-y-6">
            <section>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
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

            <section>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <IoLocationOutline className="text-red-500" /> Trạm yêu thích
              </label>

              {user.savedStation.length === 0 ? (
                <div className="text-center py-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-100">
                  <p className="text-xs text-gray-400 italic">Danh sách trống</p>
                </div>
              ) : (
                <ul className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {user.savedStation.map((station) => (
                    <li
                      key={station.id}
                      onClick={() => handleSelectSavedStation(station.id)}
                      className="flex items-center justify-between cursor-pointer text-sm bg-white border border-gray-100 rounded-xl p-3 hover:shadow-md hover:border-blue-100 transition-all group"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-400" />
                        <span className="font-medium text-gray-700">
                          {station.name}
                        </span>
                      </div>
                      <button
                        onClick={(event) => handleDeleteStation(event, station.id)}
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
            <div className="w-full space-y-2">
              {isBusinessUser && (
                <button
                  onClick={handleGoToDashboard}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-green-200 bg-white px-4 py-2 text-xs font-semibold text-green-700 uppercase tracking-tighter hover:bg-green-50 transition-colors"
                >
                  <FiLayout className="text-base" />
                  <span>Dashboard</span>
                </button>
              )}
              <button
                onClick={handleLogout}
                className="w-full flex flex-row gap-2 justify-center text-xs font-semibold text-green-600 hover:text-green-800 uppercase tracking-tighter"
              >
                <MdLogout className="text-xl" />
                <p className="my-auto">Đăng xuất</p>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
