import { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaDiamond } from "react-icons/fa6";
import { getStationById, getSuggestedStation } from "@/services/stationService";
import { useUserStore } from "@/store/useUserStore";
import { useStationStore } from "@/store/useStationStore";
import { useMapStore } from "@/store/useMapStore";
import { Coordinate } from "@/type/share";
import { StationMarkerData } from "@/type/station";
import { toast } from "react-toastify";

const cableTypeMap = {
  "Type 2": 1,
  CCS2: 2,
  Both: 2,
} as const;

export default function QuickSuggest() {
  const user = useUserStore((state) => state.user);
  const updateUser = useUserStore((state) => state.updateUser);
  const selectStation = useStationStore((state) => state.selectStation);
  const stationMarkers = useStationStore((state) => state.stationMarkers);
  const setStationMarkers = useStationStore((state) => state.setStationMarkers);
  const setFlyTo = useMapStore((state) => state.setFlyTo);

  const [loading, setLoading] = useState(false);

  const ensureCoordinate = async (): Promise<Coordinate> => {
    if (user.coordinate && user.coordinate.latitude && user.coordinate.longitude) {
      return user.coordinate;
    }

    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coordinate = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          };

          updateUser({ coordinate });
          resolve(coordinate);
        },
        (error) => reject(error),
        { enableHighAccuracy: true },
      );
    });
  };

  const handleSuggest = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const coordinate = await ensureCoordinate();
      const suggestedStation = await getSuggestedStation(
        cableTypeMap[user.vehiclePlug],
        coordinate,
      );
      const station = await getStationById(suggestedStation);

      selectStation(station);
      setFlyTo(station.position);

      const marker: StationMarkerData = {
        id: station.id,
        name: station.name,
        manufacturer: station.manufacturer,
        coordinate: station.position,
        status: String(station.status),
      };

      const hasMarker = stationMarkers.some(
        (stationMarker) => stationMarker.id === marker.id,
      );

      if (!hasMarker) {
        setStationMarkers([...stationMarkers, marker]);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to suggest a station");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="absolute bottom-30 right-8 z-1000 w-12 h-12 rounded-xl cursor-pointer hover:border-green-500 hover:border-2 bg-white border-0"
      onClick={handleSuggest}
    >
      {loading ? (
        <AiOutlineLoading3Quarters className="text-green-500 text-2xl animate-spin mx-auto" />
      ) : (
        <FaDiamond className="text-green-500 text-2xl mx-auto hover:text-green-600 cursor-pointer" />
      )}
    </button>
  );
}
