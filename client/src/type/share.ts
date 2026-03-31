export type Coordinate = {
  longitude: number;
  latitude: number;
};
export type ApiResponse<T> = {
  httpStatus: string;
  message: string;
  responseData: T;
  objectCount: number;
};