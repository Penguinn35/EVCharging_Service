"use client";
import React, { useState, useRef, useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";
import { useStationStore } from "@/store/useStationStore";
import { useRoutingStore } from "@/store/useRoutingStore";
import { getStationById } from "@/services/stationService";
import {
  createUserSuggestion,
  getUserDetails,
  reverseGeocodeWithGraphHopper,
} from "@/services/userService";
import { ApiError } from "@/lib/apiClient";
import { useMapStore } from "@/store/useMapStore";
import { Modal } from "@/components/Modal";
import { useAuthModalStore } from "@/store/useAuthModalStore";
import { FiLogIn } from "react-icons/fi";
import {
  IoMailOutline,
  IoFlash,
  IoLocationOutline,
  IoTrashOutline,
  IoPersonCircleOutline,
  IoPaperPlaneOutline,
  IoCloseOutline,
  IoCheckmarkCircleOutline,
} from "react-icons/io5";
import { MdOutlineElectricalServices, MdLogout } from "react-icons/md";
import { StationMarkerData } from "@/type/station";
import { toast } from "react-toastify";
import { Coordinate } from "@/type/share";

type SuggestionStep = "idle" | "pick-location" | "write-description";

const UserProfile = () => {
  const { user, updateUser, deleteStation, clearUser } = useUserStore();
  const isLoggedIn = useUserStore((state) => state.user.isLogedin);
  const openLogin = useAuthModalStore((state) => state.openLogin);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [suggestionStep, setSuggestionStep] = useState<SuggestionStep>("idle");
  const [suggestionDescription, setSuggestionDescription] = useState("");
  const [confirmedLocation, setConfirmedLocation] = useState<Coordinate | null>(null);
  const [confirmedAddress, setConfirmedAddress] = useState<string | null>(null);
  const [currentAddress, setCurrentAddress] = useState<string | null>(null);
  const [isResolvingAddress, setIsResolvingAddress] = useState(false);
  const [isSubmittingSuggestion, setIsSubmittingSuggestion] = useState(false);

  const { selectStation, selectedStation, stationMarkers, setStationMarkers } =
    useStationStore();
  const { clearRouting } = useRoutingStore();
  const setFlyTo = useMapStore((s) => s.setFlyTo);
  const mapCenter = useMapStore((s) => s.center);
  const setIsSuggestionPicking = useMapStore((s) => s.setIsSuggestionPicking);
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
      isLoggedIn && (!user.name?.trim() || !user.email?.trim());

    if (!shouldFetchUserDetails) return;

    let isMounted = true;

    const hydrateUserDetails = async () => {
      try {
        const userDetail = await getUserDetails();

        if (!isMounted) return;

        updateUser({
          name: userDetail.fullName,
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
  }, [isLoggedIn, user.name, user.email, updateUser, clearUser]);

  useEffect(() => {
    if (!isLoggedIn) {
      setIsSuggestionPicking(false);
      setSuggestionStep("idle");
      setConfirmedLocation(null);
      setConfirmedAddress(null);
      setCurrentAddress(null);
      setSuggestionDescription("");
    }
  }, [isLoggedIn, setIsSuggestionPicking]);

  useEffect(() => {
    if (suggestionStep !== "pick-location") return;

    const latitude = mapCenter.latitude;
    const longitude = mapCenter.longitude;

    if (!latitude && !longitude) {
      setCurrentAddress(null);
      return;
    }

    let isCancelled = false;
    setIsResolvingAddress(true);

    const timer = setTimeout(async () => {
      try {
        const result = await reverseGeocodeWithGraphHopper({ latitude, longitude });

        if (isCancelled) return;

        setCurrentAddress(result?.label ?? null);
      } catch (error) {
        if (isCancelled) return;

        console.error("Failed to reverse geocode location:", error);
        setCurrentAddress(null);
      } finally {
        if (!isCancelled) {
          setIsResolvingAddress(false);
        }
      }
    }, 500);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
      setIsResolvingAddress(false);
    };
  }, [suggestionStep, mapCenter.latitude, mapCenter.longitude]);

  const resetSuggestionFlow = () => {
    setSuggestionStep("idle");
    setSuggestionDescription("");
    setConfirmedLocation(null);
    setConfirmedAddress(null);
    setCurrentAddress(null);
    setIsSuggestionPicking(false);
  };

  const handleLogout = () => {
    setIsProfileOpen(false);
    resetSuggestionFlow();
    clearUser();
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

  const handleStartSuggestion = () => {
    setSuggestionStep("pick-location");
    setSuggestionDescription("");
    setConfirmedLocation(null);
    setConfirmedAddress(null);
    setCurrentAddress(null);
    setIsSuggestionPicking(true);
    setIsProfileOpen(false);
  };

  const handleConfirmLocation = () => {
    if (!mapCenter.latitude && !mapCenter.longitude) {
      toast.error("Khong lay duoc vi tri tu ban do");
      return;
    }

    setConfirmedLocation({
      latitude: mapCenter.latitude,
      longitude: mapCenter.longitude,
    });
    setConfirmedAddress(currentAddress);
    setSuggestionStep("write-description");
    setIsSuggestionPicking(false);
  };

  const handleCancelSuggestion = () => {
    resetSuggestionFlow();
  };

  const handleSubmitSuggestion = async () => {
    const description = suggestionDescription.trim();

    if (!description) {
      toast.error("Vui long nhap mo ta cho vi tri de xuat");
      return;
    }

    if (!confirmedLocation) {
      toast.error("Vui long xac nhan dia diem truoc khi gui");
      return;
    }

    try {
      setIsSubmittingSuggestion(true);
      await createUserSuggestion({
        location: confirmedLocation,
        description,
      });

      resetSuggestionFlow();
      toast.success("Gui goi y thanh cong. Cam on ban da dong gop!");
    } catch (err) {
      const error = err as ApiError;
      toast.error(error.message || "Khong the gui goi y luc nay");
    } finally {
      setIsSubmittingSuggestion(false);
    }
  };

  const locationPreview = `${mapCenter.latitude.toFixed(6)}, ${mapCenter.longitude.toFixed(6)}`;
  const confirmedLocationPreview = confirmedLocation
    ? `${confirmedLocation.latitude.toFixed(6)}, ${confirmedLocation.longitude.toFixed(6)}`
    : "";

  return (
    <>
      <div className="absolute top-4 right-4 z-[1000]" ref={dropdownRef}>
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
          <div className="absolute top-14 right-0 w-80 bg-white shadow-2xl rounded-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
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
              <section>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <IoFlash className="text-yellow-500" /> Cau hinh sac
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
                  <IoLocationOutline className="text-red-500" /> Goi y tram sac
                </label>
                <button
                  onClick={handleStartSuggestion}
                  className="w-full rounded-xl border border-dashed border-green-300 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 transition-colors hover:bg-green-100 flex items-center justify-center gap-2"
                >
                  <IoLocationOutline size={18} />
                  Bat dau goi y vi tri moi
                </button>
              </section>

              <section>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <IoLocationOutline className="text-red-500" /> Tram yeu thich
                </label>

                {user.savedStation.length === 0 ? (
                  <div className="text-center py-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-100">
                    <p className="text-xs text-gray-400 italic">Danh sach trong</p>
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
                            Tram #{station.name}
                          </span>
                        </div>
                        <button
                          onClick={(event) => handleDeleteStation(event, station.id)}
                          className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Go bo"
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
                onClick={handleLogout}
                className="flex flex-row gap-2 justify-center text-xs font-semibold text-green-600 hover:text-green-800 uppercase tracking-tighter"
              >
                <MdLogout className="text-xl" />
                <p className="my-auto">Dang xuat</p>
              </button>
            </div>
          </div>
        )}
      </div>

      {isLoggedIn && suggestionStep === "pick-location" && (
        <div className="absolute inset-x-0 top-4 z-[1100] flex justify-center px-4 pointer-events-none">
          <div className="pointer-events-auto w-full max-w-md rounded-2xl border border-gray-200 bg-white/95 p-4 shadow-2xl backdrop-blur-sm">
            <p className="text-sm font-semibold text-gray-800">Chon vi tri de goi y</p>
            <p className="mt-1 text-xs text-gray-500">
              Di chuyen ban do, marker giua man hinh se la diem duoc chon.
            </p>
            <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600 space-y-2">
              <p>Toa do dang chon: {locationPreview}</p>
              <p>
                Dia chi: {isResolvingAddress ? "Dang tim dia chi..." : currentAddress ?? "Chua lay duoc dia chi, se dung toa do"}
              </p>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={handleConfirmLocation}
                className="flex-1 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700 flex items-center justify-center gap-2"
              >
                <IoCheckmarkCircleOutline size={18} />
                Xac nhan vi tri
              </button>
              <button
                onClick={handleCancelSuggestion}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 flex items-center justify-center gap-2"
              >
                <IoCloseOutline size={18} />
                Huy
              </button>
            </div>
          </div>
        </div>
      )}

      <Modal
        open={isLoggedIn && suggestionStep === "write-description"}
        onClose={handleCancelSuggestion}
      >
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Mo ta diem de xuat</h3>
              <p className="mt-1 text-sm text-gray-500">
                Them mo ta ngan de doi ngu de danh gia nhu cau mo tram sac.
              </p>
            </div>
            <button
              onClick={handleCancelSuggestion}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <IoCloseOutline size={20} />
            </button>
          </div>

          <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600 space-y-2">
            <p>Toa do da chon: {confirmedLocationPreview}</p>
            <p>Dia chi: {confirmedAddress ?? "Chua lay duoc dia chi, se gui kem toa do"}</p>
          </div>

          <textarea
            value={suggestionDescription}
            onChange={(event) => setSuggestionDescription(event.target.value)}
            rows={4}
            placeholder="Vi du: khu vuc nay dong xe dien nhung chua co tram sac gan"
            className="mt-4 w-full resize-none rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-green-500"
          />

          <div className="mt-4 flex gap-2">
            <button
              onClick={handleCancelSuggestion}
              disabled={isSubmittingSuggestion}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed"
            >
              Huy
            </button>
            <button
              onClick={handleSubmitSuggestion}
              disabled={isSubmittingSuggestion}
              className="flex-1 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300 flex items-center justify-center gap-2"
            >
              <IoPaperPlaneOutline size={16} />
              {isSubmittingSuggestion ? "Dang gui..." : "Gui goi y"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default UserProfile;
