// import { ChargingStation } from "@/models/station";
import { StationDetail, StationMarkerData } from "@/type/station";
import { ApiResponse, Coordinate } from "@/type/share";
import { apiClient, publicApiClient } from "@/lib/apiClient";

type SearchResult = {
  id: string;
  name: string;
  address: string;
};

type RatingRequest = {
  stationId: string;
  point: number;
  comment: string;
};

type SuggestedStationResponse = {
  id: string;
  name: string;
  manufacturer: string;
  address: string;
  position: Coordinate;
  distanceInKilometers: number;
};

export async function getStationById(
  stationId: string,
): Promise<StationDetail> {
  const response = await publicApiClient.get<ApiResponse<StationDetail>>(
    `api/stations/${stationId}`,
  );
  return response.data.responseData;
}

export async function getStationNearBy(
  coordinate: Coordinate,
): Promise<StationMarkerData[]> {
  const response = await publicApiClient.get<ApiResponse<StationMarkerData[]>>(
    "api/stations/nearest-station",
    {
      params: {
        longitude: coordinate.longitude,
        latitude: coordinate.latitude,
      },
    },
  );
  return response.data.responseData;
}

export const searchStation = async (
  keyword: string,
): Promise<SearchResult[]> => {
  const response = await publicApiClient.get<ApiResponse<SearchResult[]>>(
    "/api/stations",
    {
      params: { keyword },
    },
  );
  return response.data.responseData;
};

export async function getSuggestedStation(
  cableType: number,
  coordinate: Coordinate,
): Promise<string> {
  const response = await apiClient.get<ApiResponse<SuggestedStationResponse>>(
    "/api/users/suggested-station",
    {
      params: {
        cableType,
        longitude: coordinate.longitude,
        latitude: coordinate.latitude,
      },
    },
  );

  return response.data.responseData.id;

}

export const saveStation = async (
  stationId: string,
): Promise<boolean> => {
  const res = await apiClient.post<ApiResponse<boolean>>(
    "/api/users/save-stations",
    null,
    {
      params: { stationId },
    },
  );

  return res.data.responseData;
};

export const deleteSavedStation = async (
  stationId: string,
): Promise<boolean> => {
  const res = await apiClient.delete<ApiResponse<boolean>>(
    "/api/users/save-stations",
    {
      params: { stationId },
    },
  );

  return res.data.responseData;
};

export const ratingStation = async (
  data: RatingRequest,
): Promise<boolean> => {
  const res = await apiClient.post<ApiResponse<boolean>>(
    "/api/stations/ratings",
    data,
  );

  return res.data.responseData;
};
