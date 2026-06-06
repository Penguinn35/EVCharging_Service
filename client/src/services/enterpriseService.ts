import { ApiResponse } from "@/type/share";
import { apiClient, publicApiClient } from "@/lib/apiClient";

export type BusinessProfile = {
  companyName: string;
  companyAddress: string;
  taxCode: string;
  logoUrl: string | null;
  managerFullName: string;
  managerEmail: string;
  managerAddress: string;
};

export type UpdateBusinessProfileRequest = {
  companyName: string;
  companyAddress: string;
  taxCode: string;
  managerFullName: string;
  managerEmail: string;
  managerAddress: string;
};

export type UpdateBusinessProfileResponse = {
  companyName: string;
  companyAddress: string;
  taxCode: string;
  managerFullName: string;
  managerEmail: string;
  managerAddress: string;
};

export type BusinessStationSummary = {
  id: string;
  name: string;
  address: string;
  district?: string;
  status: number;
  numberOfChargingPoints?: number;
};

export type PageableSort = {
  sorted: boolean;
  empty: boolean;
  unsorted: boolean;
};

export type BusinessStationsPageable = {
  pageNumber: number;
  pageSize: number;
  sort: PageableSort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
};

export type BusinessStationListResponse = {
  content: BusinessStationSummary[];
  pageable: BusinessStationsPageable;
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: PageableSort;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
};

export type BusinessStationRating = {
  stationName: string;
  comment: string;
  point: number;
  timePosted: string;
};

export type BusinessStationRatingPage = {
  content: BusinessStationRating[];
  pageable: BusinessStationsPageable;
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: PageableSort;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
};

export type BusinessStationTotalStatistics = {
  totalNumberOfRatings: number;
  averagePoint: number;
};

export type BusinessStationRatingStatistic = {
  starPoint: number;
  totalNumberOfRating: number;
};

export type BusinessStationRatingResponse = {
  ratingResponses: BusinessStationRatingPage;
  totalStatistics: BusinessStationTotalStatistics;
  ratingStatistics: BusinessStationRatingStatistic[];
};

export type GetBusinessStationRatingsParams = {
  fromDate?: string;
  toDate?: string;
  lowestPoint?: number;
  highestPoint?: number;
  page?: number;
  size?: number;
};

export type GetBusinessStationsParams = {
  keyword?: string;
  district?: string;
  page?: number;
  size?: number;
};

export type BusinessRegistrationRequest = {
  username: string;
  password: string;
  email: string;
  fullName: string;
  address: string;
  companyId: string;
  companyName: string;
  taxCode: string;
  companyAddress: string;
};

const businessRegistrationBearerToken =
  "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ2aW5ncm91cC1vd25lciIsImlhdCI6MTc4MDc0MDEzNiwiZXhwIjoxNzgwODI2NTM2fQ.p2dAhD1tXIUrn75im3KKJoEH-GV1npPZu-Ni8wODkVI";


export const getEnterpriseProfile = async (): Promise<BusinessProfile> => {
  const response = await apiClient.get<ApiResponse<BusinessProfile>>(
    "/api/business/profile",
  );

  return response.data.responseData;
};

export const registerBusinessAccount = async (
  payload: BusinessRegistrationRequest,
): Promise<ApiResponse<boolean>> => {
  const response = await publicApiClient.post<ApiResponse<boolean>>(
    "/auth/business/registration",
    {
      ...payload,
      logoUrl: "",
    },
    {
      headers: {
        Accept: "*/*",
        Authorization: businessRegistrationBearerToken,
        "Content-Type": "application/json",
      },
    },
  );

  return response.data;
};

export const updateBusinessProfile = async (
  payload: UpdateBusinessProfileRequest,
): Promise<UpdateBusinessProfileResponse> => {
  const response = await apiClient.patch<ApiResponse<UpdateBusinessProfileResponse>>(
    "/api/business/profile",
    payload
    
  );

  return response.data.responseData;
};

export const updateBusinessImage = async (file: File): Promise<boolean> => {
  const formData = new FormData();
  formData.append("logoImage", file);

  const response = await apiClient.put<ApiResponse<boolean>>(
    "/api/business/image",
    formData,
    {
      headers: {
        Accept: "*/*",
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data.responseData;
};


export const uploadBusinessStationImage = async (
  stationId: string,
  file: File,
): Promise<boolean> => {
  const formData = new FormData();
  formData.append("imageFile", file);

  const response = await apiClient.post<ApiResponse<boolean>>(
    `/api/business/stations/${stationId}/image`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data.responseData;
};

export const getBusinessStations = async (
  params: GetBusinessStationsParams,
): Promise<BusinessStationListResponse> => {
  const response = await apiClient.get<ApiResponse<BusinessStationListResponse>>(
    "/api/business/stations",
    {
      params,
    },
  );

  return response.data.responseData;
};

export const toggleBusinessStationStatus = async (
  stationId: string,
): Promise<boolean> => {
  const response = await apiClient.put<ApiResponse<boolean>>(
    `/api/business/stations/${stationId}/status`,
  );

  return response.data.responseData;
};



export const updateBusinessStationImage = async (
  stationId: string,
  key: string,
  file: File,
): Promise<boolean> => {
  const formData = new FormData();
  formData.append("key", key);
  formData.append("imageFile", file);

  const response = await apiClient.put<ApiResponse<boolean>>(
    `/api/business/stations/${stationId}/image`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data.responseData;
};

export const deleteBusinessStationImage = async (
  key: string,
): Promise<boolean> => {
  const response = await apiClient.delete<ApiResponse<boolean>>(
    `/api/business/stations/image/${key}`,
  );

  return response.data.responseData;
};

export const getBusinessStationRatings = async (
  params: GetBusinessStationRatingsParams,
): Promise<BusinessStationRatingResponse> => {
  const response = await apiClient.get<ApiResponse<BusinessStationRatingResponse>>(
    "/api/business/stations/ratings",
    {
      params: {
        ...params,
        page: params.page ?? 0,
        size: params.size ?? 10,
      },
    },
  );

  return response.data.responseData;
};


