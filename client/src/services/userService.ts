import {apiClient, publicApiClient} from "@/lib/apiClient";
import { registerType, loginType } from "@/models/user";
import { UserLoginResponse, UserDetailResponse } from "@/type/user";
import { ApiResponse, Coordinate } from "@/type/share";

export type UserSuggestionRequest = {
  location: {
    longitude: number;
    latitude: number;
  };
  description: string;
};

export type ReverseGeocodeResult = {
  label: string;
  postcode?: string;
  city?: string;
  state?: string;
  country?: string;
};

type GraphHopperHit = {
  name?: string;
  street?: string;
  housenumber?: string;
  postcode?: string;
  city?: string;
  state?: string;
  country?: string;
};

type GraphHopperGeocodeResponse = {
  hits?: GraphHopperHit[];
};

const graphHopperApiKey = process.env.NEXT_PUBLIC_API_GRAPHHOPPER;

export const getUsers = async () => {
  const response = await apiClient.get("/users");
  return response.data;
};

export const createUser = async (data: registerType) => {
  const response = await publicApiClient.post<ApiResponse<boolean>>("/auth/register", data);
  return response.data;
};

export const login = async (
  data: loginType
): Promise<UserLoginResponse> => {
  const res = await publicApiClient.post<ApiResponse<UserLoginResponse>>(
    "/auth/login",
    data
  );
  return res.data.responseData;
};

export const getUserDetails = async (
): Promise<UserDetailResponse> => {
  const response = await apiClient.get<ApiResponse<UserDetailResponse>>(
  "api/users/profile"
);
  return response.data.responseData;
}

export const createUserSuggestion = async (
  data: UserSuggestionRequest,
): Promise<boolean> => {
  const response = await apiClient.post<ApiResponse<boolean>>(
    "/api/users/suggestion",
    data,
  );

  return response.data.responseData;
};

export const reverseGeocodeWithGraphHopper = async (
  coordinate: Coordinate,
): Promise<ReverseGeocodeResult | null> => {
  if (!graphHopperApiKey) return null;

  const params = new URLSearchParams({
    reverse: "true",
    point: `${coordinate.latitude},${coordinate.longitude}`,
    locale: "vi",
    provider: "default",
    key: graphHopperApiKey,
  });

  const response = await fetch(`https://graphhopper.com/api/1/geocode?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Khong the lay dia chi tu GraphHopper");
  }

  const data = (await response.json()) as GraphHopperGeocodeResponse;
  const hit = data.hits?.[0];

  if (!hit) return null;

  const label = [
    hit.name,
    [hit.housenumber, hit.street].filter(Boolean).join(" "),
    hit.city,
    hit.state,
    hit.country,
  ]
    .filter((value) => value && value.trim().length > 0)
    .join(", ");

  return {
    label: label || `${coordinate.latitude}, ${coordinate.longitude}`,
    postcode: hit.postcode,
    city: hit.city,
    state: hit.state,
    country: hit.country,
  };
};
