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
