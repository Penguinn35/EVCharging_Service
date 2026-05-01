import { ApiResponse } from "@/type/share";
import { apiClient } from "@/lib/apiClient";

export type BusinessStationSummary = {
  id: string;
  name: string;
  address: string;
  district?: string;
  status: number;
  points?: number;
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

export type GetBusinessStationsParams = {
  keyword?: string;
  district?: string;
  page?: number;
  size?: number;
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
