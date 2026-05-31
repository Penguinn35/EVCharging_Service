"use client";

import { Modal } from "@/components/Modal";
import { ApiError } from "@/lib/apiClient";
import {
  createUserSuggestion,
  reverseGeocodeWithGraphHopper,
} from "@/services/userService";
import { useAuthModalStore } from "@/store/useAuthModalStore";
import { useMapStore } from "@/store/useMapStore";
import { useUserStore } from "@/store/useUserStore";
import { Coordinate } from "@/type/share";
import { useEffect, useState } from "react";
import {
  IoCheckmarkCircleOutline,
  IoCloseOutline,
  IoPaperPlaneOutline,
} from "react-icons/io5";
import { MdAddLocationAlt } from "react-icons/md";
import { toast } from "react-toastify";

type SuggestionStep = "idle" | "pick-location" | "write-description";

export default function StationSuggestionButton() {
  const isLoggedIn = useUserStore((state) => state.user.isLogedin);
  const openLogin = useAuthModalStore((state) => state.openLogin);
  const mapCenter = useMapStore((state) => state.center);
  const setIsSuggestionPicking = useMapStore(
    (state) => state.setIsSuggestionPicking,
  );

  const [suggestionStep, setSuggestionStep] = useState<SuggestionStep>("idle");
  const [suggestionDescription, setSuggestionDescription] = useState("");
  const [confirmedLocation, setConfirmedLocation] = useState<Coordinate | null>(
    null,
  );
  const [confirmedAddress, setConfirmedAddress] = useState<string | null>(null);
  const [currentAddress, setCurrentAddress] = useState<string | null>(null);
  const [isResolvingAddress, setIsResolvingAddress] = useState(false);
  const [isSubmittingSuggestion, setIsSubmittingSuggestion] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      setIsSuggestionPicking(false);
      setSuggestionStep("idle");
      setSuggestionDescription("");
      setConfirmedLocation(null);
      setConfirmedAddress(null);
      setCurrentAddress(null);
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

  const handleStartSuggestion = () => {
    if (!isLoggedIn) {
      openLogin();
      return;
    }

    setSuggestionStep("pick-location");
    setSuggestionDescription("");
    setConfirmedLocation(null);
    setConfirmedAddress(null);
    setCurrentAddress(null);
    setIsSuggestionPicking(true);
  };

  const handleConfirmLocation = () => {
    if (!mapCenter.latitude && !mapCenter.longitude) {
      toast.error("Không lấy được vị trí từ bản đồ");
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
      toast.error("Vui lòng nhập mô tả cho vị trí đề xuất");
      return;
    }

    if (!confirmedLocation) {
      toast.error("Vui lòng xác nhận địa điểm trước khi gửi");
      return;
    }

    try {
      setIsSubmittingSuggestion(true);
      await createUserSuggestion({
        location: confirmedLocation,
        description,
      });

      resetSuggestionFlow();
      toast.success("Gửi gợi ý thành công. Cảm ơn bạn đã đóng góp!");
    } catch (err) {
      const error = err as ApiError;
      toast.error(error.message || "Không thể gửi gợi ý lúc này");
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
      <button
        onClick={handleStartSuggestion}
        className="absolute bottom-44 right-8 z-[1000] flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl bg-white text-green-600 shadow-lg transition-all hover:border-2 hover:border-green-500 hover:bg-green-50"
        title="Gợi ý vị trí trạm sạc mới"
      >
        <MdAddLocationAlt size={22} />
      </button>

      {isLoggedIn && suggestionStep === "pick-location" && (
        <div className="absolute inset-x-0 top-4 z-[1100] flex justify-center px-4 pointer-events-none">
          <div className="pointer-events-auto w-full max-w-md rounded-2xl border border-gray-200 bg-white/95 p-4 shadow-2xl backdrop-blur-sm">
            <p className="text-sm font-semibold text-gray-800">Chọn vị trí để gợi ý</p>
            <p className="mt-1 text-xs text-gray-500">
              Di chuyển bản đồ, marker giữa màn hình sẽ là điểm được chọn.
            </p>
            <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600 space-y-2">
              <p>Tọa độ đang chọn: {locationPreview}</p>
              <p>
                Địa chỉ: {isResolvingAddress ? "Đang tìm địa chỉ..." : currentAddress ?? "Chưa lấy được địa chỉ, sẽ dùng tọa độ"}
              </p>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={handleConfirmLocation}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700"
              >
                <IoCheckmarkCircleOutline size={18} />
                Xác nhận vị trí
              </button>
              <button
                onClick={handleCancelSuggestion}
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
              >
                <IoCloseOutline size={18} />
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      <Modal
        open={isLoggedIn && suggestionStep === "write-description"}
        onClose={handleCancelSuggestion}
      >
        <div className="w-full max-w-md rounded-2xl bg-white">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Mô tả điểm đề xuất</h3>
              <p className="mt-1 text-sm text-gray-500">
                Thêm mô tả ngắn để đội ngũ đánh giá nhu cầu mở trạm sạc.
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
            <p>Tọa độ đã chọn: {confirmedLocationPreview}</p>
            <p>Địa chỉ: {confirmedAddress ?? "Chưa lấy được địa chỉ, sẽ gửi kèm tọa độ"}</p>
          </div>

          <textarea
            value={suggestionDescription}
            onChange={(event) => setSuggestionDescription(event.target.value)}
            rows={4}
            placeholder="Ví dụ: khu vực này đông xe điện nhưng chưa có trạm sạc gần"
            className="mt-4 w-full resize-none rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-green-500"
          />

          <div className="mt-4 flex gap-2">
            <button
              onClick={handleCancelSuggestion}
              disabled={isSubmittingSuggestion}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmitSuggestion}
              disabled={isSubmittingSuggestion}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300"
            >
              <IoPaperPlaneOutline size={16} />
              {isSubmittingSuggestion ? "Đang gửi..." : "Gửi gợi ý"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
