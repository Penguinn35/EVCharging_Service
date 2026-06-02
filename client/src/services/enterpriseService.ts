import { ApiResponse } from "@/type/share";
import { apiClient } from "@/lib/apiClient";

export type BusinessProfile = {
  companyName: string;
  companyAddress: string;
  taxCode: string;
  logoUrl: string | null;
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
  id: string;
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

export type BusinessEventType =
  | "STATION_CREATED"
  | "STATION_UPDATED"
  | "STATION_DELETED"
  | "CONNECTOR_CREATE"
  | "CONNECTOR_UPDATED"
  | "CONNECTOR_DELETE";

export type StationStatusName = "AVAILABLE" | "BUSY" | "UNAVAILABLE" | "FULL";

export type ConnectorTypeName = "CCS2" | "TYPE_2" | "CHAdeMO" | "TESLA";

export type ConnectorPayloadItem = {
  id: string;
  type: ConnectorTypeName;
  powerKw?: number;
  price?: number;
  voltage?: number;
  isAvailable?: boolean;
};

export type StationCreatedPayload = {
  externalId: string;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
  district?: string;
  status?: StationStatusName;
  connectors?: ConnectorPayloadItem[];
};

export type StationUpdatedPayload = {
  externalId: string;
  name?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  district?: string;
  status?: StationStatusName;
};

export type StationDeletedPayload = {
  externalId: string;
};

export type ConnectorCreatePayload = {
  id: string;
  type: ConnectorTypeName;
  powerKw?: number;
  price?: number;
  voltage?: number;
  isAvailable?: boolean;
  chargingPointId?: string;
  stationExternalId?: string;
};

export type ConnectorUpdatePayload = {
  id: string;
  type?: ConnectorTypeName;
  powerKw?: number;
  price?: number;
  voltage?: number;
  isAvailable?: boolean;
};

export type ConnectorDeletePayload = {
  id: string;
};

export type BusinessCommandRequest = {
  eventType: BusinessEventType;
  payload:
    | StationCreatedPayload
    | StationUpdatedPayload
    | StationDeletedPayload
    | ConnectorCreatePayload
    | ConnectorUpdatePayload
    | ConnectorDeletePayload;
};

export type BusinessCommandResponse = {
  eventType: BusinessEventType;
  success: boolean;
  result?: unknown;
};

export const getBusinessProfile = async (): Promise<BusinessProfile> => {
  const response = await apiClient.get<ApiResponse<BusinessProfile>>(
    "/api/business/profile",
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

export const executeBusinessCommand = async (
  command: BusinessCommandRequest,
): Promise<BusinessCommandResponse> => {
  const response = await apiClient.put<ApiResponse<BusinessCommandResponse>>(
    "/api/business/stations/command",
    command,
  );

  return response.data.responseData;
};

/** @deprecated Use executeBusinessCommand */
export const executeBusinessStationCommand = executeBusinessCommand;

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


