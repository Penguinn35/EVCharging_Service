import { apiClient } from "@/lib/apiClient";
import { ApiResponse } from "@/type/share";

export type PageableSort = {
  sorted: boolean;
  empty: boolean;
  unsorted: boolean;
};

export type StatisticsPageable = {
  pageNumber: number;
  pageSize: number;
  sort: PageableSort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
};

export type StatisticsPageResponse<T> = {
  content: T[];
  pageable: StatisticsPageable;
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

export type StatisticsPaginationParams = {
  page?: number;
  size?: number;
};

export type StatisticsDateRangeParams = StatisticsPaginationParams & {
  fromDate: string;
  toDate: string;
};

export type StationDetailCountStatistic = {
  stationId: string;
  stationName: string;
  sumOfViewDetailCount: number;
  date: string;
};

export type SavedStationCountStatistic = {
  id: string;
  name: string;
  address: string;
  numberOfSaves: number;
};

export type TotalDetailCountStatistic = {
  stationId: string;
  stationName: string;
  address: string;
  sumOfViewDetailCount: number;
};

export type HotspotRadiusParams = {
  longitude: number;
  latitude: number;
  radius: number;
};

export type HotspotDateRangeParams = {
  fromDate: string;
  toDate: string;
};

export type BusinessHitfullHotspotItem = {
  stationId: string;
  stationName: string;
  address: string;
  hitfullCount: number;
  date?: string;
  longitude?: number;
  latitude?: number;
  location?: {
    longitude: number;
    latitude: number;
  };
  position?: {
    longitude: number;
    latitude: number;
  };
};

export type BusinessSuggestionHotspotItem = {
  location?: {
    longitude: number;
    latitude: number;
  };
  longitude?: number;
  latitude?: number;
  timestamp?: string;
  description?: string;
};

export type BusinessUserLocationHotspotItem = {
  location?: {
    longitude: number;
    latitude: number;
  };
  longitude?: number;
  latitude?: number;
  timestamp?: string;
};

export const getStationDetailCountStatistics = async (
  stationId: string,
  params: StatisticsDateRangeParams,
): Promise<StatisticsPageResponse<StationDetailCountStatistic>> => {
  const response = await apiClient.get<
    ApiResponse<StatisticsPageResponse<StationDetailCountStatistic>>
  >(`/api/business/stations/${stationId}/statistics/detail-count`, {
    params: {
      ...params,
      page: params.page ?? 0,
      size: params.size ?? 10,
    },
  });

  return response.data.responseData;
};

export const getSavedStationCountStatistics = async (
  params: StatisticsPaginationParams = {},
): Promise<StatisticsPageResponse<SavedStationCountStatistic>> => {
  const response = await apiClient.get<
    ApiResponse<StatisticsPageResponse<SavedStationCountStatistic>>
  >("/api/business/stations/statistics/save-station-count", {
    params: {
      page: params.page ?? 0,
      size: params.size ?? 10,
    },
  });

  return response.data.responseData;
};

export const getTotalDetailCountStatistics = async (
  params: StatisticsDateRangeParams,
): Promise<StatisticsPageResponse<TotalDetailCountStatistic>> => {
  const response = await apiClient.get<
    ApiResponse<StatisticsPageResponse<TotalDetailCountStatistic>>
  >("/api/business/stations/statistics/total-detail-count", {
    params: {
      ...params,
      page: params.page ?? 0,
      size: params.size ?? 10,
    },
  });

  return response.data.responseData;
};

export const getBusinessStationHitfullCount = async (
  params: HotspotRadiusParams & HotspotDateRangeParams,
): Promise<BusinessHitfullHotspotItem[]> => {
  const response = await apiClient.get<ApiResponse<BusinessHitfullHotspotItem[]>>(
    "/api/business/stations/hitfull-count",
    {
      params,
    },
  );

  return response.data.responseData;
};

export const getBusinessStationHitfullCountGeneral = async (
  params?: HotspotDateRangeParams,
): Promise<
  BusinessHitfullHotspotItem[]
> => {
  const response = await apiClient.get<ApiResponse<BusinessHitfullHotspotItem[]>>(
    "/api/business/stations/hitfull-count/general",
    {
      params,
    },
  );

  return response.data.responseData;
};

export const getBusinessSuggestionHotspots = async (
  params: HotspotRadiusParams & HotspotDateRangeParams,
): Promise<BusinessSuggestionHotspotItem[]> => {
  const response = await apiClient.get<ApiResponse<BusinessSuggestionHotspotItem[]>>(
    "/api/business/suggestion",
    {
      params,
    },
  );

  return response.data.responseData;
};

export const getBusinessSuggestionHotspotsGeneral = async (
  params?: HotspotDateRangeParams,
): Promise<
  BusinessSuggestionHotspotItem[]
> => {
  const response = await apiClient.get<ApiResponse<BusinessSuggestionHotspotItem[]>>(
    "/api/business/suggestion/general",
    {
      params,
    },
  );

  return response.data.responseData;
};

export const getBusinessUsersLocationsHotspots = async (
  params?: HotspotDateRangeParams,
): Promise<
  BusinessUserLocationHotspotItem[]
> => {
  const response = await apiClient.get<ApiResponse<BusinessUserLocationHotspotItem[]>>(
    "/api/business/users/locations",
    {
      params,
    },
  );

  return response.data.responseData;
};
